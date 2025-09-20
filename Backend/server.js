import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import path from 'path';
import { fileURLToPath } from 'url';

import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';

import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoutes.js';
import userRouter from './routes/userRoute.js';
import sellerRouter from './routes/sellerRoutes.js';

const app = express();
const port = process.env.PORT || 4000;

// Get __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

connectDB();
connectCloudinary();

const allowedOrigins = ['http://localhost:5174', 'http://localhost:5173'];
app.use(cors({ origin: allowedOrigins, credentials: true }));

app.use(express.json());

// ✅ Serve uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Base route
app.get('/', (req, res) => {
  res.send('Home ROUTE');
});

// Mount routes
app.use('/api/users', userRouter);
app.use('/api/products', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);
app.use('/api/sellers', sellerRouter);

app.listen(port, () => {
  console.log(`✅ Backend running on http://localhost:${port}`);
});
