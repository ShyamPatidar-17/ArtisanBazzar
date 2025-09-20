import React, { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Add from "./pages/Add";
import List from "./pages/List";
import Orders from "./pages/Orders";
import EditProduct from "./pages/Edit";
import ViewProduct from "./pages/View";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SellerAuth from "./components/SellerAuth"; // seller login/signup

export const backendUrl = import.meta.env.VITE_BACKEND_URL;
export const currency = "$";

const App = () => {
  const [sellerToken, setSellerToken] = useState(
    localStorage.getItem("sellerToken") || ""
  );

  const location = useLocation();

  useEffect(() => {
    localStorage.setItem("sellerToken", sellerToken);
  }, [sellerToken]);

  const showSidebar =
    location.pathname !== "/" && location.pathname !== "/seller";

  return (
    <div className="bg-gray-50 min-h-screen">
      <ToastContainer />

      {/* If seller not logged in → show login/signup */}
      {sellerToken === "" ? (
        <SellerAuth setSellerToken={setSellerToken} />
      ) : (
        <>
          <Navbar setToken={setSellerToken} />
          <hr />
          <div className="flex w-full">
            {showSidebar && <Sidebar/>}
            <div
              className={`${
                showSidebar ? "w-[70%] ml-[max(5vw,25px)]" : "w-full"
              } mx-auto my-8 text-gray-600 text-base`}
            >
              <Routes>
                <Route path="/" element={<Home token={sellerToken} />} />
                <Route path="/login" element={<SellerAuth />} /> 
                <Route path="/view/:id" element={<ViewProduct />} />
                <Route path="/add" element={<Add token={sellerToken} />} />
                <Route path="/list" element={<List token={sellerToken} />} />
                <Route path="/orders" element={<Orders token={sellerToken} />} />
                <Route
                  path="/edit/:id"
                  element={<EditProduct token={sellerToken} />}
                />

                {/* Prevent access to login page if already logged in */}
                <Route path="/seller" element={<Navigate to="/add" replace />} />
              </Routes>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default App;
