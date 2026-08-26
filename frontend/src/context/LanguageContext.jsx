// context/LanguageContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { applyDirection } from "../i18n";

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const { i18n } = useTranslation();
  const [lang, setLangState] = useState(i18n.language || "en");

  useEffect(() => {
    applyDirection(lang);
  }, [lang]);

  function setLang(newLang) {
    i18n.changeLanguage(newLang);
    localStorage.setItem("lang", newLang);
    setLangState(newLang);
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
