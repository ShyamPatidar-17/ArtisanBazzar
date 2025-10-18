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


// Destructuring assets if needed in child components
const { hero, pottery, textiles, jewelry, woodwork, painting, handicraft, newsletter: newsletterImg } = assets;
 const userId = localStorage.getItem("userId");
const Home = () => {
  return (
    <div className="min-h-screen bg-orange-50 flex flex-col items-center text-center">
      {/* Toast notifications */}
      <ToastContainer position="top-center" autoClose={5000} />

      {/* Page Sections */}
      <Hero />
     

      {/* <Recommendations userId={userId} /> */}
      <Choose />
      <Policy />
      <Newsletter />
    </div>
  );
};

export default Home;
