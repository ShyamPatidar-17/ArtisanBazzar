import React, { useEffect, useState } from "react";
import { Routes, Route, useLocation, Navigate, useParams } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import "react-toastify/dist/ReactToastify.css";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Add from "./pages/Add";
import List from "./pages/List";
import Orders from "./pages/Orders";
import EditProduct from "./pages/Edit";
import ViewProduct from "./pages/View";
import Profile from "./pages/Profile";
import ChangePassword from "./pages/ChangePassword";
import EditProfile from "./pages/EditProfile";
import SellerAuth from "./components/SellerAuth";
import Chat from "./pages/Chat";
import ChatList from "./pages/ChatList";

export const backendUrl = import.meta.env.VITE_BACKEND_URL;
export const currency = "$";

function ChatWrapper() {
  const { otherId } = useParams();
  const sellerToken = localStorage.getItem("sellerToken");
  let sellerId = null;

  if (sellerToken) {
    try {
      const decoded = jwtDecode(sellerToken);
      sellerId = decoded.id;
    } catch (err) {
      console.error("Invalid token:", err);
    }
  }

  if (!sellerToken || !sellerId) {
    return (
      <div className="flex justify-center items-center h-[60vh] text-gray-500">
        Please login to use chat.
      </div>
    );
  }

  return <Chat sellerToken={sellerToken} sellerId={sellerId} otherId={otherId} />;
}

const App = () => {
  const [sellerToken, setSellerToken] = useState(localStorage.getItem("sellerToken") || "");
  const location = useLocation();

  useEffect(() => {
    localStorage.setItem("sellerToken", sellerToken);
  }, [sellerToken]);

  const hideNavbarRoutes = [ "/login"];

  return (
    <div className="bg-gray-50 min-h-screen">
      <ToastContainer />
      {sellerToken === "" ? (
        <SellerAuth setSellerToken={setSellerToken} />
      ) : (
        <>
          {!hideNavbarRoutes.includes(location.pathname) && (
            <Navbar setToken={setSellerToken} />
          )}

          <div className="flex w-full justify-center">
            <div className="w-full max-w-[1200px] mx-auto my-8 px-4 text-gray-700 text-base">
              <Routes>
                <Route path="/" element={<Home token={sellerToken} />} />
                <Route path="/add" element={<Add token={sellerToken} />} />
                <Route path="/list" element={<List token={sellerToken} />} />
                <Route path="/orders" element={<Orders token={sellerToken} />} />
                <Route path="/view/:id" element={<ViewProduct />} />
                <Route path="/edit/:id" element={<EditProduct token={sellerToken} />} />
                <Route path="/profile" element={<Profile token={sellerToken} />} />
                <Route path="/profile/edit-profile" element={<EditProfile token={sellerToken} />} />
                <Route path="/profile/change-password" element={<ChangePassword token={sellerToken} />} />
                <Route path="/chats" element={<ChatList sellerToken={sellerToken} />} />
                <Route path="/chat/:otherId" element={<ChatWrapper />} />
                <Route path="/seller" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default App;
