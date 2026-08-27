// server.js
require("dotenv").config();
const path = require("path");
const fs = require("fs");
const express = require("express");
const cors = require("cors");

const { init } = require("./db/init");
const productRoutes = require("./routes/products");
const authRoutes = require("./routes/auth");
const uploadRoutes = require("./routes/upload");

// Ensure database.db exists, schema is created, and admin/demo data seeded.
init();

// Ensure the local uploads folder exists.
const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(__dirname, "uploads");
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const app = express();

const allowedOrigins = (process.env.FRONTEND_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // السماح بطلبات النظام المحلي، الدومينات المحددة، وأي فرونت إند مرفوع على vercel.app
      if (!origin || allowedOrigins.includes(origin) || /\.vercel\.app$/.test(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS blocked for origin: ${origin}`));
      }
    }
  })
);

app.use(express.json());

// Serve uploaded images publicly, e.g. http://localhost:5000/uploads/xyz.jpg
app.use("/uploads", express.static(UPLOAD_DIR));

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);

// Basic error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Backend running at http://localhost:${PORT}`);
});
