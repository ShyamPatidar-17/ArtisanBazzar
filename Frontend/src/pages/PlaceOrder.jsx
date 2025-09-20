import React, { useContext, useState } from 'react';
import Title from '../components/Title';
import CartTotal from '../components/CartTotal';
import { assets } from '../assets/assets';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Placeorder = () => {
  const [method, setMethod] = useState('cod');
  const {
    navigate,
    backendUrl,
    token,
    cartItems,
    setCartItems,
    getCartAmount,
    delivery_fee,
    products
  } = useContext(ShopContext);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipcode: '',
    country: '',
    phone: ''
  });

  const onChangehandler = (e) => {
    const { name, value } = e.target;
    setFormData((data) => ({ ...data, [name]: value }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    console.log("SUbmittedddd");

    if (!backendUrl) {
      toast.error('Backend URL is not configured!');
      return;
    }

    try {
      let orderItems = [];

      for (const itemId in cartItems) {
        for (const size in cartItems[itemId]) {
          if (cartItems[itemId][size] > 0) {
            const product = products.find((p) => p._id === itemId);
            if (product) {
              const itemInfo = { ...product };
              itemInfo.size = size;
              itemInfo.quantity = cartItems[itemId][size];
              orderItems.push(itemInfo);
            }
          }
        }
      }

      if (orderItems.length === 0) {
        toast.error("Your cart is empty. Add items before placing an order.");
        return;
      }

      const orderData = {
        address: formData,
        items: orderItems,
        amount: getCartAmount() + delivery_fee,
        paymentMethod: method
      };

      switch (method) {
        case 'cod':
          const response = await axios.post(backendUrl + "/api/order/place", orderData, {
            headers: { token }
          });

          console.log(response.data);

          if (response.data.success) {
            setCartItems({});
            toast.success("Order placed successfully!");
            navigate('/orders');
            console.log("Success code")
          } else {
            toast.error(response.data.message || "Failed to place order.");
          }
          break;
        case 'stripe':
          const responseStripe = await axios.post(backendUrl + "/api/order/stripe", orderData, {
            headers: { token }
          });

          if (responseStripe.data.success) {
            const { session_url } = responseStripe.data;
            window.location.replace(session_url);
          } else {
            toast.error(responseStripe.data.message || "Stripe failed");
          }
          break;
        default:
          toast.error("Invalid payment method selected.");
      }
    } catch (error) {
      console.error("Order placement error:", error);
      toast.error("Something went wrong while placing your order.");
    }
  };


  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t'>

      {/* LEFT SIDE */}
      <div className='flex flex-col gap-4 w-full sm:max-w-[480px]'>
        <div className='text-xl sm:text-2xl my-3'>
          <Title text1={'DELIVERY'} text2={'INFORMATION'} />
        </div>
        <div className='flex gap-3'>
          <input onChange={onChangehandler} name='firstName' value={formData.firstName} type="text" placeholder='First Name' required className='border border-gray-300 rounded py-1.5 px-3.5 w-full' />
          <input onChange={onChangehandler} name='lastName' value={formData.lastName} type="text" placeholder='Last Name' required className='border border-gray-300 rounded py-1.5 px-3.5 w-full' />
        </div>
        <input onChange={onChangehandler} name='phone' value={formData.phone} type="tel" placeholder='Your Phone Number' required className='border border-gray-300 rounded py-1.5 px-3.5 w-full' />
        <input onChange={onChangehandler} name='email' value={formData.email} type="email" placeholder='Your Email Address' required className='border border-gray-300 rounded py-1.5 px-3.5 w-full' />
        <input onChange={onChangehandler} name='street' value={formData.street} type="text" placeholder='Street Name' required className='border border-gray-300 rounded py-1.5 px-3.5 w-full' />
        <div className='flex gap-3'>
          <input onChange={onChangehandler} name='city' value={formData.city} type="text" placeholder='City Name' required className='border border-gray-300 rounded py-1.5 px-3.5 w-full' />
          <input onChange={onChangehandler} name='state' value={formData.state} type="text" placeholder='State Name' required className='border border-gray-300 rounded py-1.5 px-3.5 w-full' />
        </div>
        <div className='flex gap-3'>
          <input onChange={onChangehandler} name='zipcode' value={formData.zipcode} type="number" placeholder='Zip Code' required className='border border-gray-300 rounded py-1.5 px-3.5 w-full' />
          <input onChange={onChangehandler} name='country' value={formData.country} type="text" placeholder='Country' required className='border border-gray-300 rounded py-1.5 px-3.5 w-full' />
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className='mt-8'>
        <div className='mt-8 min-w-80'>
          <CartTotal />
        </div>

        <div className='mt-12'>
          <Title text1={'PAYMENT'} text2={'METHOD'} />
          <div className='flex gap-3 flex-col lg:flex-row'>
            <div onClick={() => setMethod('stripe')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'stripe' ? 'bg-green-400' : ''}`} />
              <img src={assets.stripe_logo} alt="Stripe" className='h-5 mx-4' />
            </div>

            <div onClick={() => setMethod('cod')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'cod' ? 'bg-green-400' : ''}`} />
              <p className='text-gr500 text-sm font-medium mx-4'>CASH ON DELIVERY</p>
            </div>
          </div>
          <div className='w-full text-end mt-8'>
            <button type='submit' className='bg-black text-white text-sm my-8 px-8 py-3 hover:bg-green-900 rounded-2xl hover:scale-110'>
              PLACE ORDER
            </button>
          </div>
        </div>
      </div>

    </form>
  );
};

export default Placeorder;
