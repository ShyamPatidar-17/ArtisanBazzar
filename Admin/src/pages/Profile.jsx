import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  FaEnvelope,
  FaUserCircle,
  FaStore,
  FaCertificate,
  FaPhone,
  FaMapMarkerAlt,
  FaCity,
  FaGlobe,
  FaMapPin,
} from "react-icons/fa";
import { jwtDecode } from "jwt-decode";

const Profile = ({ token }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getProfileData = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const decoded = jwtDecode(token);
        console.log("Decoded token:", decoded);


        const { data } = await axios.get(`${backendUrl}/api/sellers/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (data.success) {
          setProfile(data.user);
        } else {
          toast.error(data.message || "Failed to fetch profile");
        }
      } catch (err) {
        toast.error("Error fetching profile");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getProfileData();
  }, [token]);

  if (!token)
    return (
      <div className="mt-20 text-center text-xl text-red-600">
        Please login to view your profile.
      </div>
    );

  if (loading)
    return (
      <div className="mt-20 text-center text-lg text-gray-600">
        Loading profile...
      </div>
    );

  if (!profile)
    return (
      <div className="mt-20 text-center text-red-600">Profile not found.</div>
    );

  return (
    <div className="max-w-4xl mx-auto mt-12 bg-white shadow-lg p-8 rounded-xl border border-gray-200">
      {/* Header */}
      <div className="flex items-center mb-8">
        <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-6xl overflow-hidden mr-6">
          {profile.name?.charAt(0).toUpperCase()}
        </div>
        <div>
          <h2 className="text-3xl font-bold text-red-800">{profile.name}</h2>
          <span
            className={`px-3 py-1 rounded-full text-sm font-semibold ${
              profile.role === "seller"
                ? "bg-yellow-200 text-yellow-800"
                : "bg-green-200 text-green-800"
            }`}
          >
            {profile.role.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Email */}
        <div className="flex items-center space-x-4">
          <FaEnvelope className="text-gray-500 text-xl" />
          <div>
            <p className="text-gray-600 font-medium">Email</p>
            <p className="text-gray-900 text-lg">{profile.email}</p>
          </div>
        </div>

        {/* Phone */}
        <div className="flex items-center space-x-4">
          <FaPhone className="text-gray-500 text-xl" />
          <div>
            <p className="text-gray-600 font-medium">Phone</p>
            <p className="text-gray-900 text-lg">
              {profile.phone || "Not Provided"}
            </p>
          </div>
        </div>

        {/* Registered On */}
        <div className="flex items-center space-x-4">
          <FaUserCircle className="text-gray-500 text-xl" />
          <div>
            <p className="text-gray-600 font-medium">Registered On</p>
            <p className="text-gray-900 text-lg">
              {new Date(profile.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Address */}
        <div className="flex items-center space-x-4">
          <FaMapMarkerAlt className="text-gray-500 text-xl" />
          <div>
            <p className="text-gray-600 font-medium">Address</p>
            <p className="text-gray-900 text-lg">
              {profile.address || "Not Provided"}
            </p>
          </div>
        </div>

        {/* City */}
        <div className="flex items-center space-x-4">
          <FaCity className="text-gray-500 text-xl" />
          <div>
            <p className="text-gray-600 font-medium">City</p>
            <p className="text-gray-900 text-lg">
              {profile.city || "Not Provided"}
            </p>
          </div>
        </div>

        {/* State */}
        <div className="flex items-center space-x-4">
          <FaGlobe className="text-gray-500 text-xl" />
          <div>
            <p className="text-gray-600 font-medium">State</p>
            <p className="text-gray-900 text-lg">
              {profile.state || "Not Provided"}
            </p>
          </div>
        </div>

        {/* Pincode */}
        <div className="flex items-center space-x-4">
          <FaMapPin className="text-gray-500 text-xl" />
          <div>
            <p className="text-gray-600 font-medium">Postal Code</p>
            <p className="text-gray-900 text-lg">
              {profile.postalCode || "Not Provided"}
            </p>
          </div>
        </div>

        {/* Seller-specific */}
        {profile.role === "seller" && (
          <>
            <div className="flex items-center space-x-4">
              <FaStore className="text-gray-500 text-xl" />
              <div>
                <p className="text-gray-600 font-medium">Shop Name</p>
                <p className="text-gray-900 text-lg">
                  {profile.shopName || "N/A"}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <FaCertificate className="text-gray-500 text-xl" />
              <div>
                <p className="text-gray-600 font-medium">GST Number</p>
                <p className="text-gray-900 text-lg">
                  {profile.gstNumber || "N/A"}
                </p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Actions */}
      <div className="mt-8 flex flex-col md:flex-row justify-between gap-4">
        <a
          href="/orders"
          className="flex-1 text-center px-6 py-3 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600 shadow transition"
        >
          My Orders
        </a>
        <a
          href="/profile/edit-profile"
          className="flex-1 text-center px-6 py-3 rounded-lg bg-green-500 text-white font-semibold hover:bg-green-600 shadow transition"
        >
          Edit Profile
        </a>
  <a
          href="/profile/change-password"
          className="flex-1 text-center px-6 py-3 rounded-lg bg-green-500 text-white font-semibold hover:bg-green-600 shadow transition"
        >
          Change Password
        </a>

        <button
          onClick={() => {
            localStorage.removeItem("token");
            window.location.reload();
          }}
          className="flex-1 text-center px-6 py-3 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 shadow transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
