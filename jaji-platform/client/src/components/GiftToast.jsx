// src/components/GiftToast.jsx
import React, { useEffect, useState } from "react";

/**
 * giftList: [{ id, name, emoji, points, from, ts }]
 * Sade bir overlay animasyonu: son 6 hediyeyi akıtır.
 */
export default function GiftToast({ giftList = [] }) {
  const [queue, setQueue] = useState([]);

  useEffect(() => {
    if (!giftList?.length) return;
    // En yeni hediyeler en sona gelsin
    const last = giftList.slice(-6);
    setQueue(last);
  }, [giftList]);

  return (
    <div className="pointer-events-none fixed inset-0 flex flex-col-reverse items-end gap-2 p-3">
      {queue.map((g) => (
        <div
          key={g.id}
          className="animate-slide-left bg-white/90 text-black rounded-lg shadow px-3 py-2 text-sm"
          style={{ animation: "slide-left 0.5s ease-out" }}
        >
          <span className="mr-1">{g.emoji}</span>
          <strong className="mr-1">{g.from || "Biri"}</strong>
          <span className="mr-1">{g.name}</span>
          <span className="text-xs text-gray-600">(+{g.points})</span>
        </div>
      ))}

      {/* basit animasyon CSS’i */}
      <style>{`
        @keyframes slide-left {
          0% { transform: translateX(120%); opacity: 0 }
          100% { transform: translateX(0); opacity: 1 }
        }
      `}</style>
    </div>
  );
}
