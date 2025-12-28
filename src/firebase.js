import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBIyucsmBql523KBLxTTE1_K8L6yha3REw",
    authDomain: "fin-sight-1bd0f.firebaseapp.com",
    projectId: "fin-sight-1bd0f",
    storageBucket: "fin-sight-1bd0f.firebasestorage.app",
    messagingSenderId: "720300610388",
    appId: "1:720300610388:web:1a3da34cc5f827d5822ec1",
    measurementId: "G-204CXM8T6V"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);
export default app;
