// components/ProductModal.jsx
import { useTranslation } from "react-i18next";
import EmbedPlayer from "./EmbedPlayer";
import SmartContactButton from "./SmartContactButton";

export default function ProductModal({ product, onClose }) {
  const { t } = useTranslation();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <h2 className="text-xl font-bold text-gray-900">{product.title}</h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
            aria-label={t("close")}
          >
            ✕
          </button>
        </div>

        <div className="mt-4">
          <EmbedPlayer url={product.video} title={product.title} />
        </div>

        <p className="mt-4 text-gray-600">{product.description}</p>

        <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
          <span>
            {t("price")}: <strong className="text-gray-900">${Number(product.price).toFixed(2)}</strong>
          </span>
          <span>
            {t("category")}: <strong className="text-gray-900">{product.category}</strong>
          </span>
        </div>

        <div className="mt-6">
          <SmartContactButton productTitle={product.title} />
        </div>
      </div>
    </div>
  );
}
