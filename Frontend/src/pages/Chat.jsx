import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

const Chat = ({ userToken, userId, otherId }) => {
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");
  const [otherUser, setOtherUser] = useState("User");
  const messagesEndRef = useRef(null);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // Fetch other user's info
  const fetchOtherUser = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/users/${otherId}`, {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      setOtherUser(res.data.name || "User");
    } catch {
      setOtherUser("User");
    }
  };

  // Fetch messages and mark as read
  const fetchMessages = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/messages/${userId}/${otherId}`, {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      setMessages(res.data);

      // Mark received messages as read
      await axios.post(
        `${backendUrl}/api/messages/read`,
        { sender: otherId, receiver: userId },
        { headers: { Authorization: `Bearer ${userToken}` } }
      );
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  };

  // Send message
  const sendMessage = async () => {
    if (!content.trim()) return;
    try {
      await axios.post(
        `${backendUrl}/api/messages`,
        { sender: userId, receiver: otherId, content },
        { headers: { Authorization: `Bearer ${userToken}` } }
      );
      setContent("");
      fetchMessages(); // refresh immediately after sending
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  // Auto-refresh every 3 seconds
  useEffect(() => {
    fetchOtherUser();
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [userId, otherId]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="w-full max-w-2xl mx-auto bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl shadow-xl p-4 border border-indigo-200">
      {/* Header */}
      <div className="flex items-center gap-3 border-b pb-3 mb-3 bg-white/70 rounded-xl px-3 py-2 shadow-sm">
        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-indigo-500 text-white font-bold text-lg border">
          {otherUser ? otherUser[0].toUpperCase() : "U"}
        </div>
        <h2 className="font-semibold text-lg text-gray-800">
          Chat with {otherUser}
        </h2>
      </div>

      {/* Messages Area */}
      <div className="h-[450px] overflow-y-auto pr-2 custom-scrollbar">
        {messages.length === 0 ? (
          <p className="text-gray-500 text-center mt-20 italic">
            No messages yet — start the conversation 💬
          </p>
        ) : (
          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div
                key={msg._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className={`flex items-start gap-2 my-2 ${
                  msg.sender === userId ? "justify-end" : "justify-start"
                }`}
              >
                {msg.sender !== userId && (
                  <div className="w-8 h-8 flex items-center justify-center rounded-full bg-indigo-400 text-white font-bold text-sm border">
                    {otherUser ? otherUser[0].toUpperCase() : "U"}
                  </div>
                )}
                <div
                  className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm shadow-sm ${
                    msg.sender === userId
                      ? "bg-gradient-to-br from-indigo-600 to-blue-500 text-white self-end"
                      : "bg-white text-gray-800 border border-gray-200"
                  }`}
                >
                  <div className="font-medium mb-1 text-xs opacity-70">
                    {msg.sender === userId ? "You" : otherUser}
                  </div>
                  {msg.content}
                  <div className="text-[10px] opacity-60 mt-1 text-right">
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                    {msg.sender === userId && (
                      <span className="ml-1">{msg.read ? "✓✓" : "✓"}</span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="mt-4 flex items-center gap-2 bg-white/90 rounded-xl p-2 shadow-inner">
        <input
          type="text"
          className="flex-1 border-0 bg-transparent px-3 py-2 text-sm focus:outline-none"
          placeholder="Type a message..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-xl text-sm font-medium transition-all duration-300"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
