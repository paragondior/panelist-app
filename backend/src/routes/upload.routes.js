const fs = require("fs");
const path = require("path");
const multer = require("multer");
const express = require("express");
const env = require("../config/env");
const { authenticate, requireAdmin } = require("../middleware/auth.middleware");
console.log("🔥 UPLOAD ROUTES LOADED");
const uploadRouter = express.Router();
const uploadDir = path.resolve(__dirname, "../../uploads");
const cloudinary = require("../config/cloudinary")
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

uploadRouter.post(
  "/panelist-image",
  authenticate,
  requireAdmin,
  upload.single("image"),
  async (req, res) => {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image file provided.",
      });
    }

    try {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "panelist-app/panelists",
      });

      fs.unlinkSync(req.file.path);

      return res.status(200).json({
        success: true,
        data: {
          imageUrl: result.secure_url,
        },
      });
    } catch (error) {
     console.error("Cloudinary upload error:", error);
console.error("Cloudinary error message:", error.message);

      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }

      return res.status(500).json({
        success: false,
        message: "Image upload failed.",
      });
    }
  }
);

module.exports = uploadRouter;
