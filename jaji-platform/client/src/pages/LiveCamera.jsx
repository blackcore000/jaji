// src/pages/LiveCamera.jsx
import React, { useEffect, useRef, useState } from "react";
import { db } from "../firebase";
import { ref, onValue, push, set, remove } from "firebase/database";

const rtcConfig = { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] };

export default function LiveCamera() {
  const [roomId, setRoomId] = useState("");
  const [mode, setMode] = useState("host"); // host | viewer
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const pcRef = useRef(null);
  const localStreamRef = useRef(null);

  useEffect(() => {
    return cleanup;
  }, []);

  const cleanup = async () => {
    try { pcRef.current?.close(); } catch {}
    pcRef.current = null;
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(t => t.stop());
      localStreamRef.current = null;
    }
  };

  const startHost = async () => {
    if (!roomId) return alert("Room ID gir");
    await cleanup();

    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    localStreamRef.current = stream;
    if (localVideoRef.current) localVideoRef.current.srcObject = stream;

    const pc = new RTCPeerConnection(rtcConfig);
    pcRef.current = pc;
    stream.getTracks().forEach(t => pc.addTrack(t, stream));
    pc.onicecandidate = (e) => {
      if (e.candidate) {
        const candRef = push(ref(db, `webrtc/${roomId}/host/candidates`));
        set(candRef, e.candidate.toJSON());
      }
    };

    // Viewer answer’larını dinle
    onValue(ref(db, `webrtc/${roomId}/answers`), async (snap) => {
      const v = snap.val() || {};
      const arr = Object.values(v);
      for (const ans of arr) {
        const desc = new RTCSessionDescription(ans);
        if (pc.signalingState !== "stable") {
          await pc.setRemoteDescription(desc).catch(()=>{});
        }
      }
    });

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    await set(ref(db, `webrtc/${roomId}/offer`), offer);
  };

  const startViewer = async () => {
    if (!roomId) return alert("Room ID gir");
    await cleanup();

    const pc = new RTCPeerConnection(rtcConfig);
    pcRef.current = pc;

    pc.ontrack = (e) => {
      if (remoteVideoRef.current) remoteVideoRef.current.srcObject = e.streams[0];
    };
    pc.onicecandidate = (e) => {
      if (e.candidate) {
        const candRef = push(ref(db, `webrtc/${roomId}/viewerCandidates`));
        set(candRef, e.candidate.toJSON());
      }
    };

    // Host offer’ını al
    onValue(ref(db, `webrtc/${roomId}/offer`), async (snap) => {
      const offer = snap.val();
      if (!offer) return;
      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      const ansRef = push(ref(db, `webrtc/${roomId}/answers`));
      await set(ansRef, answer);
    });

    // Host ICE candidates
    onValue(ref(db, `webrtc/${roomId}/host/candidates`), async (snap) => {
      const v = snap.val() || {};
      for (const cand of Object.values(v)) {
        try { await pc.addIceCandidate(cand); } catch {}
      }
    });
  };

  const clearRoom = async () => {
    if (!roomId) return;
    await remove(ref(db, `webrtc/${roomId}`));
    await cleanup();
  };

  return (
    <div className="p-4 grid gap-4 md:grid-cols-2">
      <div className="card">
        <h2 className="font-bold text-lg mb-2">🎥 WebRTC Canlı Yayın</h2>

        <label className="text-sm">Oda/Kanal ID</label>
        <input className="input mb-2" placeholder="ör: jaji-room-1"
          value={roomId} onChange={(e)=>setRoomId(e.target.value)} />

        <label className="text-sm">Mod</label>
        <select className="input mb-3" value={mode} onChange={(e)=>setMode(e.target.value)}>
          <option value="host">Yayıncı</option>
          <option value="viewer">İzleyici</option>
        </select>

        {mode === "host" ? (
          <>
            <button className="btn mr-2" onClick={startHost}>Yayını Başlat</button>
            <button className="btn bg-red-600 hover:bg-red-700" onClick={clearRoom}>Odayı Temizle</button>
            <video ref={localVideoRef} autoPlay playsInline muted className="mt-3 rounded border" />
          </>
        ) : (
          <>
            <button className="btn" onClick={startViewer}>Yayına Bağlan</button>
            <video ref={remoteVideoRef} autoPlay playsInline className="mt-3 rounded border" />
          </>
        )}
      </div>

      <div className="card">
        <div className="text-sm">
          Bu demo tek host → çok izleyici topolojisi içindir. Çoklu host istiyorsak, her host için ayrı offer/answers dalı ve mix/yerleşim gerekir (bir sonraki turda ekleriz).
        </div>
      </div>
    </div>
  );
}
