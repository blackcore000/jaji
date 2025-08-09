import React, { useMemo, useState } from "react";
import basePosts from "../data/posts";
import PostCard from "../components/PostCard";

function getExtraPosts() {
  const raw = localStorage.getItem("posts-extra");
  return raw ? JSON.parse(raw) : [];
}

export default function ProfilePage() {
  const [username] = useState("blackcore"); // Basit: şimdilik sabit; login ekleyince dinamik yaparız
  const posts = useMemo(() => {
    const all = [...getExtraPosts(), ...basePosts];
    return all.filter(p => p.username === username);
  }, [username]);

  return (
    <>
      <div className="card">
        <div className="row">
          <img src={`https://api.dicebear.com/7.x/thumbs/svg?seed=${encodeURIComponent(username)}`} alt="me" width="64" height="64" className="round" />
          <div>
            <div style={{fontWeight:800, fontSize:18}}>@{username}</div>
            <div className="badge">{posts.length} paylaşım</div>
          </div>
        </div>
      </div>
      <div className="space" />
      {posts.length === 0 ? <div className="card">Henüz paylaşım yok.</div> : posts.map(p => <PostCard key={p.id} post={p} />)}
    </>
  );
}
