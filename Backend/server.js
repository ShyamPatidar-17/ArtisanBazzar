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


const app = express();
const port = process.env.PORT || 4000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Connect DB + Cloudinary
connectDB();
connectCloudinary();

// ✅ Setup CORS
const allowedOrigins = ['https://artisan-tawny.vercel.app', 'https://artisanadmin.vercel.app','http://localhost:5174','http://localhost:5173'];
app.use(cors({ origin: allowedOrigins, credentials: true }));

app.use(express.json());

// ✅ Serve uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/uploads', express.static('uploads'));

app.get('/', (req, res) => res.send('Home ROUTE'));

// ✅ Mount routes
app.use('/api/users', userRouter);
app.use('/api/products', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);
app.use('/api/sellers', sellerRouter);
app.use('/api/review', reviewRouter);
app.use('/api/messages', messageRouter);
app.use('/api/recommendations', recRoute);


const server = http.createServer(app);


const io = new Server(server, {
  cors: { origin: allowedOrigins, credentials: true },
});

io.on("connection", (socket) => {
  console.log("User connected: " + socket.id);


  socket.on("joinRoom", (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their room`);
  });

  
  socket.on("sendMessage", ({ sender, receiver, content }) => {
   
    io.to(receiver).emit("receiveMessage", { sender, content });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected: " + socket.id);
  });
});

// ✅ Start server
server.listen(port, () => console.log(`✅ Backend + Socket.IO running on http://localhost:${port}`));
