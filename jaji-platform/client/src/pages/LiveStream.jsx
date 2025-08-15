import React, { useState, useEffect } from "react";

export default function LiveStream() {
  const [viewers, setViewers] = useState(0);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [gifts, setGifts] = useState([]);
  const [mode, setMode] = useState("single");
  const [earnings, setEarnings] = useState(0);

  const giftList = [
    { name: "Kalp", emoji: "❤️", points: 10 },
    { name: "Gül", emoji: "🌹", points: 50 },
    { name: "Altın", emoji: "💰", points: 100 },
    { name: "Taç", emoji: "👑", points: 500 }
  ];

  // Oda sistemi
  const [isInRoom, setIsInRoom] = useState(false);
  const [roomName, setRoomName] = useState("");
  const [rooms, setRooms] = useState(["DJ Show", "Sohbet Odası", "Müzik Düellosu"]);

  // İzleyici artışı simülasyonu
  useEffect(() => {
    if (isInRoom) {
      const interval = setInterval(() => {
        setViewers((prev) => prev + Math.floor(Math.random() * 3));
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isInRoom]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    setMessages([...messages, { user: "Sen", text: newMessage }]);
    setNewMessage("");
  };

  const sendGift = (gift) => {
    setGifts([...gifts, { name: gift.name, emoji: gift.emoji }]);
    setEarnings((prev) => prev + gift.points);

    setTimeout(() => {
      setGifts((prev) => prev.slice(1));
    }, 3000);
  };

  const startRoom = () => {
    if (!roomName.trim()) return alert("Oda ismi gir!");
    setRooms([...rooms, roomName]);
    setIsInRoom(true);
  };

  const joinRoom = (name) => {
    setRoomName(name);
    setIsInRoom(true);
  };

  if (!isInRoom) {
    return (
      <div className="p-6 bg-gray-900 text-white min-h-screen">
        <h2 className="text-2xl font-bold mb-4">🎥 Canlı Yayın Odaları</h2>
        <div className="mb-4">
          {rooms.map((room, i) => (
            <div key={i} className="flex justify-between bg-gray-800 p-2 mb-2 rounded">
              <span>{room}</span>
              <button
                onClick={() => joinRoom(room)}
                className="bg-blue-500 px-3 py-1 rounded"
              >
                Katıl
              </button>
            </div>
          ))}
        </div>
        <h3 className="text-xl mb-2">Yeni Oda Aç</h3>
        <input
          className="p-2 rounded text-black w-full mb-2"
          placeholder="Oda ismi..."
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
        />
        <select
          value={mode}
          onChange={(e) => setMode(e.target.value)}
          className="bg-gray-800 p-2 rounded w-full mb-2"
        >
          <option value="single">Tekli</option>
          <option value="duel">2’li Düello</option>
          <option value="trio">3’lü Düello</option>
          <option value="quad">4’lü Düello</option>
        </select>
        <button
          onClick={startRoom}
          className="bg-green-500 px-4 py-2 rounded w-full"
        >
          Yayını Başlat
        </button>
      </div>
    );
  }

  const commission = (earnings * 0.2).toFixed(2);
  const broadcasterEarnings = (earnings - commission).toFixed(2);

  return (
    <div className="h-screen flex flex-col bg-black text-white">
      {/* Üst Panel */}
      <div className="flex justify-between items-center p-4 bg-gray-900">
        <div>
          <h2 className="font-bold">🎥 {roomName} ({viewers} İzleyici)</h2>
          <p>Kazanç: {earnings} Puan | Komisyon: {commission} | Yayıncı Payı: {broadcasterEarnings}</p>
        </div>
        <button
          onClick={() => setIsInRoom(false)}
          className="bg-red-500 px-3 py-1 rounded"
        >
          Yayını Bitir
        </button>
      </div>

      {/* Yayın Alanı */}
      <div className="flex-1 grid gap-2 p-2"
        style={{
          gridTemplateColumns: mode === "single" ? "1fr" :
                              mode === "duel" ? "1fr 1fr" :
                              mode === "trio" ? "1fr 1fr" :
                              "1fr 1fr",
          gridTemplateRows: mode === "trio" ? "1fr 1fr" :
                            mode === "quad" ? "1fr 1fr" : "1fr"
        }}>
        {[...Array(mode === "single" ? 1 : mode === "duel" ? 2 : mode === "trio" ? 3 : 4)].map((_, i) => (
          <div key={i} className="bg-gray-700 rounded flex items-center justify-center text-2xl">
            Yayıncı {i + 1}
          </div>
        ))}
      </div>

      {/* Hediye Animasyonu */}
      <div className="absolute top-20 left-4 space-y-2">
        {gifts.map((gift, i) => (
          <div key={i} className="bg-pink-600 px-3 py-1 rounded-full animate-bounce">
            {gift.emoji} {gift.name}
          </div>
        ))}
      </div>

      {/* Sohbet */}
      <div className="bg-gray-900 p-2">
        <div className="h-32 overflow-y-auto border-b border-gray-700 mb-2">
          {messages.map((msg, i) => (
            <div key={i} className="text-sm">
              <strong>{msg.user}:</strong> {msg.text}
            </div>
          ))}
        </div>

        <div className="flex">
          <input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 p-1 text-black rounded-l"
            placeholder="Mesaj yaz..."
          />
          <button
            onClick={sendMessage}
            className="bg-blue-600 px-3 rounded-r"
          >
            Gönder
          </button>
        </div>

        {/* Hediye Butonları */}
        <div className="mt-2 flex gap-2 flex-wrap">
          {giftList.map((gift, i) => (
            <button
              key={i}
              onClick={() => sendGift(gift)}
              className="bg-purple-500 px-3 py-1 rounded"
            >
              {gift.emoji} {gift.name} ({gift.points}p)
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
