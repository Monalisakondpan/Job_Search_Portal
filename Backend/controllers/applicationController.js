import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import { Application } from "../models/applicationSchema.js";
import cloudinary from "cloudinary";
import { Job } from "../models/jobSchema.js";
import mongoose from "mongoose";

// Get all applications for an employer
export const employerGetAllApplication = catchAsyncError(async (req, res, next) => {
    const { role } = req.user;

    if (role === "Job Seeker") {
        return next(new ErrorHandler("Job Seeker is not allowed to access this resource!", 400));
    }

    const { _id } = req.user;
    const applications = await Application.find({ "employerID.user": _id });

    res.status(200).json({
        success: true,
        applications,
    });
});

// Get all applications for a job seeker
export const jobseekerGetAllApplication = catchAsyncError(async (req, res, next) => {
    const { role } = req.user;

    if (role === "Employer") {
        return next(new ErrorHandler("Employer is not allowed to access this resource!", 400));
    }

    const { _id } = req.user;
    const applications = await Application.find({ "applicantID.user": _id });

    res.status(200).json({
        success: true,
        applications,
    });
});

// Delete an application by a job seeker
export const jobSeekerDeleteApplication = catchAsyncError(async (req, res, next) => {
    const { role } = req.user;

    if (role === "Employer") {
        return next(new ErrorHandler("Employer is not allowed to access this resource!", 400));
    }

    const { id } = req.params;

    // Validate application ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(new ErrorHandler("Invalid Application ID!", 400));
    }

    const application = await Application.findById(id);

    if (!application) {
        return next(new ErrorHandler("Oops, application not found!", 404));
    }

    await application.deleteOne();

    res.status(200).json({
        success: true,
        message: "Application Deleted Successfully!",
    });
});

// Post a new application
export const postApplication = catchAsyncError(async (req, res, next) => {
    const { role } = req.user;

    if (role === "Employer") {
        return next(new ErrorHandler("Employer is not allowed to access this resource!", 400));
    }

    // Check if resume file is provided
    if (!req.files || Object.keys(req.files).length === 0) {
        return next(new ErrorHandler("Resume File Required", 400));
    }

    const { resume } = req.files;
    const allowedFormats = ["image/png", "image/jpeg", "image/webp", "application/pdf"];
    if (!allowedFormats.includes(resume.mimetype)) {
        return next(new ErrorHandler("Invalid file type. Please upload your resume in a PNG, JPG, WEBP, or PDF format.", 400));
    }

    // Upload resume to Cloudinary
    const cloudinaryResponse = await cloudinary.v2.uploader.upload(resume.tempFilePath);
    if (!cloudinaryResponse || cloudinaryResponse.error) {
        console.error("Cloudinary Error:", cloudinaryResponse.error || "Unknown Cloudinary Error");
        return next(new ErrorHandler("Failed to upload resume.", 500));
    }

    const { name, email, coverLetter, phone, address, jobId } = req.body;

    // Validate jobId
    if (!jobId) {
        return next(new ErrorHandler("Job ID is required!", 400));
    }

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
        return next(new ErrorHandler("Invalid Job ID format!", 400));
    }

    // Check if the job exists
    const jobDetails = await Job.findById(jobId);
    if (!jobDetails) {
        return next(new ErrorHandler("Job not found!", 404));
    }

    const applicantID = {
        user: req.user._id,
        role: "Job Seeker",
    };

    const employerID = {
        user: jobDetails.postedBy,
        role: "Employer",
    };

    // Validate required fields
    if (!name || !email || !coverLetter || !phone || !address || !resume) {
        return next(new ErrorHandler("Please fill all fields!", 400));
    }

    // Create the application
    const application = await Application.create({
        name,
        email,
        coverLetter,
        phone,
        address,
        applicantID,
        employerID,
        resume: {
            public_id: cloudinaryResponse.public_id,
            url: cloudinaryResponse.secure_url,
        },
    });

    res.status(200).json({
        success: true,
        message: "Application Submitted!",
        application,
    });
});