import React, { useContext, useState, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const EditProfile = () => {
  const { token, backendUrl } = useContext(ShopContext);
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Load current profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setFetching(true);
       const res = await axios.get(`${backendUrl}/api/users/profile/${userId}`, {
  headers: { Authorization: `Bearer ${token}` },
});


        if (res.data.success) {
          const user = res.data.user;
          if (user.role !== "user") {
            toast.error("This page is for customers only");
            navigate("/");
            return;
          }

          setFormData({
            name: user.name || "",
            phone: user.phone || "",
            address: user.address || "",
            city: user.city || "",
            state: user.state || "",
            postalCode: user.postalCode || "",
            country: user.country || "",
          });
        } else {
          toast.error(res.data.message || "Failed to load profile");
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load profile");
      } finally {
        setFetching(false);
      }
    };
    fetchProfile();
  }, [backendUrl, token, userId, navigate]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.put(
        `${backendUrl}/api/users/profile/edit`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        toast.success("Profile updated successfully!", { autoClose: 2000 });
        setTimeout(() => navigate("/profile"), 2200);
      } else {
        toast.error(res.data.message || "Failed to update profile");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error updating profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fefcfb] flex items-center justify-center px-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-8 sm:p-10">
        <h2 className="text-3xl font-bold text-[#2d2d2d] mb-6 text-center">
          Edit Profile
        </h2>
        <p className="text-gray-500 text-center mb-6">
          Update your account information.
        </p>
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Full Name"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f59e0b] focus:border-transparent transition"
            required
          />
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f59e0b] focus:border-transparent transition"
          />
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Address"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f59e0b] focus:border-transparent transition"
          />
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="City"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f59e0b] focus:border-transparent transition"
          />
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleChange}
            placeholder="State"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f59e0b] focus:border-transparent transition"
          />
          <input
            type="text"
            name="postalCode"
            value={formData.postalCode}
            onChange={handleChange}
            placeholder="Postal Code"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f59e0b] focus:border-transparent transition"
          />
          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleChange}
            placeholder="Country"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f59e0b] focus:border-transparent transition"
          />

          <button
            type="submit"
            className="w-full bg-[#f59e0b] hover:bg-[#d97706] text-white font-semibold py-3 rounded-lg shadow-md transition"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Profile"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
