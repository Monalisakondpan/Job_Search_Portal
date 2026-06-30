import express from "express";
import {
    deleteJob,
    getAllJobs,
    getMyJobs,
    getSinglejob,
    postJob,
    updateJob,
} from "../controllers/jobController.js";
import { isAuthorized } from "../middlewares/auth.js";

const router = express.Router();

// Public route to get all jobs
router.get("/getall", getAllJobs);

// Protected routes
router.post("/post", isAuthorized, postJob);
router.get("/getMyjobs", isAuthorized, getMyJobs); 
router.put("/update/:id", isAuthorized, updateJob);
router.delete("/delete/:id", isAuthorized, deleteJob);
router.get("/getAllJobs", isAuthorized, getAllJobs); 
router.get("/:id", isAuthorized, getSinglejob);

export default router;