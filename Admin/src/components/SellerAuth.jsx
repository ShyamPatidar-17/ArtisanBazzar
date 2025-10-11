// SellerAuth.jsx
import React, { useState } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FaStore, FaUserAlt, FaLock, FaEnvelope, FaPhoneAlt } from "react-icons/fa";

const SellerAuth = ({ setSellerToken }) => {
  const [mode, setMode] = useState("login");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    shopName: "",
    gstNumber: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url =
        mode === "signup"
          ? `${backendUrl}/api/sellers/register`
          : `${backendUrl}/api/sellers/login`;

      const payload =
        mode === "signup" ? formData : { email: formData.email, password: formData.password };

      const res = await axios.post(url, payload);

      if (res.data.success) {
        localStorage.setItem("sellerToken", res.data.token);
        setSellerToken(res.data.token);
        toast.success(`Seller ${mode} successful!`);
        navigate("/");
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex justify-center items-center min-h-screen overflow-hidden bg-gradient-to-br from-yellow-100 via-orange-100 to-pink-200">
      {/* 🌀 Animated Background Blobs */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-20 right-0 w-80 h-80 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-20 w-80 h-80 bg-orange-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

      {/* 🏬 Auth Card */}
      <div className="relative bg-white/80 backdrop-blur-xl shadow-2xl p-8 rounded-2xl w-[30rem] transform transition duration-700 hover:scale-[1.03] hover:shadow-amber-300/50 animate-fadeIn">
        <h2
          className={`text-3xl font-extrabold text-center mb-6 ${
            mode === "signup" ? "text-orange-600" : "text-pink-600"
          }`}
        >
          {mode === "signup" ? "Register Your Shop" : "Seller Login"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <>
              {/* Owner Info */}
              <div className="flex items-center border rounded-lg p-3 focus-within:ring-2 focus-within:ring-orange-400">
                <FaUserAlt className="text-gray-500 mr-3" />
                <input
                  type="text"
                  name="name"
                  placeholder="Owner Name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full outline-none"
                  required
                />
              </div>
              <div className="flex items-center border rounded-lg p-3 focus-within:ring-2 focus-within:ring-orange-400">
                <FaPhoneAlt className="text-gray-500 mr-3" />
                <input
                  type="text"
                  name="phone"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full outline-none"
                  required
                />
              </div>

              {/* Shop Info */}
              <div className="flex items-center border rounded-lg p-3 focus-within:ring-2 focus-within:ring-orange-400">
                <FaStore className="text-gray-500 mr-3" />
                <input
                  type="text"
                  name="shopName"
                  placeholder="Shop Name"
                  value={formData.shopName}
                  onChange={handleChange}
                  className="w-full outline-none"
                  required
                />
              </div>
              <input
                type="text"
                name="gstNumber"
                placeholder="GST Number"
                value={formData.gstNumber}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-400"
                required
              />

              {/* Address Fields */}
              <input
                type="text"
                name="address"
                placeholder="Street Address"
                value={formData.address}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-400"
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={handleChange}
                  className="p-3 border rounded-lg focus:ring-2 focus:ring-orange-400"
                  required
                />
                <input
                  type="text"
                  name="state"
                  placeholder="State"
                  value={formData.state}
                  onChange={handleChange}
                  className="p-3 border rounded-lg focus:ring-2 focus:ring-orange-400"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  name="postalCode"
                  placeholder="Postal Code"
                  value={formData.postalCode}
                  onChange={handleChange}
                  className="p-3 border rounded-lg focus:ring-2 focus:ring-orange-400"
                  required
                />
                <input
                  type="text"
                  name="country"
                  placeholder="Country"
                  value={formData.country}
                  onChange={handleChange}
                  className="p-3 border rounded-lg focus:ring-2 focus:ring-orange-400"
                  required
                />
              </div>
            </>
          )}

          {/* Email + Password */}
          <div className="flex items-center border rounded-lg p-3 focus-within:ring-2 focus-within:ring-pink-400">
            <FaEnvelope className="text-gray-500 mr-3" />
            <input
              type="email"
              name="email"
              placeholder="Business Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full outline-none"
              required
            />
          </div>
          <div className="flex items-center border rounded-lg p-3 focus-within:ring-2 focus-within:ring-pink-400">
            <FaLock className="text-gray-500 mr-3" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full outline-none"
              required
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-orange-500 to-pink-600 hover:from-pink-600 hover:to-orange-500 text-white font-bold py-3 rounded-lg transition duration-500 transform hover:scale-[1.02] shadow-md"
          >
            {loading ? "Processing..." : mode === "signup" ? "Signup" : "Login"}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-700">
          {mode === "signup" ? "Already a seller?" : "New seller?"}{" "}
          <button
            onClick={() => setMode(mode === "signup" ? "login" : "signup")}
            className="text-orange-600 font-semibold hover:underline transition"
          >
            {mode === "signup" ? "Login" : "Signup"}
          </button>
        </p>
      </div>

      {/* Extra Animations */}
      <style>{`
        .animate-blob { animation: blob 8s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-fadeIn { animation: fadeIn 1s ease-in-out; }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default SellerAuth;
