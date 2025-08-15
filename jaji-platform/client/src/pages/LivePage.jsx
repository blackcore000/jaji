import React, { useContext, useEffect, useRef, useState } from "react";
import { AuthCtx } from "../AuthProvider";
import {
  createLive, endLive, gift, watchLive,
  pushOffer, pushAnswer, watchOffer, watchAnswer,
  pushCandidate, watchCandidates,
} from "../lib/live";

const STUN = [{ urls: "stun:stun.l.google.com:19302" }];

export default function LivePage() {
  const { user } = useContext(AuthCtx) || {};
  const [roomId, setRoomId] = useState("");
  const [live, setLive] = useState(null);
  const videoRef = useRef(null);
  const remoteRef = useRef(null);
  const pcRef = useRef(null);
  const streamRef = useRef(null);
  const [isOwner, setIsOwner] = useState(false);

  const startAsOwner = async () => {
    if (!user?.uid || !roomId) return alert("UID ve oda gerekli");
    await createLive({ roomId, owner: user.uid, title: "Jaji Live" });
    setIsOwner(true);

    const pc = new RTCPeerConnection({ iceServers: STUN });
    pcRef.current = pc;

    // local cam
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    streamRef.current = stream;
    stream.getTracks().forEach(t => pc.addTrack(t, stream));
    videoRef.current.srcObject = stream;

    pc.onicecandidate = async (e) => {
      if (e.candidate) await pushCandidate(roomId, e.candidate.toJSON());
    };

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    await pushOffer(roomId, offer);

    // izleyiciden answer bekle
    watchAnswer(roomId, async (ans) => {
      if (ans) await pc.setRemoteDescription(new RTCSessionDescription(ans));
    });
    // izleyici ICE
    watchCandidates(roomId, async (list) => {
      for (const c of list) {
        try { await pc.addIceCandidate(new RTCIceCandidate(c)); } catch {}
      }
    });
  };

  const joinAsViewer = async () => {
    if (!roomId) return;
    const pc = new RTCPeerConnection({ iceServers: STUN });
    pcRef.current = pc;

    pc.ontrack = (e) => {
      remoteRef.current.srcObject = e.streams[0];
    };
    pc.onicecandidate = async (e) => {
      if (e.candidate) await pushCandidate(roomId, e.candidate.toJSON());
    };

    // owner offer'ini bekle
    let unsubOffer = watchOffer(roomId, async (off) => {
      if (!off) return;
      await pc.setRemoteDescription(new RTCSessionDescription(off));
      const ans = await pc.createAnswer();
      await pc.setLocalDescription(ans);
      await pushAnswer(roomId, ans);
      if (unsubOffer) unsubOffer(); // bir kere yeter
    });

    // owner ICE
    watchCandidates(roomId, async (list) => {
      for (const c of list) {
        try { await pc.addIceCandidate(new RTCIceCandidate(c)); } catch {}
      }
    });
  };

  useEffect(() => {
    if (!roomId) return;
    const off = watchLive(roomId, setLive);
    return () => off && off();
  }, [roomId]);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="card">
        <h2 className="font-bold">Canlı Yayın</h2>
        <input className="input mt-2" placeholder="Oda ID"
          value={roomId} onChange={(e)=>setRoomId(e.target.value)} />
        <div className="flex gap-2 mt-2">
          <button className="btn" onClick={startAsOwner}>Yayın Başlat</button>
          <button className="btn" onClick={joinAsViewer}>İzleyici Olarak Katıl</button>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-3">
          <video ref={videoRef} autoPlay muted playsInline className="w-full rounded bg-black" />
          <video ref={remoteRef} autoPlay playsInline className="w-full rounded bg-black" />
        </div>
        {live && (
          <div className="mt-3 text-sm">
            <div>Oda: <b>{live.id || roomId}</b></div>
            <div>Sahip: {live.owner?.slice(0,6)}</div>
            <div>Jeton: <b>{live.coins || 0}</b></div>
            <div>Durum: {live.active ? "Aktif" : "Kapalı"}</div>
            <div className="flex gap-2 mt-2">
              <button className="btn" onClick={()=>gift(roomId, 5)}>🎁 5 Jeton Gönder</button>
              {isOwner && <button className="btn" onClick={()=>endLive(roomId)}>Yayını Bitir</button>}
            </div>
          </div>
        )}
      </div>

      <div className="card">
        <h2 className="font-bold">Bilgi</h2>
        <ul className="list-disc pl-5 text-sm">
          <li>Bu iskelet tek yayıncı, tek offer/answer akışını gösterir.</li>
          <li>Gerçekte çoklu izleyici/konuk için her izleyiciye ayrı RTCPeerConnection açılır.</li>
          <li>Jeton “coins” alanında tutuluyor; ödeme entegrasyonu eklenince gerçek paraya bağlarız.</li>
        </ul>
      </div>
    </div>
  );
}
