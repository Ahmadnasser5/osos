// pages/Home.jsx
import { useTranslation } from "react-i18next";
import Navbar from "../components/Navbar";
import ProductGrid from "../components/ProductGrid";

export default function Home() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-extrabold text-gray-900">{t("hero_title")}</h1>
          <p className="mt-2 text-gray-500">{t("hero_subtitle")}</p>
        </div>
        <ProductGrid />
      </main>
    </div>
  );
}
