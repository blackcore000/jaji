// src/AuthProvider.jsx
import React, { createContext, useEffect, useState } from "react";
import { auth, providerGoogle, ensureAnon } from "./firebase";
import {
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";

export const AuthCtx = createContext(null);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [busy, setBusy] = useState(true);

  useEffect(() => {
    const off = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setBusy(false);
    });
    // anonim oturum garanti
    ensureAnon();
    return () => off();
  }, []);

  const loginGoogle = async () => {
    await signInWithPopup(auth, providerGoogle);
  };

  const loginEmail = async (email, pass) => {
    await signInWithEmailAndPassword(auth, email, pass);
  };

  const registerEmail = async (email, pass, displayName) => {
    const res = await createUserWithEmailAndPassword(auth, email, pass);
    if (displayName) {
      await updateProfile(res.user, { displayName });
    }
  };

  const logout = async () => signOut(auth);

  const value = {
    user,
    busy,
    loginGoogle,
    loginEmail,
    registerEmail,
    logout,
  };

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}
