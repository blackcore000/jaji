import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthCtx = createContext(null);
export const useAuth = () => useContext(AuthCtx);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // { id, name, email }

  // Açılışta localStorage’tan oku
  useEffect(() => {
    const raw = localStorage.getItem("jaji_user");
    if (raw) {
      try {
        setUser(JSON.parse(raw));
      } catch {}
    }
  }, []);

  const login = async (email, password) => {
    if (!email || !password) throw new Error("Email/şifre gerekli.");
    const fakeUser = { id: crypto.randomUUID(), name: email.split("@")[0], email };
    localStorage.setItem("jaji_user", JSON.stringify(fakeUser));
    setUser(fakeUser);
  };

  const register = async (name, email, password) => {
    if (!name || !email || !password) throw new Error("Tüm alanlar gerekli.");
    const fakeUser = { id: crypto.randomUUID(), name, email };
    localStorage.setItem("jaji_user", JSON.stringify(fakeUser));
    setUser(fakeUser);
  };

  const logout = () => {
    localStorage.removeItem("jaji_user");
    setUser(null);
  };

  const value = useMemo(() => ({ user, login, register, logout }), [user]);
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}
