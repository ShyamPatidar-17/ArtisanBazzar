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

  // 🔹 Replacement modal states
  const [showReplaceModal, setShowReplaceModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [selectedItemIndex, setSelectedItemIndex] = useState(null);
  const [selectedReason, setSelectedReason] = useState("");

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
          const paymentStatus =
            order.paymentMethod &&
            order.paymentMethod.toLowerCase().includes("stripe")
              ? "Paid"
              : order.status || "Pending";

          const itemsWithIndex = order.items.map((item, idx) => ({
            ...item,
            itemIndex: idx,
            status: item.status || "Order Placed",
            image:
              item.image && item.image.length > 0
                ? item.image
                : "https://via.placeholder.com/80",
          }));

          return { ...order, items: itemsWithIndex, status: paymentStatus };
        });
        setOrders(updatedOrders);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load orders");
    }
  };

  // Cancel order item
  const cancelOrderItem = async (orderId, itemIndex) => {
    try {
      const res = await axios.post(
        `${backendUrl}/api/order/status`,
        { orderId, itemIndex, status: "Cancelled" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        toast.success("Item cancelled successfully");
        updateItemStatus(orderId, itemIndex, "Cancelled");
      } else {
        toast.error(res.data.message || "Cancellation failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error while cancelling");
    }
  };

  // Return order item
  const returnOrderItem = async (orderId, itemIndex) => {
    try {
      const res = await axios.post(
        `${backendUrl}/api/order/status`,
        { orderId, itemIndex, status: "Returned" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        toast.success("Item return request placed successfully");
        updateItemStatus(orderId, itemIndex, "Returned");
      } else {
        toast.error(res.data.message || "Return request failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error while returning");
    }
  };

  // 🔹 Open Replacement Modal
  const openReplaceModal = (orderId, itemIndex) => {
    setSelectedOrderId(orderId);
    setSelectedItemIndex(itemIndex);
    setShowReplaceModal(true);
  };

  // 🔹 Confirm replacement with selected reason
  const confirmReplacement = async () => {
    if (!selectedReason) {
      toast.warning("Please select a reason!");
      return;
    }

    try {
      const res = await axios.post(
        `${backendUrl}/api/order/status`,
        {
          orderId: selectedOrderId,
          itemIndex: selectedItemIndex,
          status: "Replacement",
          reason: selectedReason,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        toast.success("Replacement request sent successfully");
        updateItemStatus(selectedOrderId, selectedItemIndex, "Replacement Requested");
      } else {
        toast.error(res.data.message || "Replacement failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error while requesting replacement");
    } finally {
      setShowReplaceModal(false);
      setSelectedReason("");
    }
  };

  // Helper: update local state for status
  const updateItemStatus = (orderId, itemIndex, newStatus) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order._id === orderId
          ? {
              ...order,
              items: order.items.map((item, idx) =>
                idx === itemIndex ? { ...item, status: newStatus } : item
              ),
            }
          : order
      )
    );
  };

  // Verify payment & load orders
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
          if (res.data.success) toast.success("Payment verified successfully!");
          loadOrderData();
        })
        .catch(() => toast.error("Payment verification failed"));
    } else {
      loadOrderData();
    }
  }, [search]);

  const getStatusColor = (status) => {
    switch (status) {
      case "Order Placed":
        return "bg-blue-100 text-blue-800";
      case "Processing":
        return "bg-purple-100 text-purple-800";
      case "Shipped":
      case "Out for Delivery":
        return "bg-yellow-100 text-yellow-800";
      case "Delivered":
      case "Paid":
        return "bg-green-100 text-green-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      case "Returned":
        return "bg-indigo-100 text-indigo-800";
      case "Replacement Requested":
        return "bg-pink-100 text-pink-800";
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
              <div className="flex justify-between items-center border-b pb-2">
                <p className="text-lg font-semibold text-gray-700">
                  Order ID:{" "}
                  <span className="text-red-900 font-bold">{order._id}</span>
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(order.date).toLocaleString()}
                </p>
              </div>

              {order.items.map((item) => (
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

                  <div className="flex gap-2">
                    {item.status !== "Cancelled" &&
                      item.status !== "Delivered" &&
                      item.status !== "Returned" &&
                      item.status !== "Replacement Requested" && (
                        <button
                          onClick={() =>
                            cancelOrderItem(order._id, item.itemIndex)
                          }
                          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                        >
                          Cancel
                        </button>
                      )}

                    {item.status === "Delivered" && (
                      <>
                        <button
                          onClick={() =>
                            returnOrderItem(order._id, item.itemIndex)
                          }
                          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                        >
                          Return
                        </button>
                        <button
                          onClick={() =>
                            openReplaceModal(order._id, item.itemIndex)
                          }
                          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                        >
                          Replace
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}

              <div className="pt-2 flex justify-between text-sm text-gray-600">
                <p>
                  Payment:{" "}
                  <span className="font-medium">{order.paymentMethod}</span>
                </p>

                <div className="font-semibold flex flex-wrap gap-2 items-center">
                  Status:{" "}
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 🔹 Replacement Reason Modal */}
      {showReplaceModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-xl p-6 shadow-lg w-80">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">
              Select Replacement Reason
            </h3>
            <div className="space-y-2">
              {[
                "Damaged Item",
                "Wrong Size/Color",
                "Defective Product",
                "Missing Parts",
                "Received Wrong Item",
                "Other",
              ].map((reason) => (
                <label
                  key={reason}
                  className="flex items-center gap-2 text-gray-700 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="replacementReason"
                    value={reason}
                    checked={selectedReason === reason}
                    onChange={(e) => setSelectedReason(e.target.value)}
                  />
                  {reason}
                </label>
              ))}
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowReplaceModal(false);
                  setSelectedReason("");
                }}
                className="px-3 py-1 rounded bg-gray-300 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={confirmReplacement}
                className="px-3 py-1 rounded bg-green-600 text-white hover:bg-green-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
