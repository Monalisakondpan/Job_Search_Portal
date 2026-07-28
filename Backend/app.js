import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import hpp from "hpp";
import userRouter from "./routes/userRouter.js";
import jobRouter from "./routes/jobRouter.js";
import applicationRouter from "./routes/applicationRouter.js";
import adminRouter from "./routes/adminRouter.js";
import { dbConnection } from "./database/dbConnection.js";
import { errorMiddleware } from "./middlewares/error.js";
import { apiLimiter } from "./middlewares/rateLimiter.js";
import fs from "fs";
const app = express();
app.set("trust proxy", 1);

dotenv.config({ path: "./config/config.env" });

if (!process.env.FRONTEND_URL) {
    console.error("Error: FRONTEND_URL is not defined in environment variables.");
    process.exit(1);
}

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      frameSrc: ["'self'", "https://res.cloudinary.com"],
      imgSrc: ["'self'", "https://res.cloudinary.com", "data:"],
    },
  },
}));

app.use(
    cors({
        origin: [process.env.FRONTEND_URL],
        methods: ["GET", "POST", "DELETE", "PUT"],
        credentials: true,
    })
);

app.use(cookieParser());
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(mongoSanitize());
app.use(hpp());
app.use("/api", apiLimiter);

const tempFileDir = "/tmp";
if (!fs.existsSync(tempFileDir)) {
    fs.mkdirSync(tempFileDir);
}
app.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir,
        limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max resume
        abortOnLimit: true,
    })
);

app.use("/api/v1/user", userRouter);
app.use("/api/v1/application", applicationRouter);
app.use("/api/v1/job", jobRouter);
app.use("/api/v1/admin", adminRouter);
// Database Connection
dbConnection();
// Handle Unhandled Routes
app.all("*", (req, res, next) => {
    res.status(404).json({
        success: false,
        message: `Cannot find ${req.originalUrl} on this server.`,
    });
});

app.use(errorMiddleware);
export default app;