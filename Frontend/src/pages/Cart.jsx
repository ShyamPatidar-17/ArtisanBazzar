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
      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            tempData.push({
              _id: items,
              size: item,
              quantity: cartItems[items][item],
            });
          }
        }
      }
      setCartData(tempData);
    }
  }, [cartItems, products]);

  const cartAmount = getCartAmount();

  return (
    <div className="bg-amber-50 min-h-screen pt-14 px-4 sm:px-8">
      <div className="text-3xl sm:text-4xl mb-6 text-center text-red-900">
        <Title text1={'YOUR'} text2={'CART'} />
      </div>

      <div className="space-y-4">
        {cartData.map((item, index) => {
          const productData = products.find((product) => product._id === item._id);
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
                    <span className="px-2 py-1 border border-gray-300 rounded-md bg-amber-100">{item.size}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 mt-2 sm:mt-0">
                <input
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={(e) =>
                    e.target.value === '' || e.target.value === '0'
                      ? null
                      : updateQuantity(item._id, item.size, Number(e.target.value))
                  }
                  className="w-16 sm:w-20 px-2 py-1 border rounded-md text-center"
                />
                <img
                  src={assets.bin_icon}
                  alt="Remove"
                  onClick={() => updateQuantity(item._id, item.size, 0)}
                  className="w-6 sm:w-7 cursor-pointer hover:scale-110 transition-transform"
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-end mt-10 sm:mt-14">
        <div className="w-full sm:w-[450px] bg-white rounded-xl shadow-md p-6">
          <CartTotal />

          <div className="w-full text-center mt-6">
            <button
              onClick={() => cartAmount !== 0 && navigate('/place-order')}
              disabled={cartAmount === 0}
              className={`w-full py-3 rounded-2xl text-white font-semibold text-lg transition-all duration-300 ${
                cartAmount === 0
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-red-700 hover:bg-red-800 hover:scale-105'
              }`}
            >
              PROCEED TO CHECKOUT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
