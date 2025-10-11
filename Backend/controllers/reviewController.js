// controllers/reviewController.js
import Review from "../models/reviewModel.js";
import Product from "../models/productModel.js";


export const getReviewsByProduct = async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json({ reviews });   // ✅ wrap in object
  } catch (err) {
    res.status(500).json({ message: "Server error fetching reviews" });
  }
};


export const createReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const { productId } = req.params;

    // check if product exists
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // check if user already reviewed
    const alreadyReviewed = await Review.findOne({
      product: productId,
      user: req.userId,  // ✅ use userId from middleware
    });

    if (alreadyReviewed) {
      return res
        .status(400)
        .json({ message: "You have already reviewed this product" });
    }

    const review = await Review.create({
      product: productId,
      user: req.userId,  // ✅ use userId from middleware
      rating: Number(rating),
      comment,
    });

    // populate user info for frontend immediately
    await review.populate("user", "name email");

    res.status(201).json({ review });
  } catch (err) {
    console.error("Create Review Error:", err);
    res.status(500).json({ message: "Error submitting review" });
  }
};
