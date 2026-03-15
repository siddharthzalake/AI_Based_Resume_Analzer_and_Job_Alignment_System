import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () =>
      console.log("✅ MongoDB connected")
    );

    mongoose.connection.on("error", (err) =>
      console.error("❌ MongoDB connection error:", err)
    );

    await mongoose.connect(`${process.env.MONGODB_URI}/resumeAnalyzer`)

  } catch (error) {
    console.error("❌ DB connection failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;