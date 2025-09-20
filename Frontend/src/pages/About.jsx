import React from "react";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import Newsletter from "../components/Newsletter";
import {
  ShieldCheck,
  HandHeart,
  Globe,
  Leaf,
  Users,
  Package,
  Trophy,
} from "lucide-react";

const About = () => {
  return (
    <div className="bg-orange-50">
      {/* About Section */}
      <div className="text-2xl text-center pt-10 border-t">
        <Title text1={"ABOUT"} text2={"US"} />
      </div>

      <div className="my-12 flex flex-col md:flex-row gap-16 items-center px-6 max-w-6xl mx-auto">
        <img
          src={assets.about_img}
          alt="About Artisan Bazaar"
          className="w-full md:max-w-[420px] rounded-2xl shadow-lg hover:scale-105 transition-transform duration-300"
        />
        <div className="flex flex-col justify-center gap-6 md:w-2/3 text-gray-700 text-lg leading-relaxed">
          <p>
            Welcome to{" "}
            <span className="font-semibold text-orange-600">Artisan Bazaar</span>
            , a celebration of India’s rich heritage and craftsmanship. We
            connect{" "}
            <span className="font-semibold">local artisans, potters, weavers, and designers</span>{" "}
            with customers across the nation who value authenticity and tradition.
          </p>
          <p>
            Every product you see here is{" "}
            <span className="font-semibold">handmade with love</span>, carrying
            stories of culture, heritage, and timeless artistry. From pottery
            and textiles to woodwork, jewelry, and paintings — we bring you{" "}
            <span className="font-semibold">unique creations</span> that preserve
            tradition while embracing modern style.
          </p>

          <b className="text-gray-800 text-xl">OUR MISSION</b>
          <p>
            At Artisan Bazaar, our mission is to{" "}
            <span className="font-semibold">empower artisans</span> by providing
            them with a platform to showcase their talent and reach global
            markets. With every purchase,{" "}
            <span className="font-semibold">you support local communities</span>{" "}
            and help keep traditional art forms alive.
          </p>
          <p>
            We believe in{" "}
            <span className="font-semibold">fair trade, sustainability,</span>{" "}
            and creating a{" "}
            <span className="font-semibold">bridge between culture and
            commerce</span>, ensuring artisans receive the recognition and
            respect they deserve.
          </p>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="text-2xl text-center py-8 border-t">
        <Title text1={"WHY"} text2={"CHOOSE US"} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto px-6 mb-20">
        {/* Card 1 */}
        <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-8 flex flex-col items-center text-center">
          <HandHeart className="w-12 h-12 text-orange-600 mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Supporting Artisans
          </h3>
          <p className="text-gray-600">
            Every purchase directly contributes to the livelihood of local
            artisans, helping them preserve traditional skills.
          </p>
        </div>

        {/* Card 2 */}
        <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-8 flex flex-col items-center text-center">
          <Leaf className="w-12 h-12 text-orange-600 mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Sustainable & Eco-Friendly
          </h3>
          <p className="text-gray-600">
            We promote eco-conscious products that respect both tradition and
            the environment, ensuring a greener future.
          </p>
        </div>

        {/* Card 3 */}
        <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-8 flex flex-col items-center text-center">
          <Globe className="w-12 h-12 text-orange-600 mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Nationwide Reach
          </h3>
          <p className="text-gray-600">
            Connecting artisans from rural India with entire nation customers who value
            authenticity, heritage, and creativity.
          </p>
        </div>
      </div>

      {/* Achievements Section */}
      <div className="bg-gradient-to-r from-orange-200 via-orange-100 to-orange-50 py-16 mb-20">
        <div className="text-2xl text-center mb-12">
          <Title text1={"OUR"} text2={"IMPACT"} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 max-w-6xl mx-auto px-6 text-center">
          {/* Artisans Empowered */}
          <div className="flex flex-col items-center">
            <Users className="w-12 h-12 text-orange-600 mb-3" />
            <h3 className="text-3xl font-bold text-gray-800">500+</h3>
            <p className="text-gray-600">Artisans Empowered</p>
          </div>

          {/* Handcrafted Products */}
          <div className="flex flex-col items-center">
            <Package className="w-12 h-12 text-orange-600 mb-3" />
            <h3 className="text-3xl font-bold text-gray-800">200+</h3>
            <p className="text-gray-600">Handcrafted Products</p>
          </div>

          {/* Awards */}
          <div className="flex flex-col items-center">
            <Trophy className="w-12 h-12 text-orange-600 mb-3" />
            <h3 className="text-3xl font-bold text-gray-800">10+</h3>
            <p className="text-gray-600">Craft Awards Won</p>
          </div>

          {/* Global Customers */}
          <div className="flex flex-col items-center">
            <Globe className="w-12 h-12 text-orange-600 mb-3" />
            <h3 className="text-3xl font-bold text-gray-800">25+</h3>
            <p className="text-gray-600">States Reached</p>
          </div>
        </div>
      </div>

      <Newsletter />
    </div>
  );
};

export default About;
