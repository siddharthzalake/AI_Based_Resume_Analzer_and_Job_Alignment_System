import Analysis from "../models/Analysis.js";
import axios from "axios";
import FormData from "form-data";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

const AI_URL = process.env.AI_SERVICE_URL || "http://localhost:8000";


const uploadFileToCloudinary = (buffer, fileName) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "resumes",

        //  Supports all file types
        resource_type: "auto",

        type: "upload",
        access_mode: "public",
        public_id: fileName
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );

    streamifier.createReadStream(buffer).pipe(stream);
  });
};



const createPreviewUrl = (fileUrl, publicId, mimeType) => {

  // ---------- PDF ----------
  if (mimeType === "application/pdf") {
    return cloudinary.url(publicId, {
      resource_type: "image",
      page: 1,
      format: "png"
    });
  }


  if (
    mimeType ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    return `https://docs.google.com/gview?url=${encodeURIComponent(fileUrl)}&embedded=true`;
  }

  return fileUrl;
};




//  Analyze Resume WITH Job Description


export const analyzeResume = async (req, res) => {
  try {
    const { companyName, jobRole, jobDescription } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Resume file required"
      });
    }

    if (!jobDescription) {
      return res.status(400).json({
        success: false,
        message: "Job description required"
      });
    }

    const fileBuffer = req.file.buffer;
    const fileName = req.file.originalname;
    const mimeType = req.file.mimetype;

    //  Upload 
    const cloudinaryResult =
      await uploadFileToCloudinary(fileBuffer, fileName);

    const fileUrl = cloudinaryResult.secure_url;

    //  Preview 
    const previewUrl = createPreviewUrl(
      fileUrl,
      cloudinaryResult.public_id,
      mimeType
    );

    //  Send to AI Service 
    const formData = new FormData();
    formData.append("resume", fileBuffer, fileName);
    formData.append("jobDescription", jobDescription);

    const aiResponse = await axios.post(
      `${AI_URL}/analyze`,
      formData,
      {
        headers: formData.getHeaders(),
        timeout: 240000 // 4 minutes
      }
    );

    if (!aiResponse.data?.analysis) {
      throw new Error("Invalid AI response");
    }

    const aiAnalysis = aiResponse.data.analysis;

    //  Save to Database 
    const analysis = await Analysis.create({
      userId: req.user.id,

      resumeFileUrl: fileUrl,
      previewImageUrl: previewUrl,

      resumeFileName: fileName,
      companyName,
      jobRole,
      jobDescription,

      scores: aiAnalysis.scores,
      missingSkills: aiAnalysis.missingSkills,
      toneFeedback: aiAnalysis.toneFeedback,
      contentSuggestions: aiAnalysis.contentSuggestions,
      atsSuggestions: aiAnalysis.atsSuggestions
    });

    return res.json({ success: true, analysis });

  } catch (error) {
    console.error("Analyze Resume Error:", error);

    return res.status(500).json({
      success: false,
      message: "Resume analysis failed"
    });
  }
};




//  Analyze Resume ONLY


export const analyzeResumeOnly = async (req, res) => {
  try {

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Resume file required"
      });
    }

    const fileBuffer = req.file.buffer;
    const fileName = req.file.originalname;
    const mimeType = req.file.mimetype;

    // Upload 
    const cloudinaryResult =
      await uploadFileToCloudinary(fileBuffer, fileName);

    const fileUrl = cloudinaryResult.secure_url;

    // ---------- Preview ----------
    const previewUrl = createPreviewUrl(
      fileUrl,
      cloudinaryResult.public_id,
      mimeType
    );

    //  Send to AI
    const formData = new FormData();
    formData.append("resume", fileBuffer, fileName);

    const response = await axios.post(
      `${AI_URL}/analyze-resume`,
      formData,
      {
        headers: formData.getHeaders(),
        timeout: 240000 // 4 minutes
      }
    );

    if (!response.data?.analysis) {
      throw new Error("Invalid AI response");
    }

    const aiAnalysis = response.data.analysis;

    //  Save
    const analysis = await Analysis.create({
      userId: req.user.id,

      resumeFileUrl: fileUrl,
      previewImageUrl: previewUrl,

      resumeFileName: fileName,

      scores: aiAnalysis.scores,
      missingSkills: aiAnalysis.missingSkills,
      toneFeedback: aiAnalysis.toneFeedback,
      contentSuggestions: aiAnalysis.contentSuggestions,
      atsSuggestions: aiAnalysis.atsSuggestions
    });

    return res.json({
      success: true,
      analysis
    });

  } catch (error) {
    console.error("Analyze Resume Only Error:", error);

    return res.status(500).json({
      success: false,
      message: "Resume analysis failed"
    });
  }
};
