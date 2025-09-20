import mongoose from "mongoose";

const connectDB = async () => {
  try {
    // Events
    mongoose.connection.on("connected", () => {
      console.log("✅ MongoDB connected");
    });

    mongoose.connection.on("error", (err) => {
      console.error("❌ MongoDB connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("⚠️ MongoDB disconnected");
    });

    // Connect
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

  } catch (error) {
    console.error("❌ Could not connect to MongoDB:", error);
    process.exit(1); // Stop the app if DB connection fails
  }
};

export default connectDB;
