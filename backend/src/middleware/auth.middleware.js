const jwt = require("jsonwebtoken");
const env = require("../config/env");
const ApiError = require("../utils/ApiError");

const authenticate = (req, res, next) => {
  const authorization = req.get("Authorization");

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return next(new ApiError(401, "Authentication required"));
  }

  const token = authorization.slice(7).trim();

  if (!token) {
    return next(new ApiError(401, "Authentication required"));
  }

  try {
    req.auth = jwt.verify(token, env.jwtSecret);
    return next();
  } catch (error) {
    return next(new ApiError(401, "Invalid or expired token"));
  }
};

const requireAdmin = (req, res, next) => {
  if (!req.auth || req.auth.role !== "admin") {
    return next(new ApiError(403, "Administrator access required"));
  }

  return next();
};

module.exports = { authenticate, requireAdmin };