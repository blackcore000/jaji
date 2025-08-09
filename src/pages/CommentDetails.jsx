// src/pages/CommentDetails.jsx
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function CommentDetails() {
  const { postId } = useParams();
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const storedPosts = JSON.parse(localStorage.getItem("posts")) || [];
    const post = storedPosts.find((p) => p.id === postId);
    if (post && post.comments) {
      setComments(post.comments);
    }
  }, [postId]);

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Yorumlar</h2>
      {comments.length > 0 ? (
        <ul className="space-y-4">
          {comments.map((comment, index) => (
            <li
              key={index}
              className="p-4 bg-gray-100 rounded shadow text-gray-800"
            >
              {comment}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">Henüz yorum yapılmamış.</p>
      )}
    </div>
  );
}
