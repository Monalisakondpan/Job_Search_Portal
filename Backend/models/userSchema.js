import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: [3, "Name must contain at least 3 characters!"], // Fixed typo
        maxlength: [30, "Name cannot exceed 30 characters!"], // Fixed typo
    },
    email: {
        type: String,
        required: [true, "Please provide your email!"],
        validate: [validator.isEmail, "Please provide a valid email!"],
    },
    phone: {
        type: String, // Changed from Number to String
        required: [true, "Please provide your phone number."],
        validate: {
            validator: function (value) {
                return /^[0-9]{10,15}$/.test(value); // Validates phone numbers with 10-15 digits
            },
            message: "Please provide a valid phone number!",
        },
    },
    password: {
        type: String,
        required: [true, "Please provide your password!"],
        minlength: [8, "Password must contain at least 8 characters!"], // Fixed typo
        maxlength: [32, "Password cannot exceed 32 characters!"], // Fixed typo
        select: false,
    },
    role: {
        type: String,
        required: [true, "Please provide your role."],
        enum: ["Job Seeker", "Employer"],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Hashing the PASSWORD
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
});

// Comparing PASSWORD
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Generating a JWT TOKEN for Authorization
userSchema.methods.getJWTToken = function () { // Fixed typo in method name
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};

export const User = mongoose.model("User", userSchema);
