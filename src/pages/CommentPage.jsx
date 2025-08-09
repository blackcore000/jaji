// src/pages/CommentPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { db } from "../lib/firebase";
import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp, updateDoc, doc, increment } from "firebase/firestore";

export default function CommentPage() {
  const { postId } = useParams();
  const [list, setList] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    const q = query(collection(db, "posts", postId, "comments"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, snap => {
      setList(snap.docs.map(d => ({id:d.id, ...d.data()})));
    });
    return () => unsub();
  }, [postId]);

  const send = async (e) => {
    e.preventDefault();
    if(!text.trim()) return;
    await addDoc(collection(db, "posts", postId, "comments"), {
      text, createdAt: serverTimestamp()
    });
    // post.commentsCount +1
    await updateDoc(doc(db, "posts", postId), { commentsCount: increment(1) });
    setText("");
  };

  return (
    <div>
      <div style={{display:"flex", justifyContent:"space-between", marginBottom:12}}>
        <h2 style={{fontSize:22, fontWeight:800}}>Yorumlar</h2>
        <Link to="/" className="link active">← Ana sayfa</Link>
      </div>

      <form onSubmit={send} className="card" style={{marginBottom:16}}>
        <input className="input" value={text} onChange={e=>setText(e.target.value)} placeholder="Yorumun…" />
        <div style={{height:8}}/>
        <button className="btn" type="submit">Gönder</button>
      </form>

      {list.length===0 ? <div className="card">Henüz yorum yok.</div> : (
        list.map(c=>(
          <div key={c.id} className="card" style={{marginBottom:12}}>
            <div style={{fontWeight:600}}>{c.text}</div>
            <div className="badge">{c.createdAt?.toDate ? c.createdAt.toDate().toLocaleString() : ""}</div>
          </div>
        ))
      )}
    </div>
  );
}
