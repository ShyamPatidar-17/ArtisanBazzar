import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // Basic info
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "seller"], default: "user" },

    // Contact info
    phone: { type: String },
    address: { type: String },
    city: { type: String },
    state: { type: String },
    postalCode: { type: String },
    country: { type: String },

    // Seller-specific info
    shopName: { type: String },
    gstNumber: { type: String },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
   
    // Cart data
    cartData: { type: Object, default: {} },

  },
  { minimize: false, timestamps: true }
);


const userModel = mongoose.models.User || mongoose.model("User", userSchema);

export default userModel;
