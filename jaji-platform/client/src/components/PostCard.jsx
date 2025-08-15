import { useMemo, useState } from "react";

/**
 * Beklenen post yapısı:
 * {
 *   id: string,
 *   author: { name: string, avatar?: string, handle?: string },
 *   content: string,
 *   image?: string, // opsiyonel görsel
 *   video?: string, // opsiyonel video URL (mp4 vs)
 *   tags?: string[], // #etiket
 *   views?: number,
 *   likes?: number,
 *   comments?: number,
 *   retweets?: number,
 *   createdAt?: number | Date
 * }
 */

export default function PostCard({ post }) {
  const initial = useMemo(() => ({
    views: post?.views ?? 0,
    likes: post?.likes ?? 0,
    comments: post?.comments ?? 0,
    retweets: post?.retweets ?? 0,
  }), [post?.id]);

  const [views, setViews] = useState(initial.views);
  const [likes, setLikes] = useState(initial.likes);
  const [comments, setComments] = useState(initial.comments);
  const [retweets, setRetweets] = useState(initial.retweets);
  const [liked, setLiked] = useState(false);
  const [rted, setRted] = useState(false);
  const [commentText, setCommentText] = useState("");

  // Kart render olunca görüntülenme sayısını bir artır (tek seferlik)
  useState(() => { setViews((v) => v + 1); }, []);

  const onLike = () => {
    setLiked((prev) => !prev);
    setLikes((n) => (liked ? n - 1 : n + 1));
  };

  const onRT = () => {
    setRted((prev) => !prev);
    setRetweets((n) => (rted ? n - 1 : n + 1));
  };

  const onComment = () => {
    if (!commentText.trim()) return;
    setComments((n) => n + 1);
    setCommentText("");
  };

  return (
    <article className="card mb-4">
      {/* Üst bilgi */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={post?.author?.avatar || "/avatar_placeholder.png"}
            alt=""
            className="w-10 h-10 rounded-full object-cover border"
          />
          <div>
            <div className="font-semibold">{post?.author?.name || "Kullanıcı"}</div>
            {post?.author?.handle && (
              <div className="text-xs text-gray-500">{post.author.handle}</div>
            )}
          </div>
        </div>

        {/* Görüntülenme */}
        <div className="text-xs text-gray-500">
          {Intl.NumberFormat().format(views)} görüntülenme
        </div>
      </div>

      {/* Metin */}
      {post?.content && (
        <div className="mt-3 whitespace-pre-wrap">{post.content}</div>
      )}

      {/* Medya */}
      {post?.image && (
        <img
          src={post.image}
          alt=""
          className="mt-3 w-full rounded-xl border object-cover"
        />
      )}

      {post?.video && (
        <video
          className="mt-3 w-full rounded-xl border"
          src={post.video}
          controls
        />
      )}

      {/* Etiketler */}
      {!!post?.tags?.length && (
        <div className="mt-3 flex flex-wrap gap-2 text-sm">
          {post.tags.map((t) => (
            <span key={t} className="px-2 py-1 rounded-full bg-gray-100 text-gray-700">#{t}</span>
          ))}
        </div>
      )}

      {/* Aksiyonlar */}
      <div className="mt-4 flex items-center gap-3">
        <button
          onClick={onLike}
          className={"px-3 py-2 rounded-lg text-sm border " + (liked ? "bg-red-50 border-red-300 text-red-600" : "bg-white")}
          title="Beğen"
        >
          ❤ {likes}
        </button>

        <div className="flex items-center gap-2">
          <input
            className="input"
            placeholder="Yorum yaz..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" ? onComment() : null}
          />
          <button className="btn" onClick={onComment}>Yorum ({comments})</button>
        </div>

        <button
          onClick={onRT}
          className={"px-3 py-2 rounded-lg text-sm border " + (rted ? "bg-green-50 border-green-300 text-green-700" : "bg-white")}
          title="RT"
        >
          ↻ {retweets}
        </button>
      </div>
    </article>
  );
}
