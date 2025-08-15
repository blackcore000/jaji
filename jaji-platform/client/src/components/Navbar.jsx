import { NavLink } from "react-router-dom";

const linkClass = ({ isActive }) =>
  (isActive ? "nav-link nav-link-active" : "nav-link");

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between py-3">
      {/* Sol: Logo */}
      <div className="flex items-center gap-2 select-none">
        {/* Sende /public içine koyduğumuz jaji_logo.png varsa gösterir */}
        <img
          src="/jaji_logo.png"
          alt="Jaji"
          className="w-8 h-8 rounded-lg object-cover"
          onError={(e) => { e.currentTarget.style.display = "none"; }}
        />
        <span className="text-xl font-bold tracking-tight">Jaji</span>
      </div>

      {/* Orta: Linkler */}
      <div className="flex items-center gap-2">
        <NavLink to="/" className={linkClass}>Ana Sayfa</NavLink>
        <NavLink to="/kesfet" className={linkClass}>Keşfet</NavLink>
        {/* <NavLink to="/ruh" className={linkClass}>Ruh İkizim</NavLink> */}
      </div>

      {/* Sağ: Hesap (placeholder) */}
      <div className="flex items-center gap-2">
        <button className="btn">Giriş</button>
      </div>
    </nav>
  );
}
