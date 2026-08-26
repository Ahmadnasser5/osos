// routes/products.js
const express = require("express");
const { db } = require("../db/init");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();
const SUPPORTED_LANGS = ["ar", "en", "ru", "de"];

// Shapes a raw DB row into a localized object for the given language.
// Falls back to English if a localized field is empty, and falls back
// to the common_image if a localized image isn't set.
function localize(row, lang) {
  const l = SUPPORTED_LANGS.includes(lang) ? lang : "en";

  return {
    id: row.id,
    title: row[`title_${l}`] || row.title_en,
    description: row[`description_${l}`] || row.description_en,
    video: row[`video_${l}`] || row.video_en || null,
    image: row[`image_${l}`] || row.common_image || null,
    price: row.price,
    category: row.category,
    created_at: row.created_at,
    updated_at: row.updated_at
  };
}

// Returns the full, un-localized row (all languages) — used by the admin dashboard.
function fullShape(row) {
  return { ...row };
}

// GET /api/products?lang=en&category=bags
router.get("/", (req, res) => {
  const { lang = "en", category } = req.query;

  let rows;
  if (category) {
    rows = db.prepare("SELECT * FROM products WHERE category = ? ORDER BY created_at DESC").all(category);
  } else {
    rows = db.prepare("SELECT * FROM products ORDER BY created_at DESC").all();
  }

  res.json(rows.map((row) => localize(row, lang)));
});

// GET /api/products/:id?lang=en
router.get("/:id", (req, res) => {
  const { lang = "en" } = req.query;
  const row = db.prepare("SELECT * FROM products WHERE id = ?").get(req.params.id);

  if (!row) return res.status(404).json({ error: "Product not found" });
  res.json(localize(row, lang));
});

// ---- Admin-only routes below ----

// GET /api/products/admin/all  (full, un-localized data for editing)
router.get("/admin/all", requireAuth, (req, res) => {
  const rows = db.prepare("SELECT * FROM products ORDER BY created_at DESC").all();
  res.json(rows.map(fullShape));
});

const REQUIRED_FIELDS = ["title_ar", "title_en", "title_ru", "title_de"];
const ALL_FIELDS = [
  "title_ar", "title_en", "title_ru", "title_de",
  "description_ar", "description_en", "description_ru", "description_de",
  "video_ar", "video_en", "video_ru", "video_de",
  "image_ar", "image_en", "image_ru", "image_de",
  "common_image", "price", "category"
];

// POST /api/products  (create)
router.post("/", requireAuth, (req, res) => {
  const body = req.body || {};

  for (const field of REQUIRED_FIELDS) {
    if (!body[field]) {
      return res.status(400).json({ error: `Missing required field: ${field}` });
    }
  }

  const data = {};
  for (const field of ALL_FIELDS) data[field] = body[field] ?? null;
  data.price = Number(data.price) || 0;
  data.category = data.category || "general";

  const columns = ALL_FIELDS.join(", ");
  const placeholders = ALL_FIELDS.map((f) => `@${f}`).join(", ");

  const stmt = db.prepare(`INSERT INTO products (${columns}) VALUES (${placeholders})`);
  const info = stmt.run(data);

  const created = db.prepare("SELECT * FROM products WHERE id = ?").get(info.lastInsertRowid);
  res.status(201).json(created);
});

// PUT /api/products/:id  (update)
router.put("/:id", requireAuth, (req, res) => {
  const existing = db.prepare("SELECT * FROM products WHERE id = ?").get(req.params.id);
  if (!existing) return res.status(404).json({ error: "Product not found" });

  const body = req.body || {};
  const data = {};
  for (const field of ALL_FIELDS) {
    data[field] = body[field] !== undefined ? body[field] : existing[field];
  }
  data.price = Number(data.price) || 0;
  data.id = req.params.id;

  const setClause = ALL_FIELDS.map((f) => `${f} = @${f}`).join(", ");
  db.prepare(`UPDATE products SET ${setClause}, updated_at = datetime('now') WHERE id = @id`).run(data);

  const updated = db.prepare("SELECT * FROM products WHERE id = ?").get(req.params.id);
  res.json(updated);
});

// DELETE /api/products/:id
router.delete("/:id", requireAuth, (req, res) => {
  const info = db.prepare("DELETE FROM products WHERE id = ?").run(req.params.id);
  if (info.changes === 0) return res.status(404).json({ error: "Product not found" });
  res.json({ success: true });
});

module.exports = router;
