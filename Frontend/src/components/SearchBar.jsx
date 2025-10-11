import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import { useLocation } from "react-router-dom";

const SearchBar = ({ alwaysVisible = false }) => {
  const { search, setSearch, showSearch, setShowSearch } = useContext(ShopContext);
  const [visible, setVisible] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.includes("collection")) setVisible(true);
    else setVisible(false);
  }, [location]);

  if (!(alwaysVisible || (showSearch && visible))) return null;

  return (
    <div className="w-full flex justify-center my-8 px-4">
      <div className="relative w-full sm:w-3/4 md:w-2/3 lg:w-1/2">
        <div className="flex items-center bg-white/90 backdrop-blur-lg border border-amber-300 shadow-xl rounded-full px-6 py-3 transition-transform duration-300 hover:scale-[1.02]">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search artisan products..."
            className="flex-1 bg-transparent outline-none text-gray-800 placeholder-gray-400 text-lg font-medium focus:ring-2 focus:ring-amber-400 rounded-full transition-all duration-200"
          />

          <button className="ml-3">
            <img
              src={assets.search_icon}
              alt="Search"
              className="w-6 h-6 text-amber-600 hover:scale-110 transition-transform duration-200"
            />
          </button>

          {!alwaysVisible && (
            <img
              src={assets.cross_icon}
              alt="Close"
              className="absolute top-1/2 right-6 -translate-y-1/2 w-5 h-5 cursor-pointer hover:rotate-45 hover:scale-125 transition-all duration-300"
              onClick={() => setShowSearch(false)}
            />
          )}
        </div>

        {/* Optional gradient underline */}
        <div className="h-1 w-full mt-2 rounded-full bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 animate-pulse"></div>
      </div>
    </div>
  );
};

export default SearchBar;
