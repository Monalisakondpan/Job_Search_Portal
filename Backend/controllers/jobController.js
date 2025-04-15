import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import { Job } from "../models/jobSchema.js";

export const getAllJobs = catchAsyncError(async (req, res, next) => {
    const jobs = await Job.find({ expired: false });
    res.status(200).json({
        success: true,
        jobs,
    });
});

export const postJob = catchAsyncError(async (req, res, next) => {
    const { role } = req.user;
    if (role === "Job Seeker") {
        return next(
            new ErrorHandler(
                "Job Seeker is not allowed to access this resource!",
                400
            )
        );
    }
    const {
        title,
        description,
        category,
        country,
        city,
        location,
        fixedSalary,
        salaryFrom,
        salaryTo,
    } = req.body;

    if (!title || !description || !category || !country || !city || !location) {
        return next(new ErrorHandler("Please provide full job details.", 400));
    }
    if ((!salaryFrom || !salaryTo) && !fixedSalary) {
        return next(
            new ErrorHandler(
                "Please either provide a fixed salary or a salary range!",
                400
            )
        );
    }
    if (salaryFrom && salaryTo && fixedSalary) {
        return next(
            new ErrorHandler(
                "Cannot enter both fixed salary and salary range together!",
                400
            )
        );
    }
    const postedBy = req.user._id;
    const job = await Job.create({
        title,
        description,
        category,
        country,
        city,
        location,
        fixedSalary: fixedSalary || null,
        salaryFrom: salaryFrom || null,
        salaryTo: salaryTo || null,
        postedBy,
    });
    res.status(201).json({
        success: true,
        message: "Job posted successfully!",
        job,
    });
});

export const getMyJobs = catchAsyncError(async (req, res, next) => {
    const { role } = req.user;
    if (role === "Job Seeker") {
        return next(
            new ErrorHandler(
                "Job Seeker is not allowed to access this resource!",
                400
            )
        );
    }
    const myJobs = await Job.find({ postedBy: req.user._id });
    res.status(200).json({
        success: true,
        myJobs,
    });
});

export const updateJob = catchAsyncError(async (req, res, next) => {
    const { role } = req.user;
    if (role === "Job Seeker") {
        return next(
            new ErrorHandler(
                "Job Seeker is not allowed to access this resource!",
                400
            )
        );
    }
    const { id } = req.params;

    // Ensure at least one field is provided for update
    const { title, description, category, country, city, location } = req.body;
    if (!title && !description && !category && !country && !city && !location) {
        return next(new ErrorHandler("Please provide fields to update.", 400));
    }

    let job = await Job.findById(id);
    if (!job) {
        return next(new ErrorHandler("Oops, Job not found!", 404));
    }
    job = await Job.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
    });
    res.status(200).json({
        success: true,
        job,
        message: "Job Updated Successfully!",
    });
});

export const deleteJob = catchAsyncError(async (req, res, next) => {
    const { role } = req.user;
    if (role === "Job Seeker") {
        return next(
            new ErrorHandler(
                "Job Seeker is not allowed to access this resource!",
                400
            )
        );
    }
    const { id } = req.params;
    const job = await Job.findById(id);
    if (!job) {
        return next(new ErrorHandler("Oops, Job not found!", 404));
    }
    await job.deleteOne();
    res.status(200).json({
        success: true,
        message: "Job Deleted Successfully!",
    });
});


export const getSinglejob = catchAsyncError(async(req, res, next) => {
    const {id} = req.params;
    try {
        const job = await Job.findById(id);
        if(!job){
            return next(new ErrorHandler("Job not found", 404));
        }
        res.status(200).json({
            success: true,
            job
        });
    } catch (error) {
        return next(new ErrorHandler("Invalid ID/ CastError", 400));
    }
});