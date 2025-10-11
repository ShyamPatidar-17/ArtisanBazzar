import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  discountPrice: { type: Number },
  image: { type: [String], required: true },
  category: { type: String, required: true },
  subCategory: { type: String },
  material: { type: String },
  region: { type: String },
  sizes: { type: [String] },
  colors: { type: [String] },
  stock: { type: Number, default: 0 },
  bestseller: { type: Boolean, default: false },
  artisan: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // admin/creator
  
}, { timestamps: true });
// Fix: Correct mongoose.model usage
const productModel = mongoose.models.Product || mongoose.model("Product", productSchema);

export default productModel;
