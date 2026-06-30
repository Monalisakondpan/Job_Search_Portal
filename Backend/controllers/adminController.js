import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import { User } from "../models/userSchema.js";
import { Job } from "../models/jobSchema.js";
import { Application } from "../models/applicationSchema.js";
import mongoose from "mongoose";

// Every function here is gated the same way the rest of this codebase
// gates roles (inline check, not a separate middleware) — consistent with
// how employer/job-seeker routes already do it.
const requireAdmin = (req, next) => {
  if (req.user.role !== "Admin") {
    return new ErrorHandler("Admin access only.", 403);
  }
  return null;
};

export const adminGetStats = catchAsyncError(async (req, res, next) => {
  const guardErr = requireAdmin(req, next);
  if (guardErr) return next(guardErr);

  const [totalUsers, totalJobSeekers, totalEmployers, totalJobs, activeJobs, totalApplications] =
    await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: "Job Seeker" }),
      User.countDocuments({ role: "Employer" }),
      Job.countDocuments(),
      Job.countDocuments({ expired: false }),
      Application.countDocuments(),
    ]);

  res.status(200).json({
    success: true,
    stats: {
      totalUsers,
      totalJobSeekers,
      totalEmployers,
      totalJobs,
      activeJobs,
      expiredJobs: totalJobs - activeJobs,
      totalApplications,
    },
  });
});

export const adminGetAllUsers = catchAsyncError(async (req, res, next) => {
  const guardErr = requireAdmin(req, next);
  if (guardErr) return next(guardErr);

  const users = await User.find().select("-password");
  res.status(200).json({ success: true, users });
});

export const adminDeleteUser = catchAsyncError(async (req, res, next) => {
  const guardErr = requireAdmin(req, next);
  if (guardErr) return next(guardErr);

  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) return next(new ErrorHandler("Invalid User ID!", 400));

  const targetUser = await User.findById(id);
  if (!targetUser) return next(new ErrorHandler("User not found!", 404));
  if (targetUser.role === "Admin") {
    return next(new ErrorHandler("Cannot delete an Admin account from the dashboard.", 403));
  }

  await targetUser.deleteOne();
  res.status(200).json({ success: true, message: "User deleted successfully!" });
});

export const adminGetAllJobs = catchAsyncError(async (req, res, next) => {
  const guardErr = requireAdmin(req, next);
  if (guardErr) return next(guardErr);

  const jobs = await Job.find().populate("postedBy", "name email");
  res.status(200).json({ success: true, jobs });
});

export const adminDeleteJob = catchAsyncError(async (req, res, next) => {
  const guardErr = requireAdmin(req, next);
  if (guardErr) return next(guardErr);

  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) return next(new ErrorHandler("Invalid Job ID!", 400));

  const job = await Job.findById(id);
  if (!job) return next(new ErrorHandler("Job not found!", 404));

  await job.deleteOne();
  res.status(200).json({ success: true, message: "Job deleted successfully!" });
});
