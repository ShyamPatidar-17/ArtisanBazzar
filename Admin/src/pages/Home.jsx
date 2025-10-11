import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PlusCircle, ListOrdered, Package, UserCircle2, MessageSquareText } from "lucide-react";
import axios from "axios";
import {jwtDecode} from "jwt-decode";
import CountUp from "react-countup";

const Home = ({ token }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [stats, setStats] = useState({
    products: 0,
    total: 0,
    processing: 0,
    delivered: 0,
    cancelled: 0,
  });
  const [shopName, setShopName] = useState("Shop");
  const id = token ? jwtDecode(token).id : null;

  useEffect(() => {
    if (token && id) {
      // Fetch dashboard stats
      axios
        .get(`${backendUrl}/api/sellers/stats/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setStats(res.data))
        .catch(() => console.log("Could not fetch stats"));

      // Fetch shop name from token or backend
      const decoded = jwtDecode(token);
      console.log(decoded.id)

      if (decoded.shopName) {
        setShopName(decoded.shopName);
      } else {
        axios
          .get(`${backendUrl}/api/sellers/me/${decoded.id}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((res) => {
            if (res.data.success && res.data.seller?.shopName) {
              setShopName(res.data.seller.shopName);
            }
          })
          .catch(() => console.log("Could not fetch shop name"));
      }
    }
  }, [token, backendUrl, id]);

  if (!token) {
    return (
      <div className="mt-20 text-center text-red-600 text-xl">
        Please login to view the dashboard.
      </div>
    );
  }

  const statusColors = {
    processing: "from-yellow-400 to-yellow-200 text-yellow-800",
    delivered: "from-green-400 to-green-200 text-green-800",
    cancelled: "from-red-400 to-red-200 text-red-800",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-green-50 px-6 py-10 flex flex-col items-center text-center">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8 tracking-tight">
        Seller Dashboard
      </h1>

      {/* Welcome Panel */}
      <div className="bg-white/90 backdrop-blur-md border border-gray-200 text-gray-800 p-8 rounded-3xl mb-12 shadow-2xl max-w-6xl w-full animate-fadeIn">
        <h2 className="text-2xl font-semibold mb-2">Welcome back, {shopName}! 👋</h2>
        <p className="text-gray-600 mb-6">
          Quick overview of your store. Manage products, orders, chats, and your profile easily.
        </p>

        {/* Stats Row */}
        <div className="flex flex-wrap justify-center gap-6 mt-6">
          <div className="flex-1 min-w-[120px] bg-gradient-to-br from-blue-400 to-blue-200 text-white p-6 rounded-xl shadow-lg hover:scale-105 transform transition-all duration-300">
            <p className="text-3xl font-bold">
              <CountUp end={stats.products} duration={1.5} />
            </p>
            <p className="text-sm mt-1">Products</p>
          </div>

          <div className="flex-1 min-w-[120px] bg-gradient-to-br from-indigo-400 to-indigo-200 text-white p-6 rounded-xl shadow-lg hover:scale-105 transform transition-all duration-300">
            <p className="text-3xl font-bold">
              <CountUp end={stats.total} duration={1.5} />
            </p>
            <p className="text-sm mt-1">Total Orders</p>
          </div>

          {["processing", "delivered", "cancelled"].map((status) => (
            <div
              key={status}
              className={`flex-1 min-w-[120px] bg-gradient-to-br ${statusColors[status]} p-6 rounded-xl shadow-lg hover:scale-105 transform transition-all duration-300`}
            >
              <p className="text-3xl font-bold">
                <CountUp end={stats[status]} duration={1.5} />
              </p>
              <p className="text-sm mt-1 capitalize">{status}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid gap-8 sm:grid-cols-5 w-full max-w-6xl">
        <Link
          to="/add"
          className="flex flex-col items-center justify-center p-6 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-2xl shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          <PlusCircle size={36} className="mb-3 animate-bounce" />
          <span className="text-lg font-semibold">Add Product</span>
        </Link>

        <Link
          to="/list"
          className="flex flex-col items-center justify-center p-6 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-2xl shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          <Package size={36} className="mb-3 animate-bounce" />
          <span className="text-lg font-semibold">Product List</span>
        </Link>

        <Link
          to="/orders"
          className="flex flex-col items-center justify-center p-6 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-2xl shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          <ListOrdered size={36} className="mb-3 animate-bounce" />
          <span className="text-lg font-semibold">Orders</span>
        </Link>

        <Link
          to="/chats"
          className="flex flex-col items-center justify-center p-6 bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 text-white rounded-2xl shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          <MessageSquareText size={36} className="mb-3 animate-pulse" />
          <span className="text-lg font-semibold">Chats</span>
        </Link>

        <Link
          to="/profile"
          className="flex flex-col items-center justify-center p-6 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white rounded-2xl shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          <UserCircle2 size={36} className="mb-3 animate-bounce" />
          <span className="text-lg font-semibold">Profile</span>
        </Link>
      </div>
    </div>
  );
};

export default Home;
