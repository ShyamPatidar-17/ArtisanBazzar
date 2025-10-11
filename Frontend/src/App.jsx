import React from "react";
import { Routes, Route, useParams } from "react-router-dom";
import "./index.css";
import { ToastContainer } from "react-toastify";

import Home from "./pages/Home";
import Collection from "./pages/Collection";
import Cart from "./pages/Cart";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Product from "./pages/Product";
import Orders from "./pages/Orders";
import PlaceOrder from "./pages/PlaceOrder";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Profile from "./pages/Profile";
import Verify from "./pages/Verify";
import CategoryPage from "./pages/Category";
import EditProfile from "./pages/EditProfile";
import ChangePassword from "./pages/ChangePassword";
import UserAuth from "./pages/UserAuth";
import SellerAuth from "./pages/SellerAuth";
import Sellers from "./pages/Seller";
import Chat from "./pages/Chat";

export const backendUrl = import.meta.env.VITE_BACKEND_URL;
export const currency = "₹";


function ChatWrapper() {
  const { otherId } = useParams();
  const userId = localStorage.getItem("userId");
  return <Chat userId={userId} otherId={otherId} />;
}

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Collection />} />
          <Route path="/shop/:categorySlug" element={<Collection />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/product/:productId" element={<Product />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/chat/:otherId" element={<ChatWrapper />} />
          <Route path="/login" element={<UserAuth />} />
          <Route path="/seller/login" element={<SellerAuth />} />
          <Route path="/place-order" element={<PlaceOrder />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/edit" element={<EditProfile />} />
          <Route path="/profile/change-password" element={<ChangePassword />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/sellers" element={<Sellers />} />
          <Route path="/product/:slug" element={<CategoryPage />} />
        </Routes>
      </div>

      <Footer />
      <ToastContainer />
    </div>
  );
}

export default App;
