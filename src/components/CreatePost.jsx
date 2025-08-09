import React, { useState } from "react";

export default function CreatePost() {
  const [username, setUsername] = useState("blackcore");
  const [content, setContent]   = useState("");
  const [image, setImage]       = useState("");

  const submit = (e) => {
    e.preventDefault();
    if(!content.trim()) return;

    const newPost = {
      id: "u-" + Date.now(),
      username,
      avatar: `https://api.dicebear.com/7.x/thumbs/svg?seed=${encodeURIComponent(username)}`,
      content,
      image: image || "",
      likes: 0, retweets: 0, views: 0,
      timestamp: Date.now()
    };

    const raw = localStorage.getItem("posts-extra");
    const arr = raw ? JSON.parse(raw) : [];
    arr.unshift(newPost);
    localStorage.setItem("posts-extra", JSON.stringify(arr));

    setContent(""); setImage("");
    alert("Paylaşıldı! Ana sayfaya dön ve gör 🎉");
  };

  return (
    <div className="card">
      <h2 style={{fontSize:20, fontWeight:800, marginBottom:12}}>Paylaş</h2>
      <form onSubmit={submit} className="row" style={{flexDirection:"column", alignItems:"stretch", gap:12}}>
        <input className="input" value={username} onChange={e=>setUsername(e.target.value)} placeholder="Kullanıcı adı" />
        <textarea className="textarea" rows={4} value={content} onChange={e=>setContent(e.target.value)} placeholder="Ne düşünüyorsun?"></textarea>
        <input className="input" value={image} onChange={e=>setImage(e.target.value)} placeholder="Görsel URL (opsiyonel)" />
        <button className="btn" type="submit">Yayınla</button>
      </form>
    </div>
  );
}
