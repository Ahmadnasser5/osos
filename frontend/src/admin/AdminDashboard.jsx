// admin/AdminDashboard.jsx
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import api from "../utils/api";
import { useAdminAuth } from "../context/AdminAuthContext";
import ProductForm from "./ProductForm";

export default function AdminDashboard() {
  const { t } = useTranslation();
  const { logout } = useAdminAuth();
  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(null); // null = closed, {} = new, {...} = edit
  const [loading, setLoading] = useState(true);

  function loadProducts() {
    setLoading(true);
    api
      .get("/products/admin/all")
      .then((res) => setProducts(res.data))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadProducts();
  }, []);

  async function handleSubmit(form) {
    if (editing?.id) {
      await api.put(`/products/${editing.id}`, form);
    } else {
      await api.post("/products", form);
    }
    setEditing(null);
    loadProducts();
  }

  async function handleDelete(id) {
    if (!confirm("Delete this product?")) return;
    await api.delete(`/products/${id}`);
    loadProducts();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <h1 className="text-lg font-bold text-gray-900">{t("dashboard")}</h1>
          <button
            onClick={logout}
            className="rounded-lg border border-gray-300 px-4 py-1.5 text-sm font-medium hover:bg-gray-50"
          >
            {t("logout")}
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">
        {editing !== null ? (
          <>
            <h2 className="mb-4 text-lg font-semibold">{editing.id ? t("edit_product") : t("add_product")}</h2>
            <ProductForm initial={editing.id ? editing : null} onSubmit={handleSubmit} onCancel={() => setEditing(null)} />
          </>
        ) : (
          <>
            <div className="mb-4 flex justify-end">
              <button
                onClick={() => setEditing({})}
                className="rounded-lg bg-brand-600 px-4 py-2 font-semibold text-white hover:bg-brand-700"
              >
                + {t("add_product")}
              </button>
            </div>

            {loading ? (
              <div className="py-16 text-center text-gray-400">Loading…</div>
            ) : products.length === 0 ? (
              <div className="py-16 text-center text-gray-400">{t("no_products")}</div>
            ) : (
              <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                <table className="w-full text-start text-sm">
                  <thead className="bg-gray-50 text-gray-600">
                    <tr>
                      <th className="px-4 py-3 text-start">Title (EN)</th>
                      <th className="px-4 py-3 text-start">{t("category")}</th>
                      <th className="px-4 py-3 text-start">{t("price")}</th>
                      <th className="px-4 py-3 text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((p) => (
                      <tr key={p.id} className="border-t border-gray-100">
                        <td className="px-4 py-3 font-medium text-gray-900">{p.title_en}</td>
                        <td className="px-4 py-3 text-gray-500">{p.category}</td>
                        <td className="px-4 py-3 text-gray-500">${Number(p.price).toFixed(2)}</td>
                        <td className="px-4 py-3 text-end">
                          <button
                            onClick={() => setEditing(p)}
                            className="me-3 font-medium text-brand-600 hover:underline"
                          >
                            {t("edit_product")}
                          </button>
                          <button
                            onClick={() => handleDelete(p.id)}
                            className="font-medium text-red-600 hover:underline"
                          >
                            {t("delete")}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
