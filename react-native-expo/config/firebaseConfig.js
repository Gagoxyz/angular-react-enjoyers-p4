
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDEeYKxOUt8e7i64luTI1Z2EwdxnaWgVAY",
  authDomain: "equipo-basket.firebaseapp.com",
  projectId: "equipo-basket",
  storageBucket: "equipo-basket.firebasestorage.app",
  messagingSenderId: "51765152514",
  appId: "1:51765152514:web:6e25113e8bacca8103501b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Exportar base de datos firestore
export const db = getFirestore(app);
