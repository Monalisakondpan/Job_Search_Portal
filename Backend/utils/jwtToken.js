export const sendToken = (user, statusCode, res, message) => {
    const token = user.getJWTToken(); // Fixed typo in method name
    const options = {
        expires: new Date(
            Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000 // Fixed expiration calculation
        ),
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Use HTTPS in production
        sameSite: "strict", // Prevent CSRF attacks
    };
    res.status(statusCode).cookie("token", token, options).json({
        success: true,
        user,
        message,
        token,
    });
};