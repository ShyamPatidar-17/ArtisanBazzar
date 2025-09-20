import React from "react";
import { Routes, Route } from "react-router-dom";
import "./index.css";
import { assets } from "./assets/assets";

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

// ✅ Auth Pages
import UserAuth from "./pages/UserAuth";
import SellerAuth from "./pages/SellerAuth";

export const backendUrl = "http://localhost:4000";
export const currency = "₹";

function App() {
  return (
    <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Collection />} />
        <Route path="/shop/:categorySlug?" element={<Collection />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/product/:productId" element={<Product />} />
        <Route path="/cart" element={<Cart />} />
        
        {/* ✅ Auth Routes */}
        <Route path="/login" element={<UserAuth />} />
        <Route path="/seller/login" element={<SellerAuth />} />
        <Route path="/place-order" element={<PlaceOrder />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/product/:slug" element={<CategoryPage />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
