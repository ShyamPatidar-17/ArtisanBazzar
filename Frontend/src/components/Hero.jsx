import React from "react";
import { Link } from "react-router-dom";
import { assets } from "../assets/assets";

const{hero}=assets;

const Hero = ({ title, subtitle, ctaText, bgImage }) => {
  return (
   <div className="relative w-full h-[70vh] flex items-center justify-center">
           <img
             src={hero}
             alt="Hero"
             className="absolute inset-0 w-full h-full object-cover opacity-90"
           />
           <div className="relative z-10 text-white px-6 max-w-3xl">
             <h1 className="text-5xl font-bold mb-6">Welcome to Artisan Bazaar</h1>
             <p className="text-lg mb-8 leading-relaxed">
               Discover authentic handmade products crafted by skilled Indian artisans.
               Every purchase supports local craftsmanship and traditions.
             </p>
             <div className="flex gap-4 justify-center">
               <Link
                 to="/shop"
                 className="px-6 py-3 rounded-lg bg-orange-600 hover:bg-orange-700 text-white font-semibold shadow-md transition-transform transform hover:scale-105"
               >
                 Explore Shop
               </Link>
               <Link
                 to="/about"
                 className="px-6 py-3 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-black font-semibold shadow-md transition-transform transform hover:scale-105"
               >
                 Learn More
               </Link>
             </div>
           </div>
         </div>
  );
};

export default Hero;
