// components/ProductCard.jsx
import { useTranslation } from "react-i18next";
import { resolveImageUrl } from "../utils/api";

export default function ProductCard({ product, onOpen }) {
  const { t } = useTranslation();
  const imageSrc = resolveImageUrl(product.image);

  return (
    <div className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md">
      <div className="aspect-square w-full overflow-hidden bg-gray-100">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={product.title}
            className="h-full w-full object-cover transition group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-gray-300">No image</div>
        )}
      </div>
      <div className="p-4">
        <h3 className="line-clamp-1 font-semibold text-gray-900">{product.title}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-gray-500">{product.description}</p>
        <div className="mt-3 flex items-center justify-between">
          <span className="font-bold text-brand-600">${Number(product.price).toFixed(2)}</span>
          <button
            onClick={() => onOpen(product)}
            className="rounded-lg bg-gray-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-gray-700"
          >
            {t("view_details")}
          </button>
        </div>
      </div>
    </div>
  );
}
