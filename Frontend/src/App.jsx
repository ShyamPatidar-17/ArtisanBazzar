import React from "react";
import { Routes, Route, useLocation, useParams } from "react-router-dom";
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
import Recommendations from './components/Recommendations';

export const backendUrl = import.meta.env.VITE_BACKEND_URL;
export const currency = "₹";

function ChatWrapper() {
  const { otherId } = useParams();
  const userId = localStorage.getItem("userId");
  return <Chat userId={userId} otherId={otherId} />;
}
 export const userId = localStorage.getItem("userId");

function App() {
  const location = useLocation();
 const userId = localStorage.getItem("userId");
  // Hide navbar on login/signup pages
  const hideNavbarRoutes = ["/login", "/seller/login"];
  const hideNavbar = hideNavbarRoutes.includes(location.pathname);

  return (
    <div className="min-h-screen flex flex-col">
      {/* ✅ Hide Navbar on login/signup routes */}
      {!hideNavbar && <Navbar />}
      <div className="flex-grow">
        <Routes>
          {/* Authentication */}
          <Route path="/login" element={<UserAuth />} />
          <Route path="/seller/login" element={<SellerAuth />} />

          {/* Main Pages */}
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Collection />} />
          <Route path="/shop/:categorySlug" element={<Collection />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/product/:productId" element={<Product />} />
          <Route path="/product/:slug" element={<CategoryPage />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/place-order" element={<PlaceOrder />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/verify" element={<Verify />} />

          {/* Profile */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/edit" element={<EditProfile />} />
          <Route path="/profile/change-password" element={<ChangePassword />} />

          {/* Chat */}
          <Route path="/chat/:otherId" element={<ChatWrapper />} />

          {/*recommendation */}

          {/* <Route path="/recommendations" element={<Recommendations userId={userId} />} /> */}


          {/* Sellers */}
          <Route path="/sellers" element={<Sellers />} />
        </Routes>
      </div>

      {/* ✅ Hide Footer also on login/signup for clean layout */}
      {!hideNavbar && <Footer />}

      <ToastContainer />
    </div>
  );
}

export default App;
