// Firebase çekirdek + servisler
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";
import { getAnalytics, isSupported as analyticsIsSupported } from "firebase/analytics";

// >>> Konsoldan verdiğin AYNI değerler <<<
const firebaseConfig = {
  apiKey: "AIzaSyA1jRp5mqYCjRY0tZd2Fya6QbAxMPNdItk",
  authDomain: "jaji-9ad03.firebaseapp.com",
  databaseURL: "https://jaji-9ad03-default-rtdb.firebaseio.com",
  projectId: "jaji-9ad03",
  storageBucket: "jaji-9ad03.firebasestorage.app", // Not: Storage hata verirse 'jaji-9ad03.appspot.com' deneyebilirsin.
  messagingSenderId: "343507021451",
  appId: "1:343507021451:web:d704a468dee69e6c07ee8e",
  measurementId: "G-G4X4T57XE7",
};

// Uygulamayı başlat
const app = initializeApp(firebaseConfig);

// Servisler
export const auth = getAuth(app);
export const db = getFirestore(app);
export const rtdb = getDatabase(app, firebaseConfig.databaseURL);
export const storage = getStorage(app);

// Analytics: sadece browser destekliyorsa kur
let analytics;
try {
  analyticsIsSupported().then((ok) => {
    if (ok) analytics = getAnalytics(app);
  });
} catch (_) {}
export { analytics };

export default app;
