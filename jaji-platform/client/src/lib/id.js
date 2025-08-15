// src/lib/id.js

// Client-unique ID (tarayıcı başına)
export function getClientId() {
  const k = "__JAJI_CLIENT_ID__";
  let v = localStorage.getItem(k);
  if (!v) {
    v = "cli_" + Math.random().toString(36).slice(2) + Date.now().toString(36);
    localStorage.setItem(k, v);
  }
  return v;
}

// Oturum açmamışlar için görüntülenecek takma ad
export function getDisplayName() {
  const animals = ["Kedi", "Kurt", "Kartal", "Şahin", "Ceylan", "Aslan", "Turna", "Yunus", "Puma", "Serçe"];
  const colors  = ["Mavi", "Kızıl", "Yeşil", "Mor", "Altın", "Gümüş", "Siyah", "Ak", "Lacivert", "Turkuaz"];
  const a = animals[Math.floor(Math.random() * animals.length)];
  const c = colors[Math.floor(Math.random() * colors.length)];
  return `${c}${a}`;
}
