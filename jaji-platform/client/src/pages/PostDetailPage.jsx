import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import PostCard from "../components/PostCard";

export default function PostDetailPage() {
  const { id } = useParams();

  // Örnek gönderi
  const post = {
    id: id,
    username: "Ahmet",
    userAvatar: "https://i.pravatar.cc/40?img=1",
    content: "Güne harika başladım! ☀️",
    image: "https://placekitten.com/400/250",
    likes: 15,
    retweets: 2,
    views: 50,
    comments: [
      { id: 1, username: "Mehmet", text: "Harika görünüyorsun! 👏" },
      { id: 2, username: "Ayşe", text: "Enerjin çok güzel 💫" }
    ]
  };

  const [comments, setComments] = useState(post.comments);
  const [newComment, setNewComment] = useState("");

  // Yorum ekleme
  const handleAddComment = () => {
    if (newComment.trim() === "") return;
    const comment = {
      id: comments.length + 1,
      username: "Sen", // Buraya giriş yapan kullanıcı gelecek
      text: newComment
    };
    setComments([comment, ...comments]);
    setNewComment("");
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Link to="/" className="text-blue-500 hover:underline mb-4 block">
        ← Geri Dön
      </Link>

      {/* Gönderi Kartı */}
      <PostCard post={post} />

      {/* Yorumlar */}
      <h2 className="text-lg font-semibold mt-6 mb-2">💬 Yorumlar</h2>
      <div className="space-y-3">
        {comments.map((c) => (
          <div key={c.id} className="p-3 bg-gray-100 rounded-lg">
            <p className="font-semibold">{c.username}</p>
            <p>{c.text}</p>
          </div>
        ))}
      </div>

      {/* Yorum Ekleme */}
      <div className="mt-4 flex gap-2">
        <input
          type="text"
          placeholder="Yorum yaz..."
          className="flex-1 border border-gray-300 rounded-lg p-2"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button
          onClick={handleAddComment}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Gönder
        </button>
      </div>
    </div>
  );
}
