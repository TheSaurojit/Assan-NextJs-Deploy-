// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";

import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


// const firebaseConfig = {
//   apiKey: "AIzaSyCIlSRlfcCjafsGbywnu87F39Mk339MbIs",
//   authDomain: "aasan-retirement.firebaseapp.com",
//   projectId: "aasan-retirement",
//   storageBucket: "aasan-retirement.firebasestorage.app",
//   messagingSenderId: "940331431402",
//   appId: "1:940331431402:web:1457110808c60ddf6aee93",
//   measurementId: "G-FXJDW81M67"
// };


const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};



// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();


const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

const googleProvider = new GoogleAuthProvider();

export { auth, db, googleProvider , storage };


