import React from "react";
import { ShieldCheck, Truck, Leaf, Heart } from "lucide-react";

const Policy = () => {
  const policies = [
    {
      icon: <ShieldCheck className="w-12 h-12 text-orange-600 mb-4" />,
      title: "Secure Payments",
      description: "All transactions are encrypted and secure for a safe shopping experience."
    },
    {
      icon: <Truck className="w-12 h-12 text-orange-600 mb-4" />,
      title: "Fast & Reliable Shipping",
      description: "We deliver handcrafted products across India quickly and reliably."
    },
    {
      icon: <Leaf className="w-12 h-12 text-orange-600 mb-4" />,
      title: "Eco-Friendly Products",
      description: "All our products are made using sustainable and natural materials."
    },
    {
      icon: <Heart className="w-12 h-12 text-orange-600 mb-4" />,
      title: "Support Artisans",
      description: "Every purchase directly supports Indian artisans and their communities."
    },
  ];

  return (
    <div className="min-h-screen bg-orange-50 py-16">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h1 className="text-4xl font-bold text-orange-800 mb-10">Our Policies</h1>
        <p className="text-gray-700 mb-16 leading-relaxed">
          At Artisan Bazaar, we are committed to providing you with authentic, high-quality handmade products while supporting local artisans and sustainable practices.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {policies.map((policy, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-transform transform hover:scale-105"
            >
              {policy.icon}
              <h3 className="text-xl font-semibold text-orange-800 mb-2">{policy.title}</h3>
              <p className="text-gray-600">{policy.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Policy;
