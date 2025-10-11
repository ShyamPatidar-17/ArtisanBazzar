import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";
import {
  FaEnvelope,
  FaUserCircle,
  FaStore,
  FaCertificate,
  FaIdBadge,
  FaPhone,
  FaMapMarkerAlt,
  FaClock,
  FaEdit,
  FaKey,
  FaCity,
  FaGlobeAmericas,
} from "react-icons/fa";
import Title from "../components/Title";
import { Link } from "react-router-dom";

const Profile = () => {
  const { token, backendUrl, logout } = useContext(ShopContext);
  const userId = localStorage.getItem("userId");

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getProfileData = async () => {
    try {
      if (!token || !userId) return;

      const response = await axios.get(`${backendUrl}/api/users/profile/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setProfile(response.data.user);
        setError("");
      } else {
        setError(response.data.message || "Failed to fetch profile");
        toast.error(response.data.message || "Failed to fetch profile");
      }
    } catch (err) {
      console.error("Profile fetch error:", err);
      setError("Could not load profile. Please try again later.");
      toast.error("Error fetching profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProfileData();
  }, [token, userId]);

  if (!token) {
    return (
      <div className="mt-20 text-center text-xl text-red-600">
        Please login to view your profile.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="mt-20 text-center text-lg text-gray-600">
        Loading profile...
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="mt-20 text-center text-xl text-red-600">
        {error || "Profile not available. Please try again."}
      </div>
    );
  }

  return (
    <div className="bg-amber-50 min-h-screen pt-14 px-4 sm:px-8">
      <div className="text-3xl sm:text-4xl mb-6 text-center text-red-900">
        <Title text1="YOUR" text2="PROFILE" />
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row items-center mb-8 gap-6">
        <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-6xl overflow-hidden shadow-md">
          {profile?.name?.charAt(0).toUpperCase() || "?"}
        </div>
        <div className="flex-1">
          <h2 className="text-3xl font-bold text-red-800 mb-2">
            {profile?.name || "Unknown"}
          </h2>
          <span
            className={`px-3 py-1 rounded-full text-sm font-semibold ${
              profile?.role === "seller"
                ? "bg-yellow-200 text-yellow-800"
                : "bg-green-200 text-green-800"
            }`}
          >
            {profile?.role?.toUpperCase() || "USER"}
          </span>

          {/* Quick Actions */}
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              to="/profile/edit"
              className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600 transition"
            >
              <FaEdit /> Edit Profile
            </Link>
            <Link
              to="/profile/change-password"
              className="flex items-center gap-2 bg-gray-700 text-white px-4 py-2 rounded shadow hover:bg-gray-800 transition"
            >
              <FaKey /> Change Password
            </Link>
          </div>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <InfoCard icon={<FaEnvelope />} title="Email" value={profile?.email} />
        {profile?.phone && <InfoCard icon={<FaPhone />} title="Phone" value={profile.phone} />}
        {profile?.address && (
          <InfoCard icon={<FaMapMarkerAlt />} title="Address" value={profile.address} />
        )}
        {profile?.city && <InfoCard icon={<FaCity />} title="City" value={profile.city} />}
        {profile?.state && <InfoCard icon={<FaMapMarkerAlt />} title="State" value={profile.state} />}
        {profile?.postalCode && <InfoCard icon={<FaMapMarkerAlt />} title="Postal Code" value={profile.postalCode} />}
        {profile?.country && <InfoCard icon={<FaGlobeAmericas />} title="Country" value={profile.country} />}
        <InfoCard
          icon={<FaClock />}
          title="Registered On"
          value={profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : "N/A"}
        />
        {profile?.role === "seller" && (
          <>
            <InfoCard icon={<FaStore />} title="Shop Name" value={profile?.shopName || "N/A"} />
            <InfoCard icon={<FaCertificate />} title="GST Number" value={profile?.gstNumber || "N/A"} />
          </>
        )}
      </div>

      {/* Actions */}
      <div className="mt-8 flex flex-col md:flex-row justify-between gap-4">
        <Link
          to="/orders"
          className="flex-1 text-center px-6 py-3 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600 shadow transition"
        >
          My Orders
        </Link>
        <button
          onClick={logout}
          className="flex-1 text-center px-6 py-3 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 shadow transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

// InfoCard component
const InfoCard = ({ icon, title, value }) => {
  return (
    <div className="flex items-center gap-3 bg-white p-4 rounded shadow hover:shadow-md transition">
      <div className="text-gray-500 text-2xl">{icon}</div>
      <div>
        <p className="text-gray-600 font-medium">{title}</p>
        <p className="text-gray-900 font-semibold">{value || "N/A"}</p>
      </div>
    </div>
  );
};

export default Profile;
