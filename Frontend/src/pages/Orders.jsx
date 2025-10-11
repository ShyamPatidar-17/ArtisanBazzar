import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import axios from "axios";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";

const Orders = () => {
  const { currency, backendUrl, token } = useContext(ShopContext);
  const [orders, setOrders] = useState([]);
  const { search } = useLocation();

  // Helper to get proper image URL
  const getImageUrl = (item) => {
    if (!item.image || item.image.length === 0) return "https://via.placeholder.com/80";
    const firstImage = Array.isArray(item.image) ? item.image[0] : item.image;
   return firstImage || "https://via.placeholder.com/80";
  };

  // Load user orders
  const loadOrderData = async () => {
    try {
      if (!token) return;
      const response = await axios.post(
        `${backendUrl}/api/order/userorders`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        const updatedOrders = response.data.orders.map((order) => {
          const itemsWithIndex = order.items.map((item, idx) => ({
            ...item,
            itemIndex: idx,
            status: item.status || "Order Placed",
            image: getImageUrl(item), // convert image path here
          }));
          return { ...order, items: itemsWithIndex };
        });
        setOrders(updatedOrders.reverse());
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load orders");
    }
  };

  // Cancel item (user/admin)
  const cancelOrderItem = async (orderId, itemIndex) => {
    try {
      const res = await axios.post(
        `${backendUrl}/api/order/status`,
        { orderId, itemIndex, status: "Cancelled" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        toast.success("Item cancelled successfully");
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId
              ? {
                  ...order,
                  items: order.items.map((item, idx) =>
                    idx === itemIndex ? { ...item, status: "Cancelled" } : item
                  ),
                }
              : order
          )
        );
      } else {
        toast.error(res.data.message || "Cancellation failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error while cancelling");
    }
  };

  // Stripe payment verification
  useEffect(() => {
    const params = new URLSearchParams(search);
    const payment = params.get("payment");
    const orderId = params.get("orderId");

    if (payment === "success" && orderId) {
      axios
        .post(
          `${backendUrl}/api/order/verifyStripe`,
          { orderId, success: "true" },
          { headers: { Authorization: `Bearer ${token}` } }
        )
        .then((res) => {
          if (res.data.success) toast.success("✅ Payment verified successfully!");
          loadOrderData();
        })
        .catch(() => toast.error("Payment verification failed"));
    } else {
      loadOrderData();
    }
  }, [search]);

  // Status badge colors
  const getStatusColor = (status) => {
    switch (status) {
      case "Order Placed":
        return "bg-blue-100 text-blue-800";
      case "Processing":
        return "bg-purple-100 text-purple-800";
      case "Shipped":
        return "bg-yellow-100 text-yellow-800";
      case "Out for Delivery":
        return "bg-orange-100 text-orange-800";
      case "Delivered":
        return "bg-green-100 text-green-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      case "Paid":
      case "Done":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-gray-200 text-gray-700";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-amber-50 min-h-screen pt-14 px-4 sm:px-8">
      <div className="text-3xl sm:text-4xl mb-6 text-center text-red-900">
        <Title text1="YOUR" text2="ORDERS" />
      </div>

      {orders.length === 0 ? (
        <p className="text-center text-gray-600 mt-20">No orders yet.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-xl shadow-md p-4 space-y-4"
            >
              {/* Order Header */}
              <div className="flex justify-between items-center border-b pb-2">
                <p className="text-lg font-semibold text-gray-700">
                  Order ID:{" "}
                  <span className="text-red-900 font-bold">{order._id}</span>
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(order.date).toLocaleString()}
                </p>
              </div>

              {/* Order Items */}
              {order.items && order.items.length > 0 ? (
                order.items.map((item) => (
                  <div
                    key={item.itemIndex}
                    className="flex flex-col sm:flex-row items-center gap-4 border-b last:border-b-0 pb-2"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 sm:w-28 sm:h-28 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <p className="text-lg font-semibold text-red-900">
                          {item.name}
                        </p>
                        <div className="flex items-center gap-3 mt-1 flex-wrap">
                          <span className="text-md font-medium">
                            {currency} {item.price} × {item.quantity}
                          </span>
                          <span className="px-2 py-1 border border-gray-300 rounded-md bg-amber-100">
                            {item.size}
                          </span>
                          <span
                            className={`px-2 py-1 rounded-md ${getStatusColor(
                              item.status
                            )}`}
                          >
                            {item.status}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Cancel button */}
                    {item.status !== "Cancelled" &&
                      item.status !== "Delivered" && (
                        <button
                          onClick={() =>
                            cancelOrderItem(order._id, item.itemIndex)
                          }
                          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                        >
                          Cancel
                        </button>
                      )}
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No items in this order</p>
              )}

              {/* Order Footer */}
              <div className="pt-2 flex justify-between text-sm text-gray-600">
                <p>
                  Payment:{" "}
                  <span className="font-medium">{order.paymentMethod}</span>
                </p>

                <div className="font-semibold flex flex-wrap gap-2 items-center">
                  Status:{" "}
                  {(() => {
                    const deliveredCount = order.items.filter(
                      (i) => i.status === "Delivered"
                    ).length;
                    const cancelledCount = order.items.filter(
                      (i) => i.status === "Cancelled"
                    ).length;
                    const pendingCount = order.items.filter(
                      (i) => i.status === "Order Placed" || i.status === "Pending"
                    ).length;
                    const total = order.items.length;

                    if (deliveredCount === total) {
                      return (
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                            "Paid"
                          )}`}
                        >
                          Paid
                        </span>
                      );
                    }

                    if (cancelledCount === total) {
                      return (
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                            "Cancelled"
                          )}`}
                        >
                          Cancelled
                        </span>
                      );
                    }

                    return (
                      <div className="flex gap-2">
                        {deliveredCount > 0 && (
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                              "Paid"
                            )}`}
                          >
                            {deliveredCount} Paid
                          </span>
                        )}
                        {cancelledCount > 0 && (
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                              "Cancelled"
                            )}`}
                          >
                            {cancelledCount} Cancelled
                          </span>
                        )}
                        {pendingCount > 0 && (
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                              "Pending"
                            )}`}
                          >
                            {pendingCount} Pending
                          </span>
                        )}
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
