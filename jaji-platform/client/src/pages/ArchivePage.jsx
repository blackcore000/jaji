import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";

export default function ArchivePage() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    (async () => {
      const q = query(collection(db, "archives"), orderBy("createdAt", "desc"));
      const s = await getDocs(q);
      setItems(s.docs.map(d => ({ id: d.id, ...d.data() })));
    })();
  }, []);

  return (
    <div className="max-w-3xl mx-auto card">
      <h1 className="text-xl font-bold mb-3">Yayın Arşivi</h1>
      <div className="grid gap-3">
        {items.map(v => (
          <div key={v.id} className="p-3 border rounded">
            <div className="font-medium">{v.title || "Kaydedilmiş Yayın"}</div>
            <div className="text-sm text-gray-600">{new Date(v.createdAt?.seconds ? v.createdAt.seconds*1000 : v.createdAt || Date.now()).toLocaleString()}</div>
            {v.url ? (
              <video className="mt-2 w-full rounded" src={v.url} controls />
            ) : (
              <div className="text-sm text-gray-500 mt-2">Video URL yok (MVP)</div>
            )}
          </div>
        ))}
        {items.length === 0 && <div className="text-sm text-gray-600">Henüz kayıt yok.</div>}
      </div>
    </div>
  );
}
