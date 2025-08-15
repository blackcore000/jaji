import React, { useState } from "react";

export default function PostEditor() {
  const [text, setText] = useState("");
  const [media, setMedia] = useState(null);
  const [gif, setGif] = useState(null);
  const [music, setMusic] = useState(null);
  const [location, setLocation] = useState("");
  const [tags, setTags] = useState("");
  const [date, setDate] = useState("");

  const handleMediaUpload = (e) => setMedia(URL.createObjectURL(e.target.files[0]));
  const handleGifUpload = (e) => setGif(URL.createObjectURL(e.target.files[0]));
  const handleMusicUpload = (e) => setMusic(URL.createObjectURL(e.target.files[0]));

  const handleSubmit = () => {
    const newPost = {
      text,
      media,
      gif,
      music,
      location,
      tags: tags.split(",").map((tag) => tag.trim()),
      date,
    };
    console.log("Yeni Gönderi:", newPost);
    alert("Gönderi hazır! Yayına alınabilir.");
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-4 rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-4">Gönderi Oluştur / Düzenle</h2>

      <textarea
        className="w-full border rounded p-2 mb-3"
        rows="4"
        placeholder="Bir şeyler yaz..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      ></textarea>

      <input type="file" accept="image/*,video/*" onChange={handleMediaUpload} className="mb-3" />
      <input type="file" accept="image/gif" onChange={handleGifUpload} className="mb-3" />
      <input type="file" accept="audio/*" onChange={handleMusicUpload} className="mb-3" />

      <input
        type="text"
        placeholder="Konum ekle"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        className="w-full border rounded p-2 mb-3"
      />

      <input
        type="text"
        placeholder="Etiketler (virgülle ayır)"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        className="w-full border rounded p-2 mb-3"
      />

      <input
        type="datetime-local"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="w-full border rounded p-2 mb-3"
      />

      <div className="mb-3">
        {media && <video src={media} controls className="max-h-60 mb-2" />}
        {gif && <img src={gif} alt="GIF" className="max-h-60 mb-2" />}
        {music && <audio src={music} controls className="w-full mb-2" />}
      </div>

      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
      >
        Gönderiyi Yayınla
      </button>
    </div>
  );
}
