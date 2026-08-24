import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import { config } from "./config/env.js";
import { connectDB } from "./lib/db.js";
import { seedDatabase } from "./lib/seed.js";
import { app, server } from "./lib/socket.js";
import { errorHandler } from "./middleware/error.middleware.js";

import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import chatRoutes from "./routes/chat.route.js";
import healthRoutes from "./routes/health.route.js";

const __dirname = path.resolve();

app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: { success: false, message: "Too many requests from this IP, please try again later." },
});
app.use("/api/", apiLimiter);

app.use(
  cors({
    origin: config.corsOrigin,
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);

if (config.nodeEnv === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend/dist", "index.html"));
  });
}

app.use(errorHandler);

const PORT = config.port;

server.listen(PORT, async () => {
  console.log(`🚀 LangLearn Server running on port ${PORT}`);
  await connectDB();
  await seedDatabase();
});