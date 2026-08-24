import mongoose from "mongoose";
import { config } from "../config/env.js";

export const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || process.env.URI || config.mongoUri || "mongodb://localhost:27017/langlearn";
    const con = await mongoose.connect(mongoUri);
    console.log(`🍃 MongoDB Connected: ${con.connection.host}`);
  } catch (error) {
    console.warn("⚠️ Note on MongoDB connection:", error.message);
    console.warn("Server will continue running. (If local MongoDB is offline, database queries will retry)");
  }
};