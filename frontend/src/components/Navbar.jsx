// components/Navbar.jsx
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSelector from "./LanguageSelector";

export default function Navbar() {
  const { t } = useTranslation();

  return (
    <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="text-lg font-bold text-gray-900">
          🛍️ Showcase
        </Link>
        <nav className="flex items-center gap-4">
          <Link to="/" className="text-sm font-medium text-gray-600 hover:text-gray-900">
            {t("nav_home")}
          </Link>
          <LanguageSelector />
        </nav>
      </div>
    </header>
  );
}
