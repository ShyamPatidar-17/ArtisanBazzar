import express from "express";
import { register, login, profile,updateProfile,changePassword,getSellerById, allseller } from "../controllers/userController.js";
import { getDashboardStats } from "../controllers/dashBoardController.js";
import authUser from "../middleware/auth.js";
import adminAuth from "../middleware/adminAuth.js";


const router = express.Router();

// SELLER ROUTES
router.get("/",allseller);
router.post("/register", register("seller"));
router.post("/login", login("seller"));
router.get("/profile", adminAuth, profile);
router.put("/profile/edit", adminAuth, updateProfile);
router.put("/profile/change-password", adminAuth, changePassword);




router.get("/me/:id", getSellerById);

//Stats
router.get("/stats/:id", adminAuth, getDashboardStats);


export default router;
