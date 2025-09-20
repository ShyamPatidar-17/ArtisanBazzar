import React from 'react'
import { assets } from '../assets/assets'

const Navbar = ({ setToken }) => {
  return (
    <div className="flex items-center justify-between px-6 py-3 bg-white shadow-sm border-b">
      
      {/* Left: Logo + Name */}
      <div className="flex items-center space-x-3">
        <img 
          src={assets.logo} 
          alt="Logo" 
          className="w-[60px] h-[60px] object-contain"
        />
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">
          Artisan Bazaar Admin
        </h1>
      </div>

      {/* Right: Logout */}
      <button
        onClick={() => setToken('')}
        className="bg-gray-800 text-white font-medium px-5 py-2 rounded-md text-sm hover:bg-red-600 transition"
      >
        Logout
      </button>
    </div>
  )
}

export default Navbar
