import axios from "axios";

// 1. جلب الرابط وإزالة أي /api أو أسلاش زائدة في نهايته لمنع التكرار نهائياً
const rawEnv = import.meta.env.VITE_API_URL || "https://the-unique-one.onrender.com";
const API_ORIGIN = rawEnv.replace(/\/api\/?$/, "").replace(/\/$/, "");

// 2. ضبط baseURL ليشمل /api مرة واحدة فقط وبشكل صحيح
const api = axios.create({
  baseURL: `${API_ORIGIN}/api`
});

// 3. إضافة التوكن تلقائياً مع كل طلب (لو متاح)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("admin_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// رفع الصور إلى الـ Backend
export async function uploadImage(file) {
  const formData = new FormData();
  formData.append("image", file);

  const res = await api.post("/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return res.data.url;
}

// تحويل مسارات الصور إلى روابط كاملة
export function resolveImageUrl(pathOrUrl) {
  if (!pathOrUrl) return null;
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  return `${API_ORIGIN}${pathOrUrl}`;
}

export default api;
