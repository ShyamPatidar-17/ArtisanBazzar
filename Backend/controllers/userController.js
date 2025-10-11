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
      res.json({ success: true, token, role, userId: user._id });
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
      const {
        name,
        email,
        password,
        phone,
        address,
        city,
        state,
        postalCode,
        country,
        shopName,
        gstNumber,
      } = req.body;

      if (!["user", "seller"].includes(role)) {
        return res.json({ success: false, message: "Invalid role" });
      }


      const exist = await userModel.findOne({ email });
      if (exist) {
        return res.json({ success: false, message: "Account already exists" });
      }

      if (!validator.isEmail(email)) {
        return res.json({ success: false, message: "Please enter a valid email" });
      }


      if (!password || password.length < 8) {
        return res.json({ success: false, message: "Password must be at least 8 characters long" });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);


      const newUser = new userModel({
        name,
        email,
        password: hashedPassword,
        role,
        phone,
        address,
        city,
        state,
        postalCode,
        country,
        shopName: role === "seller" ? shopName : undefined,
        gstNumber: role === "seller" ? gstNumber : undefined,
      });

      const user = await newUser.save();
      const token = createToken(user._id, role);

      res.json({
        success: true,
        token,
        role,
        userId: user._id,
        message: "Account created successfully",
      });
    } catch (error) {
      console.error(error);
      res.json({ success: false, message: error.message });
    }
  };
};

// ------------------ PROFILE ------------------
const profile = async (req, res) => {

  console.log("Helloo");

  try {
    console.log("Profile request userId:", req.userId);

    const user = await userModel.findById(req.userId);

    console.log(user)

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, user });
  } catch (err) {
    console.error("Profile error:", err.message);
    res.status(500).json({ success: false, message: "Failed to get profile" });
  }
};



const getUserById = async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



const updateProfile = async (req, res) => {
  try {
    const user = await userModel.findById(req.userId);
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    // Destructure all editable fields
    const {
      name,
      phone,
      address,
      city,
      state,
      postalCode,
      country,
      shopName,
      gstNumber,
    } = req.body;

    // Update common fields
    user.name = name || user.name;
    user.phone = phone || user.phone;
    user.address = address || user.address;
    user.city = city || user.city;
    user.state = state || user.state;
    user.postalCode = postalCode || user.postalCode;
    user.country = country || user.country;

    // Update seller-specific fields only for sellers
    if (user.role === "seller") {
      user.shopName = shopName || user.shopName;
      user.gstNumber = gstNumber || user.gstNumber;
    }

    await user.save();

    res.json({ success: true, message: "Profile updated successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};


// ---------------- CHANGE PASSWORD ----------------
const changePassword = async (req, res) => {
  try {
    const user = await userModel.findById(req.userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const { oldPassword, newPassword } = req.body;

    // Check old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.json({ success: false, message: "Old password is incorrect" });

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();
    res.json({ success: true, message: "Password changed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};


// Get Seller by ID
const getSellerById = async (req, res) => {
  try {
    const sellerId = req.params.id;
    const seller = await userModel.findById(sellerId).select("-password"); // exclude password

    if (!seller || seller.role !== "seller") {
      return res.status(404).json({ success: false, message: "Seller not found" });
    }

    res.status(200).json({ success: true, seller });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};


 const allseller = async (req, res) => {
  try {
    const sellers = await userModel
      .find({ role: "seller" })
      .select(
        "_id name email avatar city state country phone address shopName products createdAt updatedAt"
      ); // Only include safe fields

    res.json(sellers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};



export { login, register, profile, getUserById, updateProfile, changePassword, getSellerById,allseller };
