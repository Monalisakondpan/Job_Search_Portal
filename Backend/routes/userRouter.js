import express from "express";
import { getUser, login, logout, register, deleteMyAccount, forgotPassword, resetPassword } from "../controllers/userController.js";
import { isAuthorized } from "../middlewares/auth.js";
import { authLimiter } from "../middlewares/rateLimiter.js";

const router = express.Router();

router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);
router.post("/password/forgot", authLimiter, forgotPassword);
router.put("/password/reset/:token", authLimiter, resetPassword);

router.get("/logout", isAuthorized, logout);
router.get("/getuser", isAuthorized, getUser);
router.delete("/delete-me", isAuthorized, deleteMyAccount);

export default router;