// db/init.js
// Creates database.db (if missing), builds schema, and seeds an admin user
// plus a couple of demo products. Safe to run multiple times (idempotent).

const path = require("path");
const bcrypt = require("bcryptjs");
const Database = require("better-sqlite3");

// DB_DIR lets you point the database at a mounted persistent disk in
// production (e.g. Render disks), instead of the ephemeral local folder.
// Defaults to the backend project root, same as before.
const DB_DIR = process.env.DB_DIR || path.join(__dirname, "..");
const DB_PATH = path.join(DB_DIR, "database.db");
const db = new Database(DB_PATH);

db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

function createSchema() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS admins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,

      -- Localized titles
      title_ar TEXT NOT NULL,
      title_en TEXT NOT NULL,
      title_ru TEXT NOT NULL,
      title_de TEXT NOT NULL,

      -- Localized descriptions
      description_ar TEXT,
      description_en TEXT,
      description_ru TEXT,
      description_de TEXT,

      -- Localized embed video URLs (YouTube or Instagram)
      video_ar TEXT,
      video_en TEXT,
      video_ru TEXT,
      video_de TEXT,

      -- Localized image URLs (fallback if common_image is empty)
      image_ar TEXT,
      image_en TEXT,
      image_ru TEXT,
      image_de TEXT,

      -- Common image used across all languages unless overridden above
      common_image TEXT,

      price REAL DEFAULT 0,
      category TEXT DEFAULT 'general',

      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );
  `);
}

function seedAdmin() {
  const username = process.env.ADMIN_USERNAME || "admin";
  const password = process.env.ADMIN_PASSWORD || "admin123";

  const existing = db.prepare("SELECT id FROM admins WHERE username = ?").get(username);
  if (!existing) {
    const hash = bcrypt.hashSync(password, 10);
    db.prepare("INSERT INTO admins (username, password_hash) VALUES (?, ?)").run(username, hash);
    console.log(`✔ Admin user created -> username: "${username}" password: "${password}"`);
  } else {
    console.log(`✔ Admin user "${username}" already exists`);
  }
}

function seedProducts() {
  const count = db.prepare("SELECT COUNT(*) AS c FROM products").get().c;
  if (count > 0) {
    console.log(`✔ Products table already has ${count} row(s), skipping seed`);
    return;
  }

  const insert = db.prepare(`
    INSERT INTO products (
      title_ar, title_en, title_ru, title_de,
      description_ar, description_en, description_ru, description_de,
      video_ar, video_en, video_ru, video_de,
      image_ar, image_en, image_ru, image_de,
      common_image, price, category
    ) VALUES (
      @title_ar, @title_en, @title_ru, @title_de,
      @description_ar, @description_en, @description_ru, @description_de,
      @video_ar, @video_en, @video_ru, @video_de,
      @image_ar, @image_en, @image_ru, @image_de,
      @common_image, @price, @category
    )
  `);

  const demo = [
    {
      title_ar: "ساعة يد فاخرة",
      title_en: "Luxury Wrist Watch",
      title_ru: "Роскошные наручные часы",
      title_de: "Luxus-Armbanduhr",
      description_ar: "ساعة أنيقة مصنوعة من الفولاذ المقاوم للصدأ.",
      description_en: "An elegant watch crafted from stainless steel.",
      description_ru: "Элегантные часы из нержавеющей стали.",
      description_de: "Eine elegante Uhr aus rostfreiem Stahl.",
      video_ar: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      video_en: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      video_ru: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      video_de: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      image_ar: null,
      image_en: null,
      image_ru: null,
      image_de: null,
      common_image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800",
      price: 129.99,
      category: "accessories"
    },
    {
      title_ar: "حقيبة جلدية",
      title_en: "Leather Handbag",
      title_ru: "Кожаная сумка",
      title_de: "Ledertasche",
      description_ar: "حقيبة يد جلدية عالية الجودة تناسب كل المناسبات.",
      description_en: "High-quality leather handbag suitable for every occasion.",
      description_ru: "Высококачественная кожаная сумка на любой случай.",
      description_de: "Hochwertige Ledertasche für jeden Anlass.",
      video_ar: "https://www.instagram.com/reel/CxampleReel/",
      video_en: "https://www.instagram.com/reel/CxampleReel/",
      video_ru: "https://www.instagram.com/reel/CxampleReel/",
      video_de: "https://www.instagram.com/reel/CxampleReel/",
      image_ar: null,
      image_en: null,
      image_ru: null,
      image_de: null,
      common_image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800",
      price: 79.5,
      category: "bags"
    }
  ];

  const insertMany = db.transaction((rows) => {
    for (const row of rows) insert.run(row);
  });
  insertMany(demo);

  console.log(`✔ Seeded ${demo.length} demo products`);
}

function init() {
  createSchema();
  seedAdmin();
  seedProducts();
  console.log(`✔ Database ready at ${DB_PATH}`);
}

// Run directly: `node db/init.js`
if (require.main === module) {
  require("dotenv").config({ path: path.join(__dirname, "..", ".env") });
  init();
  db.close();
}

module.exports = { db, init, DB_PATH };
