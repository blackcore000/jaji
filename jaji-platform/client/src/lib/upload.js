import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../firebase";

export async function uploadUserFile(uid, file) {
  if (!uid || !file) throw new Error("Eksik parametre");
  const path = `uploads/${uid}/${Date.now()}_${file.name}`;
  const r = ref(storage, path);
  const snap = await uploadBytes(r, file);
  return await getDownloadURL(snap.ref);
}
