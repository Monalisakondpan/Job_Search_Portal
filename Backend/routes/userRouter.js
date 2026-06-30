import express from "express";
import { getUser, login, logout, register, deleteMyAccount } from "../controllers/userController.js";
import { isAuthorized } from "../middlewares/auth.js";
import { authLimiter } from "../middlewares/rateLimiter.js";

const router = express.Router();

// Public Routes (rate-limited to stop brute force)
router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);

// Protected Routes
router.get("/logout", isAuthorized, logout); // Logout requires authorization
router.get("/getuser", isAuthorized, getUser); // Updated route name for consistency
router.delete("/delete-me", isAuthorized, deleteMyAccount);

export default router;