import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (!phone.match(/^05\d{9}$/)) {
      setError("Geçerli bir telefon numarası giriniz. (05XXXXXXXXX)");
    } else {
      setError("");
      console.log("Giriş başarılı:", phone);
      navigate("/"); // Ana sayfaya yönlendir
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto text-center">
      <h2 className="text-2xl font-bold mb-4">Giriş Yap</h2>
      <input
        type="tel"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="05XXXXXXXXX"
        className="border p-2 w-full rounded mb-2"
      />
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <button
        onClick={handleLogin}
        className="bg-green-600 text-white px-4 py-2 rounded w-full"
      >
        Giriş Yap
      </button>
    </div>
  );
}
