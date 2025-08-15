import React, { useState } from "react";

export default function ChatInput({ onSend }) {
  const [text, setText] = useState("");

  const submit = (e) => {
    e.preventDefault();
    const t = text.trim();
    if (!t) return;
    onSend(t);
    setText("");
  };

  return (
    <form onSubmit={submit} className="border-t dark:border-gray-800 p-2 flex gap-2">
      <input
        className="flex-1 input"
        placeholder="Mesaj yaz…"
        value={text}
        onChange={(e)=>setText(e.target.value)}
      />
      <button className="btn" type="submit">Gönder</button>
    </form>
  );
}
