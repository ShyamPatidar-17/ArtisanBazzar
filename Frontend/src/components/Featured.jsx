import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import { Link } from "react-router-dom";

const {
  pottery,
  textiles,
  jewelry,
  woodwork,
  painting,
  handicraft,
} = assets;

const Featured = () => {
  const { products } = useContext(ShopContext);
  const [latestProducts, setLatestProducts] = useState([]);

  useEffect(() => {
    setLatestProducts(products.slice(0, 10));
  }, [products]);

  const categories = [
    { title: "Pottery", img: pottery, slug: "pottery" },
    { title: "Handwoven Textiles", img: textiles, slug: "textiles" },
    { title: "Jewelry", img: jewelry, slug: "jewelry" },
    { title: "Woodwork", img: woodwork, slug: "woodwork" },
    { title: "Paintings", img: painting, slug: "painting" },
    { title: "Handicrafts", img: handicraft, slug: "handicraft" },
  ];

  return (
    <div className="w-full bg-white py-16">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-orange-800 mb-8">Featured Categories</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((item, idx) => (
            <Link
              key={idx}
              to={`/shop/${item.slug}`}   // Pass the category slug in the URL
              className="rounded-xl overflow-hidden shadow-lg bg-gray-50 hover:shadow-xl transition-transform transform hover:scale-105"
            >
              <img src={item.img} alt={item.title} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="font-semibold text-lg text-orange-800">{item.title}</h3>
              </div>
            </Link>

          ))}
        </div>
      </div>
    </div>
  );
};

export default Featured;
