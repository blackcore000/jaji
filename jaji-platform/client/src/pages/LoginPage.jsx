import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage({ setUsername }) {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (name.trim() === "") {
      alert("Lütfen bir kullanıcı adı girin!");
      return;
    }
    setUsername(name);
    localStorage.setItem("username", name); // Tarayıcıya kaydediyoruz
    navigate("/"); // Anasayfaya yönlendir
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h1 className="text-2xl font-bold mb-4">Jaji'ye Hoş Geldin 👋</h1>
      <input
        type="text"
        placeholder="Kullanıcı adını gir..."
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border p-2 rounded w-64 mb-3"
      />
      <button
        onClick={handleLogin}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Giriş Yap
      </button>
    </div>
  );
}
