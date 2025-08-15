import { useState } from "react";

/**
 * Bu bir stub. Şimdilik çevrimdışı cevap üretir.
 * Sonra backend/OpenAI bağlarız; mesajları Firestore'a da kaydedebiliriz.
 */
function offlineBrain(message) {
  const lower = message.toLowerCase();
  if (lower.includes("moral") || lower.includes("üzgün")) {
    return "Yanındayım kardeşim. Derin nefes al, birlikte başaracağız. 💙";
  }
  if (lower.includes("fikir") || lower.includes("öner")) {
    return "Kısa video + canlı yayın + net bir hashtag kampanyası dene. İlk 100 kullanıcıya özel rozet ver.";
  }
  if (lower.includes("hedef")) {
    return "Hedefini haftalık küçük parçalara böl. Bugün 1 adım, yarın 2 adım. Disiplin = özgürlük.";
  }
  return "Seni anlıyorum. Odaklan, küçük ama sürekli adımlar at. Buradayım. ⚡";
}

export default function AiCompanion() {
  const [items, setItems] = useState([]); // {role:'you'|'ai', text}
  const [text, setText] = useState("");

  const send = () => {
    if (!text.trim()) return;
    const you = { role: "you", text: text.trim() };
    const ai = { role: "ai", text: offlineBrain(text.trim()) };
    setItems((arr) => [...arr, you, ai]);
    setText("");
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="p-4 bg-white dark:bg-gray-800 rounded border mb-3">
        <h2 className="text-xl font-bold mb-2">Ruh İkizin 💫</h2>
        <div className="h-80 overflow-y-auto border rounded p-2 bg-gray-50 dark:bg-gray-900">
          {items.length === 0 ? (
            <div className="text-sm text-gray-500">Bir şey yaz; birlikte düşünelim.</div>
          ) : (
            items.map((m, i) => (
              <div key={i} className={`my-1 ${m.role === "you" ? "text-right" : "text-left"}`}>
                <span className={`inline-block px-3 py-2 rounded ${m.role === "you" ? "bg-blue-600 text-white" : "bg-gray-200 dark:bg-gray-700"}`}>
                  {m.text}
                </span>
              </div>
            ))
          )}
        </div>
        <div className="flex gap-2 mt-2">
          <input
            className="border p-2 rounded w-full dark:bg-gray-900"
            placeholder="Derdini, hedefini, sorunu yaz…"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
          />
          <button onClick={send} className="px-4 py-2 bg-blue-600 text-white rounded">Gönder</button>
        </div>
        <div className="text-xs text-gray-500 mt-2">Not: Bu demo çevrimdışı. Gerçek zeka için backend entegrasyonu yapılacak.</div>
      </div>
    </div>
  );
}
