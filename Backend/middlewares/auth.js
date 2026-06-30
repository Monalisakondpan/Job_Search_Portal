import { catchAsyncError } from "./catchAsyncError.js";
import ErrorHandler from "./error.js";
import jwt from "jsonwebtoken";
import { User } from "../models/userSchema.js";

export const isAuthorized = catchAsyncError(async (req, res, next) => {
    // Ensure cookies exist
    if (!req.cookies || !req.cookies.token) {
        return next(new ErrorHandler("User not authorized. Token is missing.", 401));
    }

    const { token } = req.cookies;

    // Ensure JWT_SECRET_KEY is defined
    if (!process.env.JWT_SECRET_KEY) {
        console.error("JWT_SECRET_KEY is not defined in environment variables.");
        return next(new ErrorHandler("Internal server error. Please try again later.", 500));
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        // Find the user associated with the token
        const user = await User.findById(decoded.id);
        if (!user) {
            return next(new ErrorHandler("User not found. Authorization failed.", 404));
        }

        // Attach the user to the request object
        req.user = user;

        next();
    } catch (err) {
        // Handle invalid or expired token errors
        if (err.name === "JsonWebTokenError") {
            return next(new ErrorHandler("Invalid token signature. Authorization failed.", 401));
        } else if (err.name === "TokenExpiredError") {
            return next(new ErrorHandler("Token has expired. Please log in again.", 401));
        } else {
            console.error("Authorization Error:", err.message); // Log unexpected errors
            return next(new ErrorHandler("Authorization failed. Please try again.", 500));
        }
    }
});