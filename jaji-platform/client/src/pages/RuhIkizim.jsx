import React, { useContext, useEffect, useState } from "react";
import { AuthCtx } from "../AuthProvider";
import { chat, listThreads, getHistory, deleteThread } from "../lib/ai";

export default function RuhIkizim() {
  const { user, profile, lang = "tr" } = useContext(AuthCtx) || {};
  const [threads, setThreads] = useState([]);
  const [threadId, setThreadId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [remember, setRemember] = useState(true);
  const [busy, setBusy] = useState(false);
  const [info, setInfo] = useState("");

  useEffect(() => {
    if (!user?.uid) return;
    (async () => {
      const t = await listThreads(user.uid);
      setThreads(t.items || []);
      if ((t.items || []).length) setThreadId(t.items[0].id);
    })();
  }, [user?.uid]);

  useEffect(() => {
    if (!user?.uid || !threadId) { setMessages([]); return; }
    (async () => {
      const h = await getHistory(user.uid, threadId);
      setMessages(h.messages || []);
    })();
  }, [user?.uid, threadId]);

  const send = async () => {
    if (!user?.uid || !input.trim()) return;
    setBusy(true); setInfo("");
    try {
      const local = [...messages, { role: "user", content: input }];
      setMessages(local);
      setInput("");
      const res = await chat(user.uid, input.trim(), threadId, lang || "tr", remember, {
        displayName: profile?.displayName || user.email || "Kullanıcı"
      });
      if (res.threadId && !threadId) setThreadId(res.threadId);
      setMessages([...local, { role: "assistant", content: res.answer }]);
      if (res.verified) setInfo("Doğrulanmış hesap: uzun yanıt limiti aktif.");
    } catch (e) {
      setInfo(e.message || "Hata");
    } finally {
      setBusy(false);
    }
  };

  const newThread = () => {
    setThreadId(null);
    setMessages([]);
    setInfo("");
  };

  const removeThread = async (id) => {
    if (!user?.uid || !id) return;
    const ok = confirm("Bu konuşma silinsin mi?");
    if (!ok) return;
    await deleteThread(user.uid, id);
    const t = await listThreads(user.uid);
    setThreads(t.items || []);
    setThreadId((t.items || [])[0]?.id || null);
  };

  return (
    <div className="grid md:grid-cols-[260px_1fr] gap-4">
      {/* Sol: Thread listesi */}
      <aside className="card">
        <div className="flex justify-between items-center mb-2">
          <h2 className="font-bold">Ruh İkizim</h2>
          <button className="btn" onClick={newThread}>Yeni</button>
        </div>
        <div className="grid gap-2 max-h-[60vh] overflow-auto">
          {(threads || []).map(t => (
            <div
              key={t.id}
              onClick={() => setThreadId(t.id)}
              className={"p-2 rounded cursor-pointer border " + (t.id === threadId ? "bg-blue-50 border-blue-300" : "bg-white")}
            >
              <div className="text-sm font-medium truncate">{t.title || "Konuşma"}</div>
              <button className="text-xs text-red-500 mt-1" onClick={(e) => { e.stopPropagation(); removeThread(t.id); }}>
                Sil
              </button>
            </div>
          ))}
        </div>
      </aside>

      {/* Sağ: Sohbet */}
      <section className="card flex flex-col">
        <div className="flex justify-between items-center mb-2">
          <div className="text-sm text-gray-600">Hatırla:
            <input type="checkbox" className="ml-2" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
          </div>
          {info && <div className="text-xs text-gray-700">{info}</div>}
        </div>

        <div className="flex-1 min-h-[300px] max-h-[60vh] overflow-auto space-y-2">
          {messages.map((m, i) => (
            <div key={i} className={(m.role === "user" ? "text-right" : "text-left")}>
              <div className={"inline-block px-3 py-2 rounded-lg " + (m.role === "user" ? "bg-blue-600 text-white" : "bg-gray-100")}>
                {m.content}
              </div>
            </div>
          ))}
          {!messages.length && (
            <div className="text-sm text-gray-500">Ruh İkiziminle konuşmaya başla. Buradaki konuşmalarını istersen hatırlayabilir.</div>
          )}
        </div>

        <div className="mt-3 flex gap-2">
          <input
            className="input flex-1"
            placeholder="Mesajını yaz..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => (e.key === "Enter" ? send() : null)}
          />
          <button className="btn" onClick={send} disabled={busy || !input.trim()}>
            Gönder
          </button>
        </div>
      </section>
    </div>
  );
}
