import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';
import { backendUrl, currency } from '../App';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem("sellerToken") || "";
  const sellerId = token ? jwtDecode(token).id : null;

  const fetchOrders = async () => {
    if (!token) return;
    try {
      const { data } = await axios.get(`${backendUrl}/api/order/list`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) setOrders(data.orders.reverse());
      else toast.error(data.message || "Failed to fetch orders");
    } catch (err) {
      console.error(err);
      toast.error("Error fetching orders");
    }
  };

  const handleItemStatusChange = async (orderId, itemIndex, newStatus) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/order/status`,
        { orderId, itemIndex, status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        toast.success("Item status updated!");
        fetchOrders();
      } else toast.error(data.message || "Failed to update status");
    } catch (err) {
      console.error(err);
      toast.error("Error updating status");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [token]);

  // ✅ Distinct background colors for each status
  const getStatusBg = (status) => {
    switch (status) {
      case 'Order Placed':
        return 'bg-blue-100 border-blue-400';
      case 'Processing':
        return 'bg-yellow-100 border-yellow-400';
      case 'Shipped':
        return 'bg-purple-100 border-purple-400';
      case 'Delivered':
        return 'bg-green-100 border-green-400';
      case 'Cancelled':
        return 'bg-red-100 border-red-400';
      default:
        return 'bg-white border-gray-300';
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">My Product Orders</h2>
      {orders.length === 0 ? (
        <p className="text-gray-500">No orders found.</p>
      ) : (
        orders.map((order) => (
          <div key={order._id} className="border rounded-md p-4 mb-6 shadow">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span><strong>Order ID:</strong> {order._id}</span>
              <span><strong>Date:</strong> {new Date(order.date).toDateString()}</span>
            </div>

            <div className="text-sm text-gray-700 mb-2">
              <p><strong>Customer:</strong> {order.address.firstName} {order.address.lastName}</p>
              <p><strong>Phone:</strong> {order.address.phone}</p>
              <p><strong>Address:</strong> {order.address.street}, {order.address.city}</p>
              <p><strong>Payment Method:</strong> {order.paymentMethod?.toUpperCase()}</p>
              <p><strong>Total:</strong> {currency} {order.amount}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              {order.items
                .filter(item => item.createdBy === sellerId)
                .map((item, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center gap-4 border rounded p-3 shadow-sm transition-all duration-300 ${getStatusBg(item.status)}`}
                  >
                    <img
                      src={item.image[0]}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded border"
                    />
                    <div className="text-sm w-full">
                      <p className="font-semibold">{item.name}</p>
                      <p>Price: {currency} {item.price} | Qty: {item.quantity} | Size: {item.size}</p>

                      <div className="mt-2">
                        <span className="font-medium">Status:</span>{' '}
                        <select
                          disabled={item.status === 'Cancelled' || item.status === 'Delivered'}
                          value={item.status}
                          onChange={(e) => handleItemStatusChange(order._id, idx, e.target.value)}
                          className={`border px-2 py-1 rounded mt-1 w-full 
                            ${item.status === 'Cancelled' ? 'bg-red-200 text-red-800 cursor-not-allowed' : ''} 
                            ${item.status === 'Delivered' ? 'bg-green-200 text-green-800 cursor-not-allowed' : ''}`}
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
