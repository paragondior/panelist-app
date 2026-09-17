const dotenv = require("dotenv");

dotenv.config();

const env = {
  port: Number(process.env.PORT) || 5000,
  nodeEnv: process.env.NODE_ENV || "development",
  mongodbUri: process.env.MONGODB_URI,
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:5173",
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1d",
};

if (!env.mongodbUri) {
  throw new Error("MONGODB_URI is not configured");
}

if (!env.jwtSecret) {
  throw new Error("JWT_SECRET is not configured");
}

module.exports = env;