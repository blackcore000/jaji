import React, { useContext, useEffect, useState } from "react";
import { AuthCtx } from "../../AuthProvider";
import { db } from "../../firebase";
import { collection, onSnapshot, query } from "firebase/firestore";

export default function ChatSidebar({ onSelectChat }) {
  const { user } = useContext(AuthCtx) || {};
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "rooms"));
    const off = onSnapshot(q, (snap) => {
      const all = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      // Üyenin olduğu odaları öne al
      const mineFirst = all.sort((a,b) => {
        const am = (a.members || []).includes(user?.uid);
        const bm = (b.members || []).includes(user?.uid);
        return (am === bm) ? 0 : am ? -1 : 1;
      });
      setRooms(mineFirst);
    });
    return () => off();
  }, [user?.uid]);

  return (
    <aside className="w-64 border-r dark:border-gray-800 p-3">
      <div className="text-xs uppercase text-gray-500 mb-2">Sohbetler</div>
      <div className="flex flex-col gap-1">
        {rooms.map(r => (
          <button
            key={r.id}
            onClick={() => onSelectChat(r)}
            className="text-left px-2 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <div className="text-sm font-semibold">
              {r.type === "group" ? "👥 " : r.type === "channel" ? "📣 " : "💬 "}
              {r.name || r.id.slice(0,6)}
            </div>
            <div className="text-[11px] text-gray-500">
              {r.type.toUpperCase()} • Üye: {r.members?.length || 1}
            </div>
          </button>
        ))}
      </div>
    </aside>
  );
}
