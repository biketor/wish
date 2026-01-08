import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCz42N79zKq0WGV2hsfhdUoDB5qKyXx00I",
  authDomain: "wizhdb-7a2e3.firebaseapp.com",
  projectId: "wizhdb-7a2e3",
  storageBucket: "wizhdb-7a2e3.firebasestorage.app",
  messagingSenderId: "713582758508",
  appId: "1:713582758508:web:9ddb5f3cf922b72cdd2649"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar servicios
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
