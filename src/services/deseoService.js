import { db } from '../firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const CACHE_KEY = 'wizh_deseos_cache';
const CACHE_TIMESTAMP_KEY = 'wizh_deseos_timestamp';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

// Estructura de datos optimizada: /users/{uid}/deseos/{tipo}
export const guardarDeseo = async (userId, tipo, texto, userName) => {
  if (!texto?.trim()) {
    throw new Error('El deseo no puede estar vacío');
  }

  const deseoRef = doc(db, 'users', userId, 'deseos', tipo);
  const deseoData = {
    texto: texto.trim(),
    userName,
    cumplido: false,
    fechaCreacion: new Date(),
    fechaActualizacion: new Date(),
  };

  try {
    // Intentar guardar en Firebase
    await setDoc(deseoRef, deseoData, { merge: true });
    
    // Actualizar caché local
    actualizarCacheLocal(userId, tipo, deseoData);
    
    return { success: true };
  } catch (error) {
    // Si falla Firebase, guardar en localStorage para sync posterior
    guardarEnPendientes(userId, tipo, deseoData);
    throw error;
  }
};

export const obtenerDeseo = async (userId, tipo) => {
  // Primero revisar caché
  const cached = obtenerDeCacheLocal(userId, tipo);
  if (cached) return cached;

  // Si no hay caché, consultar Firebase
  try {
    const deseoRef = doc(db, 'users', userId, 'deseos', tipo);
    const deseoSnap = await getDoc(deseoRef);
    
    if (deseoSnap.exists()) {
      const data = deseoSnap.data();
      
      // Migración: Si no tiene el campo cumplido, agregarlo
      if (data.cumplido === undefined) {
        await setDoc(deseoRef, { 
          cumplido: false,
          fechaCreacion: data.fechaActualizacion || new Date()
        }, { merge: true });
        data.cumplido = false;
      }
      
      actualizarCacheLocal(userId, tipo, data);
      return data.texto;
    }
    
    return '';
  } catch (error) {
    console.error('Error obteniendo deseo:', error);
    return obtenerDeCacheLocal(userId, tipo) || '';
  }
};

export const obtenerTodosLosDeseos = async (userId) => {
  const tipos = ['deseo1', 'deseo2', 'deseo3'];
  const deseos = {};
  
  for (const tipo of tipos) {
    try {
      const deseoRef = doc(db, 'users', userId, 'deseos', tipo);
      const deseoSnap = await getDoc(deseoRef);
      
      if (deseoSnap.exists()) {
        const data = deseoSnap.data();
        
        // Migración: Si no tiene el campo cumplido, agregarlo
        if (data.cumplido === undefined) {
          await setDoc(deseoRef, { 
            cumplido: false,
            fechaCreacion: data.fechaActualizacion || new Date()
          }, { merge: true });
          data.cumplido = false;
        }
        
        deseos[tipo] = {
          texto: data.texto,
          cumplido: data.cumplido || false,
          fechaCreacion: data.fechaCreacion,
          fechaActualizacion: data.fechaActualizacion,
        };
      }
    } catch (error) {
      console.error(`Error obteniendo ${tipo}:`, error);
    }
  }
  
  return deseos;
};

// Marcar deseo como cumplido/no cumplido
export const toggleCumplidoDeseo = async (userId, tipo) => {
  try {
    const deseoRef = doc(db, 'users', userId, 'deseos', tipo);
    const deseoSnap = await getDoc(deseoRef);
    
    if (deseoSnap.exists()) {
      const cumplido = !deseoSnap.data().cumplido;
      await setDoc(deseoRef, { 
        cumplido,
        fechaActualizacion: new Date()
      }, { merge: true });
      
      return { success: true, cumplido };
    }
    
    return { success: false };
  } catch (error) {
    console.error('Error actualizando estado de cumplido:', error);
    throw error;
  }
};

// Funciones de caché local
const actualizarCacheLocal = (userId, tipo, data) => {
  try {
    const cache = obtenerCacheCompleto();
    if (!cache[userId]) cache[userId] = {};
    cache[userId][tipo] = { ...data, texto: data.texto };
    
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
    localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
  } catch (error) {
    console.warn('Error actualizando caché:', error);
  }
};

const obtenerDeCacheLocal = (userId, tipo) => {
  try {
    const timestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);
    if (!timestamp || Date.now() - parseInt(timestamp) > CACHE_DURATION) {
      return null;
    }
    
    const cache = obtenerCacheCompleto();
    return cache[userId]?.[tipo]?.texto || null;
  } catch (error) {
    return null;
  }
};

const obtenerCacheCompleto = () => {
  try {
    const cache = localStorage.getItem(CACHE_KEY);
    return cache ? JSON.parse(cache) : {};
  } catch (error) {
    return {};
  }
};

const guardarEnPendientes = (userId, tipo, data) => {
  try {
    const pendientes = JSON.parse(localStorage.getItem('wizh_pendientes') || '[]');
    pendientes.push({ userId, tipo, data, timestamp: Date.now() });
    localStorage.setItem('wizh_pendientes', JSON.stringify(pendientes));
  } catch (error) {
    console.error('Error guardando en pendientes:', error);
  }
};

// Sincronizar pendientes cuando vuelva la conexión
export const sincronizarPendientes = async () => {
  try {
    const pendientes = JSON.parse(localStorage.getItem('wizh_pendientes') || '[]');
    if (pendientes.length === 0) return;

    for (const item of pendientes) {
      const deseoRef = doc(db, 'users', item.userId, 'deseos', item.tipo);
      await setDoc(deseoRef, item.data, { merge: true });
    }

    localStorage.removeItem('wizh_pendientes');
    return true;
  } catch (error) {
    console.error('Error sincronizando pendientes:', error);
    return false;
  }
};
