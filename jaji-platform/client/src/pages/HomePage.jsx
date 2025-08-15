// src/pages/HomePage.jsx
import React, { useEffect, useState } from "react";
import { watchFeed } from "../lib/posts";
import PostCard from "../components/PostCard";

export default function HomePage() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const off = watchFeed(setPosts, 50);
    return () => off && off();
  }, []);

  return (
    <div>
      <h1 className="text-xl font-bold mb-3">Ana Akış</h1>
      {posts.map((p) => <PostCard key={p.id} post={p} />)}
      {posts.length === 0 && <div className="card">Henüz gönderi yok.</div>}
    </div>
  );
}
