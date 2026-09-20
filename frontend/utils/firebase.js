// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "intesaai.firebaseapp.com",
  projectId: "intesaai",
  storageBucket: "intesaai.firebasestorage.app",
  messagingSenderId: "720351365935",
  appId: "1:720351365935:web:be80e9d7afbe9fc114afda",
  measurementId: "G-PLGPJWLCML",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };
