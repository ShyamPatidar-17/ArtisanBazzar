import React from 'react'
import { assets } from '../assets/assets'
import { Globe, HandHeart, Leaf, ShieldCheck } from "lucide-react";

const Choose = () => {
  return (
       <div className="w-full bg-orange-50 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-orange-900 mb-10">Why Choose Us?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <HandHeart className="w-12 h-12 text-orange-600 mb-4" />,
                title: "Support Artisans",
                desc: "Every purchase directly supports Indian artisans and their families.",
              },
              {
                icon: <Globe className="w-12 h-12 text-orange-600 mb-4" />,
                title: "Nationwide Shipping",
                desc: "Delivering authentic handcrafted products across the country.",
              },
              {
                icon: <Leaf className="w-12 h-12 text-orange-600 mb-4" />,
                title: "Eco-Friendly",
                desc: "Sustainable and natural materials used in artisan creations.",
              },
              {
                icon: <ShieldCheck className="w-12 h-12 text-orange-600 mb-4" />,
                title: "Trusted Quality",
                desc: "Each product is carefully checked to ensure authenticity and quality.",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl p-6 shadow hover:shadow-xl transition-transform transform hover:scale-105"
              >
                {item.icon}
                <h3 className="font-semibold text-xl mb-2 text-orange-800">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
  )
}

export default Choose;
