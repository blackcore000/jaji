// src/lib/posts.js
import {
  addDoc, collection, deleteDoc, doc, getDoc, increment, limit, onSnapshot,
  orderBy, query, serverTimestamp, setDoc, updateDoc
} from "firebase/firestore";
import { db } from "../firebase";

// ----- FEED -----
export function watchFeed(cb, limitN = 50) {
  const q = query(collection(db, "posts"), orderBy("createdAt", "desc"), limit(limitN));
  return onSnapshot(q, (snap) => {
    const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    cb(list);
  });
}

// ----- VIEWS -----
export async function addView(postId) {
  if (!postId) return;
  await updateDoc(doc(db, "posts", postId), { views: increment(1) });
}

// ----- LIKE (toggle) -----
// posts/{postId}/likes/{uid}
export async function toggleLike(postId, uid) {
  if (!postId || !uid) return;
  const likeRef = doc(db, "posts", postId, "likes", uid);
  const liked = (await getDoc(likeRef)).exists();
  if (liked) {
    await deleteDoc(likeRef);
    await updateDoc(doc(db, "posts", postId), { likes: increment(-1) });
    return false;
  } else {
    await setDoc(likeRef, { uid, createdAt: serverTimestamp() });
    await updateDoc(doc(db, "posts", postId), { likes: increment(1) });
    return true;
  }
}

// ----- YORUM -----
export async function addComment(postId, { uid, text }) {
  if (!postId || !uid || !text?.trim()) return;
  await addDoc(collection(db, "posts", postId, "comments"), {
    uid, text: text.trim(), createdAt: serverTimestamp()
  });
  await updateDoc(doc(db, "posts", postId), { comments: increment(1) });
}

// ----- RETWEET (basit) -----
export async function retweet(postId, uid) {
  if (!postId || !uid) return;
  const postSnap = await getDoc(doc(db, "posts", postId));
  if (!postSnap.exists()) return;
  const p = postSnap.data();
  // yeni RT post
  await addDoc(collection(db, "posts"), {
    uid,
    text: p.text || "",
    image: p.image || null,
    gif: p.gif || null,
    video: p.video || null,
    originalId: postId,
    likes: 0, comments: 0, rts: 0, views: 0,
    createdAt: serverTimestamp()
  });
  await updateDoc(doc(db, "posts", postId), { rts: increment(1) });
}
