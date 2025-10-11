import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { ShopContext } from "../context/ShopContext";
import { FaStar } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Title from "./Title"; // ✅ Custom Title component

const Review = ({ productId }) => {
  const { backendUrl, token, logout } = useContext(ShopContext);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");

  // ✅ Fetch reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/review/${productId}`);
        setReviews(res.data.reviews || []);
      } catch (err) {
        console.error("Error fetching reviews:", err);
      }
    };
    fetchReviews();
  }, [productId, backendUrl]);

  // ✅ Submit review
  const handleSubmit = async () => {
    if (!token) {
      toast.error("Please login to post a review");
      return;
    }
    if (!rating || !comment) {
      toast.error("Rating and comment are required");
      return;
    }

    try {
      const res = await axios.post(
        `${backendUrl}/api/review/${productId}`,
        { rating, comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Review posted successfully!");
      setReviews([res.data.review, ...reviews]);
      setRating(0);
      setHoverRating(0);
      setComment("");
    } catch (err) {
      console.error("Error posting review:", err);
      if (err.response?.status === 401) logout();
      toast.error(err.response?.data?.message || "Error posting review");
    }
  };

  // ✅ Calculate average rating
  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : 0;

  return (
    <div className="w-full my-24 bg-amber-50 py-10 px-6 rounded-lg shadow-lg">
      {/* --- Section Title --- */}
      <div className="text-center text-3xl py-2 text-red-900">
        <Title text1={"CUSTOMER"} text2={"REVIEWS"} />
      </div>

      {/* --- Average Rating --- */}
      <div className="flex flex-col items-center md:items-start md:flex-row md:justify-between gap-6 mt-6 mb-10">
        <div className="text-center md:text-left">
          <h2 className="text-2xl font-bold text-gray-800">Average Rating</h2>
          <p className="text-gray-600 mt-1">
            ⭐ {avgRating} / 5 · {reviews.length}{" "}
            {reviews.length === 1 ? "Review" : "Reviews"}
          </p>
          <div className="flex mt-2 gap-1 justify-center md:justify-start">
            {[1, 2, 3, 4, 5].map((num) => (
              <motion.div
                key={num}
                whileHover={{ scale: 1.2, rotate: 10 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <FaStar
                  size={26}
                  className={`${
                    num <= Math.round(avgRating)
                      ? "text-yellow-500"
                      : "text-gray-300"
                  }`}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* --- Two Column Layout --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* --- Left Side: All Reviews --- */}
        <div className="space-y-4 max-h-[450px] overflow-y-auto pr-2 custom-scrollbar">
          {reviews.length > 0 ? (
            <AnimatePresence>
              {reviews.map((r) => (
                <motion.div
                  key={r._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="p-5 rounded-xl bg-white border border-gray-100 shadow hover:shadow-xl transition"
                >
                  <div className="flex items-center justify-between mb-3">
                    <p className="font-semibold text-gray-900">
                      {r.user?.name || "Anonymous"}
                    </p>
                    <div className="flex text-yellow-500 gap-1">
                      {[...Array(5)].map((_, i) => (
                        <motion.div
                          key={i}
                          whileHover={{ scale: 1.3 }}
                          transition={{ type: "spring", stiffness: 200 }}
                        >
                          <FaStar
                            size={22} // ✅ Larger star size
                            className={`${
                              i < r.rating
                                ? "fill-yellow-500"
                                : "fill-gray-300"
                            }`}
                          />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700">{r.comment}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(r.createdAt).toLocaleDateString()}
                  </p>
                </motion.div>
              ))}
            </AnimatePresence>
          ) : (
            <div className="text-center p-6 text-gray-500 bg-gray-50 rounded-xl">
              No reviews yet. Be the first to share your experience ✨
            </div>
          )}
        </div>

        {/* --- Right Side: Write Review --- */}
        <div className="p-6 border border-gray-200 rounded-xl bg-white shadow-md">
          <div className="text-center text-2xl py-2 text-blue-800">
            <Title text1={"WRITE"} text2={"REVIEW"} />
          </div>

          {token ? (
            <>
              {/* Star Rating */}
              <div className="flex items-center justify-center gap-3 mb-4">
                {[1, 2, 3, 4, 5].map((num) => (
                  <motion.div
                    key={num}
                    whileHover={{ scale: 1.3, rotate: -10 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <FaStar
                      size={30} // ✅ Bigger stars for writing review
                      onClick={() => setRating(num)}
                      onMouseEnter={() => setHoverRating(num)}
                      onMouseLeave={() => setHoverRating(0)}
                      className={`cursor-pointer transition ${
                        num <= (hoverRating || rating)
                          ? "text-yellow-500 scale-110"
                          : "text-gray-300"
                      }`}
                    />
                  </motion.div>
                ))}
              </div>

              {/* Comment Box */}
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                placeholder="Share your experience..."
                rows={5}
              />

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow transition"
              >
                Submit Review
              </button>
            </>
          ) : (
            <p className="text-red-600 font-medium mt-4 text-center">
              Please login to post a review
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Review;
