const fs = require("fs");
const path = require("path");
const multer = require("multer");
const express = require("express");
const env = require("../config/env");
const { authenticate, requireAdmin } = require("../middleware/auth.middleware");

const uploadRouter = express.Router();
const uploadDir = path.resolve(__dirname, "../../uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_, __, callback) => callback(null, uploadDir),
  filename: (_, file, callback) => {
    const safe = file.originalname.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9_.-]/g, "");
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}-${safe}`;
    callback(null, unique);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_, file, callback) => {
    if (file.mimetype.startsWith("image/")) {
      callback(null, true);
      return;
    }

    callback(new Error("Only image files are allowed."));
  },
});

uploadRouter.post("/panelist-image", authenticate, requireAdmin, upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "No image file provided." });
  }

  const imageUrl = `${env.backendUrl}/uploads/${req.file.filename}`;

  return res.status(200).json({
    success: true,
    data: { imageUrl },
  });
});

module.exports = uploadRouter;
