import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./src/config/db.js";
import userRouter from "./src/routes/userRoute.js";
import analysisroutes from "./src/routes/analysisRoute.js";
import historyRoutes from "./src/routes/history.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ---------- Connect Database ----------
connectDB();

// ---------- Middleware ----------
app.use(express.json());
app.use(cookieParser());

// CORS configuration (supports cookies)
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

// ---------- Routes ----------
app.use("/api/user", userRouter);
app.use("/api/user", historyRoutes);
app.use("/api", analysisroutes);

// Health check
app.get("/", (req, res) => {
  res.send("API Running");
});

// ---------- Start Server ----------
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});