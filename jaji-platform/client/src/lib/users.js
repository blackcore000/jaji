import { doc, getDoc, updateDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

export async function setVerified(uid, value = true) {
  if (!uid) return;
  await updateDoc(doc(db, "users", uid), {
    verified: !!value,
    verifiedAt: serverTimestamp(),
    verificationTier: value ? "blue" : null,
  });
}
