// config/db.js
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("✅ MongoDB connected");
    });

    mongoose.connection.on("error", (err) => {
      console.error("❌ MongoDB connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("⚠️ MongoDB disconnected");
    });

    await mongoose.connect(process.env.MONGODB_URI);
  } catch (error) {
    console.error("❌ Could not connect to MongoDB:", error);
    process.exit(1);
  }
};

export default connectDB;
