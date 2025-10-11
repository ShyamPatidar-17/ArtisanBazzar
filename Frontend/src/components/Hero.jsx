import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { assets } from "../assets/assets";

const { hero } = assets;

const facts = [
  "Pottery is one of the oldest human inventions, dating back to 29,000 BC.",
  "Indian handicrafts represent centuries of tradition and artistry.",
  "Terracotta pottery is widely used in rural India for cooking and storage.",
  "Handmade crafts promote sustainability by using eco-friendly materials.",
  "Each artisan’s work is unique, carrying their personal creativity and skill.",
  "Blue Pottery from Jaipur is world-famous for its unique style and elegance.",
  "Warli painting is a traditional tribal art form from Maharashtra.",
  "Dokra metal craft is an ancient technique using the lost-wax casting method.",
  "Madhubani paintings originated in Bihar and are rich in symbolism.",
  "Handicrafts are often made from natural, recycled, or upcycled materials."
];

const Hero = () => {
  const [index, setIndex] = useState(0);

  // Auto-change facts every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % facts.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-[85vh] flex items-center justify-center bg-gradient-to-r from-orange-50 to-yellow-50 px-6">
      <div className="max-w-6xl w-full flex flex-col md:flex-row items-center justify-between gap-10">
        
    
        <div className="flex-1 text-left">
          <h1 className="text-5xl font-bold mb-6 text-orange-800 drop-shadow-sm">
            Welcome to Artisan Bazaar
          </h1>
          
   
          <div className="bg-gradient-to-r from-yellow-100 to-orange-100 px-6 py-4 rounded-xl shadow-md max-w-md relative mb-6">
            <AnimatePresence mode="wait">
              <motion.p
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.9 }}
                className="text-md md:text-lg font-semibold text-orange-900"
              >
                {facts[index]}
              </motion.p>
            </AnimatePresence>

      
            <div className="flex justify-center mt-3 gap-2">
              {facts.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  className={`h-2 w-2 rounded-full transition-all duration-300 ${
                    i === index ? "bg-orange-600 w-4" : "bg-gray-400"
                  }`}
                />
              ))}
            </div>
          </div>

      
          <div className="flex gap-4 mb-8">
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

        <div className="flex-1 flex justify-center">
          <motion.img
            src={hero}
            alt="Handicraft"
            className="rounded-2xl shadow-lg object-cover max-h-[500px] w-full md:w-[90%]"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1 }}
          />
        </div>
      </div>
    </div>
  );
};

export default Hero;
