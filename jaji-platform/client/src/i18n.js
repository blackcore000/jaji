import React, { createContext, useContext, useMemo, useState } from "react";

const dict = {
  tr: { home: "Ana Sayfa", explore: "Keşfet", live: "Canlı", chat: "Sohbet", settings: "Ayarlar", login: "Giriş", logout: "Çıkış" },
  en: { home: "Home", explore: "Explore", live: "Live", chat: "Chat", settings: "Settings", login: "Login", logout: "Logout" },
};

const I18nCtx = createContext(null);
export function I18nProvider({ children }) {
  const [lang, setLang] = useState("tr");
  const value = useMemo(() => ({ lang, setLang, t: (k)=>dict[lang]?.[k] || k }), [lang]);
  return <I18nCtx.Provider value={value}>{children}</I18nCtx.Provider>;
}
export function useI18n(){ return useContext(I18nCtx); }
const DICTS = {
  tr: {
    home: "Ana Sayfa",
    explore: "Keşfet",
    chat: "Sohbet",
    live: "Canlı",
    settings: "Ayarlar",
    phone_login: "Telefon ile Giriş",
    phone_number: "Telefon Numarası",
    country: "Ülke",
    send_code: "Kod Gönder",
    verify_code: "Kodu Doğrula",
    sms_code: "SMS Kodu",
    change_phone: "Telefonu Değiştir",
  },
  en: {
    home: "Home",
    explore: "Explore",
    chat: "Chat",
    live: "Live",
    settings: "Settings",
    phone_login: "Sign in with Phone",
    phone_number: "Phone Number",
    country: "Country",
    send_code: "Send Code",
    verify_code: "Verify Code",
    sms_code: "SMS Code",
    change_phone: "Change phone",
  }
};
