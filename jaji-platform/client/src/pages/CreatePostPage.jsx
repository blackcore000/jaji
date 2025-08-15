// src/pages/CreatePostPage.jsx
import AdvancedComposer from "../components/AdvancedComposer";
import { createPostFB } from "../lib/posts";

export default function CreatePostPage({ currentUser, posts, setPosts }) {
  const handleShare = async (payload) => {
    // Firebase'e yaz
    try {
      const saved = await createPostFB({ author: currentUser.username, ...payload });
      // Lokal listeyi de güncelle ki ekranda anında görünsün:
      setPosts([saved, ...posts]);
      alert("Paylaşıldı (Firebase).");
    } catch (e) {
      console.error(e);
      alert("Paylaşım başarısız: " + (e.message || e));
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-6">
      <AdvancedComposer onShare={handleShare} />
    </div>
  );
}
