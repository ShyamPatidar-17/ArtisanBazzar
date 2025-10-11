import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Link } from 'react-router-dom';

const ProductItem = ({ id, image, name, price }) => {
  const { currency } = useContext(ShopContext);

  return (
    <Link
      to={`/product/${id}`}

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
      </div>
    </Link>
  );
};

export default ProductItem;
