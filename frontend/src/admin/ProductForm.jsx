// admin/ProductForm.jsx
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { LANGUAGES } from "../i18n";
import ImageUploadField from "./ImageUploadField";

const EMPTY_PRODUCT = {
  title_ar: "", title_en: "", title_ru: "", title_de: "",
  description_ar: "", description_en: "", description_ru: "", description_de: "",
  video_ar: "", video_en: "", video_ru: "", video_de: "",
  image_ar: "", image_en: "", image_ru: "", image_de: "",
  common_image: "",
  price: 0,
  category: ""
};

export default function ProductForm({ initial, onSubmit, onCancel }) {
  const { t } = useTranslation();
  const [form, setForm] = useState(initial ? { ...EMPTY_PRODUCT, ...initial } : EMPTY_PRODUCT);
  const [activeLang, setActiveLang] = useState("en");
  const [saving, setSaving] = useState(false);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await onSubmit(form);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      {/* Common fields */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">{t("price")}</label>
          <input
            type="number"
            step="0.01"
            className="w-full rounded-lg border border-gray-300 px-3 py-2"
            value={form.price}
            onChange={(e) => update("price", e.target.value)}
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">{t("category")}</label>
          <input
            className="w-full rounded-lg border border-gray-300 px-3 py-2"
            value={form.category}
            onChange={(e) => update("category", e.target.value)}
          />
        </div>
      </div>

      <ImageUploadField
        label="Common Image (used for all languages unless overridden below)"
        value={form.common_image}
        onChange={(url) => update("common_image", url)}
      />

      {/* Language tabs */}
      <div>
        <div className="mb-3 flex gap-2 border-b border-gray-200">
          {LANGUAGES.map((l) => (
            <button
              key={l.code}
              type="button"
              onClick={() => setActiveLang(l.code)}
              className={`px-3 py-2 text-sm font-medium ${
                activeLang === l.code
                  ? "border-b-2 border-brand-600 text-brand-700"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              {l.flag} {l.label}
            </button>
          ))}
        </div>

        {LANGUAGES.map((l) => (
          <div key={l.code} className={activeLang === l.code ? "space-y-3" : "hidden"}>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Title ({l.code.toUpperCase()}) {["ar", "en", "ru", "de"].includes(l.code) && "*"}
              </label>
              <input
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
                value={form[`title_${l.code}`] || ""}
                onChange={(e) => update(`title_${l.code}`, e.target.value)}
                dir={l.code === "ar" ? "rtl" : "ltr"}
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Description ({l.code.toUpperCase()})
              </label>
              <textarea
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
                rows={3}
                value={form[`description_${l.code}`] || ""}
                onChange={(e) => update(`description_${l.code}`, e.target.value)}
                dir={l.code === "ar" ? "rtl" : "ltr"}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                YouTube / Instagram URL ({l.code.toUpperCase()})
              </label>
              <input
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
                value={form[`video_${l.code}`] || ""}
                onChange={(e) => update(`video_${l.code}`, e.target.value)}
                placeholder="https://youtube.com/… or https://instagram.com/reel/…"
              />
            </div>
            <ImageUploadField
              label={`Localized Image (${l.code.toUpperCase()}) — optional, falls back to common image`}
              value={form[`image_${l.code}`]}
              onChange={(url) => update(`image_${l.code}`, url)}
            />
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-brand-600 px-5 py-2.5 font-semibold text-white hover:bg-brand-700 disabled:opacity-50"
        >
          {saving ? "…" : t("save")}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-gray-300 px-5 py-2.5 font-semibold text-gray-700 hover:bg-gray-50"
        >
          {t("cancel")}
        </button>
      </div>
    </form>
  );
}
