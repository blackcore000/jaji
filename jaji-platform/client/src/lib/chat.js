// src/lib/chat.js
import {
  addDoc, collection, doc, getDoc, onSnapshot, orderBy, query,
  serverTimestamp, setDoc, updateDoc, arrayUnion
} from "firebase/firestore";
import { db } from "../firebase";

// Ortak oda dokümanı şeması:
// rooms/{roomId} => { type: "dm" | "group" | "channel", name?, members: [uid], owner?, mods?: [uid], createdAt }
export async function createGroup({ name, owner }) {
  const ref = await addDoc(collection(db, "rooms"), {
    type: "group",
    name,
    owner,
    mods: [owner],
    members: [owner],
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function createChannel({ name, owner }) {
  const ref = await addDoc(collection(db, "rooms"), {
    type: "channel",
    name,
    owner,
    mods: [owner],
    members: [owner], // kanalda “yazarlar” burada tutulur, izleyiciler mesaj atamaz
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function addMember(roomId, uid) {
  await updateDoc(doc(db, "rooms", roomId), { members: arrayUnion(uid) });
}

export async function getRoom(roomId) {
  const snap = await getDoc(doc(db, "rooms", roomId));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

// Mesajlar: rooms/{roomId}/messages/{autoId}
export function watchMessages(roomId, cb, limitN = 200) {
  const q = query(
    collection(db, "rooms", roomId, "messages"),
    orderBy("createdAt", "asc")
  );
  return onSnapshot(q, (snap) => cb(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
}

export async function sendMessage(roomId, { uid, text }) {
  if (!roomId || !uid || !text?.trim()) return;
  await addDoc(collection(db, "rooms", roomId, "messages"), {
    uid, text: text.trim(), createdAt: serverTimestamp()
  });
}
