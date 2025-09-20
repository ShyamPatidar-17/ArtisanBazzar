// controllers/productController.js
import productModel from "../models/productModel.js";
import { v2 as cloudinary } from "cloudinary";

// ✅ ADD PRODUCT
const addProduct = async (req, res) => {
  try {
    const { name, price, description, sizes, bestseller, category, subCategory } = req.body;

    if (!name || !price || !description || !sizes || !category || !subCategory) {
      return res.json({ success: false, message: "Please fill all required fields" });
    }

    const parsedSizes = JSON.parse(sizes);

    // ✅ Collect uploaded files
    const files = [
      ...(req.files?.image1 || []),
      ...(req.files?.image2 || []),
      ...(req.files?.image3 || []),
      ...(req.files?.image4 || []),
    ];

    // ✅ Upload to Cloudinary
    const imagesUrl = await Promise.all(
      files.map((file) =>
        cloudinary.uploader.upload(file.path, { resource_type: "image" })
          .then((res) => res.secure_url)
      )
    );

    // ✅ Save product
    const product = new productModel({
      name,
      description,
      price: Number(price),
      sizes: parsedSizes,
      category,
      subCategory,
      bestseller: String(bestseller).toLowerCase() === "true",
      image: imagesUrl,
    });

    await product.save();
    res.json({ success: true, message: "Product added successfully", product });
  } catch (error) {
    console.error("Add Product Error:", error);
    res.json({ success: false, message: error.message });
  }
};

// ✅ LIST PRODUCTS
const listProduct = async (req, res) => {
  try {
    const products = await productModel.find({});
    res.json({ success: true, products });
  } catch (error) {
    res.json({ success: false, message: "Failed to fetch products" });
  }
};

// ✅ REMOVE PRODUCT
const removeProduct = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) return res.json({ success: false, message: "Product ID missing" });

    await productModel.findByIdAndDelete(id);
    res.json({ success: true, message: "Product removed successfully" });
  } catch (error) {
    res.json({ success: false, message: "Failed to remove product" });
  }
};

// ✅ SINGLE PRODUCT
const singleProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productModel.findById(id);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });
    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch product" });
  }
};

// ✅ EDIT PRODUCT
const editProduct = async (req, res) => {
  try {
    const { id } = req.params;
    let {
      name,
      price,
      description,
      sizes,
      colors,
      bestseller,
      featured,
      category,
      subCategory,
      discountPrice,
      material,
      region,
      stock,
      artisan,
    } = req.body;

    // ✅ Parse arrays
    if (sizes) sizes = typeof sizes === "string" ? JSON.parse(sizes) : sizes;
    if (colors) colors = typeof colors === "string" ? JSON.parse(colors) : colors;

    // ✅ Collect new images if provided
    const files = [
      ...(req.files?.image1 || []),
      ...(req.files?.image2 || []),
      ...(req.files?.image3 || []),
      ...(req.files?.image4 || []),
    ];

    let imageUrls = [];
    if (files.length > 0) {
      imageUrls = await Promise.all(
        files.map((file) =>
          cloudinary.uploader.upload(file.path, { resource_type: "image" })
            .then((res) => res.secure_url)
        )
      );
    }

    // Build updated fields
    const updatedFields = {
      name,
      price: Number(price),
      description,
      sizes,
      colors,
      bestseller: String(bestseller).toLowerCase() === "true",
      featured: String(featured).toLowerCase() === "true",
      category,
      subCategory,
      discountPrice: discountPrice ? Number(discountPrice) : undefined,
      material,
      region,
      stock: stock ? Number(stock) : 0,
      artisan,
    };

    if (imageUrls.length > 0) {
      updatedFields.image = imageUrls; // replace only if new images uploaded
    }

    // Remove undefined fields so they don’t overwrite existing ones
    Object.keys(updatedFields).forEach(
      (key) => updatedFields[key] === undefined && delete updatedFields[key]
    );

    const updatedProduct = await productModel.findByIdAndUpdate(
      id,
      { $set: updatedFields },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.json({ success: true, message: "Product updated successfully", product: updatedProduct });
  } catch (error) {
    console.error("Edit Product Error:", error);
    res.status(500).json({ success: false, message: "Failed to edit product" });
  }
};



// PRODUCT BY NAME (category slug)
const productByName = async (req, res) => {
  try {
    const { slug } = req.params;
    const products = await productModel.find({ category: new RegExp(slug, "i") });
    res.json({ success: true, products });
  } catch (error) {
    console.error("Product By Name Error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch products" });
  }
};

export { addProduct, listProduct, removeProduct, singleProduct, editProduct, productByName };
