// src/pages/LiveStreamOnline.jsx  (GÜNCEL)
import React, { useContext, useEffect, useMemo, useState } from "react";
import {
  ref, onValue, push, set, update, remove, serverTimestamp, onDisconnect, runTransaction
} from "firebase/database";
import { db } from "../firebase";
import GiftToast from "../components/GiftToast";
import { getClientId, getDisplayName } from "../lib/id";
import { AuthCtx } from "../AuthProvider";
import GiftStore from "../components/GiftStore";

const GIFT_CATALOG = [
  { name: "Kalp", emoji: "❤️", points: 10 },
  { name: "Gül", emoji: "🌹", points: 50 },
  { name: "Altın", emoji: "💰", points: 100 },
  { name: "Taç", emoji: "👑", points: 500 },
];

export default function LiveStreamOnline() {
  const { user } = useContext(AuthCtx) || {};
  const clientId = useMemo(() => getClientId(), []);
  const displayName = useMemo(() => user?.displayName || getDisplayName(), [user?.displayName]);

  const [rooms, setRooms] = useState([]);
  const [roomName, setRoomName] = useState("");
  const [mode, setMode] = useState("single"); // single | duel | trio | quad
  const [current, setCurrent] = useState(null);
  const [messages, setMessages] = useState([]);
  const [gifts, setGifts] = useState([]);
  const [earnings, setEarnings] = useState(0);
  const [presenceCount, setPresenceCount] = useState(0);
  const [newMsg, setNewMsg] = useState("");
  const [hosts, setHosts] = useState({});
  const maxHosts = useMemo(() => (mode === "single" ? 1 : mode === "duel" ? 2 : mode === "trio" ? 3 : 4), [mode]);

  useEffect(() => {
    const roomsRef = ref(db, "rooms");
    const off = onValue(roomsRef, (snap) => {
      const v = snap.val() || {};
      const list = Object.entries(v).map(([id, data]) => ({ id, ...data }));
      setRooms(list.sort((a,b) => (b.createdAt || 0) - (a.createdAt || 0)));
    });
    return () => off();
  }, []);

  const startRoom = async () => {
    if (!roomName.trim()) return alert("Oda adı gir!");
    const r = push(ref(db, "rooms"));
    const initialHosts = { [clientId]: true };
    await set(r, {
      name: roomName,
      mode,
      earnings: 0,
      createdAt: Date.now(),
      hosts: initialHosts,
      owner: user?.uid || null,
    });
    await joinRoom({ id: r.key, name: roomName, mode });
  };

  const joinRoom = async (room) => {
    setCurrent(room);

    const myPresenceRef = ref(db, `rooms/${room.id}/presence/${clientId}`);
    await set(myPresenceRef, { name: displayName, joinedAt: serverTimestamp(), uid: user?.uid || null });
    onDisconnect(myPresenceRef).remove();

    const presenceRef = ref(db, `rooms/${room.id}/presence`);
    const offPresence = onValue(presenceRef, (snap) => {
      const v = snap.val() || {};
      setPresenceCount(Object.keys(v).length);
    });

    const messagesRef = ref(db, `rooms/${room.id}/messages`);
    const offMessages = onValue(messagesRef, (snap) => {
      const v = snap.val() || {};
      setMessages(Object.values(v));
    });

    const giftsRef = ref(db, `rooms/${room.id}/gifts`);
    const offGifts = onValue(giftsRef, (snap) => {
      const v = snap.val() || {};
      const arr = Object.entries(v).map(([id, g]) => ({ id, ...g }));
      arr.sort((a, b) => (a.ts || 0) - (b.ts || 0));
      setGifts(arr);
    });

    const metaRef = ref(db, `rooms/${room.id}`);
    const offMeta = onValue(metaRef, (snap) => {
      const v = snap.val();
      if (!v) return;
      setEarnings(v.earnings || 0);
      setMode(v.mode || "single");
      setHosts(v.hosts || {});
    });

    return () => {
      offPresence();
      offMessages();
      offGifts();
      offMeta();
      remove(myPresenceRef).catch(()=>{});
    };
  };

  const leaveRoom = async () => {
    if (!current) return;
    try { await remove(ref(db, `rooms/${current.id}/presence/${clientId}`)); } catch {}
    setCurrent(null);
    setMessages([]);
    setGifts([]);
    setEarnings(0);
    setPresenceCount(0);
  };

  const toggleHost = async () => {
    if (!current) return;
    const isHost = !!hosts[clientId];
    const currentHostCount = Object.keys(hosts || {}).length;

    if (isHost) {
      const next = { ...hosts }; delete next[clientId];
      await update(ref(db, `rooms/${current.id}`), { hosts: next });
    } else {
      if (currentHostCount >= maxHosts) return alert(`En fazla ${maxHosts} yayıncı.`);
      await update(ref(db, `rooms/${current.id}`), { hosts: { ...(hosts||{}), [clientId]: true }});
    }
  };

  const sendMessage = async () => {
    if (!current || !newMsg.trim()) return;
    const mRef = push(ref(db, `rooms/${current.id}/messages`));
    await set(mRef, { user: displayName, text: newMsg, ts: serverTimestamp(), uid: user?.uid || null });
    setNewMsg("");
  };

  // (Mağaza bileşeni spendCredits yapıyor; burada sadece kazancı güvenceye alıyoruz)
  useEffect(() => {
    if (!current) return;
    const earnRef = ref(db, `rooms/${current.id}/earnings`);
    const off = onValue(earnRef, (snap) => setEarnings(snap.val() || 0));
    return () => off();
  }, [current?.id]);

  const commission = (earnings * 0.2).toFixed(2);
  const payout = (earnings - earnings * 0.2).toFixed(2);

  const hostIds = Object.keys(hosts || {});
  const gridCols = mode === "single" ? "1fr" : mode === "duel" ? "1fr 1fr" : "1fr 1fr";
  const gridRows = mode === "trio" ? "1fr 1fr" : mode === "quad" ? "1fr 1fr" : "1fr";

  if (!current) {
    return (
      <div className="p-6 bg-gray-900 text-white min-h-screen">
        <h2 className="text-2xl font-bold mb-4">🎥 Canlı Yayın (Online)</h2>

        <div className="mb-6 space-y-2">
          {rooms.map((r) => (
            <div key={r.id} className="bg-gray-800 p-3 rounded flex items-center justify-between">
              <div>
                <div className="font-semibold">{r.name}</div>
                <div className="text-sm text-gray-300">
                  Mod: {r.mode} • Yayıncı: {r.hosts ? Object.keys(r.hosts).length : 0} • Kazanç: {r.earnings || 0}
                </div>
              </div>
              <button className="btn" onClick={() => joinRoom(r)}>Katıl</button>
            </div>
          ))}
          {rooms.length === 0 && (<div className="text-gray-300">Hiç oda yok. Aşağıdan aç.</div>)}
        </div>

        <div className="max-w-md bg-gray-800 p-4 rounded">
          <h3 className="font-bold mb-2">Yeni Oda Aç</h3>
          <input className="input mb-2" placeholder="Oda adı..."
            value={roomName} onChange={(e)=>setRoomName(e.target.value)} />
          <select className="input mb-3" value={mode} onChange={(e)=>setMode(e.target.value)}>
            <option value="single">Tekli</option>
            <option value="duel">2’li Düello</option>
            <option value="trio">3’lü Düello</option>
            <option value="quad">4’lü Düello</option>
          </select>
          <button className="btn w-full" onClick={startRoom}>Yayını Başlat</button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-black text-white relative">
      <GiftToast giftList={gifts} />

      <div className="flex justify-between items-center p-3 bg-gray-900">
        <div>
          <div className="font-bold">{current.name}</div>
          <div className="text-sm text-gray-300">
            Mod: {mode} • İzleyici: {presenceCount} • Yayıncı: {Object.keys(hosts || {}).length}/{maxHosts}
          </div>
          <div className="text-sm">
            Kazanç: {earnings}p • Komisyon: {commission}p • Yayıncı Payı: {payout}p
          </div>
        </div>
        <div className="flex gap-2">
          <button className="btn" onClick={toggleHost}>
            {hosts[clientId] ? "Yayıncıdan Çık" : "Yayıncı Ol"}
          </button>
          <button className="btn bg-red-600 hover:bg-red-700" onClick={leaveRoom}>Çık</button>
        </div>
      </div>

      <div className="flex-1 grid gap-2 p-2" style={{ gridTemplateColumns: gridCols, gridTemplateRows: gridRows }}>
        {hostIds.map((hid, i) => (
          <div key={hid} className="bg-gray-700 rounded flex items-center justify-center text-xl">
            Yayıncı {i + 1}
          </div>
        ))}
        {Array.from({ length: Math.max(0, maxHosts - hostIds.length) }).map((_, i) => (
          <div key={`empty-${i}`} className="bg-gray-800/60 rounded border border-dashed border-gray-600
           flex items-center justify-center text-gray-400">
            Boş Slot
          </div>
        ))}
      </div>

      <div className="bg-gray-900 p-2 grid gap-2 md:grid-cols-[1fr_320px]">
        {/* Chat */}
        <div>
          <div className="h-32 overflow-y-auto border-b border-gray-700 mb-2">
            {messages.map((m, i) => (
              <div key={i} className="text-sm">
                <strong>{m.user}:</strong> {m.text}
              </div>
            ))}
          </div>
          <div className="flex">
            <input className="flex-1 p-2 text-black rounded-l" placeholder="Mesaj yaz…"
              value={newMsg} onChange={(e)=>setNewMsg(e.target.value)}
              onKeyDown={(e)=>e.key==="Enter" && sendMessage()} />
            <button className="btn rounded-l-none" onClick={sendMessage}>Gönder</button>
          </div>
        </div>

        {/* Hediye Mağazası */}
        <GiftStore user={user} roomId={current.id} catalog={GIFT_CATALOG} />
      </div>
    </div>
  );
}
