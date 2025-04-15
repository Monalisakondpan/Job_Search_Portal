import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import userRouter from "./routes/userRouter.js";
import jobRouter from "./routes/jobRouter.js";
import applicationRouter from "./routes/applicationRouter.js";
import { dbConnection } from "./database/dbConnection.js";
import { errorMiddleware } from "./middlewares/error.js";
import fs from "fs";

const app = express();

// Load environment variables
dotenv.config({ path: "./config/config.env" });

// Validate environment variables
if (!process.env.FRONTEND_URL) {
    console.error("Error: FRONTEND_URL is not defined in environment variables.");
    process.exit(1);
}

// Enable CORS
app.use(
    cors({
        origin: [process.env.FRONTEND_URL],
        methods: ["GET", "POST", "DELETE", "PUT"],
        credentials: true,
    })
);

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// File Upload Middleware
const tempFileDir = "/tmp";
if (!fs.existsSync(tempFileDir)) {
    fs.mkdirSync(tempFileDir); // Ensure the temp directory exists
}
app.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir,
    })
);

// API Routes
app.use("/api/v1/user", userRouter);
app.use("/api/v1/application", applicationRouter);
app.use("/api/v1/job", jobRouter);

// Database Connection
dbConnection();

// Handle Unhandled Routes
app.all("*", (req, res, next) => {
    res.status(404).json({
        success: false,
        message: `Cannot find ${req.originalUrl} on this server.`,
    });
});

// Error Middleware
app.use(errorMiddleware);

export default app;