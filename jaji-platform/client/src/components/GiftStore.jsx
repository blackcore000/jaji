// src/components/GiftStore.jsx
import React, { useEffect, useState } from "react";
import { addCredits, spendCredits, getBalance } from "../lib/wallet";
import { ref, push, set, runTransaction, serverTimestamp } from "firebase/database";
import { db } from "../firebase";

export default function GiftStore({ user, roomId, catalog }) {
  const [balance, setBalance] = useState(0);
  const [buying, setBuying] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (!user?.uid) return;
    getBalance(user.uid).then(setBalance);
  }, [user?.uid]);

  const topup = async (amount) => {
    if (!user?.uid) return;
    setBuying(true); setMsg("");
    try {
      await addCredits(user.uid, amount, { note: "test-topup" });
      const b = await getBalance(user.uid);
      setBalance(b);
      setMsg(`${amount} kredi yüklendi.`);
    } catch (e) {
      setMsg(e.message);
    } finally {
      setBuying(false);
    }
  };

  const sendGift = async (g) => {
    if (!user?.uid || !roomId) return;
    setMsg("");
    try {
      await spendCredits(user.uid, g.points, { roomId, gift: g.name });
      // RTDB: room gifts + earnings
      const giftRef = push(ref(db, `rooms/${roomId}/gifts`));
      await set(giftRef, { ...g, from: user.displayName || user.uid, ts: serverTimestamp() });
      const earnRef = ref(db, `rooms/${roomId}/earnings`);
      await runTransaction(earnRef, (cur) => (cur || 0) + g.points);
      const b = await getBalance(user.uid);
      setBalance(b);
      setMsg(`${g.name} gönderildi.`);
    } catch (e) {
      setMsg(e.message);
    }
  };

  return (
    <div className="card">
      <div className="font-bold mb-2">🎁 Hediye Mağazası</div>
      <div className="text-sm mb-2">Bakiye: {balance} kredi</div>
      <div className="flex gap-2 flex-wrap mb-3">
        {[100, 500, 1000].map((a) => (
          <button key={a} className="btn" disabled={buying} onClick={() => topup(a)}>
            +{a} Kredi
          </button>
        ))}
      </div>
      <div className="flex gap-2 flex-wrap">
        {catalog.map((g) => (
          <button key={g.name} className="btn" onClick={() => sendGift(g)}>
            {g.emoji} {g.name} ({g.points})
          </button>
        ))}
      </div>
      {!!msg && <div className="text-xs mt-2 text-gray-600">{msg}</div>}
    </div>
  );
}
