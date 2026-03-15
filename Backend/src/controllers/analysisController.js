import Analysis from "../models/Analysis.js";
import axios from "axios";
import FormData from "form-data";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

import libre from "libreoffice-convert";
import { promisify } from "util";

const libreConvert = promisify(libre.convert);

const AI_URL = process.env.AI_SERVICE_URL || "http://localhost:8000";



//  Convert DOCX -> PDF

const convertDocToPDF = async (buffer) => {
  return await libreConvert(buffer, ".pdf", undefined);
};



// Upload to Cloudinary 

const uploadPDFToCloudinary = (buffer, fileName) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "resumes",
        resource_type: "image", //  PDF preview
        public_id: fileName.replace(/\.[^/.]+$/, "")
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );

    streamifier.createReadStream(buffer).pipe(stream);
  });
};



//  Analyze Resume WITH JD

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

    let fileBuffer = req.file.buffer;
    let fileName = req.file.originalname;

    // ---------- Convert DOC/DOCX → PDF ----------
    if (
      req.file.mimetype === "application/msword" ||
      req.file.mimetype ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      fileBuffer = await convertDocToPDF(fileBuffer);
      fileName = fileName.replace(/\.(doc|docx)$/i, ".pdf");
    }

    // ---------- Upload PDF to Cloudinary ----------
    const cloudinaryResult =
      await uploadPDFToCloudinary(fileBuffer, fileName);

    const fileUrl = cloudinaryResult.secure_url;

    // Cloudinary preview (first page)
   const previewUrl = cloudinary.url(
  cloudinaryResult.public_id,
  {
    resource_type: "image",
    page: 1,      // first page
    format: "png" // render as image
  }
);

    // ---------- Send to AI Service ----------
    const formData = new FormData();
    formData.append("resume", fileBuffer, fileName);
    formData.append("jobDescription", jobDescription);

    const aiResponse = await axios.post(
      `${AI_URL}/analyze`,
      formData,
      {
        headers: formData.getHeaders(),
        timeout: 60000
      }
    );

    if (!aiResponse.data?.analysis) {
      throw new Error("Invalid AI response");
    }

    const aiAnalysis = aiResponse.data.analysis;

    // ---------- Save to Database ----------
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


// ======================================================
// 🔥 Analyze Resume ONLY
// ======================================================
export const analyzeResumeOnly = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Resume file required"
      });
    }

    let fileBuffer = req.file.buffer;
    let fileName = req.file.originalname;

    // ---------- Convert DOC/DOCX → PDF ----------
    if (
      req.file.mimetype === "application/msword" ||
      req.file.mimetype ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      fileBuffer = await convertDocToPDF(fileBuffer);
      fileName = fileName.replace(/\.(doc|docx)$/i, ".pdf");
    }

    // ---------- Upload PDF ----------
    const cloudinaryResult =
      await uploadPDFToCloudinary(fileBuffer, fileName);

    const fileUrl = cloudinaryResult.secure_url;
     const previewUrl = cloudinary.url(
  cloudinaryResult.public_id,
  {
    resource_type: "image",
    page: 1,      // first page
    format: "png" // render as image
  }
);

    // ---------- Send to AI ----------
    const formData = new FormData();
    formData.append("resume", fileBuffer, fileName);

    const response = await axios.post(
      `${AI_URL}/analyze-resume`,
      formData,
      {
        headers: formData.getHeaders(),
        timeout: 60000
      }
    );

    if (!response.data?.analysis) {
      throw new Error("Invalid AI response");
    }

    const aiAnalysis = response.data.analysis;

    // ---------- Save ----------
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