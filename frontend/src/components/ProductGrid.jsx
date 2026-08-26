// components/ProductGrid.jsx
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import api from "../utils/api";
import { useLanguage } from "../context/LanguageContext";
import ProductCard from "./ProductCard";
import ProductModal from "./ProductModal";

export default function ProductGrid() {
  const { lang } = useLanguage();
  const { t } = useTranslation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    setLoading(true);
    api
      .get("/products", { params: { lang } })
      .then((res) => setProducts(res.data))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [lang]);

  if (loading) {
    return <div className="py-20 text-center text-gray-400">Loading…</div>;
  }

  if (products.length === 0) {
    return <div className="py-20 text-center text-gray-400">{t("no_products")}</div>;
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} onOpen={setSelected} />
        ))}
      </div>

      {selected && <ProductModal product={selected} onClose={() => setSelected(null)} />}
    </>
  );
}
