import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useI18n } from "../i18n";

// Basit ülke listesi (ISO2, ülke adı, ülke kodu)
const COUNTRIES = [
  { iso2: "TR", name: "Türkiye", dial: "+90" },
  { iso2: "US", name: "United States", dial: "+1" },
  { iso2: "GB", name: "United Kingdom", dial: "+44" },
  { iso2: "DE", name: "Deutschland", dial: "+49" },
  { iso2: "FR", name: "France", dial: "+33" },
  { iso2: "IN", name: "India", dial: "+91" },
  { iso2: "SA", name: "Saudi Arabia", dial: "+966" },
  { iso2: "RU", name: "Россия", dial: "+7" },
  { iso2: "CN", name: "中国", dial: "+86" },
  { iso2: "JP", name: "日本", dial: "+81" },
  // ihtiyaca göre uzatılır…
];

function toE164(dial, local) {
  // çok basit normalizasyon: baştaki 0’ı at ve ülke kodu ile birleştir
  const cleaned = (local || "").replace(/[^\d]/g, "");
  const noLeadZero = cleaned.replace(/^0+/, "");
  return `${dial}${noLeadZero}`;
}

export default function PhoneAuth() {
  const { t, lang } = useI18n();
  const [country, setCountry] = useState(COUNTRIES[0]);
  const [localNumber, setLocalNumber] = useState("");
  const [full, setFull] = useState("");            // E.164
  const [code, setCode] = useState("");
  const [confirm, setConfirm] = useState(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    // tarayıcı dilinden ülke tahmini (ör: tr-TR → TR)
    try {
      const nav = navigator?.language || "";
      const iso = nav.split("-")[1]?.toUpperCase();
      const found = COUNTRIES.find(c => c.iso2 === iso);
      if (found) setCountry(found);
    } catch {}
  }, []);

  useEffect(() => {
    setFull(toE164(country.dial, localNumber));
  }, [country, localNumber]);

  useEffect(() => {
    // reCAPTCHA bir kere kurulmalı
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "invisible",
      });
    }
  }, []);

  const sendCode = async (e) => {
    e.preventDefault();
    setMsg(""); setBusy(true);
    try {
      const appVerifier = window.recaptchaVerifier;
      const confirmation = await signInWithPhoneNumber(auth, full, appVerifier);
      setConfirm(confirmation);
      setMsg("SMS gönderildi. Kodu gir.");
    } catch (err) {
      setMsg(err.message || "SMS gönderilemedi.");
      // reCAPTCHA reset
      try { window.recaptchaVerifier.clear(); window.recaptchaVerifier = null; } catch {}
    } finally {
      setBusy(false);
    }
  };

  const verify = async (e) => {
    e.preventDefault();
    if (!confirm) return;
    setBusy(true); setMsg("");
    try {
      const cred = await confirm.confirm(code);
      const u = cred.user;
      // Profil dokümanı oluştur/güncelle
      await setDoc(doc(db, "users", u.uid), {
        uid: u.uid,
        phoneNumber: u.phoneNumber || full,
        country: country.iso2,
        dialCode: country.dial,
        language: lang,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }, { merge: true });
      setMsg("Giriş başarılı.");
    } catch (err) {
      setMsg(err.message || "Kod doğrulanamadı.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-md mx-auto card">
      <h2 className="font-bold text-lg mb-2">{t("phone_login")}</h2>

      {!confirm && (
        <form onSubmit={sendCode} className="flex flex-col gap-2">
          <label className="text-sm">{t("country")}</label>
          <select
            className="input"
            value={country.iso2}
            onChange={(e)=>setCountry(COUNTRIES.find(c=>c.iso2===e.target.value))}
          >
            {COUNTRIES.map(c => (
              <option key={c.iso2} value={c.iso2}>{c.name} ({c.dial})</option>
            ))}
          </select>

          <label className="text-sm">{t("phone_number")}</label>
          <div className="flex gap-2">
            <input className="input w-28" value={country.dial} readOnly />
            <input
              className="input flex-1"
              placeholder="5xx xxx xx xx"
              value={localNumber}
              onChange={(e)=>setLocalNumber(e.target.value)}
            />
          </div>

          <button className="btn" type="submit" disabled={busy}>
            {busy ? "…" : t("send_code")}
          </button>

          {full && <div className="text-xs text-gray-600">E.164: {full}</div>}
          {msg && <div className="text-sm text-gray-700">{msg}</div>}
          <div id="recaptcha-container" />
        </form>
      )}

      {confirm && (
        <form onSubmit={verify} className="flex flex-col gap-2">
          <label className="text-sm">{t("sms_code")}</label>
          <input
            className="input"
            placeholder="123456"
            value={code}
            onChange={(e)=>setCode(e.target.value)}
          />
          <div className="flex gap-2">
            <button className="btn" type="submit" disabled={busy}>
              {busy ? "…" : t("verify_code")}
            </button>
            <button className="btn" type="button" onClick={()=>setConfirm(null)}>
              {t("change_phone")}
            </button>
          </div>
          {msg && <div className="text-sm text-gray-700">{msg}</div>}
        </form>
      )}
    </div>
  );
}
