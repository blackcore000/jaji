// src/pages/ExplorePage.jsx
import React, { useEffect, useState } from "react";
import { watchFeed } from "../lib/posts";
import PostCard from "../components/PostCard";

// Basit skor: likes*3 + comments*3 + rts*4 + views*0.2 - yaş cezası
function scoreOf(p) {
  const likes = p.likes || 0, cm = p.comments || 0, rt = p.rts || 0, v = p.views || 0;
  const created = p.createdAt?.seconds ? p.createdAt.seconds * 1000 : Date.now();
  const ageHours = (Date.now() - created) / 3600000;
  const freshnessPenalty = Math.max(0, ageHours - 24) * 0.5; // 24 saatten sonra azalan
  return likes * 3 + cm * 3 + rt * 4 + v * 0.2 - freshnessPenalty;
}

export default function ExplorePage() {
  const [items, setItems] = useState([]);
  useEffect(() => {
    const off = watchFeed((list) => {
      const sorted = [...list].sort((a, b) => scoreOf(b) - scoreOf(a));
      setItems(sorted);
    }, 100);
    return () => off && off();
  }, []);

  return (
    <div>
      <h1 className="text-xl font-bold mb-3">Keşfet</h1>
      {items.map((p) => <PostCard key={p.id} post={p} />)}
      {items.length === 0 && <div className="card">Henüz içerik yok.</div>}
    </div>
  );
}
