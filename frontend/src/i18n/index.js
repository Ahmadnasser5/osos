// i18n/index.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

export const RTL_LANGS = ["ar"];

export const LANGUAGES = [
  { code: "ar", label: "العربية", flag: "🇸🇦" },
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "ru", label: "Русский", flag: "🇷🇺" },
  { code: "de", label: "Deutsch", flag: "🇩🇪" }
];

const resources = {
  ar: {
    translation: {
      nav_home: "الرئيسية",
      nav_products: "المنتجات",
      hero_title: "اكتشف منتجاتنا",
      hero_subtitle: "تصفح مجموعتنا المميزة بلغتك المفضلة",
      view_details: "عرض التفاصيل",
      contact_us: "تواصل معنا",
      price: "السعر",
      category: "الفئة",
      close: "إغلاق",
      admin_login: "تسجيل دخول المشرف",
      username: "اسم المستخدم",
      password: "كلمة المرور",
      login: "دخول",
      dashboard: "لوحة التحكم",
      add_product: "إضافة منتج",
      edit_product: "تعديل المنتج",
      delete: "حذف",
      save: "حفظ",
      cancel: "إلغاء",
      logout: "تسجيل الخروج",
      no_products: "لا توجد منتجات بعد",
      inquiry_message: "مرحباً، أنا مهتم بمنتج:"
    }
  },
  en: {
    translation: {
      nav_home: "Home",
      nav_products: "Products",
      hero_title: "Discover Our Products",
      hero_subtitle: "Browse our curated collection in your language",
      view_details: "View Details",
      contact_us: "Contact Us",
      price: "Price",
      category: "Category",
      close: "Close",
      admin_login: "Admin Login",
      username: "Username",
      password: "Password",
      login: "Login",
      dashboard: "Dashboard",
      add_product: "Add Product",
      edit_product: "Edit Product",
      delete: "Delete",
      save: "Save",
      cancel: "Cancel",
      logout: "Logout",
      no_products: "No products yet",
      inquiry_message: "Hello, I'm interested in the product:"
    }
  },
  ru: {
    translation: {
      nav_home: "Главная",
      nav_products: "Товары",
      hero_title: "Откройте наши товары",
      hero_subtitle: "Просматривайте коллекцию на вашем языке",
      view_details: "Подробнее",
      contact_us: "Связаться с нами",
      price: "Цена",
      category: "Категория",
      close: "Закрыть",
      admin_login: "Вход для администратора",
      username: "Имя пользователя",
      password: "Пароль",
      login: "Войти",
      dashboard: "Панель управления",
      add_product: "Добавить товар",
      edit_product: "Редактировать товар",
      delete: "Удалить",
      save: "Сохранить",
      cancel: "Отмена",
      logout: "Выйти",
      no_products: "Пока нет товаров",
      inquiry_message: "Здравствуйте, меня интересует товар:"
    }
  },
  de: {
    translation: {
      nav_home: "Startseite",
      nav_products: "Produkte",
      hero_title: "Entdecken Sie unsere Produkte",
      hero_subtitle: "Durchstöbern Sie unsere Kollektion in Ihrer Sprache",
      view_details: "Details ansehen",
      contact_us: "Kontaktieren Sie uns",
      price: "Preis",
      category: "Kategorie",
      close: "Schließen",
      admin_login: "Admin-Anmeldung",
      username: "Benutzername",
      password: "Passwort",
      login: "Anmelden",
      dashboard: "Dashboard",
      add_product: "Produkt hinzufügen",
      edit_product: "Produkt bearbeiten",
      delete: "Löschen",
      save: "Speichern",
      cancel: "Abbrechen",
      logout: "Abmelden",
      no_products: "Noch keine Produkte",
      inquiry_message: "Hallo, ich interessiere mich für das Produkt:"
    }
  }
};

i18n.use(initReactI18next).init({
  resources,
  lng: localStorage.getItem("lang") || "en",
  fallbackLng: "en",
  interpolation: { escapeValue: false }
});

export function applyDirection(lang) {
  const dir = RTL_LANGS.includes(lang) ? "rtl" : "ltr";
  document.documentElement.setAttribute("dir", dir);
  document.documentElement.setAttribute("lang", lang);
}

export default i18n;
