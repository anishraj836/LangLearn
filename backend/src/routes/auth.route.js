import express from "express";
const router = express.Router();
import {signup,login,logout,onboard} from "../controllers/auth.controllers.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import User from "../models/User.js";
router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", logout);
router.post("/onboarding",protectRoute ,onboard);

//check if user is logged in or not
router.get("/me", protectRoute, (req,res)=>{
    res.status(200).json({success: true, user: req.user});
})
export default router;