import userModel from "../models/userModel.js";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const createToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// ------------------ LOGIN ------------------
const login = (role) => {
  return async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await userModel.findOne({ email, role });

      if (!user) {
        return res.json({ success: false, message: `${role} does not exist` });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.json({ success: false, message: "Invalid Credentials" });
      }

      const token = createToken(user._id, role);
      res.json({ success: true, token, role });
    } catch (error) {
      console.log(error);
      res.json({ success: false, message: error.message });
    }
  };
};

// ------------------ REGISTER ------------------
const register = (role) => {
  return async (req, res) => {
    try {
      const { name, email, password, shopName, gstNumber } = req.body;

      if (!["user", "seller"].includes(role)) {
        return res.json({ success: false, message: "Invalid role" });
      }

      // Email already exists?
      const exist = await userModel.findOne({ email });
      if (exist) {
        return res.json({ success: false, message: "Account already exists" });
      }

      if (!validator.isEmail(email)) {
        return res.json({ success: false, message: "Please enter a valid email" });
      }

      if (password.length < 8) {
        return res.json({ success: false, message: "Please enter a strong password" });
      }

      // Hash Password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = new userModel({
        name,
        email,
        password: hashedPassword,
        role,
        shopName: role === "seller" ? shopName : undefined,
        gstNumber: role === "seller" ? gstNumber : undefined,
      });

      const user = await newUser.save();
      const token = createToken(user._id, role);

      res.json({ success: true, token, role });
    } catch (error) {
      console.log(error);
      res.json({ success: false, message: error.message });
    }
  };
};

// ------------------ PROFILE ------------------
const profile = async (req, res) => {
  try {
    const user = await userModel.findById(req.userId).select("-password");
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
    res.json({ success: true, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to get profile" });
  }
};

export { login, register, profile };
