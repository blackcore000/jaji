// src/pages/ExplorePage.jsx
import React, { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import PostCard from "../components/PostCard";

function score(p){ return (p.likes||0)*2 + (p.retweets||0)*3 + (p.views||0)*0.5; }

export default function ExplorePage() {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "posts"), (snap) => {
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      list.sort((a,b)=> score(b)-score(a));
      setPosts(list);
    });
    return () => unsub();
  }, []);
  return (
    <>
      <h2 style={{fontSize:24, fontWeight:800, marginBottom:12}}>Keşfet</h2>
      {posts.map(p=> <PostCard key={p.id} post={p}/>)}
    </>
  );
}
