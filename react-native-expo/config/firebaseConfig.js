
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA-by8O6uYEsw5vPq9I-s_d_RLBZbstMQY",
  authDomain: "angular-react-enjoyers-p2.firebaseapp.com",
  projectId: "angular-react-enjoyers-p2",
  storageBucket: "angular-react-enjoyers-p2.firebasestorage.app",
  messagingSenderId: "87430062589",
  appId: "1:87430062589:web:892dbfae8732fc24673994",
  measurementId: "G-6DZWR6V784"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Exportar base de datos firestore
export const db = getFirestore(app);
