// components/SmartContactButton.jsx
import { useTranslation } from "react-i18next";
import { useLanguage } from "../context/LanguageContext";

// Set these to your real business contact details.
const WHATSAPP_NUMBER = "0566778283"; // digits only, no + or spaces
const TELEGRAM_USERNAME = "your_telegram_username";

export default function SmartContactButton({ productTitle }) {
  const { lang } = useLanguage();
  const { t } = useTranslation();

  function handleClick() {
    const message = `${t("inquiry_message")} ${productTitle}`;

    if (lang === "ru") {
      // Telegram deep link. Telegram doesn't support a universal
      // pre-filled-DM-to-a-user link, so we open the chat and copy
      // the message to the clipboard for the user to paste.
      navigator.clipboard?.writeText(message).catch(() => {});
      window.open(`https://t.me/${TELEGRAM_USERNAME}`, "_blank", "noopener,noreferrer");
    } else {
      const encoded = encodeURIComponent(message);
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`, "_blank", "noopener,noreferrer");
    }
  }

  return (
    <button
      onClick={handleClick}
      className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 px-5 py-2.5 font-semibold text-white shadow hover:bg-green-700 transition"
    >
      {lang === "ru" ? "Telegram" : "WhatsApp"} — {t("contact_us")}
    </button>
  );
}
