import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAzmNe6t13MlRWl5U0BjofFeNVuoT2PJmI",
  authDomain: "smartstock-b9fb4.firebaseapp.com",
  projectId: "smartstock-b9fb4",
  storageBucket: "smartstock-b9fb4.firebasestorage.app",
  messagingSenderId: "378197763821",
  appId: "1:378197763821:web:0b3ada04667ba157b94ee4",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);