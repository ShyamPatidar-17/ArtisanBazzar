import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import logo from "../assets/logo.png";
import { ShopContext } from "../context/ShopContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { token, logout } = useContext(ShopContext);
  const navigate = useNavigate();

  return (
    <nav className="sticky top-0 z-50 w-full bg-[#fff2e6] text-red-950 shadow-md">
      <div className="flex justify-between items-center px-6 py-4">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-3 hover:scale-105 transition-transform"
        >
          <img
            src={logo}
            alt="Artisan Bazaar Logo"
            className="w-20 h-20 object-contain rounded-full border-2 border-white shadow-md"
          />
        </Link>


        {/* Desktop Links */}
        <div className="hidden sm:flex gap-6 items-center">
          {["Home", "Shop", "Cart", "About", "Contact"].map((item) => (
            <Link
              key={item}
              to={`/${item.toLowerCase() === "home" ? "" : item.toLowerCase()}`}
              className="relative group text-lg"
            >
              {item}
              <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-red-400 transition-all group-hover:w-full"></span>
            </Link>
          ))}

          {/* Login / Logout */}
          {!token ? (
            <Link
              to="/login"
              className="px-4 py-2 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-black font-semibold shadow-md transition-transform transform hover:scale-105"
            >
              Login
            </Link>
          ) : (
            <button
              onClick={() => logout()}
              className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold shadow-md transition-transform transform hover:scale-105"
            >
              Logout
            </button>
          )}

          {/* Seller Portal */}
          <Link
            to="http://localhost:5173/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white font-semibold shadow-md transition-transform transform hover:scale-105"
          >
            Seller
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="sm:hidden text-red-950"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="sm:hidden bg-amber-700 flex flex-col items-center py-4 gap-4 shadow-lg">
          {["Home", "Shop", "Cart", "About", "Contact"].map((item) => (
            <Link
              key={item}
              to={`/${item.toLowerCase() === "home" ? "" : item.toLowerCase()}`}
              onClick={() => setIsOpen(false)}
              className="text-lg text-white hover:text-yellow-300"
            >
              {item}
            </Link>
          ))}

          {!token ? (
            <Link
              to="/login"
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-black font-semibold shadow-md transition-transform transform hover:scale-105"
            >
              Login
            </Link>
          ) : (
            <button
              onClick={() => {
                logout();
                setIsOpen(false);
              }}
              className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold shadow-md transition-transform transform hover:scale-105"
            >
              Logout
            </button>
          )}

          <Link
            to="http://localhost:5173/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white font-semibold shadow-md transition-transform transform hover:scale-105"
          >
            Seller
          </Link>
        </div>
      )}
    </nav>
  );
}
