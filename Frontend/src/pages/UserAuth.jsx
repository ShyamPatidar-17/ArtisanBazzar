// UserAuth.jsx
import React, { useState, useContext } from "react";
import axios from "axios";
import { ShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const UserAuth = () => {
  const [mode, setMode] = useState("login"); // login | signup
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const { backendUrl, setToken } = useContext(ShopContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url =
        mode === "signup"
          ? `${backendUrl}/api/users/register`
          : `${backendUrl}/api/users/login`;

      const res = await axios.post(url, formData);

      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        setToken(res.data.token); // ✅ Update context immediately
        toast.success(`User ${mode} successful!`);
        navigate("/");
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Try again.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-amber-100">
      <div className="bg-white shadow-xl p-8 rounded-lg w-96">
        <h2 className="text-2xl font-bold text-center mb-6">
          {mode === "signup" ? "User Signup" : "User Login"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
          <button
            type="submit"
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 rounded"
          >
            {mode === "signup" ? "Signup" : "Login"}
          </button>
        </form>
        <p className="mt-4 text-center">
          {mode === "signup" ? "Already a user?" : "New here?"}{" "}
          <button
            onClick={() => setMode(mode === "signup" ? "login" : "signup")}
            className="text-blue-500 underline"
          >
            {mode === "signup" ? "Login" : "Signup"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default UserAuth;
