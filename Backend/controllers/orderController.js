import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import productModel from "../models/productModel.js";
import { Stripe } from "stripe";
import jwt from "jsonwebtoken";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const deliveryCharges = 10;
const currency = "inr";

// ---------------- Helper: Extract userId from JWT ----------------
const getUserIdFromToken = (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) throw new Error("No authorization header found");
  const token = authHeader.split(" ")[1];
  if (!token) throw new Error("Token not provided");
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  return decoded.id;
};

// ---------------- Helper: Get full image URL ----------------
const getFullImageUrl = (imageArray) => {
  if (!imageArray || imageArray.length === 0) {
    return "https://via.placeholder.com/80"; // fallback image
  }

  const firstImage = Array.isArray(imageArray) ? imageArray[0] : imageArray;
  // If image is from Cloudinary, return as-is
  if (firstImage.startsWith("http")) return firstImage;

  // Otherwise serve local image with backend base URL
  const base = process.env.BACKEND_URL?.replace(/\/$/, "");
  return `${base}/${firstImage}`;
};

// ---------------- Build Items with Product Images ----------------
const buildOrderItems = async (items) => {
  return await Promise.all(
    items.map(async (item) => {
      // Fetch product image from DB
      const product = await productModel.findById(item.productId).select("image");
      const imageUrl = getFullImageUrl(product?.image);

      return {
        name: item.name,
        image: imageUrl ? [imageUrl] : [],
        price: item.price,
        size: item.size,
        quantity: item.quantity,
        createdBy: item.createdBy || item.sellerId,
        status: "Order Placed",
      };
    })
  );
};

// ---------------- COD Order ----------------
export const placeOrderCOD = async (req, res) => {
  try {
    const userId = getUserIdFromToken(req);
    const { items, address } = req.body;

    if (!items || items.length === 0) {
      return res.json({ success: false, message: "Cart is empty" });
    }

    // Build enriched items with images
    const enrichedItems = await buildOrderItems(items);

    const totalAmount =
      enrichedItems.reduce((sum, i) => sum + i.price * i.quantity, 0) + deliveryCharges;

    const newOrder = new orderModel({
      userId,
      items: enrichedItems,
      amount: totalAmount,
      address,
      paymentMethod: "COD",
      payment: false,
      status: "Order Placed",
    });

    await newOrder.save();
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    res.json({ success: true, message: "✅ COD Order placed successfully!" });
  } catch (error) {
    console.error("COD Order Error:", error);
    res.json({ success: false, message: error.message });
  }
};

// ---------------- Stripe Order ----------------
export const placeOrderStripe = async (req, res) => {
  try {
    const userId = getUserIdFromToken(req);
    const { items, address } = req.body;
    const { origin } = req.headers;

    if (!items || items.length === 0) {
      return res.json({ success: false, message: "Cart is empty" });
    }

    // Build enriched items with images
    const enrichedItems = await buildOrderItems(items);

    const totalAmount =
      enrichedItems.reduce((sum, i) => sum + i.price * i.quantity, 0) + deliveryCharges;

    const newOrder = new orderModel({
      userId,
      items: enrichedItems,
      amount: totalAmount,
      address,
      paymentMethod: "Stripe",
      payment: false,
      status: "Order Placed",
    });

    await newOrder.save();

    const line_items = enrichedItems.map((item) => ({
      price_data: {
        currency,
        product_data: { name: item.name },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }));

    line_items.push({
      price_data: {
        currency,
        product_data: { name: "Delivery Charges" },
        unit_amount: deliveryCharges * 100,
      },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `${origin}/orders?payment=success&orderId=${newOrder._id}`,
      cancel_url: `${origin}/place-order`,
    });

    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.error("Stripe Order Error:", error);
    res.json({ success: false, message: error.message });
  }
};

// ---------------- Verify Stripe ----------------
export const verifyStripe = async (req, res) => {
  try {
    const { orderId, success } = req.body;
    const order = await orderModel.findById(orderId);
    if (!order) return res.json({ success: false, message: "Order not found" });

    if (success === "true") {
      order.payment = true;
      order.status = "Order Placed";
      await order.save();
      await userModel.findByIdAndUpdate(order.userId, { cartData: {} });
      res.json({ success: true, message: "✅ Payment verified successfully!" });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      res.json({ success: false, message: "Payment failed, order canceled" });
    }
  } catch (error) {
    console.error("Verify Stripe Error:", error);
    res.json({ success: false, message: error.message });
  }
};

// ---------------- Admin Orders ----------------
export const adminOrders = async (req, res) => {
  try {
    const sellerId = req.userId;
    const orders = await orderModel.find({ "items.createdBy": sellerId });

    const updatedOrders = orders.map((order) => ({
      ...order.toObject(),
      items: order.items.map((item) => ({
        ...item.toObject(),
        image: getFullImageUrl(item.image),
      })),
    }));

    res.json({ success: true, orders: updatedOrders });
  } catch (err) {
    console.error("Admin Orders Error:", err);
    res.json({ success: false, message: err.message });
  }
};

// ---------------- User Orders ----------------
export const userOrders = async (req, res) => {
  try {
    const userId = getUserIdFromToken(req);
    const orders = await orderModel.find({ userId }).sort({ createdAt: -1 });

    const updatedOrders = orders.map((order) => ({
      ...order.toObject(),
      items: order.items.map((item) => ({
        ...item.toObject(),
        image: getFullImageUrl(item.image),
      })),
    }));

    res.json({ success: true, orders: updatedOrders });
  } catch (err) {
    console.error("User Orders Error:", err);
    res.json({ success: false, message: err.message });
  }
};

// ---------------- Update Order Item Status ----------------
export const updateOrderItemStatus = async (req, res) => {
  try {
    const { orderId, itemIndex, status } = req.body;

    const validStatuses = [
      "Order Placed",
      "Processing",
      "Shipped",
      "Delivered",
      "Cancelled",
      "Returned",
      "Replacement",
    ];

    if (!validStatuses.includes(status))
      return res.status(400).json({ success: false, message: "Invalid status" });

    const order = await orderModel.findById(orderId);
    if (!order)
      return res.status(404).json({ success: false, message: "Order not found" });

    if (!order.items[itemIndex])
      return res.status(400).json({ success: false, message: "Invalid item index" });

    if (status === "Cancelled" && order.items[itemIndex].status === "Delivered")
      return res.status(400).json({ success: false, message: "Cannot cancel delivered item" });

    order.items[itemIndex].status = status;
    await order.save();

    res.json({ success: true, message: `Item status updated to ${status}`, order });
  } catch (error) {
    console.error("Update Order Item Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ---------------- Count Orders for Seller ----------------
export const countOrders = async (req, res) => {
  try {
    const sellerId = req.userId;
    if (!sellerId)
      return res.status(401).json({ success: false, message: "Unauthorized" });

    const count = await orderModel.countDocuments({
      "items.createdBy": sellerId,
    });

    res.json({ success: true, count });
  } catch (err) {
    console.error("Count Orders Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ---------------- My Orders ----------------
export const getMyOrders = async (req, res) => {
  try {
    if (!req.userId)
      return res.status(401).json({ success: false, message: "Unauthorized" });

    const userId = req.userId;
    const orders = await orderModel.find({ userId }).sort({ createdAt: -1 });

    const updatedOrders = orders.map((order) => ({
      ...order.toObject(),
      items: order.items.map((item) => ({
        ...item.toObject(),
        image: getFullImageUrl(item.image),
      })),
    }));

    res.json({ success: true, orders: updatedOrders });
  } catch (error) {
    console.error("Error fetching my orders:", error);
    res.status(500).json({ success: false, message: "Failed to fetch orders" });
  }
};
