import { useState } from "react";
import ImageEditor from "../components/ImageEditor";

export default function EditPage() {
  const [editedImage, setEditedImage] = useState(null);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Görsel Düzenleme</h1>
      <ImageEditor onSave={(img) => setEditedImage(img)} />

      {editedImage && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold">Düzenlenmiş Görsel:</h2>
          <img src={editedImage} alt="Sonuç" className="mt-2 border" />
        </div>
      )}
    </div>
  );
}
