import React, { useEffect, useState } from "react";

function loadStories() {
  const raw = localStorage.getItem("stories");
  return raw ? JSON.parse(raw) : []; // [{id, username, avatar, items:[{url, at}], at}]
}

export default function StoryBar({ onOpen }) {
  const [stories, setStories] = useState([]);

  useEffect(() => {
    setStories(loadStories());
  }, []);

  if (stories.length === 0) return null;

  return (
    <div className="card" style={{overflowX:"auto"}}>
      <div style={{display:"flex", gap:12}}>
        {stories.map((s) => (
          <button
            key={s.id}
            onClick={() => onOpen?.(s.id)}
            style={{display:"flex", flexDirection:"column", alignItems:"center"}}
            title={`@${s.username}`}
          >
            <img
              src={s.avatar}
              alt={s.username}
              width="64"
              height="64"
              style={{borderRadius:999, objectFit:"cover", border:"3px solid #2563eb"}}
            />
            <span style={{fontSize:12, color:"#374151", marginTop:6}}>@{s.username}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
