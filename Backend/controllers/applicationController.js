import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import { Application, APPLICATION_STATUSES } from "../models/applicationSchema.js";
import cloudinary from "cloudinary";
import { Job } from "../models/jobSchema.js";
import mongoose from "mongoose";
import { User } from "../models/userSchema.js";
import { sendEmail, applicationSubmittedEmailHtml, newApplicantEmailHtml, statusChangeEmailHtml, notifyAdmin } from "../utils/sendEmail.js";
import { extractResumeText, buildATSScore } from "../utils/atsScorer.js";

export const employerGetAllApplication = catchAsyncError(async (req, res, next) => {
    const { role } = req.user;
    if (role === "Job Seeker") return next(new ErrorHandler("Job Seeker is not allowed to access this resource!", 400));
    const { _id } = req.user;
    const applications = await Application.find({ "employerID.user": _id });
    res.status(200).json({ success: true, applications });
});

export const employerGetRankedApplications = catchAsyncError(async (req, res, next) => {
    const { role } = req.user;
    if (role === "Job Seeker") return next(new ErrorHandler("Job Seeker is not allowed to access this resource!", 400));
    const { jobId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(jobId)) return next(new ErrorHandler("Invalid Job ID!", 400));

    const job = await Job.findById(jobId);
    if (!job) return next(new ErrorHandler("Job not found!", 404));
    if (String(job.postedBy) !== String(req.user._id)) {
        return next(new ErrorHandler("You did not post this job!", 403));
    }

    const applications = await Application.find({ jobId, "employerID.user": req.user._id });

    const ranked = applications.sort((a, b) => {
        const scoreA = a.atsScore?.score;
        const scoreB = b.atsScore?.score;
        if (scoreA === null || scoreA === undefined) return 1;
        if (scoreB === null || scoreB === undefined) return -1;
        return scoreB - scoreA;
    });

    res.status(200).json({ success: true, applications: ranked });
});

export const jobseekerGetAllApplication = catchAsyncError(async (req, res, next) => {
    const { role } = req.user;
    if (role === "Employer") return next(new ErrorHandler("Employer is not allowed to access this resource!", 400));
    const { _id } = req.user;
    const applications = await Application.find({ "applicantID.user": _id });
    res.status(200).json({ success: true, applications });
});

export const jobSeekerDeleteApplication = catchAsyncError(async (req, res, next) => {
    const { role } = req.user;
    if (role === "Employer") return next(new ErrorHandler("Employer is not allowed to access this resource!", 400));
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return next(new ErrorHandler("Invalid Application ID!", 400));
    const application = await Application.findById(id);
    if (!application) return next(new ErrorHandler("Application not found!", 404));
    await application.deleteOne();
    res.status(200).json({ success: true, message: "Application Deleted Successfully!" });
});

export const employerUpdateApplicationStatus = catchAsyncError(async (req, res, next) => {
    const { role } = req.user;
    if (role === "Job Seeker") return next(new ErrorHandler("Job Seeker is not allowed to access this resource!", 400));

    const { id } = req.params;
    const { status } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) return next(new ErrorHandler("Invalid Application ID!", 400));
    if (!status || !APPLICATION_STATUSES.includes(status)) {
        return next(new ErrorHandler(`Status must be one of: ${APPLICATION_STATUSES.join(", ")}`, 400));
    }

    const application = await Application.findById(id);
    if (!application) return next(new ErrorHandler("Application not found!", 404));
    if (String(application.employerID.user) !== String(req.user._id)) {
        return next(new ErrorHandler("You did not receive this application!", 403));
    }

    application.status = status;
    application.statusHistory.push({ status, changedAt: new Date() });
    await application.save();

    try {
        const job = await Job.findById(application.jobId);
        await sendEmail({
            to: application.email,
            subject: `Application Update: ${status} – CareerForge`,
            html: statusChangeEmailHtml({
                applicantName: application.name,
                jobTitle: job?.title || "the position",
                status,
            }),
        });
    } catch (err) {
        console.error("Failed to send status-change email:", err.message);
    }

    res.status(200).json({ success: true, message: "Application status updated!", application });
});

export const postApplication = catchAsyncError(async (req, res, next) => {
    const { role } = req.user;
    if (role === "Employer") return next(new ErrorHandler("Employer is not allowed to apply for jobs!", 400));

    if (!req.files || Object.keys(req.files).length === 0) return next(new ErrorHandler("Resume File Required", 400));
    const { resume } = req.files;
    const allowedFormats = ["image/png", "image/jpeg", "image/webp", "application/pdf"];
    if (!allowedFormats.includes(resume.mimetype)) return next(new ErrorHandler("Invalid file type. Please upload PNG, JPG, WEBP, or PDF.", 400));

    const { name, email, coverLetter, phone, address, jobId } = req.body;
    if (!jobId || !mongoose.Types.ObjectId.isValid(jobId)) return next(new ErrorHandler("Invalid Job ID!", 400));
    if (!name || !email || !coverLetter || !phone || !address) return next(new ErrorHandler("Please fill all fields!", 400));

    const jobDetails = await Job.findById(jobId).populate("postedBy");
    if (!jobDetails) return next(new ErrorHandler("Job not found!", 404));

    const alreadyApplied = await Application.findOne({ jobId, "applicantID.user": req.user._id });
    if (alreadyApplied) {
        return next(new ErrorHandler("You have already applied for this job!", 400));
    }

    const cloudinaryResponse = await cloudinary.v2.uploader.upload(resume.tempFilePath);
    if (!cloudinaryResponse || cloudinaryResponse.error) return next(new ErrorHandler("Failed to upload resume.", 500));

    const resumeText = await extractResumeText(resume.tempFilePath, resume.mimetype);
    const atsScore = buildATSScore(resumeText, jobDetails.requiredSkills);

    const applicantID = { user: req.user._id, role: "Job Seeker" };
    const employerID = { user: jobDetails.postedBy, role: "Employer" };

    const application = await Application.create({
        name, email, coverLetter, phone, address, applicantID, employerID,
        resume: { public_id: cloudinaryResponse.public_id, url: cloudinaryResponse.secure_url },
        atsScore,
        jobId: jobDetails._id,
    });

    // Send confirmation email to applicant
    try {
        await sendEmail({
            to: email,
            subject: "Application Submitted Successfully – CareerForge",
            html: applicationSubmittedEmailHtml({
                applicantName: name,
                jobTitle: jobDetails.title,
                companyName: jobDetails.companyName || "",
            }),
        });
    } catch (err) {
        console.error("Failed to send applicant email:", err.message);
    }

    // Send notification email to employer
    try {
        const employer = await User.findById(jobDetails.postedBy);
        if (employer && employer.email) {
            await sendEmail({
                to: employer.email,
                subject: `New Application for "${jobDetails.title}" – CareerForge`,
                html: newApplicantEmailHtml({
                    employerName: employer.name,
                    applicantName: name,
                    applicantEmail: email,
                    jobTitle: jobDetails.title,
                }),
            });
        }
    } catch (err) {
        console.error("Failed to send employer email:", err.message);
    }

    notifyAdmin({
        title: "New Job Application",
        subject: `New application for "${jobDetails.title}" – CareerForge`,
        lines: [
            { label: "Applicant", value: name },
            { label: "Applicant Email", value: email },
            { label: "Applied For", value: jobDetails.title },
        ],
    });

    res.status(200).json({ success: true, message: "Application Submitted! Confirmation email sent.", application });
});