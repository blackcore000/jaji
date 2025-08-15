import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

// Bu iki sayfa sende mevcut (HomePage, ExplorePage)
import HomePage from "./pages/HomePage";
import ExplorePage from "./pages/ExplorePage";

// Ruh İkizim sayfasını eklediysen aktif et
// import RuhIkizim from "./pages/RuhIkizim";

export default function App() {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b">
        <div className="max-w-6xl mx-auto px-4">
          <Navbar />
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/kesfet" element={<ExplorePage />} />
          {/* <Route path="/ruh" element={<RuhIkizim />} /> */}
        </Routes>
      </main>
    </div>
  );
}
