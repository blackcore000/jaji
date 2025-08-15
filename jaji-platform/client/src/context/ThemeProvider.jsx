import React, { createContext, useEffect, useMemo, useState } from "react";

export const ThemeCtx = createContext({ theme: "light", setTheme: () => {} });

export default function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(localStorage.getItem("JAJI_THEME") || "light");

  useEffect(() => {
    localStorage.setItem("JAJI_THEME", theme);
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
  }, [theme]);

  const value = useMemo(() => ({ theme, setTheme }), [theme]);
  return <ThemeCtx.Provider value={value}>{children}</ThemeCtx.Provider>;
}
