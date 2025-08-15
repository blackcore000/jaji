import React, { useState, useEffect } from "react";

export default function LiveStream() {
  const [isLive, setIsLive] = useState(false);
  const [viewers, setViewers] = useState(0);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [duelMode, setDuelMode] = useState(1); // 1=tekli, 2=2li, 3=3lu, 4=4lu
  const [gifts, setGifts] = useState([]);

  useEffect(() => {
    if (isLive) {
      const interval = setInterval(() => {
        setViewers((prev) => prev + Math.floor(Math.random() * 3));
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [isLive]);

  const startLive = () => {
    setIsLive(true);
    setViewers(1);
  };

  const stopLive = () => {
    setIsLive(false);
    setViewers(0);
  };

  const sendMessage = () => {
    if (input.trim() === "") return;
    setMessages([...messages, { user: "Sen", text: input }]);
    setInput("");
  };

  const sendGift = (gift) => {
    setGifts([...gifts, gift]);
  };

  return (
    <div className="p-4 max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">🎥 Canlı Yayın</h2>

      {!isLive ? (
        <>
          <label className="block mb-2 font-semibold">Düello Modu</label>
          <select
            value={duelMode}
            onChange={(e) => setDuelMode(parseInt(e.target.value))}
            className="border p-2 rounded w-full mb-4"
          >
            <option value={1}>Tekli Yayın</option>
            <option value={2}>2’li Düello</option>
            <option value={3}>3’lü Düello</option>
            <option value={4}>4’lü Düello</option>
          </select>
          <button
            onClick={startLive}
            className="bg-red-500 text-white px-4 py-2 rounded w-full"
          >
            🚀 Yayını Başlat
          </button>
        </>
      ) : (
        <>
          <div className="flex justify-between items-center mb-4">
            <span>👀 İzleyici: {viewers}</span>
            <button
              onClick={stopLive}
              className="bg-gray-500 text-white px-4 py-1 rounded"
            >
              Yayını Bitir
            </button>
          </div>

          <div className="border rounded p-4 mb-4 bg-black text-white h-64 overflow-y-auto">
            <p className="text-green-400">
              {duelMode} kişilik {duelMode > 1 ? "düello" : "canlı yayın"} başladı!
            </p>
            {messages.map((m, i) => (
              <p key={i}>
                <strong>{m.user}:</strong> {m.text}
              </p>
            ))}
          </div>

          {/* Mesaj Gönderme */}
          <div className="flex mb-4">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Mesaj yaz..."
              className="border p-2 rounded flex-1"
            />
            <button
              onClick={sendMessage}
              className="bg-blue-500 text-white px-4 ml-2 rounded"
            >
              Gönder
            </button>
          </div>

          {/* Hediye Gönderme */}
          <div className="mb-4">
            <h3 className="font-semibold mb-2">🎁 Hediye Gönder</h3>
            <div className="flex space-x-2">
              <button
                onClick={() => sendGift("🌹 Gül")}
                className="bg-pink-500 text-white px-3 py-1 rounded"
              >
                🌹 Gül
              </button>
              <button
                onClick={() => sendGift("💎 Elmas")}
                className="bg-purple-500 text-white px-3 py-1 rounded"
              >
                💎 Elmas
              </button>
              <button
                onClick={() => sendGift("🚗 Araba")}
                className="bg-yellow-500 text-white px-3 py-1 rounded"
              >
                🚗 Araba
              </button>
            </div>
          </div>

          {/* Gönderilen Hediyeler */}
          {gifts.length > 0 && (
            <div className="border rounded p-2 bg-gray-100 dark:bg-gray-700">
              <h4 className="font-semibold">Gönderilen Hediyeler:</h4>
              <ul>
                {gifts.map((gift, i) => (
                  <li key={i}>{gift}</li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
}
