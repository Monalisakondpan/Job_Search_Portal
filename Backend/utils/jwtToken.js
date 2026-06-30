export const sendToken = (user, statusCode, res, message) => {
    const token = user.getJWTToken();
    const options = {
        expires: new Date(
            Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    };

    // Send a SAFE user object — never the password hash or internal fields.
    const safeUser = {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
    };

    res.status(statusCode).cookie("token", token, options).json({
        success: true,
        user: safeUser,
        message,
        // token NO LONGER returned in body — prevents leak/replay
    });
};