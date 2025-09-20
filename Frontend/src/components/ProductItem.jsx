import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Link } from 'react-router-dom';

const ProductItem = ({ id, image, name, price }) => {
  const { currency } = useContext(ShopContext);

  return (
    <Link
      to={`/product/${id}`}
      className="group relative block text-gray-800 cursor-pointer rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 bg-amber-50"
    >
      {/* Product Image */}
      <div className="overflow-hidden">
        <img
          src={image[0]}
          alt={name}
          className="w-full h-48 object-cover transform transition-transform duration-500 group-hover:scale-110"
        />
        {/* Artisan glow effect on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-yellow-50 via-amber-100 to-transparent opacity-0 group-hover:opacity-50 transition-opacity duration-500 rounded-lg"></div>
      </div>

      {/* Product Info */}
      <div className="p-3">
        <p className="text-sm font-semibold text-red-800 group-hover:text-red-600 transition-colors">{name}</p>
        <p className="text-sm font-bold text-amber-900">{currency} {price}</p>
      </div>

      {/* Add small “Artisan Bazaar” tag */}
      <span className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-md shadow-md">
        Artisan
      </span>
    </Link>
  );
};

export default ProductItem;
