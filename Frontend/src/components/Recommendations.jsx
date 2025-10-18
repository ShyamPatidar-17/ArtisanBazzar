// frontend/src/components/Recommendations.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../App";

export default function Recommendations({ userId }) {
  const [recs, setRecs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    axios
      .get(`${backendUrl}/api/recommendations/${userId}`)
      .then((res) => setRecs(res.data))
      .catch((err) => console.error("Reco error:", err))
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) return <div>Loading recommendations...</div>;
  if (!recs.length) return <div>No recommendations yet — try buying something!</div>;

  return (
    <div className="bg-amber-50 min-h-screen pt-14 px-4 sm:px-8">
      
      <div className="text-3xl sm:text-4xl mb-6 text-center text-red-900">
        <Title text1="RECOMMENDED" text2="COLLECTION" />
      </div>
      <h3>🧿 Recommended for you</h3>
      <div style={{ display: "flex", gap: 12, overflowX: "auto" }}>
        {recs.map((r) => (
          <div
            key={r.product._id}
            style={{
              width: 180,
              border: "1px solid #ddd",
              padding: 8,
              borderRadius: 8,
            }}
          >
            <img
              src={r.product.image?.[0] || "https://via.placeholder.com/150"}
              alt={r.product.name}
              style={{ width: "100%", height: 120, objectFit: "cover" }}
            />
            <h4 style={{ fontSize: 14, margin: "8px 0 4px" }}>{r.product.name}</h4>
            <div style={{ fontSize: 13 }}>₹{r.product.price}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
