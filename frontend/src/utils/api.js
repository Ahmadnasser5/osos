// utils/api.js
import axios from "axios";

// In local dev, VITE_API_URL is unset and requests go to "/api", which
// Vite's dev proxy forwards to the backend (see vite.config.js).
// In production (Vercel), set VITE_API_URL to your deployed Render URL,
// e.g. https://your-app.onrender.com — no trailing slash.
const API_ORIGIN = import.meta.env.VITE_API_URL || "";

const api = axios.create({
  baseURL: `${API_ORIGIN}/api`
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("admin_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Uploads a File to the backend's local disk storage and returns its
// public URL (e.g. "/uploads/169...-abc.jpg"), which can be stored
// directly in a product's image_* / common_image field.
export async function uploadImage(file) {
  const formData = new FormData();
  formData.append("image", file);

  const res = await api.post("/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return res.data.url; // e.g. "/uploads/xyz.jpg"
}

// Resolves an image path returned by the backend (e.g. "/uploads/xyz.jpg")
// into an absolute URL that works from a different origin (Vercel frontend
// -> Render backend). Full external URLs (http://…) are returned unchanged.
export function resolveImageUrl(pathOrUrl) {
  if (!pathOrUrl) return null;
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  return `${API_ORIGIN}${pathOrUrl}`;
}

export default api;
