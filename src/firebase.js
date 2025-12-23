import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDMDJCBAEz7FS8rZjhoPI2A16tVo3Ux7bM",
  authDomain: "wizhdb-1d0ad.firebaseapp.com",
  projectId: "wizhdb-1d0ad",
  storageBucket: "wizhdb-1d0ad.firebasestorage.app",
  messagingSenderId: "278751582424",
  appId: "1:278751582424:web:ca5502801fc52808795fad",
  measurementId: "G-VWQ2SDCF25"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar servicios
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
