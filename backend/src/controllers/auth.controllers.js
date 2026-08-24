import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { config } from "../config/env.js";

export const signup = asyncHandler(async (req, res) => {
  const { email, password, fullName } = req.body;

  if (!email || !password || !fullName) {
    throw ApiError.badRequest("All fields (fullName, email, password) are required.");
  }
  if (password.length < 6) {
    throw ApiError.badRequest("Password must be at least 6 characters long.");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw ApiError.badRequest("Invalid email format.");
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw ApiError.badRequest("Email already registered. Please login.");
  }

  const idx = Math.floor(Math.random() * 100) + 1;
  const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;

  const newUser = await User.create({
    email,
    fullName,
    password,
    profilePic: randomAvatar,
  });

  const token = jwt.sign({ userId: newUser._id }, config.jwtSecret, {
    expiresIn: "7d",
  });

  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "strict",
    secure: config.nodeEnv === "production",
  });

  res.status(201).json({ success: true, user: newUser });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw ApiError.badRequest("Email and password are required.");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw ApiError.unauthorized("Invalid Email or Password.");
  }

  const isPasswordCorrect = await user.matchPassword(password);
  if (!isPasswordCorrect) {
    throw ApiError.unauthorized("Invalid Email or Password.");
  }

  const token = jwt.sign({ userId: user._id }, config.jwtSecret, {
    expiresIn: "7d",
  });

  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "strict",
    secure: config.nodeEnv === "production",
  });

  res.status(200).json({ success: true, user });
});

export const demoLogin = asyncHandler(async (req, res) => {
  let demoUser = await User.findOne({ email: "demo@langlearn.ai" });

  if (!demoUser) {
    const hashedPassword = await bcrypt.hash("demo1234", 10);
    demoUser = await User.create({
      fullName: "Alex Rivera",
      email: "demo@langlearn.ai",
      password: hashedPassword,
      profilePic: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&auto=format&fit=crop&q=80",
      bio: "Avid language enthusiast practicing Spanish & French!",
      location: "San Francisco, USA",
      nativeLanguage: "English",
      learningLanguage: "Spanish",
      interests: ["Tech", "Books", "Travel", "Cooking"],
      fluencyScore: 75,
      completedQuestsCount: 2,
      isMatchmakingUnlocked: true,
      isOnboarded: true,
    });
  }

  const token = jwt.sign({ userId: demoUser._id }, config.jwtSecret, {
    expiresIn: "7d",
  });

  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "strict",
    secure: config.nodeEnv === "production",
  });

  res.status(200).json({ success: true, user: demoUser });
});

export const logout = asyncHandler(async (req, res) => {
  res.clearCookie("jwt");
  res.status(200).json({ success: true, message: "Logout successful." });
});

export const onboard = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { fullName, bio, nativeLanguage, learningLanguage, location, interests } = req.body;

  if (!fullName || !bio || !nativeLanguage || !learningLanguage || !location) {
    throw ApiError.badRequest("All profile onboarding fields are required.");
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    {
      ...req.body,
      interests: interests || ["Tech", "Travel", "Culture"],
      isOnboarded: true,
    },
    { new: true }
  );

  if (!updatedUser) {
    throw ApiError.notFound("User not found.");
  }

  res.status(200).json({ success: true, user: updatedUser });
});