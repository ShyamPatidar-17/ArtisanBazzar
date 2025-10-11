import React, { useContext, useState, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import CartTotal from "../components/CartTotal";
import { assets } from "../assets/assets";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const PlaceOrder = () => {
  const [method, setMethod] = useState("cod");
  const { backendUrl, token, cartItems, setCartItems, products } = useContext(ShopContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  useEffect(() => {
    if (products.length) setLoading(false);
  }, [products]);

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Build order items including productId, quantity, and createdBy
  const buildOrderItems = () => {
    const orderItems = [];
    for (const itemId in cartItems) {
      for (const variant in cartItems[itemId]) {
        const quantity = cartItems[itemId][variant];
        if (quantity > 0) {
          const product = products.find((p) => p._id === itemId);
          if (product) {
            orderItems.push({
              name: product.name,
              productId: itemId,
              size: variant,
              quantity,
              price: product.price,
              createdBy: product.createdBy,
            });
          }
        }
      }
    }
    return orderItems;
  };

  // Reduce stock in database for each product
  const reduceStock = async (orderItems) => {
    try {
      for (const item of orderItems) {
        await axios.patch(`${backendUrl}/api/products/reduce-stock/${item.productId}`, {
          quantity: item.quantity,
        }, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
    } catch (error) {
      console.error("Stock Reduction Error:", error);
      toast.error("Failed to update product stock.");
    }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!token) return toast.error("You must be logged in to place an order.");
    const orderItems = buildOrderItems();
    if (orderItems.length === 0) return toast.error("Your cart is empty.");

    const orderData = {
      address: formData,
      items: orderItems,
    };

    const headers = { Authorization: `Bearer ${token}` };

    try {
      if (method === "cod") {
        // Cash on Delivery
        const res = await axios.post(`${backendUrl}/api/order/place`, orderData, { headers });
        if (res.data.success) {
          await reduceStock(orderItems);  // Reduce stock after order success
          setCartItems({});               // Clear cart
          toast.success(res.data.message);
          navigate("/orders");
        } else {
          toast.error(res.data.message);
        }
      } else if (method === "stripe") {
        // Stripe Payment
        const res = await axios.post(`${backendUrl}/api/order/stripe`, orderData, { headers });
        if (res.data.success && res.data.session_url) {
          // For Stripe, stock reduction should be done via webhook after successful payment
          window.location.href = res.data.session_url;
        } else {
          toast.error(res.data.message);
        }
      } else {
        toast.error("Invalid payment method selected.");
      }
    } catch (error) {
      console.error("Order Error:", error);
      toast.error("Something went wrong while placing your order.");
    }
  };

  if (loading) return <p className="text-center mt-20 text-lg">Loading products...</p>;

  return (
   
    <div className="bg-amber-50 min-h-screen pt-14 px-4 sm:px-8">
      <ToastContainer position="top-right" autoClose={3000} />
      <form onSubmit={onSubmitHandler} className="flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t">
        {/* LEFT: Delivery Info */}
        <div className="flex flex-col gap-4 w-full sm:max-w-[480px]">
          <div className="text-xl sm:text-2xl my-3">
            <Title text1="DELIVERY" text2="INFORMATION" />
          </div>
          <div className="flex gap-3">
            <input name="firstName" value={formData.firstName} onChange={onChangeHandler} type="text" placeholder="First Name" required className="border border-gray-300 rounded py-1.5 px-3.5 w-full"/>
            <input name="lastName" value={formData.lastName} onChange={onChangeHandler} type="text" placeholder="Last Name" required className="border border-gray-300 rounded py-1.5 px-3.5 w-full"/>
          </div>
          <input name="phone" value={formData.phone} onChange={onChangeHandler} type="tel" placeholder="Your Phone Number" required className="border border-gray-300 rounded py-1.5 px-3.5 w-full"/>
          <input name="email" value={formData.email} onChange={onChangeHandler} type="email" placeholder="Your Email Address" required className="border border-gray-300 rounded py-1.5 px-3.5 w-full"/>
          <input name="street" value={formData.street} onChange={onChangeHandler} type="text" placeholder="Street Name" required className="border border-gray-300 rounded py-1.5 px-3.5 w-full"/>
          <div className="flex gap-3">
            <input name="city" value={formData.city} onChange={onChangeHandler} type="text" placeholder="City Name" required className="border border-gray-300 rounded py-1.5 px-3.5 w-full"/>
            <input name="state" value={formData.state} onChange={onChangeHandler} type="text" placeholder="State Name" required className="border border-gray-300 rounded py-1.5 px-3.5 w-full"/>
          </div>
          <div className="flex gap-3">
            <input name="zipcode" value={formData.zipcode} onChange={onChangeHandler} type="number" placeholder="Zip Code" required className="border border-gray-300 rounded py-1.5 px-3.5 w-full"/>
            <input name="country" value={formData.country} onChange={onChangeHandler} type="text" placeholder="Country" required className="border border-gray-300 rounded py-1.5 px-3.5 w-full"/>
          </div>
        </div>

        {/* RIGHT: Cart Total + Payment */}
        <div className="mt-8 w-full sm:max-w-[400px]">
          <CartTotal />
          <div className="mt-12">
            <Title text1="PAYMENT" text2="METHOD" />
            <div className="flex gap-3 flex-col lg:flex-row mt-2">
              <div onClick={() => setMethod("stripe")} className={`flex items-center gap-3 border p-2 px-3 cursor-pointer ${method === "stripe" ? "border-green-500" : ""}`}>
                <p className={`min-w-3.5 h-3.5 border rounded-full ${method === "stripe" ? "bg-green-400" : ""}`} />
                <img src={assets.stripe_logo} alt="Stripe" className="h-5 mx-4" />
              </div>
              <div onClick={() => setMethod("cod")} className={`flex items-center gap-3 border p-2 px-3 cursor-pointer ${method === "cod" ? "border-green-500" : ""}`}>
                <p className={`min-w-3.5 h-3.5 border rounded-full ${method === "cod" ? "bg-green-400" : ""}`} />
                <p className="text-gr500 text-sm font-medium mx-4">CASH ON DELIVERY</p>
              </div>
            </div>
            <div className="w-full text-end mt-8">
              <button type="submit" className="bg-black text-white text-sm my-8 px-8 py-3 hover:bg-green-900 rounded-2xl hover:scale-110 transition-all">
                PLACE ORDER
              </button>
            </div>
          </div>
        </div>
      </form>
  
    </div>
  );
};

export default PlaceOrder;
