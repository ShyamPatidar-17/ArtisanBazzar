import express from "express";
import { getRecommendationsForUser } from "../controllers/recommendController.js"

const recRoute = express.Router();


recRoute.get("/:userId", getRecommendationsForUser);

export default recRoute;
