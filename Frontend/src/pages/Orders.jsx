import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import { toast } from 'react-toastify';

const Orders = () => {
  const { currency, backendUrl, token } = useContext(ShopContext);
  const [orderData, setOrderData] = useState([]);

  const loadOrderData = async () => {
    try {
      if (!token) return;

      const response = await axios.post(backendUrl + "/api/order/userorders", {}, {
        headers: { token }
      });

      if (response.data.success) {
        let allOrdersItem = [];
        response.data.orders.forEach((order) => {
          order.items.forEach((item, index) => {
            allOrdersItem.push({
              ...item,
              payment: order.payment,
              paymentMethod: order.paymentMethod,
              date: order.date,
              orderId: order._id,
              itemIndex: index
            });
          });
        });

        setOrderData(allOrdersItem.reverse());
      }
    } catch (error) {
      console.error("Error loading orders:", error);
    }
  };

  const cancelOrderItem = async (orderId, itemIndex) => {
    try {
      const res = await axios.post(backendUrl+"/api/order/status", {
        orderId,
        itemIndex,
        status: "Cancelled"
      }, {
        headers: { token }
      });

      if (res.data.success) {
        toast.success("Item cancelled successfully");
        loadOrderData();
      } else {
        toast.error(res.data.message || "Cancellation failed");
      }
    } catch (err) {
      toast.error("Server error while cancelling");
    }
  };

  useEffect(() => {
    loadOrderData();
  }, [token]);

  return (
    <div className='border-t pt-16'>
      <div className='text-2xl'>
        <Title text1={'MY'} text2={'ORDERS'} />
      </div>

      <div>
        {orderData.map((item, index) => (
          <div key={index} className='py-4 border-t border-b text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
            <div className='flex items-start gap-6 text-sm'>
              <img src={item.image[0]} alt={item.name} className='w-16 sm:w-20' />
              <div>
                <p className='sm:text-base font-medium'>{item.name}</p>
                <div className='flex items-center gap-3 mt-2 text-base text-gray-700'>
                  <p className='text-lg'>{currency} {item.price}</p>
                  <p>Quantity: {item.quantity}</p>
                  <p>Size: {item.size}</p>
                </div>
                <p>Date: <span className='text-gray-400'>{new Date(item.date).toDateString()}</span></p>
                <p>Payment: <span className='text-black'>{item.paymentMethod}</span></p>
              </div>
            </div>

            <div className='md:w-1/2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3'>
              <div className='flex items-center gap-2'>
                <span className={`min-w-2 h-2 rounded-full ${
                  item.status === 'Cancelled' ? 'bg-red-500'
                  : item.status === 'Delivered' ? 'bg-green-500'
                  : item.status === 'Shipped' ? 'bg-yellow-500'
                  : 'bg-gray-400'
                }`}></span>
                <p className='text-sm md:text-base'>{item.status}</p>
              </div>

              <div className='flex gap-3'>
                {(item.status !== 'Cancelled' && item.status !=='Delivered') && (
                  <button
                    onClick={loadOrderData}
                    className='border px-4 py-2 text-sm font-medium rounded-xl hover:bg-green-500 hover:scale-105 transition'
                  >
                    Track Order
                  </button>
                )}

                {(item.status === 'Order Placed' || item.status === 'Processing') && (
                  <button
                    onClick={() => cancelOrderItem(item.orderId, item.itemIndex)}
                    className='border px-4 py-2 text-sm font-medium rounded-xl hover:bg-red-500 hover:scale-105 transition text-red-700'
                  >
                    Cancel Order
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
