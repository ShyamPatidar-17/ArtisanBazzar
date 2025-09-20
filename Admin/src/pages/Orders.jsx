import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { backendUrl, currency } from '../App'; // or from context/provider

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);

  // Fetch all orders
  const fetchAllOrders = async () => {
    if (!token) return;

    try {
      const response = await axios.post(
        `${backendUrl}/api/order/list`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}` // ✅ Correct header format
          },
        }
      );

      if (response.data.success) {
        setOrders(response.data.orders.reverse()); // latest first
      } else {
        toast.error(response.data.message || 'Failed to fetch orders.');
      }
    } catch (error) {
      console.error('Fetch orders error:', error);
      toast.error('Error fetching orders.');
    }
  };

  // Handle status change for individual item
  const handleItemStatusChange = async (orderId, itemIndex, newStatus) => {
    try {
      const res = await axios.post(
        `${backendUrl}/api/order/status`,
        {
          orderId,
          itemIndex,
          status: newStatus
        },
        {
          headers: {
            Authorization: `Bearer ${token}` // ✅ Correct header format
          }
        }
      );

      if (res.data.success) {
        toast.success('Item status updated!');
        fetchAllOrders(); // refresh orders
      } else {
        toast.error(res.data.message || 'Failed to update item status');
      }
    } catch (err) {
      console.error('Item status update error:', err);
      toast.error('Something went wrong while updating item status');
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, [token]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">All Orders</h2>

      {orders.length === 0 ? (
        <p className="text-gray-500">No orders found.</p>
      ) : (
        orders.map((order, index) => (
          <div key={order._id || index} className="border rounded-md p-4 mb-6 shadow">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span><strong>Order ID:</strong> {order._id}</span>
              <span><strong>Date:</strong> {new Date(order.date).toDateString()}</span>
            </div>

            <div className="text-sm text-gray-700 mb-2">
              <p><strong>Customer:</strong> {order.address.firstName} {order.address.lastName}</p>
              <p><strong>Phone:</strong> {order.address.phone}</p>
              <p><strong>Address:</strong> {order.address.street}, {order.address.city}, {order.address.state}, {order.address.country}</p>
              <p><strong>ZipCode:</strong> {order.address.zipcode}</p>
              <p><strong>Payment:</strong> {order.paymentMethod?.toUpperCase()}</p>
              <p>
                <strong>Payment Status:</strong>{' '}
                {(order.payment || order.items.some(item => item.status === 'Delivered')) ? 'Done' : 'Pending'}
              </p>
              <p><strong>Total Amount:</strong> {currency} {order.amount}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              {order.items.map((item, itemIndex) => (
                <div key={itemIndex} className="flex items-center gap-4 border rounded p-2 bg-white border-blue-800">
                  <img src={item.image[0]} alt={item.name} className="w-16 h-16 object-cover rounded" />
                  <div className="text-sm w-full">
                    <p className="font-semibold">{item.name}</p>
                    <p>Price: {currency} {item.price} | Qty: {item.quantity} | Size: {item.size}</p>
                    <div className="mt-1">
                      <span className="font-medium">Status:</span>{' '}
                      <select
                        disabled={item.status === 'Cancelled' || item.status === 'Delivered'}
                        value={item.status}
                        onChange={(e) => handleItemStatusChange(order._id, itemIndex, e.target.value)}
                        className={`border px-2 py-1 rounded mt-1 w-full
                          ${item.status === 'Cancelled' ? 'bg-red-100 text-red-600 cursor-not-allowed' : ''}
                          ${item.status === 'Delivered' ? 'bg-green-100 text-green-700 cursor-not-allowed' : ''}`}
                      >
                        {['Order Placed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(status => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Orders;
