class ErrorHandler extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}

export const errorMiddleware = (err, req, res, next) => {
    err.message = err.message || "Internal server error";
    err.statusCode = err.statusCode || 500;

    // Handle Mongoose CastError (invalid ObjectId)
    if (err.name === "CastError") {
        const message = `Resource not found. Invalid ${err.path}`;
        err = new ErrorHandler(message, 400);
    }

    // Handle Mongoose Duplicate Key Error
    if (err.code === 11000) {
        const message = `Duplicate field value entered: ${Object.keys(err.keyValue).join(", ")}`;
        err = new ErrorHandler(message, 400);
    }

    // Handle Invalid JWT Error
    if (err.name === "JsonWebTokenError") {
        const message = `Invalid JSON Web Token. Please try again.`;
        err = new ErrorHandler(message, 401);
    }

    // Handle Expired JWT Error
    if (err.name === "TokenExpiredError") {
        const message = `JSON Web Token has expired. Please log in again.`;
        err = new ErrorHandler(message, 401);
    }

    // Send Error Response
    return res.status(err.statusCode).json({
        success: false,
        message: err.message,
    });
};

export default ErrorHandler;