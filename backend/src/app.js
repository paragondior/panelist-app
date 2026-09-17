const cors = require("cors");
const express = require("express");
const env = require("./config/env");
const { errorHandler, notFoundHandler } = require("./middleware/error.middleware");
const authRoutes = require("./routes/auth.routes");
const panelistRoutes = require("./routes/panelist.routes");
const sessionRoutes = require("./routes/session.routes");

const app = express();

app.use(
  cors({
    origin: env.frontendUrl,
  }),
);
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/panelists", panelistRoutes);
app.use("/api/sessions", sessionRoutes);

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