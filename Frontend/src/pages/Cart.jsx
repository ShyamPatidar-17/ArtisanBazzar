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
            tempData.push({
              _id: prodId,
              variant,
              quantity: cartItems[prodId][variant],
            });
          }
        }
      }
      setCartData(tempData);
    }
  }, [cartItems, products]);

  const cartAmount = getCartAmount(); // Get total cart amount

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
            const productData = products.find((p) => p._id === item._id);
            if (!productData) return null;

            return (
              <div
                key={index}
                className="bg-white rounded-xl shadow-md p-4 flex flex-col sm:flex-row items-center gap-4 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-center gap-4 flex-1">
                  <img
                    src={productData.image[0]}
                    alt={productData.name}
                    className="w-20 h-20 sm:w-28 sm:h-28 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <p className="text-lg font-semibold text-red-900">{productData.name}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-md font-medium">{currency} {productData.price}</span>
                      <span className="px-2 py-1 border border-gray-300 rounded-md bg-amber-100">{item.variant}</span>
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
                      if (val > 0) updateQuantity(item._id, item.variant, val);
                    }}
                    className="w-16 sm:w-20 px-2 py-1 border rounded-md text-center"
                  />
                  <img
                    src={assets.bin_icon}
                    alt="Remove"
                    onClick={() => updateQuantity(item._id, item.variant, 0)}
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

      {/* Checkout button only if cart is not empty */}
      {cartData.length > 0 && (
        <div className='w-full text-center mt-6'>
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
