const fs = require("fs");
const path = require("path");
const cors = require("cors");
const express = require("express");
const env = require("./config/env");
const { errorHandler, notFoundHandler } = require("./middleware/error.middleware");
const authRoutes = require("./routes/auth.routes");
const panelistRoutes = require("./routes/panelist.routes");
const publicSessionRoutes = require("./routes/public-session.routes");
const sessionRoutes = require("./routes/session.routes");
const uploadRoutes = require("./routes/upload.routes");

const app = express();
const uploadsDir = path.resolve(__dirname, "../uploads");

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use(
  cors({
    origin: env.frontendUrl,
  }),
);
app.use(express.json());
app.use("/uploads", express.static(uploadsDir));

app.use("/api/auth", authRoutes);
app.use("/api/panelists", panelistRoutes);
app.use("/api/public/sessions", publicSessionRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/uploads", uploadRoutes);

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