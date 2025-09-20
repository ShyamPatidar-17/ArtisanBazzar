import React from "react";
import { Link } from "react-router-dom";
import { PlusCircle, ListOrdered, Package } from "lucide-react"; // icons

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-green-50 px-6 py-10 flex flex-col items-center text-center">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-6 tracking-tight">
        Admin Dashboard
      </h1>

      {/* Welcome Message */}
      <div className="bg-white/70 backdrop-blur-sm border border-gray-200 text-gray-800 p-8 rounded-2xl mb-12 shadow-lg max-w-2xl">
        <h2 className="text-2xl font-semibold mb-3">Welcome back, Admin! 👋</h2>
        <p className="text-gray-600">
          Manage products and orders seamlessly. Use the quick access buttons
          below to perform actions faster.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="grid gap-8 sm:grid-cols-3 w-full max-w-5xl">
        {/* Add Product */}
        <Link
          to="/add"
          className="flex flex-col items-center justify-center p-8 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-2xl shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          <PlusCircle size={40} className="mb-4" />
          <span className="text-xl font-bold">Add Product</span>
          <p className="text-sm opacity-80 mt-1">Quickly add new products</p>
        </Link>

        {/* Product List */}
        <Link
          to="/list"
          className="flex flex-col items-center justify-center p-8 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-2xl shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          <Package size={40} className="mb-4" />
          <span className="text-xl font-bold">Product List</span>
          <p className="text-sm opacity-80 mt-1">View & manage products</p>
        </Link>

        {/* Orders */}
        <Link
          to="/orders"
          className="flex flex-col items-center justify-center p-8 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-2xl shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          <ListOrdered size={40} className="mb-4" />
          <span className="text-xl font-bold">All Orders</span>
          <p className="text-sm opacity-80 mt-1">Check customer orders</p>
        </Link>
      </div>
    </div>
  );
};

export default Home;
