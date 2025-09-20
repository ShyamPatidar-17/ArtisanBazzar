import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png"; // ✅ adjust path if needed

export default function Footer() {
  return (
    <footer className="w-full bg-[#fff2e6] mt-12 text-gray-700">
      {/* Main Footer Content */}
      <div className="w-full px-10 py-10 grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {/* Column 1 - Logo & Intro */}
        <div className="flex flex-col items-start">
          <div className="flex items-center gap-3 mb-4">
            <img
              src={logo}
              alt="Artisan Bazaar Logo"
              className="w-14 h-14 object-contain rounded-full border-2 border-white shadow-md hover:scale-110 transition-transform duration-300"
            />
            <h3 className="text-2xl font-bold">Artisan Bazaar</h3>
          </div>
          <p className="text-sm text-gray-900 leading-relaxed max-w-md">
            Connecting Indian potters, artisans, and designers with customers
            across the nation. Every purchase supports local craftsmanship. 🪔
          </p>
        </div>

        {/* Column 2 - Quick Links */}
        <div>
          <h3 className="text-lg font-bold mb-3">Quick Links</h3>
          <ul className="space-y-2">
            {["Home", "Shop", "About", "Contact", "Sell with Us"].map(
              (item, idx) => (
                <li key={idx}>
                  <Link
                    to={`/${
                      item === "Home"
                        ? ""
                        : item.toLowerCase().replace(/\s+/g, "")
                    }`}
                    className="relative group"
                  >
                    {item}
                    <span className="absolute left-0 -bottom-0.5 w-0 h-[2px] bg-yellow-400 transition-all group-hover:w-full"></span>
                  </Link>
                </li>
              )
            )}
          </ul>
        </div>

        {/* Column 3 - Contact */}
        <div>
          <h3 className="text-lg font-bold mb-3">Contact</h3>
          <p>
            Email:{" "}
            <a
              href="mailto:support@artisanbazaar.in"
              className="hover:underline"
            >
              support@artisanbazaar.in
            </a>
          </p>
          <p>
            Phone:{" "}
            <a href="tel:+919876543210" className="hover:underline">
              +91 98765 43210
            </a>
          </p>
          <div className="flex gap-6 mt-4">
            {["Facebook", "Instagram", "Twitter"].map((social) => (
              <a
                key={social}
                href="#"
                className="hover:text-yellow-500 transition-transform transform hover:scale-110"
              >
                {social}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="w-full bg-slate-300 text-center py-3 text-sm flex flex-col md:flex-row items-center justify-center gap-2">
        <span>
          © {new Date().getFullYear()} Artisan Bazaar · All Rights Reserved
        </span>
        <span className="flex items-center gap-1">
          · Made with{" "}
          <span className="text-red-500 animate-pulse">♥</span> by{" "}
          <span className="font-semibold">MERNverse Group</span> ·
        </span>
      </div>
    </footer>
  );
}
