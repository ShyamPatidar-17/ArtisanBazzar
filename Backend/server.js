import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import path from 'path';
import { fileURLToPath } from 'url';

import http from "http";
import { Server } from "socket.io";

import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';

import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoutes.js';
import userRouter from './routes/userRoute.js';
import sellerRouter from './routes/sellerRoutes.js';
import reviewRouter from './routes/reviewRoute.js';
import messageRouter from './routes/messageRoute.js';
import recRoute from './routes/recommendations.js';
import chatbotRoute from './routes/chatbotRoute.js';

const app = express();
const port = process.env.PORT || 4000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// DB + Cloudinary
connectDB();
connectCloudinary();

// ----------- CORS FIX ------------
const allowedOrigins = [
  "https://artisanbazzar.vercel.app",
  "https://artisanadmin.vercel.app",
  "http://localhost:5173",
  "http://localhost:5174",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin) || !origin) {
        callback(null, true);
      } else {
        console.log("❌ Blocked by CORS:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: "Content-Type,Authorization",
  })
);

// Preflight Handler
app.options("*", cors());

// ---------------------------------

app.use(express.json());

// Serve uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Test route
app.get('/', (req, res) => res.send('Home ROUTE'));

// ---------- ROUTES ----------
app.use('/api/users', userRouter);
app.use('/api/products', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);
app.use('/api/sellers', sellerRouter);
app.use('/api/review', reviewRouter);
app.use('/api/messages', messageRouter);
app.use('/api/recommendations', recRoute);
app.use('/api/chat', chatbotRoute);

// ---------- SOCKET.IO ----------
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true
  }
});

io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("joinRoom", (userId) => {
        socket.join(userId);
        console.log(`User ${userId} joined room`);
    });

    socket.on("sendMessage", ({ sender, receiver, content }) => {
        io.to(receiver).emit("receiveMessage", { sender, content });
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

// ------------- ERROR HANDLER (Important for CORS) -------------
app.use((err, req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  console.error("🔥 Server Error:", err.message);
  res.status(500).json({ error: err.message });
});

// ------------ START SERVER ------------
server.listen(port, () =>
  console.log(`✅ Backend + Socket.IO running on port ${port}`)
);

console.log("Server ready");
