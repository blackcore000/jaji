import React, { useEffect, useState } from "react";
import { db, rtdb } from "../firebase";
import { ref, onValue, set } from "firebase/database";
import { v4 as uuid } from "uuid";

export default function DuelPage() {
  const [roomId, setRoomId] = useState("");
  const [slots, setSlots] = useState(["", "", "", ""]);
  const [earnings, setEarnings] = useState(0);

  const createRoom = async () => {
    const id = "duel_" + uuid().slice(0, 8);
    await set(ref(rtdb, `duel/${id}`), {
      slots: ["", "", "", ""],
      earnings: 0,
      startedAt: Date.now()
    });
    setRoomId(id);
  };

  useEffect(() => {
    if (!roomId) return;
    const er = ref(rtdb, `duel/${roomId}/earnings`);
    return onValue(er, (snap) => setEarnings(snap.val() || 0));
  }, [roomId]);

  return (
    <div className="max-w-4xl mx-auto card">
      <h1 className="text-xl font-bold mb-3">Düello Yayın</h1>
      <div className="flex gap-2 mb-3">
        <button className="btn" onClick={createRoom}>Oda Oluştur</button>
        {roomId && <div className="text-sm">Oda: {roomId} · Kazanç: {earnings}</div>}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="aspect-video bg-black/80 rounded flex items-center justify-center text-white">
            SLOT {i + 1}
          </div>
        ))}
      </div>

      <p className="text-sm text-gray-600 mt-3">
        Not: MVP’de yalnız görsel yer tutucu. WebRTC entegrasyonunu daha önce verdiğimiz <b>LiveCamera</b> üzerinden çoğaltacağız.
      </p>
    </div>
  );
}
