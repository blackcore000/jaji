import React, { useContext, useEffect, useState } from "react";
import { AuthCtx } from "../AuthProvider";
import ChatSidebar from "../components/chat/ChatSidebar";
import ChatMessage from "../components/chat/ChatMessage";
import ChatInput from "../components/chat/ChatInput";
import { createChannel, createGroup, sendMessage, watchMessages } from "../lib/chat";

export default function ChatPage() {
  const { user } = useContext(AuthCtx) || {};
  const [selected, setSelected] = useState(null); // {id, type, ...}
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (!selected?.id) return;
    const off = watchMessages(selected.id, setMessages);
    return () => off && off();
  }, [selected?.id]);

  const onSend = async (text) => {
    if (!selected?.id || !user?.uid) return;
    await sendMessage(selected.id, { uid: user.uid, text });
  };

  const newGroup = async () => {
    const name = prompt("Grup adı?");
    if (!name || !user?.uid) return;
    const id = await createGroup({ name, owner: user.uid });
    setSelected({ id, type: "group", name, members: [user.uid] });
  };

  const newChannel = async () => {
    const name = prompt("Kanal adı?");
    if (!name || !user?.uid) return;
    const id = await createChannel({ name, owner: user.uid });
    setSelected({ id, type: "channel", name, members: [user.uid] });
  };

  return (
    <div className="grid grid-cols-[260px_1fr] h-[calc(100vh-64px)]">
      <div>
        <div className="p-2 border-b dark:border-gray-800 flex gap-2">
          <button className="btn" onClick={newGroup}>+ Grup</button>
          <button className="btn" onClick={newChannel}>+ Kanal</button>
        </div>
        <ChatSidebar onSelectChat={setSelected} />
      </div>

      <div className="flex flex-col">
        <div className="p-3 border-b dark:border-gray-800 text-sm">
          {selected ? (
            <b>{selected.name || selected.id}</b>
          ) : (
            "Bir sohbet seç veya yeni grup/kanal oluştur."
          )}
        </div>
        <div className="flex-1 overflow-y-auto p-3">
          {messages.map(m => <ChatMessage key={m.id} m={m} me={user?.uid} />)}
        </div>
        {selected && <ChatInput onSend={onSend} />}
      </div>
    </div>
  );
}
