import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { config } from "../config/env.js";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies?.jwt;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized - No token provided" });
    }

    const jwtSecret = process.env.JWT_SECRET_KEY || config.jwtSecret;
    const decoded = jwt.verify(token, jwtSecret);
    if (!decoded || !decoded.userId) {
      return res.status(401).json({ message: "Unauthorized - Invalid token" });
    }

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(401).json({ message: "Unauthorized - User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Error in protectRoute middleware:", error.message);
    res.status(401).json({ message: "Unauthorized - Invalid or expired session token" });
  }
};