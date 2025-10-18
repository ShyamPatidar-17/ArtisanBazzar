// middleware/multer.js
import multer from "multer";

// Memory storage avoids writing files to disk (Vercel serverless compatible)
const storage = multer.memoryStorage();

// Accept multiple image fields
export const uploadImages = multer({ storage }).fields([
  { name: "image1", maxCount: 1 },
  { name: "image2", maxCount: 1 },
  { name: "image3", maxCount: 1 },
  { name: "image4", maxCount: 1 },
]);
