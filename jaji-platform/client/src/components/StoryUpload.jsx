import { useRef, useState } from "react";

export default function StoryUpload({ onAdd }) {
  const fileRef = useRef(null);
  const [busy, setBusy] = useState(false);

  const onPick = () => fileRef.current?.click();

  const handleFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    setBusy(true);
    // Mini gecikme: gerçek yüklemeyi simüle ediyoruz
    setTimeout(() => {
      onAdd?.({
        id: crypto.randomUUID(),
        mediaUrl: url,
        type: f.type.startsWith("video") ? "video" : "image",
        user: { name: "Sen", avatar: "https://i.pravatar.cc/100?img=1" },
        createdAt: Date.now()
      });
      setBusy(false);
    }, 300);
  };

  return (
    <div className="flex items-center gap-3">
      <button
        className="px-3 py-1 rounded-full bg-blue-600 text-white text-sm"
        onClick={onPick}
        disabled={busy}
      >
        {busy ? "Yükleniyor…" : "Hikaye Ekle"}
      </button>
      <input
        ref={fileRef}
        type="file"
        accept="image/*,video/*"
        className="hidden"
        onChange={handleFile}
      />
    </div>
  );
}
