import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import { Stripe } from "stripe";
import jwt from "jsonwebtoken";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const deliveryCharges = 10;
const currency = "inr";

// Helper to extract userId from JWT
const getUserIdFromToken = (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) throw new Error("No authorization header found");
  const token = authHeader.split(" ")[1];
  if (!token) throw new Error("Token not provided");
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  return decoded.id;
};

// Helper to convert image paths to full URLs
const getFullImageUrl = (imageArray) => {
  if (!imageArray || imageArray.length === 0) return "https://via.placeholder.com/80";
  const firstImage = Array.isArray(imageArray) ? imageArray[0] : imageArray;
  return firstImage.startsWith("http") ? firstImage : `${process.env.BACKEND_URL}/${firstImage}`;
};

// ---------------- Build Items ----------------
const buildOrderItems = (items) => {
  return items.map(item => ({
    name: item.name,
    image: item.image || [],
    price: item.price,
    size: item.size,
    quantity: item.quantity,
    createdBy: item.createdBy || item.sellerId, // must exist
    status: 'Order Placed'
  }));
};

// ---------------- COD Order ----------------
export const placeOrderCOD = async (req, res) => {
  try {
    const userId = getUserIdFromToken(req);
    const { items, address } = req.body;

    if (!items || items.length === 0)
      return res.json({ success: false, message: "Cart is empty" });

    const enrichedItems = buildOrderItems(items);

    const totalAmount = enrichedItems.reduce((sum, i) => sum + i.price * i.quantity, 0) + deliveryCharges;

    const newOrder = new orderModel({
      userId,
      items: enrichedItems,
      amount: totalAmount,
      address,
      paymentMethod: "COD",
      payment: false,
      status: "Order Placed"
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

    if (!items || items.length === 0)
      return res.json({ success: false, message: "Cart is empty" });

    const enrichedItems = buildOrderItems(items);

    const totalAmount = enrichedItems.reduce((sum, i) => sum + i.price * i.quantity, 0) + deliveryCharges;

    const newOrder = new orderModel({
      userId,
      items: enrichedItems,
      amount: totalAmount,
      address,
      paymentMethod: "Stripe",
      payment: false,
      status: "Order Placed"
    });

    await newOrder.save();

    const line_items = enrichedItems.map(item => ({
      price_data: {
        currency,
        product_data: { name: item.name },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }));

    // Add delivery fee
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

    const updatedOrders = orders.map(order => ({
      ...order.toObject(),
      items: order.items.map(item => ({
        ...item.toObject(),
        image: getFullImageUrl(item.image),
      })),
    }));

    res.json({ success: true, orders: updatedOrders });
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: err.message });
  }
};

// ---------------- User Orders ----------------
export const userOrders = async (req, res) => {
  try {
    const userId = getUserIdFromToken(req);
    const orders = await orderModel.find({ userId }).sort({ createdAt: -1 });

    // Map images to full URLs
    const updatedOrders = orders.map(order => ({
      ...order.toObject(),
      items: order.items.map(item => ({
        ...item.toObject(),
        image: getFullImageUrl(item.image),
      })),
    }));

    res.json({ success: true, orders: updatedOrders });
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: err.message });
  }
};

// ---------------- Update Order Item ----------------
export const updateOrderItemStatus = async (req, res) => {
  try {
    const { orderId, itemIndex, status } = req.body;
    const validStatuses = ['Order Placed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
    if (!validStatuses.includes(status))
      return res.status(400).json({ success: false, message: "Invalid status" });

    const order = await orderModel.findById(orderId);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

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
    const sellerId = req.userId;  // ensure req.user exists
    if (!sellerId) return res.status(401).json({ success: false, message: "Unauthorized" });

    // Count orders efficiently
    const count = await orderModel.countDocuments({ "items.createdBy": sellerId });

    res.json({ success: true, count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};


export const getMyOrders = async (req, res) => {
  try {
    if (!req.userId)
      return res.status(401).json({ success: false, message: "Unauthorized" });

    const userId = req.userId;
    const orders = await orderModel.find({ userId }).sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (error) {
    console.error("Error fetching my orders:", error);
    res.status(500).json({ success: false, message: "Failed to fetch orders" });
  }
};