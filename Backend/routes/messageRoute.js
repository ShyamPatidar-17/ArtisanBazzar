import express from "express";
import adminAuth from "../middleware/adminAuth.js"
import {
  sendMessage,
  getMessages,
  markAsRead,
  getCustomerChats,
} from "../controllers/messageController.js";

const router = express.Router();
router.get("/customers/:sellerId", getCustomerChats);
router.post("/", sendMessage);
router.get("/:userId/:otherId", getMessages);
router.post("/read", markAsRead);


export default router;
