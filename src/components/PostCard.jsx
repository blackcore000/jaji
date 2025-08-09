// src/components/PostCard.jsx
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { db } from "../lib/firebase";
import { doc, increment, updateDoc } from "firebase/firestore";

export default function PostCard({ post }) {
  const ref = doc(db, "posts", post.id);

  // Kart görünür: view +1
  useEffect(() => {
    if (!post?.id) return;
    updateDoc(ref, { views: increment(1) }).catch(()=>{});
    // eslint-disable-next-line
  }, [post?.id]);

  const like = () => updateDoc(ref, { likes: increment(1) });
  const rt   = () => updateDoc(ref, { retweets: increment(1) });

  const when = post.createdAt?.toDate ? post.createdAt.toDate().toLocaleString() : "";

  return (
    <div className="card">
      <div className="row">
        <img src={post.avatar} alt={post.username} width="40" height="40" className="round" />
        <div>
          <div style={{fontWeight:700}}>@{post.username}</div>
          <div className="badge">{when}</div>
        </div>
      </div>

      <div className="space" />
      <div>{post.content}</div>
      {post.image && <div className="space" />}
      {post.image && <img src={post.image} alt="" style={{width:"100%", borderRadius:12, maxHeight:420, objectFit:"cover"}} />}

      <div className="space" />
      <div className="row" style={{justifyContent:"space-between", color:"#6b7280", fontSize:14}}>
        <button className="btn" onClick={like}>❤️ {post.likes || 0}</button>
        <Link className="btn" to={`/comments/${post.id}`}>💬 {(post.commentsCount || 0)}</Link>
        <button className="btn" onClick={rt}>🔁 {post.retweets || 0}</button>
        <span>👁️ {post.views || 0}</span>
      </div>
    </div>
  );
}
