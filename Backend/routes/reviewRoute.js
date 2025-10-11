// routes/reviewRoutes.js
import express from "express";
import authUser from "../middleware/auth.js";
import {
  getReviewsByProduct,
  createReview,
} from "../controllers/reviewController.js";

const reviewRouter = express.Router();

// Get all reviews for a product
reviewRouter.get("/:productId", getReviewsByProduct);

// Post a review for a product (requires login)
reviewRouter.post("/:productId",authUser() , createReview);

export default reviewRouter;
