const cors = require("cors");
const express = require("express");
const env = require("./config/env");
const { errorHandler, notFoundHandler } = require("./middleware/error.middleware");

const app = express();

app.use(
  cors({
    origin: env.frontendUrl,
  }),
);
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Backend is running",
    environment: env.nodeEnv,
  });
});

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;