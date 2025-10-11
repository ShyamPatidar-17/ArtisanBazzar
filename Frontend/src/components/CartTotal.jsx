import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from './Title';

const CartTotal = () => {
  const { getCartAmount, currency, delivery_fee } = useContext(ShopContext);
  const cartAmount = getCartAmount();
  const totalAmount = cartAmount === 0 ? 0 : cartAmount + delivery_fee;

  return (
    <div className="w-full bg-white rounded-xl shadow-md p-6 border border-amber-200">
      <Title text1="CART" text2="TOTALS" />

      <div className="flex flex-col gap-3 mt-4 text-sm text-gray-800">
        <div className="flex justify-between">
          <p className="font-medium">Subtotal</p>
          <p className="font-semibold">{currency} {cartAmount}.00</p>
        </div>

        {cartAmount !== 0 && (
          <div className="flex justify-between">
            <p className="font-medium">Shipping Fee:</p>
            <p className="font-semibold">{currency} {delivery_fee}.00</p>
          </div>
        )}

        <hr className="border-amber-300 my-2" />

        <div className="flex justify-between text-lg font-bold">
          <p>Total:</p>
          <p>{currency} {totalAmount}.00</p>
        </div>
      </div>
    </div>
  );
};

export default CartTotal;
