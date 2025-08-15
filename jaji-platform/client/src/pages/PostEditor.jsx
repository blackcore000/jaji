import React, { useContext, useState } from "react";
import { AuthCtx } from "../AuthProvider";
import { addPost } from "../lib/posts";
import { uploadUserFile } from "../lib/upload";
import { isClean } from "../lib/moderation";

export default function PostEditor() {
  const { user } = useContext(AuthCtx) || {};
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    if (!user?.uid) return setMsg("Giriş yapmalısın.");
    if (!isClean(text)) return setMsg("İçerik uygun değil.");
    setBusy(true); setMsg("");
    try {
      let mediaUrl = "";
      let mediaType = "";
      if (file) {
        mediaUrl = await uploadUserFile(user.uid, file);
        mediaType = file.type.startsWith("video") ? "video" : "image";
      }
      await addPost(user.uid, { text, mediaUrl, mediaType });
      setText(""); setFile(null);
      setMsg("Paylaşıldı!");
    } catch (e) {
      setMsg(e.message || "Paylaşım başarısız.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="card max-w-2xl mx-auto">
      <h2 className="font-bold text-lg mb-2">Yeni Paylaşım</h2>
      <form onSubmit={submit} className="flex flex-col gap-2">
        <textarea
          className="input min-h-[120px]"
          placeholder="Bugün neler oluyor?"
          value={text}
          onChange={(e)=>setText(e.target.value)}
        />
        <input type="file" accept="image/*,video/*" onChange={(e)=>setFile(e.target.files?.[0]||null)} />
        <div className="flex gap-2">
          <button className="btn" disabled={busy} type="submit">{busy ? "Yükleniyor…" : "Paylaş"}</button>
          {msg && <div className="self-center text-sm text-gray-600">{msg}</div>}
        </div>
      </form>
    </div>
  );
}
