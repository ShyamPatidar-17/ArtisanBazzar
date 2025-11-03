import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { FaRobot, FaTimes, FaMicrophone, FaPaperPlane } from "react-icons/fa";

const languages = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिंदी" },
];

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [context, setContext] = useState({});
  const [language, setLanguage] = useState("en");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  const recognition =
    typeof window !== "undefined" &&
    new (window.SpeechRecognition || window.webkitSpeechRecognition)();

  const startVoiceInput = () => {
    if (!recognition) return;
    recognition.lang = language === "hi" ? "hi-IN" : "en-US";
    recognition.start();
    recognition.onresult = (event) => setInput(event.results[0][0].transcript);
  };

  useEffect(() => {
    if (!isOpen) return;
    const hour = new Date().getHours();
    const greeting =
      hour < 12 ? "Good morning ☀️" : hour < 18 ? "Good afternoon 🌞" : "Good evening 🌙";

    setMessages([
      {
        sender: "bot",
        text: `${greeting}! I'm your Artisan Bazaar assistant. How can I help you today? `,
      },
    ]);
  }, [isOpen]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const res = await axios.post(`${backendUrl}/api/chat`, {
        message: input,
        context,
        language,
      });
      const reply = res.data.reply || "Sorry, I didn’t catch that.";
      setMessages((prev) => [...prev, { sender: "bot", text: reply }]);

      if (res.data.products?.length) {
        setMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            text: "You might like: " + res.data.products.map((p) => p.name).join(", "),
          },
        ]);
      }

      setContext((prev) => ({ ...prev, lastUserMessage: input }));
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: " Something went wrong. Please try again." },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Floating Robot Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-amber-600 to-orange-500 text-white p-5 rounded-full shadow-lg hover:scale-110 transition-transform z-50"
          title="Chat with us"
        >
          <FaRobot className="w-6 h-6" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[500px] bg-[#1e1b17] text-white rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-amber-400 z-50">
          {/* Header */}
          <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold text-lg flex justify-between items-center px-4 py-3 rounded-t-3xl">
            <div className="flex items-center gap-2">
              <span>Artisan Bazaar Chatbot</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200 p-1 rounded-full transition"
            >
              <FaTimes />
            </button>
          </div>

          {/* Chat Body */}
          <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-[#2a261f] to-[#1e1b17] space-y-3">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm animate-fade ${
                  msg.sender === "user"
                    ? "bg-[#2d3a4a] ml-auto text-gray-100"
                    : "bg-[#3e2e1e] mr-auto text-amber-100"
                }`}
              >
                {msg.text}
              </div>
            ))}

            {isTyping && (
              <div className="flex space-x-1">
                <span className="w-2 h-2 bg-amber-300 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-amber-300 rounded-full animate-bounce delay-100"></span>
                <span className="w-2 h-2 bg-amber-300 rounded-full animate-bounce delay-200"></span>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Footer with Buttons Above Input */}
          <div className="p-4 border-t border-amber-700 bg-[#24201c]">
            {/* Buttons Row */}
            <div className="flex justify-between items-center mb-3 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                {/* Microphone */}
                <button
                  onClick={startVoiceInput}
                  className="bg-green-500 hover:bg-green-400 text-white px-3 py-2 rounded-xl shadow-md hover:shadow-lg"
                >
                  <FaMicrophone />
                </button>

                {/* Language Selector */}
              <select
  value={language}
  onChange={(e) => setLanguage(e.target.value)}
  className={`
    px-3 py-2 rounded-xl shadow-md min-w-[100px] cursor-pointer
    text-white font-medium transition-all duration-200
    bg-blue-500 hover:bg-blue-400 focus:bg-blue-600 focus:shadow-lg
  `}
>
  {languages.map((lang) => (
    <option
      key={lang.code}
      value={lang.code}
      className={`
        text-black font-semibold
        ${language === lang.code ? "bg-green-300" : "bg-white"}
      `}
    >
      {lang.label}
    </option>
  ))}
</select>


              </div>

              {/* Send Button */}
              <button
                onClick={sendMessage}
                className="bg-amber-600 hover:bg-amber-500 text-white px-4 py-2 rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-transform flex items-center gap-2"
              >
                <FaPaperPlane /> Send
              </button>
            </div>

            {/* Input Box Below Buttons */}
            <div className="flex items-center border border-amber-600 rounded-xl px-3 py-2 bg-[#2f2b26]">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Ask about crafts, orders, or offers..."
                className="flex-1 bg-transparent text-white outline-none text-sm placeholder-gray-400"
              />
            </div>
          </div>
        </div>
      )}

      <style>
        {`
          .animate-fade { 
            animation: fadeIn 0.3s ease-in-out; 
          }
          @keyframes fadeIn {
            0% { opacity: 0; transform: translateY(5px); }
            100% { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </>
  );
};

export default Chatbot;
