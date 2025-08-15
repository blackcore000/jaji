// src/pages/StoriesCreate.jsx
import { useState } from "react";
import { createStoryFB } from "../lib/stories";

export default function StoriesCreate({ currentUser }) {
  const [file, setFile] = useState(null); // File
  const [type, setType] = useState("image"); // image|video
  const [preview, setPreview] = useState("");
  const [tags, setTags] = useState("");
  const [music, setMusic] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");

  const onPick = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setType(f.type.startsWith("video") ? "video" : "image");
    setPreview(URL.createObjectURL(f));
  };

  const addStory = async () => {
    if (!file) return alert("Hikâye için görsel/video seç.");
    try {
      const saved = await createStoryFB({
        author: currentUser.username,
        file, type,
        music: music.trim() || null,
        tags: tags.split(",").map(s => s.trim()).filter(Boolean),
        location: location.trim() || null,
        date: date || null,
      });
      // basit bildirim
      alert("Hikâye yüklendi (Firebase). ID: " + saved.id);
      // reset
      setFile(null); setPreview(""); setTags(""); setMusic(""); setLocation(""); setDate("");
    } catch (e) {
      console.error(e);
      alert("Hikâye yüklenemedi: " + (e.message || e));
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <div className="border rounded p-4 bg-white dark:bg-gray-800">
        <input type="file" accept="image/*,video/*" onChange={onPick} />
        {preview && (
          <div className="mt-2">
            {type === "video"
              ? <video src={preview} controls className="w-full rounded" />
              : <img src={preview} className="w-full rounded" alt="story" />}
          </div>
        )}
        <div className="grid grid-cols-1 gap-2 mt-3">
          <input className="border p-2 rounded" placeholder="Etiketler (virgülle)" value={tags} onChange={(e) => setTags(e.target.value)} />
          <input className="border p-2 rounded" placeholder="Müzik URL" value={music} onChange={(e) => setMusic(e.target.value)} />
          <input className="border p-2 rounded" placeholder="Konum" value={location} onChange={(e) => setLocation(e.target.value)} />
          <input className="border p-2 rounded" type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <button onClick={addStory} className="bg-purple-600 text-white px-4 py-2 rounded w-full mt-3">Hikâye Paylaş</button>
      </div>
    </div>
  );
}
