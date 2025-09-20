import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    email: { type: String, required: true, unique: true },

    password: { type: String, required: true },

    role: { 
      type: String, 
      enum: ["user", "seller"], 
      default: "user" 
    }, // role to differentiate

    cartData: { type: Object, default: {} }, 

    
    shopName: { type: String },
    gstNumber: { type: String },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }], 
  },
  { minimize: false, timestamps: true }
);

const userModel =
  mongoose.models.User || mongoose.model("User", userSchema);

export default userModel;
