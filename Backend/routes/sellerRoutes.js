import express from "express";
import { register, login, profile } from "../controllers/userController.js";
import authUser from "../middleware/auth.js";

const router = express.Router();

// SELLER ROUTES
router.post("/register", register("seller"));
router.post("/login", login("seller"));
router.get("/profile", authUser, profile);

export default router;
