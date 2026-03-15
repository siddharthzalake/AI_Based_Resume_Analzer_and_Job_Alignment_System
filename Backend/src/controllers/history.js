import Analysis from "../models/Analysis.js";

export const getHistory = async (req, res) => {
  const history = await Analysis
    .find({ userId: req.user.id })
    .sort({ createdAt: -1 });

  res.json({ success: true, history });
};