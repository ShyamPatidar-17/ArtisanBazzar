import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

// ✅ This actually checks SELLER authentication
const adminAuth = async (req, res, next) => {
  try {
    // 1️⃣ Get the token from the Authorization header
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, login required",
      });
    }

    const token = authHeader.split(" ")[1];

    // 2️⃣ Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3️⃣ Find the seller in DB
    const seller = await userModel.findById(decoded.id);

    if (!seller || seller.role !== "seller") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only sellers can access this route.",
      });
    }

    // 4️⃣ Attach seller info to req
    req.userId = seller._id;
    req.role = seller.role;

    next(); // ✅ Continue to the route
  } catch (err) {
    console.error("Seller Auth Error:", err.message);
    res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

export default adminAuth;
