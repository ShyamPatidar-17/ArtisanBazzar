import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { useNavigate } from "react-router-dom";
import Title from "./Title";

const Recommendations = () => {
  const [recs, setRecs] = useState([]);
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  // 🔄 Fetch recommendations when user logs in
  useEffect(() => {
    if (!userId) {
      console.log("🚫 No user logged in — skipping recommendations");
      return;
    }

    const fetchRecs = async () => {
      try {
        console.log("Fetching recommendations for user:", userId);
        const res = await axios.get(`${backendUrl}/api/recommendations/${userId}`);
        console.log("🔍 Recommendations received:", res.data);
        setRecs(res.data);
      } catch (err) {
        console.error("❌ Recommendation fetch error:", err);
      }
    };

    fetchRecs();
  }, [userId]);

  // 🧭 Navigate to product detail page
  const handleProductClick = (id) => {
    navigate(`/product/${id}`);
  };

  return (
    <div className="p-6">
      {/* Title Section */}
      <div className="text-3xl sm:text-4xl mb-10 text-center text-red-900">
        <Title text1="Your" text2="Recommendations" />
      </div>

      {/* Product Grid */}
      {recs.length > 0 ? (
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {recs.map((p) => (
            <div
              key={p._id}
              onClick={() => handleProductClick(p._id)}
              className="cursor-pointer border border-gray-200 rounded-2xl bg-white shadow-sm hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              <img
                src={p.image?.[0] || "/placeholder.jpg"}
                alt={p.name || "Product image"}
                className="w-full h-52 object-cover rounded-t-2xl"
                onError={(e) => (e.target.src = "/placeholder.jpg")}
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 truncate">{p.name}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {p.category || "Uncategorized"} • {p.subCategory || "General"}
                </p>
                <p className="mt-3 text-indigo-600 font-bold text-lg">₹{p.price}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // Empty State
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <img
            src="/no-recs.svg"
            alt="No recommendations"
            className="w-40 h-40 mb-6 opacity-70"
            onError={(e) => (e.target.style.display = "none")}
          />
          <p className="text-gray-700 text-lg font-medium">
            No recommendations available yet.
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Start shopping to receive personalized product suggestions!
          </p>
        </div>
      )}
    </div>
  );
};

export default Recommendations;
