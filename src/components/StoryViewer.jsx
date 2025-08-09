import React, { useEffect, useMemo, useRef, useState } from "react";

function loadStories() {
  const raw = localStorage.getItem("stories");
  return raw ? JSON.parse(raw) : [];
}

export default function StoryViewer({ storyId, onClose }) {
  const story = useMemo(() => loadStories().find(s => s.id === storyId), [storyId]);
  const [idx, setIdx] = useState(0);
  const timer = useRef(null);

  useEffect(() => {
    if (!story) return;
    timer.current = setInterval(() => {
      setIdx(i => {
        const next = i + 1;
        if (next >= story.items.length) {
          clearInterval(timer.current);
          onClose?.();
          return i;
        }
        return next;
      });
    }, 3000); // 3 sn’de bir geç
    return () => clearInterval(timer.current);
  }, [story, onClose]);

  if (!story) return null;

  const current = story.items[idx];
  const isVideo = /\.(mp4|webm|ogg)$/i.test(current.url);

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center">
      <div className="card" style={{width:"min(92vw, 640px)", background:"#000", color:"#fff", position:"relative"}}>
        <button onClick={onClose} style={{position:"absolute", top:10, right:10, background:"#111827", borderRadius:8, padding:"6px 10px"}}>✕</button>
        <div style={{display:"flex", alignItems:"center", gap:10, padding:"10px 10px 0"}}>
          <img src={story.avatar} alt={story.username} width="36" height="36" style={{borderRadius:999}}/>
          <div style={{fontWeight:700}}>@{story.username}</div>
        </div>
        <div style={{padding:10}}>
          {isVideo ? (
            <video src={current.url} style={{width:"100%", borderRadius:12}} autoPlay muted playsInline />
          ) : (
            <img src={current.url} alt="" style={{width:"100%", borderRadius:12, objectFit:"cover", maxHeight:520}} />
          )}
        </div>
        {/* Progress */}
        <div style={{position:"absolute", top:0, left:0, right:0, height:4, display:"flex", gap:4, padding:8}}>
          {story.items.map((_, i)=>(
            <div key={i} style={{flex:1, background:"#374151"}}>
              <div style={{
                height:"100%",
                width: i<idx ? "100%" : i===idx ? "100%" : "0%",
                background:"#3b82f6",
                transition: "width 3s linear"
              }}/>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
