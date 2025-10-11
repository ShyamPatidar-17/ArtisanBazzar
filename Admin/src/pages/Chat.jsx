import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { io } from "socket.io-client";

const Chat = ({ sellerToken, sellerId, otherId, customerName }) => {
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // Use customerName from props
  const otherUser = customerName || "Customer";

  // Socket reference
  const socketRef = useRef(null);

  // Fetch messages and mark received as read
  const fetchMessages = async () => {
    if (!sellerId || !otherId) return;
    try {
      const res = await axios.get(
        `${backendUrl}/api/messages/${sellerId}/${otherId}`,
        { headers: { Authorization: `Bearer ${sellerToken}` } }
      );
      setMessages(res.data);

      // Mark messages received by this user as read
      await axios.post(
        `${backendUrl}/api/messages/read`,
        { sender: otherId, receiver: sellerId },
        { headers: { Authorization: `Bearer ${sellerToken}` } }
      );
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  };

  // Send message
  const sendMessage = async () => {
    if (!content.trim()) return;
    try {
      const msgData = {
        sender: sellerId,
        receiver: otherId,
        content,
      };
      await axios.post(`${backendUrl}/api/messages`, msgData, {
        headers: { Authorization: `Bearer ${sellerToken}` },
      });

      // Emit message to socket for real-time update
      socketRef.current.emit("send_message", msgData);

      setContent("");
      setMessages((prev) => [...prev, { ...msgData, createdAt: new Date(), read: false, _id: Date.now() }]);
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  // Initial load and setup socket
  useEffect(() => {
    fetchMessages();

    socketRef.current = io(backendUrl, { auth: { token: sellerToken } });

    // Listen for incoming messages
    socketRef.current.on("receive_message", (msg) => {
      if (msg.sender === otherId) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [sellerId, otherId]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="w-full max-w-2xl mx-auto bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl shadow-xl p-4 border border-indigo-200">
      {/* Chat Header */}
      <div className="flex items-center gap-3 border-b pb-3 mb-3 bg-white/70 rounded-xl px-3 py-2 shadow-sm">
        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-indigo-500 text-white font-bold text-lg border">
          {otherUser[0].toUpperCase()}
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
                  msg.sender === sellerId ? "justify-end" : "justify-start"
                }`}
              >
                {msg.sender !== sellerId && (
                  <div className="w-8 h-8 flex items-center justify-center rounded-full bg-indigo-400 text-white font-bold text-sm border">
                    {otherUser[0].toUpperCase()}
                  </div>
                )}
                <div
                  className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm shadow-sm ${
                    msg.sender === sellerId
                      ? "bg-gradient-to-br from-indigo-600 to-blue-500 text-white self-end"
                      : "bg-white text-gray-800 border border-gray-200"
                  }`}
                >
                  <div className="font-medium mb-1 text-xs opacity-70">
                    {msg.sender === sellerId ? "You" : otherUser}
                  </div>
                  {msg.content}
                  <div className="text-[10px] opacity-60 mt-1 text-right">
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                    {msg.sender === sellerId && (
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

      {/* Typing Animation */}
      {isTyping && (
        <div className="text-sm text-gray-500 italic mt-2 ml-3 animate-pulse">
          {otherUser} is typing...
        </div>
      )}

      {/* Input Area */}
      <div className="mt-4 flex items-center gap-2 bg-white/90 rounded-xl p-2 shadow-inner">
        <input
          type="text"
          className="flex-1 border-0 bg-transparent px-3 py-2 text-sm focus:outline-none"
          placeholder="Type a message..."
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
            setIsTyping(true);
            setTimeout(() => setIsTyping(false), 5000);
          }}
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
