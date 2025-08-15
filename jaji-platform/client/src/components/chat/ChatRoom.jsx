import { useEffect, useRef, useState } from "react";
import { getMessages, sendMessage, subscribeMessages } from "../../lib/chat.js";
import ChatMessage from "./ChatMessage.jsx";
import ChatInput from "./ChatInput.jsx";

export default function ChatRoom({ conversation }) {
  const [msgs, setMsgs] = useState([]);
  const scRef = useRef(null);

  useEffect(() => {
    if (!conversation?.id) return;
    setMsgs(getMessages(conversation.id));
    const off = subscribeMessages(conversation.id, setMsgs);
    return off;
  }, [conversation?.id]);

  useEffect(() => {
    scRef.current?.scrollTo({ top: scRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs.length]);

  const onSend = (text) => {
    sendMessage({ conversationId: conversation.id, author: "Sen", text });
  };

  if (!conversation) return <div className="card">Sohbet seç.</div>;

  return (
    <section className="card h-[calc(100vh-140px)] flex flex-col">
      <div className="pb-2 border-b mb-2">
        <h2 className="font-semibold">
          {conversation.title} <span className="text-sm opacity-60">({conversation.type})</span>
        </h2>
      </div>
      <div ref={scRef} className="flex-1 overflow-y-auto pr-1">
        {msgs.map((m) => <ChatMessage key={m.id} msg={m} />)}
        {msgs.length === 0 && <div className="text-sm text-gray-500">Henüz mesaj yok. İlk mesajı gönder.</div>}
      </div>
      <ChatInput onSend={onSend} />
    </section>
  );
}
