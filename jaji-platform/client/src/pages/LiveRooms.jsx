import { useMemo, useState } from "react";

/**
 * Bu, WebRTC/RTMP olmadan UI ve akış mantığını simüle eder.
 * Gerçek canlı yayın için: WebRTC SFU (mediasoup/livekit) + hediye mikroservisi gerekir.
 */
export default function LiveRooms({ currentUser, liveRooms, setLiveRooms }) {
  const [title, setTitle] = useState("");
  const [duoSize, setDuoSize] = useState(2); // 2 | 3 | 4
  const [selectedRoomId, setSelectedRoomId] = useState(null);

  const selected = useMemo(() => liveRooms.find(r => r.id === selectedRoomId) || null, [liveRooms, selectedRoomId]);

  const createRoom = () => {
    if (!title.trim()) return alert("Oda adı?");
    const id = Math.random().toString(36).slice(2, 9);
    const room = { id, title: title.trim(), hosts: [currentUser.username], duoSize, gifts: {} };
    setLiveRooms([room, ...liveRooms]);
    setTitle(""); setSelectedRoomId(id);
  };

  const joinRoom = (id) => {
    setLiveRooms(prev => prev.map(r => {
      if (r.id !== id) return r;
      if (!r.hosts.includes(currentUser.username) && r.hosts.length < r.duoSize) {
        return { ...r, hosts: [...r.hosts, currentUser.username] };
      }
      return r;
    }));
    setSelectedRoomId(id);
  };

  const leaveRoom = (id) => {
    setLiveRooms(prev => prev.map(r => {
      if (r.id !== id) return r;
      return { ...r, hosts: r.hosts.filter(h => h !== currentUser.username) };
    }));
    setSelectedRoomId(null);
  };

  const sendGift = (id, toUser, amount = 1) => {
    setLiveRooms(prev => prev.map(r => {
      if (r.id !== id) return r;
      const gifts = { ...(r.gifts || {}) };
      gifts[toUser] = (gifts[toUser] || 0) + amount;
      return { ...r, gifts };
    }));
  };

  return (
    <div className="grid md:grid-cols-[280px_1fr] gap-4">
      {/* Sol panel: oda listesi + oluştur */}
      <div className="bg-white dark:bg-gray-800 border rounded p-3">
        <h3 className="font-bold mb-2">Canlı Odalar</h3>
        <div className="flex gap-2 mb-2">
          <input
            className="border p-2 rounded w-full dark:bg-gray-900"
            placeholder="Oda başlığı"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <select className="border p-2 rounded dark:bg-gray-900" value={duoSize} onChange={(e) => setDuoSize(Number(e.target.value))}>
            <option value={2}>2'li</option>
            <option value={3}>3'lü</option>
            <option value={4}>4'lü</option>
          </select>
          <button onClick={createRoom} className="px-3 py-2 bg-green-600 text-white rounded">Kur</button>
        </div>
        <div className="space-y-2 max-h-[60vh] overflow-y-auto">
          {liveRooms.length === 0 ? (
            <div className="text-sm text-gray-500">Henüz oda yok.</div>
          ) : liveRooms.map(r => (
            <div key={r.id} className="border rounded p-2">
              <div className="font-semibold">{r.title}</div>
              <div className="text-xs text-gray-500">Kapasite: {r.hosts.length}/{r.duoSize} • ID: {r.id}</div>
              <div className="text-sm mt-1">Sunucular: {r.hosts.join(", ") || "-"}</div>
              <div className="mt-2 flex gap-2">
                <button onClick={() => joinRoom(r.id)} className="px-2 py-1 bg-blue-600 text-white rounded text-sm">Katıl</button>
                <button onClick={() => setSelectedRoomId(r.id)} className="px-2 py-1 border rounded text-sm">Görüntüle</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sağ panel: seçili oda */}
      <div className="bg-white dark:bg-gray-800 border rounded p-3">
        {!selected ? (
          <div className="text-sm text-gray-500">Bir odayı seç ya da oluştur.</div>
        ) : (
          <div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xl font-bold">{selected.title}</div>
                <div className="text-xs text-gray-500">ID: {selected.id}</div>
              </div>
              {selected.hosts.includes(currentUser.username) ? (
                <button onClick={() => leaveRoom(selected.id)} className="px-3 py-1 bg-gray-300 rounded">Ayrıl</button>
              ) : (
                <button onClick={() => joinRoom(selected.id)} className="px-3 py-1 bg-blue-600 text-white rounded">Katıl</button>
              )}
            </div>

            {/* “Video kareleri” simülasyonu */}
            <div className="grid grid-cols-2 gap-2 mt-3">
              {Array.from({ length: selected.duoSize }).map((_, i) => {
                const user = selected.hosts[i];
                return (
                  <div key={i} className="h-40 bg-black/70 text-white rounded flex items-center justify-center">
                    {user ? `🎥 ${user}` : "Boş slot"}
                  </div>
                );
              })}
            </div>

            {/* Hediye gönderimi */}
            <div className="mt-3">
              <div className="font-semibold mb-2">Hediye Gönder</div>
              <div className="flex flex-wrap gap-2">
                {selected.hosts.map(u => (
                  <button key={u} onClick={() => sendGift(selected.id, u, 1)} className="px-3 py-1 bg-pink-600 text-white rounded">
                    🎁 +1 → {u}
                  </button>
                ))}
              </div>
              <div className="text-sm text-gray-500 mt-2">
                Toplanan hediyeler:{" "}
                {Object.keys(selected.gifts || {}).length === 0
                  ? "—"
                  : Object.entries(selected.gifts).map(([u,c]) => `${u}: ${c}`).join(" • ")}
              </div>
            </div>

            <div className="text-xs text-gray-500 mt-3">
              Not: Bu bir demo akışı. Gerçek canlı yayın için WebRTC (SFU) ve hediye ekonomisi (cüzdan/bakiye) mikroservisleri entegre edilir.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
