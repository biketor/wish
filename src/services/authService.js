import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { auth } from '../firebase';

const googleProvider = new GoogleAuthProvider();

// Registrar usuario con email y contraseña
export const registrarConEmail = async (email, password, nombre) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, {
      displayName: nombre
    });
    return { success: true, user: userCredential.user };
  } catch (error) {
    return { success: false, error: manejarError(error) };
  }
};

// Iniciar sesión con email y contraseña
export const iniciarSesionConEmail = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    return { success: false, error: manejarError(error) };
  }
};

// Iniciar sesión con Google
export const iniciarSesionConGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return { success: true, user: result.user };
  } catch (error) {
    return { success: false, error: manejarError(error) };
  }
};

// Cerrar sesión
export const cerrarSesion = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Error al cerrar sesión' };
  }
};

// Manejar errores de Firebase Auth
const manejarError = (error) => {
  switch (error.code) {
    case 'auth/email-already-in-use':
      return 'Este email ya está registrado';
    case 'auth/weak-password':
      return 'La contraseña debe tener al menos 6 caracteres';
    case 'auth/invalid-email':
      return 'Email inválido';
    case 'auth/user-not-found':
      return 'Usuario no encontrado';
    case 'auth/wrong-password':
      return 'Contraseña incorrecta';
    case 'auth/popup-closed-by-user':
      return 'Inicio de sesión cancelado';
    default:
      return 'Error de autenticación. Intenta nuevamente.';
  }
};
