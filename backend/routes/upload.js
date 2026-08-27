// routes/upload.js
// Handles local image uploads. Files are saved to backend/uploads/ and
// served statically at /uploads/<filename> (see server.js). No cloud
// storage, no API keys — just the local disk.

const path = require("path");
const crypto = require("crypto");
const express = require("express");
const multer = require("multer");

const router = express.Router();

const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(__dirname, "..", "uploads");
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || ".jpg";
    const unique = crypto.randomBytes(8).toString("hex");
    cb(null, `${Date.now()}-${unique}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    if (!ALLOWED_TYPES.has(file.mimetype)) {
      return cb(new Error("Only JPEG, PNG, WEBP, or GIF images are allowed"));
    }
    cb(null, true);
  }
});

// POST /api/upload  (field name: "image")
router.post("/", (req, res) => {
  upload.single("image")(req, res, (err) => {
    if (err) return res.status(400).json({ error: err.message });
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    // Public URL the frontend can store directly in image_* / common_image fields.
    const url = `/uploads/${req.file.filename}`;
    res.status(201).json({ url });
  });
});

module.exports = router;
