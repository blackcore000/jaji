import React, { useContext, useState } from "react";
import { AuthCtx } from "../AuthProvider";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp, query, where, getDocs } from "firebase/firestore";

export default function SoulmatePage() {
  const { user } = useContext(AuthCtx) || {};
  const [targetEmail, setTargetEmail] = useState("");
  const [roomId, setRoomId] = useState("");
  const [msg, setMsg] = useState("");

  const createSoulRoom = async () => {
    if (!user?.uid || !targetEmail) { setMsg("Giriş yap ve hedef e-mail gir."); return; }
    const qs = query(collection(db, "users"), where("email", "==", targetEmail));
    const ss = await getDocs(qs);
    if (ss.empty) { setMsg("Kullanıcı bulunamadı."); return; }
    const mate = ss.docs[0].id;

    const r = await addDoc(collection(db, "soulrooms"), {
      a: user.uid,
      b: mate,
      createdAt: serverTimestamp(),
      lastMsgAt: serverTimestamp()
    });
    setRoomId(r.id);
    setMsg("Ruh ikizi odası kuruldu.");
  };

  return (
    <div className="max-w-xl mx-auto card">
      <h1 className="text-xl font-bold mb-3">Ruh İkizi</h1>
      <div className="grid gap-3">
        <input className="input" placeholder="Hedef e-mail" value={targetEmail} onChange={(e) => setTargetEmail(e.target.value)} />
        <button className="btn" onClick={createSoulRoom}>Oda Oluştur</button>
        {roomId && <div className="text-sm">Oda: <b>{roomId}</b></div>}
        {msg && <div className="text-sm text-green-600">{msg}</div>}
      </div>
    </div>
  );
}
