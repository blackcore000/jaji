import { useState } from "react";

export default function CommentBox({ onComment }) {
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      onComment(text.trim());
      setText("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <textarea
        className="w-full p-2 border rounded mb-2"
        rows={3}
        placeholder="Yorum yaz..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      ></textarea>
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
      >
        Yorum Yap
      </button>
    </form>
  );
}
