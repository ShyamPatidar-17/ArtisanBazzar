import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { assets } from "../assets/assets";
import Hero from "../components/Hero";
import Featured from "../components/Featured";
import Choose from "../components/Choose";
import Policy from "../components/Policy";
import Newsletter from "../components/Newsletter";
import Recommendations from "../components/Recommendations";

const { hero, pottery, textiles, jewelry, woodwork, painting, handicraft, newsletter: newsletterImg } = assets;
const userId = localStorage.getItem("userId");

const Home = () => {
  return (
    <div className="min-h-screen bg-orange-50 flex flex-col items-center text-center">
      <ToastContainer position="top-center" autoClose={5000} />

   
      <div className="mt-5 mb-5 px-4">
      <h2
  className="text-3xl md:text-4xl font-semibold bg-gradient-to-r from-orange-600 via-amber-500 to-yellow-400 
  bg-clip-text text-transparent drop-shadow-md tracking-wide animate-gradient"
>
  “From the Hands of Artisans to the Heart of Your Home.”
</h2>

      </div>

      {/* Main Sections */}
      <Hero />
      <Recommendations userId={userId} />
      <Choose />
      <Policy />
      <Newsletter />
    </div>
  );
};

export default Home;
