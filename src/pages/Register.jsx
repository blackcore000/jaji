import { useState } from "react";

export default function Register() {
  const [phone, setPhone] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = () => {
    if (!phone.match(/^05\d{9}$/)) {
      setError("Lütfen geçerli bir telefon numarası girin. (05XXXXXXXXX)");
      setConfirmed(false);
    } else {
      setError("");
      setConfirmed(true);
      console.log("Kayıt başarılı:", phone); // Geçici backend
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto text-center">
      <h2 className="text-2xl font-bold mb-4">Kayıt Ol</h2>
      <input
        type="tel"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="05XXXXXXXXX"
        className="border p-2 w-full rounded mb-2"
      />
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <button
        onClick={handleRegister}
        className="bg-blue-600 text-white px-4 py-2 rounded w-full"
      >
        Kayıt Ol
      </button>

      {confirmed && (
        <div className="text-green-600 mt-4 font-medium">
          Kayıt başarılı! 🎉
        </div>
      )}
    </div>
  );
}
