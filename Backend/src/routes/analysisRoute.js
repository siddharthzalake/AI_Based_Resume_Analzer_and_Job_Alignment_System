import express from "express";
import  upload  from "../middleware/uploadMiddleware.js";
import {
  analyzeResume,
  analyzeResumeOnly
} from "../controllers/analysisController.js";
import authUser from "../middleware/authMiddleware.js";

const analysisroutes = express.Router();

analysisroutes.post("/analyze-resume",authUser ,upload.single("resume"), analyzeResumeOnly);

analysisroutes.post("/analyze-with-jd",authUser, upload.single("resume"), analyzeResume);

export default analysisroutes;