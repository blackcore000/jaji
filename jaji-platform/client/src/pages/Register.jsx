// src/pages/Register.jsx
import React, { useContext, useState } from "react";
import { AuthCtx } from "../AuthProvider";

export default function Register() {
  const { registerEmail } = useContext(AuthCtx) || {};
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  return (
    <div className="max-w-sm mx-auto p-4 card">
      <h2 className="text-xl font-bold mb-4">Kayıt Ol</h2>
      <input className="input mb-2" placeholder="Görünen Ad"
        value={displayName} onChange={(e)=>setDisplayName(e.target.value)} />
      <input className="input mb-2" placeholder="Email"
        value={email} onChange={(e)=>setEmail(e.target.value)} />
      <input className="input mb-3" type="password" placeholder="Şifre"
        value={pass} onChange={(e)=>setPass(e.target.value)} />
      <button className="btn w-full" onClick={()=>registerEmail(email, pass, displayName)}>Kaydol</button>
    </div>
  );
}
