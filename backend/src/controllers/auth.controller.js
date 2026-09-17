const authService = require("../services/auth.service");
const ApiError = require("../utils/ApiError");

const login = async (req, res) => {
  const { email, password } = req.body;

  if (typeof email !== "string" || typeof password !== "string" || !email.trim() || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const result = await authService.login(email, password);

  res.status(200).json({
    success: true,
    data: result,
  });
};

const getCurrentUser = async (req, res) => {
  const user = await authService.getCurrentUser(req.auth.userId);

  res.status(200).json({
    success: true,
    data: { user },
  });
};

module.exports = { getCurrentUser, login };