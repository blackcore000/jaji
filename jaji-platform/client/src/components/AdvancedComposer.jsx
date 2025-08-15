import { useMemo, useState } from "react";

// basit sticker kataloğu
const STICKERS = ["🔥", "🎉", "💎", "😂", "💖", "👑", "⚡", "🌙", "🎵"];
function parseTags(text) {
  const hashtags = Array.from(text.matchAll(/#(\w+)/g)).map(m => m[1]);
  const mentions = Array.from(text.matchAll(/@(\w+)/g)).map(m => m[1]);
  return { hashtags, mentions };
}

export default function AdvancedComposer({ onShare }) {
  const [content, setContent] = useState("");
  const [media, setMedia] = useState(null); // {file,preview,type}
  const [stickers, setStickers] = useState([]);
  const [location, setLocation] = useState("");
  const [schedule, setSchedule] = useState("");
  const [musicUrl, setMusicUrl] = useState(""); // opsiyonel
  const [gifOnly, setGifOnly] = useState(false);

  const addSticker = (s) => setStickers(prev => prev.includes(s) ? prev : [...prev, s]);
  const removeSticker = (s) => setStickers(prev => prev.filter(x => x !== s));

  const onPick = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const isGif = f.type === "image/gif";
    setGifOnly(isGif);
    setMedia({
      file: f,
      preview: URL.createObjectURL(f),
      type: f.type.startsWith("video") ? "video" : "image",
      isGif
    });
  };

  const meta = useMemo(() => {
    const { hashtags, mentions } = parseTags(content);
    return { hashtags, mentions };
  }, [content]);

  const share = () => {
    if (!content.trim() && !media) {
      alert("Bir şeyler yaz veya medya ekle!");
      return;
    }
    onShare({
      content: content.trim(),
      media,
      stickers,
      location: location.trim() || null,
      scheduledAt: schedule || null,
      music: musicUrl.trim() || null,
      ...meta,
    });
    // reset
    setContent(""); setMedia(null); setStickers([]); setLocation(""); setSchedule(""); setMusicUrl(""); setGifOnly(false);
  };

  return (
    <div className="border rounded p-4 bg-white dark:bg-gray-800">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Ne düşünüyorsun? (#hashtag, @kullanici)"
        className="border p-2 rounded w-full mb-2 dark:bg-gray-900"
      />
      {media && (
        <div className="mb-2">
          {media.type === "video"
            ? <video src={media.preview} controls className="w-full rounded" />
            : <img src={media.preview} className="w-full rounded" alt="preview" />}
        </div>
      )}
      <div className="flex flex-wrap items-center gap-2 mb-2">
        <input type="file" accept="image/*,video/*" onChange={onPick} />
        <input
          type="text"
          placeholder="Konum (örn: İstanbul)"
          className="border p-2 rounded"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <input
          type="datetime-local"
          className="border p-2 rounded"
          value={schedule}
          onChange={(e) => setSchedule(e.target.value)}
        />
        <input
          type="url"
          placeholder="Müzik URL (opsiyonel)"
          className="border p-2 rounded w-60"
          value={musicUrl}
          onChange={(e) => setMusicUrl(e.target.value)}
        />
      </div>

      <div className="mb-2">
        <div className="text-sm mb-1">Sticker seç:</div>
        <div className="flex flex-wrap gap-1">
          {STICKERS.map(s => (
            <button
              key={s}
              className={`px-2 py-1 rounded border ${stickers.includes(s) ? "bg-yellow-100" : "bg-white"}`}
              onClick={() => (stickers.includes(s) ? removeSticker(s) : addSticker(s))}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="text-sm text-gray-600 mb-2">
        {meta.hashtags.length > 0 && <>Etiketler: {meta.hashtags.join(", ")} · </>}
        {meta.mentions.length > 0 && <>Bahsedenler: {meta.mentions.join(", ")}</>}
      </div>

      <button onClick={share} className="bg-blue-600 text-white px-4 py-2 rounded w-full">
        Paylaş
      </button>
      {gifOnly && <div className="mt-2 text-xs text-purple-600">GIF yüklendi: oynatım otomatik olmayabilir.</div>}
    </div>
  );
}
