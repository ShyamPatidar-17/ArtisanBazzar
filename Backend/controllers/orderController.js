import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import productModel from "../models/productModel.js";
import { Stripe } from "stripe";
import jwt from "jsonwebtoken";
import { sendMail } from "../utils/sendEmail.js";

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
  if (!imageArray || imageArray.length === 0)
    return "https://via.placeholder.com/80";
  const firstImage = Array.isArray(imageArray) ? imageArray[0] : imageArray;
  if (firstImage.startsWith("http")) return firstImage;
  const base = process.env.BACKEND_URL?.replace(/\/$/, "");
  return `${base}/${firstImage}`;
};


const resolveImage = (imgArr) => {
  if (!imgArr || imgArr.length === 0) return "";

  const img = imgArr[0];

  if (!img) return "";

  // Already a full URL (Cloudinary)
  if (img.startsWith("http")) return img;

  // Local upload
  return `${process.env.BACKEND_URL}/${img}`;
};


// ---------------- Build Items with Product Images ----------------
const buildOrderItems = async (items) => {
  return await Promise.all(
    items.map(async (item) => {
      const product = await productModel
        .findById(item.productId)
        .select("image ownerId");
      const imageUrl = getFullImageUrl(product?.image);
      return {
        name: item.name,
        image: imageUrl ? [imageUrl] : [],
        price: item.price,
        size: item.size,
        color: item.color,
        quantity: item.quantity,
        createdBy: product?.ownerId || item.createdBy,
        status: "Order Placed",
      };
    })
  );
};

// ---------------- Send Order Emails ----------------
const sendOrderEmails = async (order, user) => {
  try {
    // 1️⃣ Email to Customer
    const customerHTML = `
      <h2>Hi ${user.name},</h2>
      <p>Your order has been successfully placed on <b>Artisan Bazzar</b>.</p>
      <p><b>Order ID:</b> ${order._id}</p>
      <ul>
        ${order.items
          .map(
            (i) =>
              `<li>${i.name} - ₹${i.price} × ${i.quantity} = ₹${
                i.price * i.quantity
              }</li>`
          )
          .join("")}
      </ul>
      <p><b>Total:</b> ₹${order.amount}</p>
      <p><b>Payment:</b> ${order.payment ? "Paid ✅" : "Pending ⏳"}</p>
      <p>Status: ${order.status}</p>
      <br/>
      <p>We'll notify you once it's shipped!</p>
      <br/>
      <b>Team Artisan Bazzar 🛍️</b>
    `;

    await sendMail(
      user.email,
      "Order Confirmation - Artisan Bazzar",
      customerHTML
    );

    // 2️⃣ Email to Each Product Owner
    for (const item of order.items) {
      const artisan = await userModel.findById(item.createdBy);
      if (!artisan?.email) {
        console.warn(
          `⚠️ No email found for artisan with ID ${item.createdBy}`
        );
        continue;
      }

      const artisanHTML = `
        <h3>New Order Received!</h3>
        <p>Your product <b>${item.name}</b> has been ordered by <b>${user.name}</b>.</p>
        <p><b>Quantity:</b> ${item.quantity}</p>
        <p><b>Total Order Value:</b> ₹${order.amount}</p>
        <p><b>Payment:</b> ${order.payment ? "Paid ✅" : "Pending ⏳"}</p>
        <br/>
        <p>Login to your dashboard to manage this order.</p>
        <b>Team Artisan Bazzar 🛒</b>
      `;

      const sent = await sendMail(
        artisan.email,
        `New Order for ${item.name} - Artisan Bazzar`,
        artisanHTML
      );

      if (sent) {
        console.log(`✅ Email successfully sent to product owner: ${artisan.email}`);
      } else {
        console.warn(`⚠️ Failed to send email to product owner: ${artisan.email}`);
      }
    }
  } catch (err) {
    console.error("❌ Error sending order emails:", err.message);
  }
};

// ---------------- COD Order ----------------
export const placeOrderCOD = async (req, res) => {
  try {
    const userId = getUserIdFromToken(req);
    const { items, address } = req.body;
    if (!items?.length)
      return res.json({ success: false, message: "Cart is empty" });

    const user = await userModel.findById(userId);
    const enrichedItems = await buildOrderItems(items);
    const totalAmount =
      enrichedItems.reduce((s, i) => s + i.price * i.quantity, 0) +
      deliveryCharges;

    const newOrder = await orderModel.create({
      userId,
      items: enrichedItems,
      amount: totalAmount,
      address,
      paymentMethod: "COD",
      payment: false,
      status: "Order Placed",
    });

    await userModel.findByIdAndUpdate(userId, { cartData: {} });
    await sendOrderEmails(newOrder, user);

    res.json({
      success: true,
      message: "COD Order placed successfully!",
    });
  } catch (error) {
    console.error("❌ COD Order Error:", error);
    res.json({ success: false, message: error.message });
  }
};

// ---------------- Stripe Order ----------------
export const placeOrderStripe = async (req, res) => {
  try {
    const userId = getUserIdFromToken(req);
    const { items, address } = req.body;
    const { origin } = req.headers;
    if (!items?.length)
      return res.json({ success: false, message: "Cart is empty" });

    const user = await userModel.findById(userId);
    const enrichedItems = await buildOrderItems(items);
    const totalAmount =
      enrichedItems.reduce((s, i) => s + i.price * i.quantity, 0) +
      deliveryCharges;

    const newOrder = await orderModel.create({
      userId,
      items: enrichedItems,
      amount: totalAmount,
      address,
      paymentMethod: "Stripe",
      payment: false,
      status: "Order Placed",
    });

    const line_items = enrichedItems.map((i) => ({
      price_data: {
        currency,
        product_data: { name: i.name },
        unit_amount: i.price * 100,
      },
      quantity: i.quantity,
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
    console.error("❌ Stripe Order Error:", error);
    res.json({ success: false, message: error.message });
  }
};

// ---------------- Verify Stripe ----------------
export const verifyStripe = async (req, res) => {
  try {
    const { orderId, success } = req.body;
    const order = await orderModel.findById(orderId);
    if (!order)
      return res.json({ success: false, message: "Order not found" });

    const user = await userModel.findById(order.userId);

    if (success === "true") {
      order.payment = true;
      order.status = "Order Placed";
      await order.save();
      await userModel.findByIdAndUpdate(order.userId, { cartData: {} });

      await sendMail(
        user.email,
        "Payment Successful - Artisian Bazzar",
        `<p>Your payment for order <b>${order._id}</b> was successful.</p>`
      );

      await sendOrderEmails(order, user);
      res.json({ success: true, message: "Payment verified successfully!" });
    } else {
      order.status = "Cancelled";
      await order.save();
      await sendMail(
        user.email,
        "Payment Failed - Artisian Bazzar",
        `<p>Your payment for order <b>${order._id}</b> failed. The order has been cancelled automatically.</p>`
      );
      res.json({ success: false, message: "Payment failed, order cancelled" });
    }
  } catch (error) {
    console.error("❌ Verify Stripe Error:", error);
    res.json({ success: false, message: error.message });
  }
};

// ---------------- Update Item Status ----------------
export const updateOrderItemStatus = async (req, res) => {
  try {
    const { orderId, itemIndex, status } = req.body;
    const validStatuses = ["Order Placed", "Processing", "Shipped", "Delivered", "Cancelled", "Returned", "Replacement"];
    if (!validStatuses.includes(status))
      return res.status(400).json({ success: false, message: "Invalid status" });

    const order = await orderModel.findById(orderId);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    if (!order.items[itemIndex])
      return res.status(400).json({ success: false, message: "Invalid item index" });

    order.items[itemIndex].status = status;
    await order.save();

    const user = await userModel.findById(order.userId);
    if (status === "Cancelled") {
      await sendEmail({
        to: user.email,
        subject: "Order Cancelled - Artisian Bazzar",
        html: `<p>Your order <b>${order._id}</b> has been cancelled successfully.</p>`,
      });
    }

    res.json({ success: true, message: `Item status updated to ${status}`, order });
  } catch (error) {
    console.error("❌ Update Order Item Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ---------------- Count Orders for Seller ----------------
export const countOrders = async (req, res) => {
  try {
    const sellerId = req.userId;
    if (!sellerId)
      return res.status(401).json({ success: false, message: "Unauthorized" });
    const count = await orderModel.countDocuments({ "items.createdBy": sellerId });
    res.json({ success: true, count });
  } catch (err) {
    console.error("❌ Count Orders Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ---------------- User & Seller Orders ----------------
export const userOrders = async (req, res) => {
  try {
    const userId = getUserIdFromToken(req);
    const orders = await orderModel.find({ userId }).sort({ createdAt: -1 });
    const updated = orders.map(o => ({
      ...o.toObject(),
      items: o.items.map(i => ({ ...i.toObject(), image: getFullImageUrl(i.image) })),
    }));
    res.json({ success: true, orders: updated });
  } catch (err) {
    console.error("❌ User Orders Error:", err);
    res.json({ success: false, message: err.message });
  }
};

export const adminOrders = async (req, res) => {
  try {
    const sellerId = req.userId;

    const orders = await orderModel.find({
      "items.createdBy": sellerId
    });

    const updated = orders.map(order => ({
      ...order.toObject(),
      items: order.items.map(item => ({
        ...item.toObject(),
        image: resolveImage(item.image),   
      }))
    }));

    res.json({ success: true, orders: updated });

  } catch (err) {
    console.error("❌ Admin Orders Error:", err);
    res.json({ success: false, message: err.message });
  }
};


export const getMyOrders = async (req, res) => {
  try {
    if (!req.userId)
      return res.status(401).json({ success: false, message: "Unauthorized" });
    const orders = await orderModel.find({ userId: req.userId }).sort({ createdAt: -1 });
    const updated = orders.map(o => ({
      ...o.toObject(),
      items: o.items.map(i => ({ ...i.toObject(), image: getFullImageUrl(i.image) })),
    }));
    res.json({ success: true, orders: updated });
  } catch (error) {
    console.error("❌ Error fetching my orders:", error);
    res.status(500).json({ success: false, message: "Failed to fetch orders" });
  }
};
