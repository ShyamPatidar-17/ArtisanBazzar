import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, LogOut } from "lucide-react";
import { assets } from "../assets/assets"; // your logo

export default function Navbar({ setToken }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { name: "Dashboard", path: "/" },
    { name: "Add Product", path: "/add" },
    { name: "Product List", path: "/list" },
    { name: "Orders", path: "/orders" },
    { name: "Chats", path: "/chats" },
    { name: "Profile", path: "/profile" },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Import font
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
            src={assets.logo}
            alt="Logo"
            className="w-14 h-14 object-contain rounded-full transition-transform duration-300 group-hover:rotate-6"
          />
          <h1 className="text-2xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
            Artisan Bazaar Admin
          </h1>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`relative text-base font-medium transition-all duration-300 ${
                  isActive
                    ? "text-blue-600 after:w-full"
                    : "text-gray-700 hover:text-blue-600 after:w-0"
                } after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:bg-blue-600 after:transition-all after:duration-300 hover:after:w-full`}
              >
                {item.name}
              </Link>
            );
          })}

          {/* Logout Button */}
          <button
            onClick={() => {
              setToken("");
              localStorage.removeItem("sellerToken");
              navigate("/");
            }}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg shadow-md hover:scale-105 transition-transform duration-200"
          >
            <LogOut size={18} /> Logout
          </button>
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
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={`text-base font-medium ${
                location.pathname === item.path
                  ? "text-blue-600 font-semibold"
                  : "text-gray-800 hover:text-blue-600"
              }`}
            >
              {item.name}
            </Link>
          ))}

          <button
            onClick={() => {
              setToken("");
              localStorage.removeItem("sellerToken");
              setIsOpen(false);
              navigate("/");
            }}
            className="w-32 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-md shadow-md hover:scale-105 transition"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      )}
    </nav>
  );
}
