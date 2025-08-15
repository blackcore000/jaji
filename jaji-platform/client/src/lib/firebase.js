// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously, GoogleAuthProvider } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey:        import.meta.env.VITE_FB_API_KEY,
  authDomain:    import.meta.env.VITE_FB_AUTH_DOMAIN,
  databaseURL:   import.meta.env.VITE_FB_DATABASE_URL,   // BUNU .env'ye ekle
  projectId:     import.meta.env.VITE_FB_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FB_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FB_MESSAGING_SENDER_ID,
  appId:         import.meta.env.VITE_FB_APP_ID,
  measurementId: import.meta.env.VITE_FB_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const providerGoogle = new GoogleAuthProvider();
export const db = getDatabase(app);

// İstersen tek satırda anonim oturum da açarız (opsiyonel):
export async function ensureAnon() {
  if (!auth.currentUser) {
    await signInAnonymously(auth).catch(()=>{});
  }
}
