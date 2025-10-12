import React, { useState, useContext, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, User, LogIn, LogOut, Store } from "lucide-react"; // icons
import { ShopContext } from "../context/ShopContext";
import logo from "../assets/logo.png";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { token, logout } = useContext(ShopContext);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = ["Home", "Shop", "Cart", "About", "Contact", "Sellers"];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  return (
    <nav
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-white/90 backdrop-blur-lg shadow-md border-b border-gray-200"
          : "bg-white shadow-sm"
      }`}
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      <div className="flex justify-between items-center px-6 py-3">
        {/* Logo + Title */}
        <Link to="/" className="flex items-center gap-3 group">
          <img
            src={logo}
            alt="Logo"
            className="w-14 h-14 object-contain rounded-full transition-transform duration-300 group-hover:rotate-6"
          />
          <h1 className="text-2xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
            Artisan Bazaar
          </h1>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          {menuItems.map((item) => {
            const path =
              item.toLowerCase() === "home" ? "/" : `/${item.toLowerCase()}`;
            const isActive = location.pathname === path;

            return (
              <Link
                key={item}
                to={path}
                className={`relative text-base font-medium transition-all duration-300 ${
                  isActive
                    ? "text-blue-600 after:w-full"
                    : "text-gray-700 hover:text-blue-600 after:w-0"
                } after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:bg-blue-600 after:transition-all after:duration-300 hover:after:w-full`}
              >
                {item}
              </Link>
            );
          })}

          {token ? (
            <>
              <button
                onClick={() => navigate("/profile")}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg shadow-md hover:scale-105 transition-transform duration-200"
              >
                <User size={18} /> Profile
              </button>
              <button
                onClick={logout}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg shadow-md hover:scale-105 transition-transform duration-200"
              >
                <LogOut size={18} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-800 rounded-lg shadow-md hover:scale-105 transition-transform duration-200"
              >
                <LogIn size={18} /> Login
              </Link>
              <Link
                to="https://artisanadmin.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg shadow-md hover:scale-105 transition-transform duration-200"
              >
                <Store size={18} /> Seller
              </Link>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-gray-700"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden flex flex-col items-center bg-white/95 backdrop-blur-md border-t py-4 space-y-3 shadow-inner animate-slideDown">
          {menuItems.map((item) => {
            const path =
              item.toLowerCase() === "home" ? "/" : `/${item.toLowerCase()}`;
            const isActive = location.pathname === path;

            return (
              <Link
                key={item}
                to={path}
                onClick={() => setIsOpen(false)}
                className={`text-base font-medium transition-colors ${
                  isActive
                    ? "text-blue-600 font-semibold"
                    : "text-gray-800 hover:text-blue-600"
                }`}
              >
                {item}
              </Link>
            );
          })}

          {token ? (
            <>
              <button
                onClick={() => {
                  navigate("/profile");
                  setIsOpen(false);
                }}
                className="w-40 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-md shadow-md hover:scale-105 transition"
              >
                <User size={18} /> Profile
              </button>
              <button
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
                className="w-40 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-md shadow-md hover:scale-105 transition"
              >
                <LogOut size={18} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="w-40 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-800 rounded-md shadow-md hover:scale-105 transition"
              >
                <LogIn size={18} /> Login
              </Link>
              <Link
                to="https://artisanadmin.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-40 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-md shadow-md hover:scale-105 transition"
              >
                <Store size={18} /> Seller
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
