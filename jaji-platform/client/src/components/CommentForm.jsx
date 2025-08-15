import { useState } from "react";

export default function CommentForm({ onAddComment }) {
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    onAddComment({
      username: "Sen", // giriş yapan kullanıcı
      avatar: "https://i.pravatar.cc/150?img=12",
      text
    });
    setText("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex space-x-2 mt-2">
      <input
        type="text"
        placeholder="Yorum yaz..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="flex-1 border rounded-lg px-3 py-1"
      />
      <button
        type="submit"
        className="bg-blue-500 text-white px-3 rounded-lg"
      >
        Gönder
      </button>
    </form>
  );
}
