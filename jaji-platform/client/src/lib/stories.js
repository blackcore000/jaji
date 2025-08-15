import { db } from "../firebase";
import { collection, addDoc, doc, setDoc } from "firebase/firestore";

export async function createStory(uid, data) {
  const ref = collection(db, "stories");
  const payload = {
    uid,
    text: data.text || "",
    gif: data.gif || null,
    music: data.music || null,
    location: data.location || null,
    tags: data.tags || [],
    color: data.color || "#000000",
    createdAt: Date.now(),
    expireAt: Date.now() + 24 * 60 * 60 * 1000,
  };
  const r = await addDoc(ref, payload);
  return r.id;
}

export async function updateStory(id, patch) {
  await setDoc(doc(db, "stories", id), patch, { merge: true });
}
