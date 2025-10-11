import express from "express";
import {
  listProduct,
  addProduct,
  removeProduct,
  singleProduct,
  editProduct,
  reduceStock,
  getMyProducts,
  productByCategory,
} from "../controllers/productController.js";
import { uploadImages } from "../middleware/multer.js";
import adminAuth from "../middleware/adminAuth.js";

const productRouter = express.Router();

productRouter.post("/add", adminAuth, uploadImages, addProduct);
productRouter.post("/remove", adminAuth, removeProduct);
productRouter.get("/single/:id", singleProduct);   
productRouter.get("/list",listProduct);
productRouter.put("/edit/:id", adminAuth, uploadImages, editProduct);
productRouter.get("/category/:category", productByCategory);
productRouter.get("/my-products", adminAuth, getMyProducts);
productRouter.patch("/reduce-stock/:id", reduceStock);




export default productRouter;
