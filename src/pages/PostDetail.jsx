import { useState } from "react";
import CommentBox from "../components/CommentBox";

export default function PostDetail() {
  const [comments, setComments] = useState([]);

  const handleNewComment = (comment) => {
    setComments([...comments, comment]);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📸 İçerik Başlığı</h1>

      {/* Yorum Bileşeni */}
      <CommentBox onComment={handleNewComment} />

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Yorumlar</h2>
        {comments.length === 0 ? (
          <p>Henüz yorum yok.</p>
        ) : (
          <ul className="space-y-2">
            {comments.map((comment, i) => (
              <li
                key={i}
                className="bg-gray-100 p-2 rounded border border-gray-300"
              >
                {comment}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
