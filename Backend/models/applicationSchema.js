import mongoose from "mongoose";
import validator from "validator";

// Single source of truth for valid statuses. Imported by the controller
// for validation. Frontend keeps its own matching copy (no shared module
// between frontend/backend in this project) — if you add a status here,
// update the frontend dropdown too.
export const APPLICATION_STATUSES = [
    "Applied",
    "Under Review",
    "Shortlisted",
    "Interview Scheduled",
    "Selected",
    "Rejected",
];

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
    atsScore: {
        score: { type: Number, default: null }, // 0-100, or null if not computable
        matchedSkills: { type: [String], default: [] },
        missingSkills: { type: [String], default: [] },
        extractedSkills: { type: [String], default: [] },
        resumeTextExtracted: { type: Boolean, default: false },
        note: { type: String, default: null },
        analyzedAt: { type: Date, default: null },
    },
    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
        required: true,
    },
    status: {
        type: String,
        enum: APPLICATION_STATUSES,
        default: "Applied",
    },
    statusHistory: {
        type: [
            {
                status: { type: String, enum: APPLICATION_STATUSES, required: true },
                changedAt: { type: Date, default: Date.now },
            },
        ],
        default: () => [{ status: "Applied", changedAt: new Date() }],
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