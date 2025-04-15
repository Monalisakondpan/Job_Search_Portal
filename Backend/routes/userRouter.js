import express from "express";
import { getUser, login, logout, register } from "../controllers/userController.js";
import { isAuthorized } from "../middlewares/auth.js";

const router = express.Router();

// Public Routes
router.post("/register", register);
router.post("/login", login);

// Protected Routes
router.get("/logout", isAuthorized, logout); // Logout requires authorization
router.get("/getuser", isAuthorized, getUser); // Updated route name for consistency

export default router;