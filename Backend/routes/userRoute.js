import express from "express";
import { register, login, profile,getUserById,updateProfile,changePassword } from "../controllers/userController.js";
import authUser from "../middleware/auth.js";
import adminAuth from "../middleware/adminAuth.js"

const router = express.Router();


//Find user


// USER ROUTES
router.post("/register", register("user"));
router.post("/login", login("user"));
router.get("/profile", authUser(), profile);
router.put("/profile/edit", authUser(), updateProfile);
router.put("/profile/change-password", authUser(), changePassword);



//--------------------------
router.get("/profile/:id",authUser(),getUserById)


export default router;
