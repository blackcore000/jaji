import { doc, getDoc, increment, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

export async function ensureWallet(uid) {
  const r = doc(db, "wallets", uid);
  const s = await getDoc(r);
  if (!s.exists()) await setDoc(r, { balance: 0, updatedAt: Date.now() });
}
export async function addCoins(uid, amount) {
  await updateDoc(doc(db, "wallets", uid), { balance: increment(amount), updatedAt: Date.now() });
}
export async function spendCoins(uid, amount) {
  // Prod’da transaction ile bakiyeyi kontrol et.
  await updateDoc(doc(db, "wallets", uid), { balance: increment(-amount), updatedAt: Date.now() });
}
