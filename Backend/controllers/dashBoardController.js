import productModel from "../models/productModel.js";
import orderModel from "../models/orderModel.js";

export const getDashboardStats = async (req, res) => {
  try {
    const sellerId = req.params.id;

    // Count seller's products
    const products = await productModel.countDocuments({ createdBy: sellerId });

    // Find all orders containing items by this seller
    const orders = await orderModel.find({ "items.createdBy": sellerId });

    // Initialize counts
    const statusCounts = {
      total: 0,
      processing: 0,
      delivered: 0,
      cancelled: 0,
    };

    // Count items by status (only Processing, Delivered, Cancelled)
    orders.forEach(order => {
      order.items
        .filter(item => item.createdBy.toString() === sellerId)
        .forEach(item => {
          statusCounts.total += 1;
          switch (item.status) {
            case "Processing":
              statusCounts.processing += 1;
              break;
            case "Delivered":
              statusCounts.delivered += 1;
              break;
            case "Cancelled":
              statusCounts.cancelled += 1;
              break;
            default:
              break; // ignore Placed or Shipped
          }
        });
    });

    res.json({
      success: true,
      products,
      ...statusCounts,
      message: "Dashboard stats fetched successfully",
    });

  } catch (error) {
    console.error("Dashboard stats error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard stats",
      error: error.message,
    });
  }
};
