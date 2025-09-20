import React, { useContext, useEffect } from 'react';
import { ShopContext } from '../context/ShopContext';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import {jwtDecode} from 'jwt-decode'

const Verify = () => {
  const { navigate, token, setCartItems, backendUrl } = useContext(ShopContext);
  const [searchParams] = useSearchParams();

  const success = searchParams.get('success');
  const orderId = searchParams.get('orderId');

  const verifyPayment = async () => {
    try {
      if (!token) return;

      // Decode user ID from token
      const decoded = jwtDecode(token);
      const userId = decoded.id;

      const response = await axios.post(
        `${backendUrl}/api/order/verifyStripe`,
        { success, orderId, userId },
        { headers: { token } }
      );

      if (response.data.success) {
        setCartItems({});
        localStorage.setItem('cartItems', JSON.stringify({}));
        toast.success('Order Placed');
        navigate('/orders');
      } else {
        toast.error('Failed to Place Order');
        navigate('/cart');
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Something went wrong');
      navigate('/cart');
    }
  };

  useEffect(() => {
    if (token && success && orderId) {
      verifyPayment();
    }
  }, [token]);

  return <div>Verifying your payment...</div>;
};

export default Verify;
