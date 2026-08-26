# Multi-Language Product Showcase

A 100% free, zero-config full-stack app:
- **Frontend:** React (Vite) + Tailwind CSS
- **Backend:** Node.js + Express
- **Database:** SQLite (`better-sqlite3`, local file `backend/database.db` — no DB server needed)
- **Languages:** Arabic (RTL), English, Russian, German
- **Client site:** product grid, detail modal, YouTube/Instagram embeds, smart WhatsApp/Telegram contact button
- **Admin dashboard:** JWT login, full CRUD for localized products, direct image upload (files saved locally to `backend/uploads/`, no cloud storage needed)

## Directory Structure

```
product-showcase/
├── backend/
│   ├── db/
│   │   └── init.js            # schema creation + seed (admin user + demo products)
│   ├── middleware/
│   │   └── auth.js            # JWT verification middleware
│   ├── routes/
│   │   ├── auth.js            # POST /api/auth/login, GET /api/auth/me
│   │   ├── products.js        # public + admin product endpoints
│   │   └── upload.js          # POST /api/upload — saves image files locally
│   ├── uploads/                # uploaded product images land here (served at /uploads/*)
│   ├── .env.example
│   ├── package.json
│   ├── server.js              # Express entry point
│   └── database.db            # created automatically on first run
│
├── frontend/
│   ├── src/
│   │   ├── admin/              # AdminLogin, AdminDashboard, ProductForm, ImageUploadField, ProtectedRoute
│   │   ├── components/         # Navbar, LanguageSelector, ProductGrid, ProductCard,
│   │   │                       # ProductModal, EmbedPlayer, SmartContactButton
│   │   ├── context/             # LanguageContext, AdminAuthContext
│   │   ├── i18n/                # i18next config (AR/EN/RU/DE strings)
│   │   ├── pages/                # Home
│   │   ├── utils/api.js          # axios instance with auth header injection
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   ├── vercel.json           # SPA rewrite config for Vercel
│   ├── .env.example
│   └── vite.config.js
│
├── .gitignore
├── render.yaml              # Render blueprint (backend deploy config)
└── README.md
```

## Run Locally (no paid services, no Docker, no external DB)

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env      # edit JWT_SECRET / ADMIN_USERNAME / ADMIN_PASSWORD if you want
npm start
```

This automatically creates `backend/database.db`, builds the schema, seeds an admin
user (`admin` / `admin123` by default) and two demo products. Server runs at
`http://localhost:5000`.

### 2. Frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Vite dev server runs at `http://localhost:5173` and proxies `/api` calls to the
backend on port 5000 (see `vite.config.js`).

### 3. Use it

- Client site: http://localhost:5173/
- Admin login: http://localhost:5173/admin/login (`admin` / `admin123`)

## Uploading images (no external hosting needed)

In the admin dashboard's product form, each image field (common image and the
four per-language overrides) has an **"Upload image"** button. Picking a file:

1. Sends it to `POST /api/upload` (JWT-protected).
2. The backend saves it to `backend/uploads/<timestamp>-<random>.ext` (max 5MB,
   JPEG/PNG/WEBP/GIF only).
3. The response URL (e.g. `/uploads/169...-abc.jpg`) is stored directly in the
   product's `common_image` / `image_<lang>` field and served statically by
   Express — no S3, Cloudinary, or other paid service required.

You can still paste a direct external URL into the same field instead, if you'd
rather link an image than upload one — both work interchangeably.

## Deploying: Backend on Render, Frontend on Vercel

The project is now cross-origin ready (CORS + configurable API base URL). Steps:

### 1. Push to GitHub
Commit and push this whole repo (both `backend/` and `frontend/`) to a GitHub repository.

### 2. Backend → Render
1. On [render.com](https://render.com), **New → Web Service**, connect your repo.
   (Or use the included `render.yaml` blueprint: **New → Blueprint**, point it at
   the repo, and Render reads the config automatically.)
2. If configuring manually, set:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
3. Add environment variables (Render dashboard → Environment):
   - `JWT_SECRET` — any long random string
   - `ADMIN_USERNAME` / `ADMIN_PASSWORD` — your admin login
   - `FRONTEND_ORIGIN` — you'll fill this in after step 3 (your Vercel URL)
4. Deploy. Note the resulting URL, e.g. `https://your-app.onrender.com`.

**⚠️ Important — free tier storage is ephemeral.** Render's free web services
use a temporary filesystem: `database.db` and everything in `uploads/` are
wiped on every deploy, restart, or when the service spins down from
inactivity. For a real deployment, add a **persistent disk** (Render
dashboard → your service → Disks; requires a paid instance type) mounted at
e.g. `/opt/render/project/src/backend/data`, then set:
   - `DB_DIR=/opt/render/project/src/backend/data`
   - `UPLOAD_DIR=/opt/render/project/src/backend/data/uploads`

Without a disk, the app still works fine for testing/demos — just know data
resets periodically.

### 3. Frontend → Vercel
1. On [vercel.com](https://vercel.com), **New Project**, import the repo.
2. Set **Root Directory** to `frontend`.
3. Framework preset: **Vite** (auto-detected).
4. Add an environment variable:
   - `VITE_API_URL` = your Render URL from step 2, e.g. `https://your-app.onrender.com`
     (no trailing slash)
5. Deploy. Vercel gives you a URL like `https://your-app.vercel.app`.
   (`vercel.json` is already included so client-side routes like `/admin` work
   on direct load/refresh.)

### 4. Connect them
Go back to Render → your backend service → Environment, and set:
- `FRONTEND_ORIGIN=https://your-app.vercel.app`

Redeploy the backend so CORS allows requests from your live frontend. Done —
client site and admin dashboard both work end-to-end across the two hosts.

### Local dev is unaffected
Locally, leave `VITE_API_URL` and `FRONTEND_ORIGIN` unset — Vite's dev proxy
and the default `http://localhost:5173` CORS origin handle everything
automatically, exactly as before.

## Configuration notes

- **WhatsApp/Telegram numbers:** edit `WHATSAPP_NUMBER` and `TELEGRAM_USERNAME` at
  the top of `frontend/src/components/SmartContactButton.jsx`.
- **Smart contact routing:** Russian (`ru`) users are routed to Telegram; Arabic,
  English, and German users are routed to WhatsApp with a pre-filled message
  containing the product title.
- **Video embeds:** paste any standard YouTube URL (watch/shorts/youtu.be) or
  Instagram post/reel URL into the admin form's video fields — `EmbedPlayer`
  detects the type automatically.
- **Images:** each product has a `common_image` used for every language, plus
  optional per-language `image_<lang>` overrides.
- **Production build:** `cd frontend && npm run build` outputs static files to
  `frontend/dist/`, which you can serve with any static host or point Express
  at via `express.static` if you want a single deployable service.

## Resetting the database

Delete `backend/database.db` (and the `-wal`/`-shm` files if present) and restart
the backend — it will recreate the schema and reseed the admin user + demo data.
