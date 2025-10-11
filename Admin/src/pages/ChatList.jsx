import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { MessageSquare, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ChatList = ({ sellerToken }) => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    if (!sellerToken) return;

    let sellerId;
    try {
      const decoded = jwtDecode(sellerToken);
      sellerId = decoded._id || decoded.id;
    } catch (err) {
      console.error("❌ Invalid token:", err);
      return;
    }

    const fetchCustomers = async () => {
      try {
        const res = await axios.get(
          `${backendUrl}/api/messages/customers/${sellerId}`,
          { headers: { Authorization: `Bearer ${sellerToken}` } }
        );
        setCustomers(res.data);
      } catch (err) {
        console.error(
          "Failed to load customers:",
          err.response?.data || err.message
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
    const interval = setInterval(fetchCustomers, 3000);
    return () => clearInterval(interval);
  }, [sellerToken]);

  if (!sellerToken) {
    return (
      <div className="flex justify-center items-center h-[60vh] text-gray-500">
        Please login to view chats.
      </div>
    );
  }

  return (
    <div className="p-6 w-full max-w-3xl mx-auto bg-gradient-to-br from-indigo-50 to-blue-100 rounded-2xl shadow-lg border border-indigo-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          <MessageSquare className="text-indigo-600" /> Customer Chats
        </h2>
      </div>

      {/* Loading / No Chats */}
      {loading ? (
        <p className="text-center text-gray-500 py-10">Loading chats...</p>
      ) : customers.length === 0 ? (
        <p className="text-center text-gray-500 italic py-10">
          No conversations yet — start chatting with your customers 💬
        </p>
      ) : (
        <AnimatePresence>
          <div className="flex flex-col gap-3">
            {customers.map((customer) => {
              const hasUnread = customer.unreadCount > 0;
              const firstChar =
                (customer.name?.trim().charAt(0) ||
                  customer.email?.trim().charAt(0) ||
                  "U"
                ).toUpperCase();

              return (
                <motion.div
                  key={customer._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  onClick={() =>
                    navigate(`/chat/${customer._id}`, {
                      state: { customerName: customer.name || "Customer" },
                    })
                  }
                  className={`flex items-center justify-between p-4 rounded-xl shadow-sm border cursor-pointer transition-all duration-200 ${
                    hasUnread
                      ? "bg-indigo-100 hover:bg-indigo-200 border-indigo-400 shadow-md"
                      : "bg-white hover:bg-gray-100 border-transparent"
                  } hover:-translate-y-1`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={`https://api.dicebear.com/7.x/initials/svg?seed=${firstChar}`}
                      alt="avatar"
                      className="w-10 h-10 rounded-full border"
                    />
                    <div>
                      <h3
                        className={`font-semibold ${
                          hasUnread ? "text-indigo-700" : "text-gray-800"
                        }`}
                      >
                        {customer.name || "Unnamed User"}
                      </h3>
                      <p
                        className={`text-sm truncate max-w-[200px] ${
                          hasUnread ? "text-indigo-600 font-medium" : "text-gray-500"
                        }`}
                      >
                        {customer.lastMessage
                          ? customer.lastMessage.content
                          : "No messages yet"}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs text-gray-400 flex items-center gap-1 justify-end">
                      <Clock size={12} />
                      {customer.lastMessage
                        ? new Date(customer.lastMessage.createdAt).toLocaleTimeString(
                            [],
                            { hour: "2-digit", minute: "2-digit" }
                          )
                        : "--:--"}
                    </div>
                    {hasUnread && (
                      <span className="mt-1 inline-block bg-indigo-600 text-white text-[10px] font-semibold px-2 py-1 rounded-full">
                        {customer.unreadCount} new
                      </span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </AnimatePresence>
      )}
    </div>
  );
};

export default ChatList;
