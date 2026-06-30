import express from "express";
import {
  adminGetStats,
  adminGetAllUsers,
  adminDeleteUser,
  adminGetAllJobs,
  adminDeleteJob,
} from "../controllers/adminController.js";
import { isAuthorized } from "../middlewares/auth.js";

const router = express.Router();

router.get("/stats", isAuthorized, adminGetStats);
router.get("/users", isAuthorized, adminGetAllUsers);
router.delete("/user/:id", isAuthorized, adminDeleteUser);
router.get("/jobs", isAuthorized, adminGetAllJobs);
router.delete("/job/:id", isAuthorized, adminDeleteJob);

export default router;
