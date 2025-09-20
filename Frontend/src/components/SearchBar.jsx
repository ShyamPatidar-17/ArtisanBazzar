import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import { useLocation } from 'react-router-dom';

const SearchBar = () => {
  const { search, setSearch, showSearch, setShowSearch } = useContext(ShopContext);
  const [visible, setVisible] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.includes('collection')) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [location]);

  return showSearch && visible ? (
    <div className="relative border-t border-b bg-amber-50 text-center py-5 shadow-md">
      <div className="inline-flex items-center justify-center border-2 border-amber-300 px-5 py-2 mx-auto rounded-full w-3/4 bg-amber-100 hover:bg-amber-200 transition-colors shadow-sm focus-within:shadow-md">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search artisan products..."
          className="flex-1 outline-none bg-transparent text-sm text-red-900 placeholder-red-400"
        />
        <img src={assets.search_icon} alt="Search" className="w-5 h-5 ml-2" />
      </div>
      <img
        src={assets.cross_icon}
        alt="Close"
        className="absolute top-5 right-5 w-5 h-5 cursor-pointer hover:scale-110 transition-transform"
        onClick={() => setShowSearch(false)}
      />
    </div>
  ) : null;
};

export default SearchBar;
