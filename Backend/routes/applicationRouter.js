import express from "express";
import {employerGetAllApplication, employerGetRankedApplications, employerUpdateApplicationStatus, jobSeekerDeleteApplication, jobseekerGetAllApplication, postApplication} from "../controllers/applicationController.js";
import { isAuthorized } from "../middlewares/auth.js";


const router = express.Router();

router.get("/jobseeker/getall", isAuthorized, jobseekerGetAllApplication);
router.get("/employer/getall",isAuthorized, employerGetAllApplication);
router.get("/employer/ranked/:jobId", isAuthorized, employerGetRankedApplications);
router.put("/status/:id", isAuthorized, employerUpdateApplicationStatus);
router.delete("/delete/:id",isAuthorized, jobSeekerDeleteApplication);
router.post("/post", isAuthorized, postApplication);

export default router;