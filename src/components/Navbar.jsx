import React from "react";
import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <div className="nav-inner">
      <div className="row">
        <strong style={{ fontSize: 20, color: "#2563eb" }}>Jaji</strong>
        <span className="badge">| özgürlük için</span>
      </div>

      <div className="nav-links">
        <NavLink to="/" className={({ isActive }) => "link" + (isActive ? " active" : "")}>
          Ana Sayfa
        </NavLink>
        <NavLink to="/explore" className={({ isActive }) => "link" + (isActive ? " active" : "")}>
          Keşfet
        </NavLink>
        <NavLink to="/stories" className={({ isActive }) => "link" + (isActive ? " active" : "")}>
          Hikâyeler
        </NavLink>
        <NavLink to="/create" className={({ isActive }) => "link" + (isActive ? " active" : "")}>
          Paylaş
        </NavLink>
        <NavLink to="/profile" className={({ isActive }) => "link" + (isActive ? " active" : "")}>
          Profil
        </NavLink>
      </div>
    </div>
  );
}
