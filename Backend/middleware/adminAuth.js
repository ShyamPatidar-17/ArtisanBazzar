import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js"; 

const adminAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, login again",
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const seller = await userModel.findById(decoded.id);

    if (!seller || seller.role !== "seller") {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    req.user = seller; // attach seller info to request
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

export default adminAuth;
