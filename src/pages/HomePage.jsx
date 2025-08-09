// src/pages/HomePage.jsx
import React, { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import PostCard from "../components/PostCard";
import StoryBar from "../components/StoryBar";

export default function HomePage() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setPosts(list);
    });
    return () => unsub();
  }, []);

  return (
    <>
      <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 12 }}>Ana Sayfa</h2>
      <StoryBar onOpen={() => (window.location.href = "/stories")} />
      <div className="space" />
      {posts.map((p) => <PostCard key={p.id} post={p} />)}
    </>
  );
}
