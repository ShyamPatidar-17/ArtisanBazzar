import { GoogleGenerativeAI } from "@google/generative-ai";
import productModel from "../models/productModel.js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "models/gemini-2.5-flash" });

export const handleChat = async (req, res) => {
  try {
    const { message, context, language = "en" } = req.body;
    if (!message) return res.status(400).json({ error: "Message is required" });

    
    const products = await productModel
      .find({ name: { $regex: message, $options: "i" } })
      .limit(3);

    const prompt = `
You are an AI assistant for "Artisan Bazaar", an online marketplace for handmade crafts.
Language: ${language === "hi" ? "Hindi" : "English"}
Context: ${JSON.stringify(context)}
User message: ${message}
Suggested products: ${products.map(p => p.name).join(", ")}
Respond in a friendly, helpful tone with emojis.
`;

    const result = await model.generateContent(prompt);
    const reply = result.response.text();

    res.json({ reply, products });
  } catch (err) {
    console.error("Chatbot error:", err);
    res.status(500).json({ error: "Failed to get response from AI" });
  }
};
