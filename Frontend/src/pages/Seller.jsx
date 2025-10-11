import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { MessageSquareText } from "lucide-react";
import Title from "../components/Title";

const Sellers = () => {
  const navigate = useNavigate();
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchSellers = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/sellers`);
        setSellers(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching sellers:", error);
        setLoading(false);
      }
    };
    fetchSellers();
  }, []);

  const handleChat = (sellerId) => {
    navigate(`/chat/${sellerId}`);
  };

  if (loading) return <p className="text-center mt-10">Loading sellers...</p>;
  if (!sellers.length) return <p className="text-center mt-10">No sellers available.</p>;

  // Generate a pastel color based on string (name or id)
  const getPastelColor = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const h = hash % 360; // hue
    return `hsl(${h}, 70%, 85%)`; // pastel HSL
  };

  // Generate vibrant color for text highlights
  const getTextColor = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const h = hash % 360;
    return `hsl(${h}, 70%, 30%)`;
  };

  return (
    <div className="bg-amber-50 min-h-screen pt-14 px-4 sm:px-8">
      <div className="text-3xl sm:text-4xl mb-8 text-center text-red-900">
        <Title text1="CONNECT" text2="WITH ARTISAN" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sellers.map((seller) => (
          <div
            key={seller._id}
            className="border p-5 rounded-xl shadow-lg transform hover:scale-105 hover:shadow-2xl transition-all duration-300 relative"
            style={{ backgroundColor: getPastelColor(seller._id) }}
          >
            <div className="flex items-center gap-4">
              {seller.avatar ? (
                <img
                  src={seller.avatar}
                  alt={seller.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-white"
                />
              ) : (
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold border-2 border-white"
                  style={{ backgroundColor: getTextColor(seller.name) }}
                >
                  {seller.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <h2
                  className="text-lg font-bold"
                  style={{ color: getTextColor(seller.name) }}
                >
                  {seller.name}
                </h2>
                <p className="text-sm text-gray-700">{seller.email}</p>
                <p className="text-sm text-gray-700">{seller.city || "City not specified"}</p>
              </div>
            </div>

            {seller.shopName && (
              <p
                className="mt-3 font-semibold"
                style={{ color: getTextColor(seller.shopName) }}
              >
                Shop: {seller.shopName}
              </p>
            )}

            <button
              onClick={() => handleChat(seller._id)}
              className="mt-4 w-full bg-blue-600 text-white py-2 rounded flex items-center justify-center gap-2 hover:bg-blue-700 transition"
            >
              <MessageSquareText size={18} /> Chat with Artisan
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sellers;
