import React, { useContext, useState } from "react";
import { AuthCtx } from "../AuthProvider";
import { setVerified } from "../lib/users";

export default function Settings() {
  const { user } = useContext(AuthCtx) || { user: null };
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  const buyBlueTick = async () => {
    if (!user?.uid) return;
    setBusy(true); setMsg("");
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/billing/create-checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: user.uid,
          email: user.email || "",
          // istersen dil, ülke vb. da gönder
        }),
      });
      const data = await res.json();
      if (data?.url) {
        window.location.href = data.url; // Stripe Checkout’a yönlendir
      } else {
        throw new Error("Ödeme oturumu açılamadı.");
      }
    } catch (e) {
      setMsg(e.message || "Ödeme başlatılamadı.");
    } finally {
      setBusy(false);
    }
  };

  // Geliştirme için geçici doğrulama (webhook olmadan test)
  const devMarkVerified = async () => {
    if (!user?.uid) return;
    setBusy(true); setMsg("");
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/billing/dev-mark-verified`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: user.uid }),
      });
      const data = await res.json();
      setMsg(data?.ok ? "Geçici olarak doğrulandı (DEV)." : "DEV doğrulama başarısız.");
    } catch (e) {
      setMsg(e.message || "DEV doğrulama hatası");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 grid gap-4">
      <div className="card">
        <h2 className="font-bold text-lg mb-2">Doğrulama (Mavi Tik)</h2>
        <p className="text-sm text-gray-600">
          Mavi tik ile profilin öne çıkar, mesaj ve paylaşımlarda doğrulama rozeti görünür.
        </p>
        <div className="flex gap-2 mt-3">
          <button className="btn" disabled={busy || !user} onClick={buyBlueTick}>
            {busy ? "…" : "Mavi Tik Satın Al"}
          </button>
          <button className="btn" onClick={devMarkVerified} disabled={busy || !user}>
            DEV: Geçici Doğrula
          </button>
        </div>
        {msg && <div className="text-sm text-gray-700 mt-2">{msg}</div>}
      </div>

      {/* Diğer ayar kartların (tema, gizlilik, hesap) burada */}
    </div>
  );
}
