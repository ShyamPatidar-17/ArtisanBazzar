import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, User } from "lucide-react";
import logo from "../assets/logo.png";
import { ShopContext } from "../context/ShopContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { token, logout } = useContext(ShopContext);
  const navigate = useNavigate();

  const menuItems = ["Home", "Shop", "Cart", "About", "Contact", "Sellers"];

  return (
    <nav className="sticky top-0 z-50 w-full bg-[#fff2e6] text-red-950 shadow-lg">
      <div className="flex justify-between items-center px-6 py-4">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-3 transform transition-transform duration-500 hover:scale-110 hover:animate-bounce"
        >
          <img
            src={logo}
            alt="Artisan Bazaar Logo"
            className="w-20 h-20 object-contain rounded-full border-2 border-white shadow-lg hover:shadow-2xl transition-shadow duration-500 animate-pulse"
          />
        </Link>

        {/* Desktop Links */}
        <div className="hidden sm:flex gap-6 items-center">
          {menuItems.map((item) => (
            <Link
              key={item}
              to={`/${item.toLowerCase() === "home" ? "" : item.toLowerCase()}`}
              className="relative group text-lg font-semibold transition-transform transform hover:scale-110 hover:text-red-600"
            >
              {item}
              <span className="absolute left-0 -bottom-1 w-0 h-[3px] bg-red-400 rounded-full transition-all duration-500 ease-out group-hover:w-full group-hover:animate-bounce"></span>
            </Link>
          ))}

          {token && (
            <button
              onClick={() => navigate("/profile")}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-semibold shadow-md transform transition-all hover:scale-110 hover:rotate-3 hover:shadow-xl motion-safe:animate-pulse"
            >
              <User size={18} /> Profile
            </button>
          )}

          {!token ? (
            <>
              <Link
                to="/login"
                className="px-4 py-2 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-black font-semibold shadow-md transform transition-all hover:scale-110 hover:rotate-3 hover:shadow-xl motion-safe:animate-bounce"
              >
                Login
              </Link>
              <Link
                to="http://localhost:5173/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white font-semibold shadow-md transform transition-all hover:scale-110 hover:rotate-3 hover:shadow-xl motion-safe:animate-bounce"
              >
                Seller
              </Link>
            </>
          ) : (
            <button
              onClick={() => logout()}
              className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold shadow-md transform transition-all hover:scale-110 hover:rotate-3 hover:shadow-xl motion-safe:animate-pulse"
            >
              Logout
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="sm:hidden text-red-950 transform transition-transform hover:scale-125 hover:rotate-12"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      <div
        className={`sm:hidden bg-[#fff2e6] flex flex-col items-center py-4 gap-4 shadow-lg transition-all duration-700 overflow-hidden ${
          isOpen ? "max-h-[600px] animate-slide-down" : "max-h-0"
        }`}
      >
        {menuItems.map((item, index) => (
          <Link
            key={item}
            to={`/${item.toLowerCase() === "home" ? "" : item.toLowerCase()}`}
            onClick={() => setIsOpen(false)}
            className={`text-lg text-red-950 font-semibold hover:text-red-600 transition-all duration-300 hover:scale-110 hover:rotate-3 animate-bounce delay-${index * 75}`}
          >
            {item}
          </Link>
        ))}

        {token && (
          <button
            onClick={() => {
              navigate("/profile");
              setIsOpen(false);
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-semibold shadow-md transform transition-all hover:scale-110 hover:rotate-3 motion-safe:animate-pulse hover:shadow-xl"
          >
            <User size={18} /> Profile
          </button>
        )}

        {!token ? (
          <>
            <Link
              to="/login"
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-black font-semibold shadow-md transform transition-all hover:scale-110 hover:rotate-3 motion-safe:animate-bounce hover:shadow-xl"
            >
              Login
            </Link>
            <Link
              to="http://localhost:5173/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white font-semibold shadow-md transform transition-all hover:scale-110 hover:rotate-3 motion-safe:animate-bounce hover:shadow-xl"
            >
              Seller
            </Link>
          </>
        ) : (
          <button
            onClick={() => {
              logout();
              setIsOpen(false);
            }}
            className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold shadow-md transform transition-all hover:scale-110 hover:rotate-3 motion-safe:animate-pulse hover:shadow-xl"
          >
            Logout
          </button>
        )}
      </div>

      {/* Tailwind custom animation for mobile slide-down */}
      <style>{`
        @keyframes slide-down {
          0% { transform: translateY(-30px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-down {
          animation: slide-down 0.5s ease-out forwards;
        }
      `}</style>
    </nav>
  );
}
