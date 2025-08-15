import React, { useEffect, useState } from "react";

export default function SettingsPage() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark"); else root.classList.remove("dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <div className="max-w-2xl mx-auto card">
      <h2 className="font-bold text-lg mb-2">Ayarlar</h2>
      <div className="flex items-center justify-between">
        <div>Tema</div>
        <select className="input w-40" value={theme} onChange={(e)=>setTheme(e.target.value)}>
          <option value="light">Açık</option>
          <option value="dark">Koyu</option>
        </select>
      </div>

      <div className="mt-4 text-sm text-gray-600">
        <b>Gizlilik</b> (örnek): Hesabını özel yap, sadece takipçiler görsün vb.
        <div className="mt-1 italic">Not: Bu alan görünüm amaçlı. Prod için kullanıcı dokümanına flag ekleyeceğiz.</div>
      </div>
    </div>
  );
}
