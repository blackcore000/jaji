import { useState } from "react";

export default function CommentSection({ postId, comments, setComments }) {
  const [text, setText] = useState("");

  const handleAddComment = () => {
    if (!text.trim()) return;

    const newComment = {
      id: Date.now(),
      postId,
      text,
    };

    const updatedComments = [...comments, newComment];
    setComments(updatedComments);
    localStorage.setItem("comments", JSON.stringify(updatedComments));
    setText("");
  };

  const postComments = comments.filter((c) => c.postId === postId);

  return (
    <div className="mt-3 border-t pt-3">
      <h3 className="font-semibold text-sm">Yorumlar</h3>
      {postComments.length > 0 ? (
        postComments.map((c) => (
          <div key={c.id} className="text-sm mt-1 bg-gray-100 p-2 rounded">
            {c.text}
          </div>
        ))
      ) : (
        <p className="text-xs text-gray-500">Henüz yorum yok.</p>
      )}

      <div className="flex mt-2">
        <input
          type="text"
          placeholder="Yorum yaz..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 border p-2 rounded text-sm"
        />
        <button
          onClick={handleAddComment}
          className="ml-2 bg-blue-500 text-white px-3 rounded text-sm hover:bg-blue-600"
        >
          Ekle
        </button>
      </div>
    </div>
  );
}
