import express from "express";
import { register, login, profile } from "../controllers/userController.js";
import authUser from "../middleware/auth.js";

const router = express.Router();

// USER ROUTES
router.post("/register", register("user"));
router.post("/login", login("user"));
router.get("/profile", authUser, profile);

// SELLER ROUTES
router.post("/sellers/register", register("seller"));
router.post("/sellers/login", login("seller"));
router.get("/sellers/profile", authUser, profile);

export default router;
