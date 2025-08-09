import { useState, useRef } from "react";

export default function ImageEditor({ onSave }) {
  const [image, setImage] = useState(null);
  const canvasRef = useRef();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result);
    reader.readAsDataURL(file);
  };

  const applyBrightness = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.filter = "brightness(1.2)";
    ctx.drawImage(canvas, 0, 0);
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    const dataUrl = canvas.toDataURL("image/png");
    onSave(dataUrl);
  };

  return (
    <div className="p-4">
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {image && (
        <div className="mt-4">
          <canvas
            ref={canvasRef}
            width={400}
            height={400}
            className="border"
          />
          <button
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
            onClick={applyBrightness}
          >
            Işık Arttır
          </button>
          <button
            className="ml-2 px-4 py-2 bg-green-600 text-white rounded"
            onClick={handleSave}
          >
            Kaydet ve Paylaş
          </button>
        </div>
      )}
    </div>
  );
}
