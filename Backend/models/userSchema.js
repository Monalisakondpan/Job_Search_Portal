import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: [3, "Name must contain at least 3 characters!"],
        maxlength: [30, "Name cannot exceed 30 characters!"],
    },
    email: {
        type: String,
        required: [true, "Please provide your email!"],
        validate: [validator.isEmail, "Please provide a valid email!"],
    },
    phone: {
        type: String,
        required: [true, "Please provide your phone number."],
        validate: {
            validator: function (value) {
                return /^[0-9]{10,15}$/.test(value);
            },
            message: "Please provide a valid phone number!",
        },
    },
    password: {
        type: String,
        required: [true, "Please provide your password!"],
        minlength: [8, "Password must contain at least 8 characters!"],
        maxlength: [32, "Password cannot exceed 32 characters!"],
        validate: {
            validator: function (value) {
                return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/.test(value);
            },
            message: "Password must include an uppercase letter, a lowercase letter, a number, and a special character.",
        },
        select: false,
    },
    role: {
        type: String,
        required: [true, "Please provide your role."],
        enum: ["Job Seeker", "Employer", "Admin"],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
});

// Hashing the PASSWORD
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

// Comparing PASSWORD
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Generating a JWT TOKEN for Authorization
userSchema.methods.getJWTToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};

// Generating password reset token
userSchema.methods.getResetPasswordToken = function () {
    const resetToken = crypto.randomBytes(20).toString("hex");

    this.resetPasswordToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

    this.resetPasswordExpire = Date.now() + 30 * 60 * 1000; // 30 minutes

    return resetToken;
};

export const User = mongoose.model("User", userSchema);