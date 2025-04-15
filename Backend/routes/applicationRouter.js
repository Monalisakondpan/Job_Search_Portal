import express from "express";
import {employerGetAllApplication, jobSeekerDeleteApplication, jobseekerGetAllApplication, postApplication} from "../controllers/applicationController.js";
import { isAuthorized } from "../middlewares/auth.js";


const router = express.Router();

router.get("/jobseeker/getall", isAuthorized, jobseekerGetAllApplication);
router.get("/employer/getall",isAuthorized, employerGetAllApplication);
router.delete("/delete/:id",isAuthorized, jobSeekerDeleteApplication);
router.post("/post", isAuthorized, postApplication);

export default router;