import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import { assets } from '../assets/assets';
import CartTotal from '../components/CartTotal';

const Cart = () => {
  const { currency, products, cartItems, updateQuantity, navigate, getCartAmount } = useContext(ShopContext);
  const [cartData, setCartData] = useState([]);

  useEffect(() => {
    if (products.length > 0) {
      const tempData = [];
      for (const prodId in cartItems) {
        for (const variant in cartItems[prodId]) {
          if (cartItems[prodId][variant] > 0) {
            const [size, color] = variant.split("-"); // ✅ extract both
            tempData.push({
              _id: prodId,
              size,
              color,
              quantity: cartItems[prodId][variant],
            });
          }
        }
      }
      setCartData(tempData);
    }
  }, [cartItems, products]);

  const cartAmount = getCartAmount();

  const isColor = (val) => {
    const hexPattern = /^#(?:[0-9a-fA-F]{3}){1,2}$/;
    const colors = [
      'red', 'blue', 'green', 'yellow', 'black', 'white',
      'orange', 'pink', 'purple', 'gray', 'brown', 'beige'
    ];
    return hexPattern.test(val) || colors.includes(val?.toLowerCase());
  };

  return (
    <div className="bg-amber-50 min-h-screen pt-14 px-4 sm:px-8">
      <div className="text-3xl sm:text-4xl mb-6 text-center text-red-900">
        <Title text1="YOUR" text2="CART" />
      </div>

      {cartData.length === 0 ? (
        <p className="text-center text-gray-600 mt-20">Your cart is empty.</p>
      ) : (
        <div className="space-y-4">
          {cartData.map((item, index) => {
            const product = products.find((p) => p._id === item._id);
            if (!product) return null;

            return (
              <div
                key={index}
                className="bg-white rounded-xl shadow-md p-4 flex flex-col sm:flex-row items-center gap-4 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-center gap-4 flex-1">
                  <img
                    src={product.image[0]}
                    alt={product.name}
                    className="w-20 h-20 sm:w-28 sm:h-28 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <p className="text-lg font-semibold text-red-900">{product.name}</p>
                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                      <span className="text-md font-medium">
                        {currency} {product.price}
                      </span>

                      {/* ✅ Display size (if exists) */}
                      {item.size=='L' ||item.size=='M'||item.size=='XL' || item.size=='S' ||item.size=='s' ||item.size=='m' ||item.size=='l' ||item.size=='xl'    && (
                        <span className="px-2 py-1 border border-gray-300 rounded-md bg-amber-100 text-sm">
                          Size: {item.size}
                        </span>
                      )}

                     
                      {item.color && isColor(item.color) && (
                        <span
                          className="w-6 h-6 rounded-full border border-gray-400 inline-block"
                          style={{ backgroundColor: item.color }}
                          title={item.color}
                        ></span>
                      )}

                      {/* Fallback if color not valid */}
                      {item.color && !isColor(item.color) && (
                        <span className="px-2 py-1 border border-gray-300 rounded-md bg-amber-100 text-sm">
                          Color: {item.color}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 mt-2 sm:mt-0">
                  <input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      if (val > 0)
                        updateQuantity(item._id, [item.size, item.color].filter(Boolean).join('-'), val);
                    }}
                    className="w-16 sm:w-20 px-2 py-1 border rounded-md text-center"
                  />
                  <img
                    src={assets.bin_icon}
                    alt="Remove"
                    onClick={() =>
                      updateQuantity(item._id, [item.size, item.color].filter(Boolean).join('-'), 0)
                    }
                    className="w-6 sm:w-7 cursor-pointer hover:scale-110 transition-transform"
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Cart totals */}
      <div className="flex justify-end mt-10 sm:mt-14">
        <div className="w-full sm:w-[450px]">
          <CartTotal />
        </div>
      </div>

      {cartData.length > 0 && (
        <div className="w-full text-center mt-6">
          <button
            onClick={() => navigate('/place-order')}
            className="w-full py-3 rounded-2xl text-white font-semibold text-lg bg-red-700 hover:bg-green-800 hover:scale-105 transition-all duration-300"
          >
            PROCEED TO CHECKOUT
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;
