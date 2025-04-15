import mongoose from "mongoose";
import validator from "validator";

const applicationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide your name!"],
        minlength: [3, "Name must contain at least 3 characters!"], // Fixed typo
        maxlength: [30, "Name cannot exceed 30 characters!"], // Fixed typo
    },
    email: {
        type: String,
        validate: [validator.isEmail, "Please provide a valid email!"], // Fixed property name
        required: [true, "Please provide your email!"],
    },
    coverLetter: {
        type: String,
        required: [true, "Please provide your cover Letter!"], // Fixed typo
    },
    phone: {
        type: String, // Changed from Number to String
        required: [true, "Please provide your Phone Number!"],
        validate: {
            validator: function (value) {
                return /^[0-9]{10,15}$/.test(value); // Validates phone numbers with 10-15 digits
            },
            message: "Please provide a valid phone number!",
        },
    },
    address: {
        type: String,
        required: [true, "Please provide your Address!"],
    },
    resume: {
        public_id: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        },
    },
    applicantID: {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        role: {
            type: String,
            enum: ["Job Seeker"],
            required: true,
        },
    },
    employerID: {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        role: {
            type: String,
            enum: ["Employer"],
            required: true,
        },
    },
});

export const Application = mongoose.model("Application", applicationSchema);