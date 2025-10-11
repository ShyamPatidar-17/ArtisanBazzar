import mongoose from "mongoose";
import Message from "../models/messageModel.js";
import userModel from "../models/userModel.js";

// ✅ Send a new message
export const sendMessage = async (req, res) => {
  try {
    const { sender, receiver, content } = req.body;
    const message = await Message.create({ sender, receiver, content });
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get all messages between two users
export const getMessages = async (req, res) => {
  try {
    const { userId, otherId } = req.params;
    const messages = await Message.find({
      $or: [
        { sender: userId, receiver: otherId },
        { sender: otherId, receiver: userId },
      ],
    }).sort({ createdAt: 1 });
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Mark messages as read
export const markAsRead = async (req, res) => {
  try {
    const { sender, receiver } = req.body;
    await Message.updateMany({ sender, receiver, read: false }, { read: true });
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get all unique customers who chatted with a seller + latest message info
export const getCustomerChats = async (req, res) => {
  try {
    const { sellerId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(sellerId)) {
      return res.status(400).json({ error: "Invalid seller ID" });
    }

    const sellerObjectId = new mongoose.Types.ObjectId(sellerId);

    // Get unique customer IDs involved in any chat with the seller
    const customerIdsFromSender = await Message.distinct("sender", {
      receiver: sellerObjectId,
    });
    const customerIdsFromReceiver = await Message.distinct("receiver", {
      sender: sellerObjectId,
    });

    const customerIds = [
      ...new Set([...customerIdsFromSender, ...customerIdsFromReceiver]),
    ].filter((id) => id.toString() !== sellerId);

    // Fetch customer details
    const customers = await userModel
      .find({ _id: { $in: customerIds }, role: "user" })
      .select("name email");

    // For each customer, find last message + unread count
    const enrichedCustomers = await Promise.all(
      customers.map(async (customer) => {
        const lastMessage = await Message.findOne({
          $or: [
            { sender: sellerObjectId, receiver: customer._id },
            { sender: customer._id, receiver: sellerObjectId },
          ],
        })
          .sort({ createdAt: -1 })
          .limit(1)
          .lean();

        const unreadCount = await Message.countDocuments({
          sender: customer._id,
          receiver: sellerObjectId,
          read: false,
        });

        return {
          ...customer.toObject(),
          lastMessage,
          unreadCount,
        };
      })
    );

    return res.status(200).json(enrichedCustomers);
  } catch (err) {
    console.error("getCustomerChats error:", err.message);
    res.status(500).json({ error: err.message });
  }
};
