import mongoose from "mongoose";

const analysisSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    previewImageUrl: {
      type: String,
      required: true
    },

    resumeFileName: String,
    companyName: String,
    jobRole: String,
    jobDescription: String,

    //  NEW HYBRID SCORES
    scores: {
      keywordMatch: Number,
      semanticScore: Number,
      atsScore: Number,
      alignmentScore: Number,
      overallScore: Number
    },

    // AI INFO
    missingSkills: [String],

    contentSuggestions: [String],

    atsSuggestions: [String],

  },
  { timestamps: true }
);

const Analysis = mongoose.model("Analysis", analysisSchema);

export default Analysis;
