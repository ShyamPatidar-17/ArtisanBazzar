import React from 'react';
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { Mail } from "lucide-react";
import "react-toastify/dist/ReactToastify.css";

const Newsletter = () => {
  const navigate = useNavigate();

  const handleSubscribe = (e) => {
    e.preventDefault();
    toast.success("Subscribed successfully!");
    setTimeout(() => {
      navigate("/");
      window.location.reload();
    }, 2000);
  };

  return (
    <div className="w-full bg-orange-100 py-16">
      <ToastContainer position="top-center" autoClose={5000} />

      <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
        
        {/* Left Column - Form */}
        <div className="flex-1">
          <h2 className="text-3xl font-bold text-orange-900 mb-4">Stay Connected</h2>
          <p className="text-gray-700 mb-6">
            Subscribe to our newsletter to receive updates about new arrivals,
            artisan stories, and exclusive offers.
          </p>
          <form className="flex flex-col sm:flex-row gap-3" onSubmit={handleSubscribe}>
            <input
              type="email"
              placeholder="Enter your email"
              className="px-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-orange-400"
              required
            />
            <button
              type="submit"
              className="px-6 py-2 rounded-md bg-orange-600 hover:bg-orange-700 text-white font-semibold shadow-md transition-transform transform hover:scale-105"
            >
              Subscribe
            </button>
          </form>
          <p className="text-sm text-gray-500 mt-3">We respect your privacy. Unsubscribe anytime.</p>
        </div>

        {/* Right Column - Animated Mail Icon */}
        <div className="flex-1 flex justify-center md:justify-end">
          <Mail className="w-24 h-24 text-orange-600 animate-float-rotate" />
        </div>

      </div>

      {/* Custom Tailwind Animation */}
      <style>
        {`
          @keyframes floatRotate {
            0% { transform: translate(0, 0) rotate(0deg); }
            25% { transform: translate(5px, -5px) rotate(5deg); }
            50% { transform: translate(0, -10px) rotate(-5deg); }
            75% { transform: translate(-5px, -5px) rotate(5deg); }
            100% { transform: translate(0, 0) rotate(0deg); }
          }
          .animate-float-rotate {
            animation: floatRotate 3s ease-in-out infinite;
          }
        `}
      </style>
    </div>
  );
};

export default Newsletter;
