// backend/routes/recommendations.js
import express from "express";
import mongoose from "mongoose";
import getRecommendationsForUser from "../services/recommender.js";

const recRoute = express.Router();

recRoute.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId))
      return res.status(400).json({ error: "Invalid userId" });

    const recs = await getRecommendationsForUser(userId, { limit: 12 });
    res.json(recs);
  } catch (err) {
    console.error("Recommendation error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default recRoute;
