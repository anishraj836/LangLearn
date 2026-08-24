import "dotenv/config";

export const config = {
  port: process.env.PORT || 5001,
  mongoUri: process.env.MONGO_URI || "mongodb://localhost:27017/langlearn",
  jwtSecret: process.env.JWT_SECRET_KEY || "fallback_super_secret_jwt_key_langlearn_2026",
  geminiApiKey: process.env.GEMINI_API_KEY || "",
  nodeEnv: process.env.NODE_ENV || "development",
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:5173",
};

// Simple boot validation
if (!config.jwtSecret) {
  console.warn("⚠️ Warning: JWT_SECRET_KEY is not set. Using default development secret.");
}
if (!config.geminiApiKey) {
  console.warn("ℹ️ Notice: GEMINI_API_KEY is missing. AI Tutor will run in High-Fidelity Mock Mode.");
}
