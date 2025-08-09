import { useState } from "react";

export default function Share() {
  const [text, setText] = useState("");
  const [posts, setPosts] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim() === "") return;

    const newPost = {
      id: Date.now(),
      content: text,
      likes: 0,
    };

    setPosts([newPost, ...posts]);
    setText("");
  };

  return (
    <div className="max-w-xl mx-auto mt-8 p-4 bg-white shadow-md rounded-xl">
      <h2 className="text-2xl font-bold mb-4 text-center">İçerik Paylaş</h2>

      <form onSubmit={handleSubmit} className="mb-6">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Ne düşünüyorsun?"
          className="w-full border border-gray-300 rounded-lg p-2 mb-2 resize-none"
          rows="4"
        ></textarea>
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
        >
          Paylaş
        </button>
      </form>

      <div className="space-y-4">
        {posts.map((post) => (
          <div
            key={post.id}
            className="border p-3 rounded-md bg-gray-50 shadow-sm"
          >
            <p className="text-gray-800">{post.content}</p>
            <p className="text-sm text-gray-500 mt-1">Beğeni: {post.likes}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
