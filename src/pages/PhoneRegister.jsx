import React, { useState } from 'react';

function PhoneRegister() {
  const [phone, setPhone] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Telefon numarası: ${phone}`);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Jaji'ye Hoş Geldin</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="tel"
          placeholder="Telefon numaranızı girin"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="p-2 border border-gray-300 rounded-md"
        />
        <button
          type="submit"
          className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600"
        >
          Kaydol
        </button>
      </form>
    </div>
  );
}

export default PhoneRegister;
