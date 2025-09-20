import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },                // Product name
  description: { type: String, required: true },         // Detailed description
  price: { type: Number, required: true },               // Price in INR (₹)
  discountPrice: { type: Number },                       // Optional discount price
  image: { type: [String], required: true },             // Array of image URLs
  category: { type: String, required: true },            // Example: Pottery, Handloom, Jewelry
  subCategory: { type: String },                         // Example: Terracotta, Saree, Brass
  material: { type: String },                            // Clay, Cotton, Silk, Wood, etc.
  region: { type: String },                              // Rajasthan, Gujarat, Madhya Pradesh, etc.
  sizes: { type: [String] },                             // S, M, L, XL (for textiles/clothing)
  colors: { type: [String] },                            // Available colors
  stock: { type: Number, default: 0 },                   // Inventory count
  bestseller: { type: Boolean, default: false },         // Flag for popular products
  artisan: { type: String },                             // Artisan name or ID (to link with artisan collection later)
  createdAt: { type: Date, default: Date.now },          // Auto timestamp
  updatedAt: { type: Date, default: Date.now },          // Auto update timestamp
}, { timestamps: true }); // adds createdAt & updatedAt automatically

// Fix: Correct mongoose.model usage
const productModel = mongoose.models.Product || mongoose.model("Product", productSchema);

export default productModel;
