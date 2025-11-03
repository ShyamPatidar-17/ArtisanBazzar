import express from "express";
import { handleChat } from "../controllers/chatbotController.js";

const chatbotRoute = express.Router();

// POST /api/chat
chatbotRoute.post("/", handleChat);

export default chatbotRoute;
