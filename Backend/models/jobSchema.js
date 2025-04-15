import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Please provide a job title."],
        minlength: [3, "Job title must contain at least 3 characters."], // Fixed typo
        maxlength: [50, "Job title cannot exceed 50 characters."], // Fixed typo
    },
    description: {
        type: String,
        required: [true, "Please provide a job description."],
        minlength: [50, "Job description must contain at least 50 characters."], // Fixed typo
        maxlength: [350, "Job description cannot exceed 350 characters."], // Fixed typo
    },
    category: {
        type: String,
        required: [true, "Job category is required."],
    },
    country: {
        type: String,
        required: [true, "Job country is required."],
    },
    city: {
        type: String,
        required: [true, "Job city is required."],
    },
    location: {
        type: String,
        required: [true, "Please provide the exact location."],
    },
    fixedSalary: {
        type: Number,
        min: [1000, "Fixed salary must be at least 1000."], // Changed from minlength to min
        max: [999999999, "Fixed salary cannot exceed 9 digits."], // Changed from maxlength to max
    },
    salaryFrom: {
        type: Number,
        min: [1000, "Salary From must be at least 1000."], // Changed from minlength to min
        max: [999999999, "Salary From cannot exceed 9 digits."], // Changed from maxlength to max
    },
    salaryTo: {
        type: Number,
        min: [1000, "Salary To must be at least 1000."], // Changed from minlength to min
        max: [999999999, "Salary To cannot exceed 9 digits."], // Changed from maxlength to max
    },
    expired: {
        type: Boolean,
        default: false,
    },
    jobPostedOn: {
        type: Date,
        default: Date.now,
    },
    postedBy: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
    },
});

export const Job = mongoose.model("Job", jobSchema);