// src/lib/live.js
import {
  doc, setDoc, updateDoc, serverTimestamp, increment, onSnapshot, deleteDoc, collection, addDoc
} from "firebase/firestore";
import { db } from "../firebase";

export async function createLive({ roomId, owner, title }) {
  await setDoc(doc(db, "liveRooms", roomId), {
    owner, title, coins: 0, active: true, createdAt: serverTimestamp()
  });
}
export async function endLive(roomId) {
  await updateDoc(doc(db, "liveRooms", roomId), { active: false });
}
export async function gift(roomId, amount = 1) {
  await updateDoc(doc(db, "liveRooms", roomId), { coins: increment(amount) });
}
export function watchLive(roomId, cb) {
  return onSnapshot(doc(db, "liveRooms", roomId), (d) => {
    cb(d.exists() ? { id: d.id, ...d.data() } : null);
  });
}

// ---- basit SDP/ICE sinyalleme:
export async function pushOffer(roomId, sdp) {
  await setDoc(doc(db, "liveRooms", roomId, "sdp", "offer"), { sdp });
}
export async function pushAnswer(roomId, sdp) {
  await setDoc(doc(db, "liveRooms", roomId, "sdp", "answer"), { sdp });
}
export function watchOffer(roomId, cb) {
  return onSnapshot(doc(db, "liveRooms", roomId, "sdp", "offer"), (d) => cb(d.data()?.sdp || null));
}
export function watchAnswer(roomId, cb) {
  return onSnapshot(doc(db, "liveRooms", roomId, "sdp", "answer"), (d) => cb(d.data()?.sdp || null));
}
export async function pushCandidate(roomId, cand) {
  await addDoc(collection(db, "liveRooms", roomId, "candidates"), { cand });
}
export function watchCandidates(roomId, cb) {
  return onSnapshot(collection(db, "liveRooms", roomId, "candidates"), (snap) => {
    cb(snap.docs.map(d => d.data().cand));
  });
}
