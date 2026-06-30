import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import { User } from "../models/userSchema.js";
import { sendToken } from "../utils/jwtToken.js";
import { isPlainString, cleanString } from "../utils/sanitize.js";
import { sendEmail, notifyAdmin, welcomeEmailHtml, accountDeletedEmailHtml } from "../utils/sendEmail.js";

export const register = catchAsyncError(async (req, res, next) => {
   const { name, email, phone, role, password } = req.body;

   if (![name, email, phone, role, password].every(isPlainString)) {
     return next(new ErrorHandler("Please fill the full registration form correctly!", 400));
   }

   if (password.length > 64) {
     return next(new ErrorHandler("Password is too long.", 400));
   }

   if (role === "Admin") {
     return next(new ErrorHandler("Admin accounts cannot be created through registration.", 403));
   }

   const isEmail = await User.findOne({ email: cleanString(email) });
   if (isEmail) {
     return next(new ErrorHandler("Email already exists!", 400));
   }

   const user = await User.create({ name, email, phone, role, password });

   try {
     await sendEmail({
       to: email,
       subject: "Welcome to CareerForge 🎉",
       html: welcomeEmailHtml({ name, role }),
     });
   } catch (err) {
     console.error("Failed to send welcome email:", err.message);
   }

   notifyAdmin({
     title: "New User Registered",
     subject: `New ${role} registered – CareerForge`,
     lines: [
       { label: "Name", value: name },
       { label: "Email", value: email },
       { label: "Role", value: role },
     ],
   });

   sendToken(user, 200, res, "User registered Successfully!");
});

export const login = catchAsyncError(async (req, res, next) => {
   const { email, password, role } = req.body;

   // Type guard — blocks NoSQL injection login bypass.
   if (![email, password, role].every(isPlainString)) {
      return next(new ErrorHandler("Please provide valid email, password and role.", 400));
   }

   if (password.length > 64) {
      return next(new ErrorHandler("Invalid Email or Password", 400));
   }

   const user = await User.findOne({ email: cleanString(email) }).select("+password");
   if (!user) {
     return next(new ErrorHandler("Invalid Email or Password", 400));
   }
   const isPasswordMatched = await user.comparePassword(password);
   if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid Email or Password", 400));
   }
   if (user.role !== role) {
     return next(new ErrorHandler("User with this role not found!", 400));
   }
   sendToken(user, 200, res, "User logged in successfully!");
});

export const logout = catchAsyncError(async (req, res, next) => {
   res.status(200).cookie("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      expires: new Date(Date.now()),
   }).json({
      success: true,
      message: "User logged out successfully!",
   });
});

export const getUser = catchAsyncError((req, res, next) => {
   const user = req.user;
   res.status(200).json({ success: true, user });
});

export const deleteMyAccount = catchAsyncError(async (req, res, next) => {
   // Capture details BEFORE deleting, so we can email the user a goodbye.
   const { name, email } = req.user;

   await User.findByIdAndDelete(req.user._id);

   try {
     await sendEmail({
       to: email,
       subject: "Your CareerForge account has been deleted",
       html: accountDeletedEmailHtml({ name }),
     });
   } catch (err) {
     console.error("Failed to send account-deleted email:", err.message);
   }

   notifyAdmin({
     title: "User Deleted Their Account",
     subject: `Account deleted – CareerForge`,
     lines: [
       { label: "Name", value: name },
       { label: "Email", value: email },
     ],
   });

   res.status(200).cookie("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      expires: new Date(Date.now()),
   }).json({
      success: true,
      message: "Account deleted successfully!",
   });
});