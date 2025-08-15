import React, { useContext, useState } from "react";
import { AuthCtx } from "../AuthProvider";
import { createStory } from "../lib/story";

export default function StoryEditor() {
  const { user } = useContext(AuthCtx) || {};
  const [text, setText] = useState("");
  const [gif, setGif] = useState("");
  const [music, setMusic] = useState("");
  const [location, setLocation] = useState("");
  const [tags, setTags] = useState("");
  const [color, setColor] = useState("#000000");
  const [msg, setMsg] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    if (!user?.uid) { setMsg("Önce giriş yap."); return; }
    const id = await createStory(user.uid, {
      text, gif: gif || null, music: music || null, location: location || null,
      tags: tags ? tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
      color
    });
    setMsg(`Hikâye oluşturuldu: ${id}`);
    setText(""); setGif(""); setMusic(""); setLocation(""); setTags("");
  };

  return (
    <div className="max-w-xl mx-auto card">
      <h1 className="text-xl font-bold mb-3">Hikâye Oluştur</h1>
      <form onSubmit={submit} className="grid gap-3">
        <textarea className="input min-h-[100px]" placeholder="Hikâye metni…"
          value={text} onChange={(e) => setText(e.target.value)} />
        <input className="input" placeholder="GIF URL (opsiyonel)" value={gif} onChange={(e) => setGif(e.target.value)} />
        <input className="input" placeholder="Müzik URL/ID (opsiyonel)" value={music} onChange={(e) => setMusic(e.target.value)} />
        <input className="input" placeholder="Konum (opsiyonel)" value={location} onChange={(e) => setLocation(e.target.value)} />
        <input className="input" placeholder="Etiketler virgülle: jaji,ruh,gece"
          value={tags} onChange={(e) => setTags(e.target.value)} />
        <div className="flex items-center gap-2">
          <span>Renk:</span>
          <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
        </div>
        <button className="btn">Yayınla</button>
        {msg && <div className="text-sm text-green-600">{msg}</div>}
      </form>
    </div>
  );
}
