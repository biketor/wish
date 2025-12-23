import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';
import { obtenerTodosLosDeseos } from '../services/deseoService';
import { storage, db } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, updateDoc, getDoc, setDoc } from 'firebase/firestore';
import styles from './Perfil.module.css';

const Perfil = () => {
  const { usuario } = useAuth();
  const navigate = useNavigate();
  const [fotoPerfil, setFotoPerfil] = useState(null);
  const [cargandoFoto, setCargandoFoto] = useState(false);
  const [deseosCumplidos, setDeseosCumplidos] = useState(0);
  const inputFileRef = useRef(null);

  useEffect(() => {
    const cargarDatos = async () => {
      if (!usuario?.uid) return;

      try {
        // Cargar foto de perfil
        const userDoc = await getDoc(doc(db, 'users', usuario.uid));
        if (userDoc.exists() && userDoc.data().fotoPerfil) {
          setFotoPerfil(userDoc.data().fotoPerfil);
        }

        // Cargar deseos cumplidos
        const deseos = await obtenerTodosLosDeseos(usuario.uid);
        const cumplidos = Object.values(deseos).filter(d => d.cumplido).length;
        setDeseosCumplidos(cumplidos);
      } catch (error) {
        console.error('Error cargando datos:', error);
      }
    };

    cargarDatos();
  }, [usuario]);

  const handleSeleccionarFoto = () => {
    inputFileRef.current?.click();
  };

  const handleCambioFoto = async (e) => {
    const archivo = e.target.files[0];
    if (!archivo) return;

    // Validar tipo de archivo
    if (!archivo.type.startsWith('image/')) {
      toast.error('Por favor selecciona una imagen válida');
      return;
    }

    // Validar tamaño (max 5MB)
    if (archivo.size > 5 * 1024 * 1024) {
      toast.error('La imagen no debe superar 5MB');
      return;
    }

    setCargandoFoto(true);

    try {
      // Subir a Firebase Storage
      const storageRef = ref(storage, `fotos-perfil/${usuario.uid}.${archivo.name.split('.').pop()}`);
      const snapshot = await uploadBytes(storageRef, archivo);
      
      // Obtener URL de descarga
      const urlDescarga = await getDownloadURL(snapshot.ref);
      
      // Actualizar en Firestore (crear documento si no existe)
      const userRef = doc(db, 'users', usuario.uid);
      await setDoc(userRef, {
        fotoPerfil: urlDescarga,
        email: usuario.email,
        displayName: usuario.displayName || usuario.email?.split('@')[0],
        fechaActualizacion: new Date()
      }, { merge: true });

      setFotoPerfil(urlDescarga);
      toast.success('✨ Foto de perfil actualizada');
    } catch (error) {
      console.error('Error subiendo foto:', error);
      
      // Mensajes de error más específicos
      if (error.code === 'storage/unauthorized') {
        toast.error('No tienes permisos para subir imágenes');
      } else if (error.code === 'storage/canceled') {
        toast.error('Carga cancelada');
      } else {
        toast.error('Error al actualizar la foto. Intenta nuevamente.');
      }
    } finally {
      setCargandoFoto(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <Link to="/home" className={styles.logoContainer}>
          <img src="/assets/logo.png" alt="WIZH" className={styles.logo} />
        </Link>
        <h1 className={styles.titulo}>PERFIL</h1>
        <div className={styles.iconos}>
          <img src="/assets/perfil.png" alt="Notificación" className={styles.icono} />
          <img src="/assets/perfil.png" alt="Perfil" className={styles.icono} />
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.fotoContainer}>
          <div className={styles.fotoWrapper} onClick={handleSeleccionarFoto}>
            {cargandoFoto ? (
              <div className={styles.loader}>Cargando...</div>
            ) : fotoPerfil ? (
              <img src={fotoPerfil} alt="Foto de perfil" className={styles.fotoPerfil} />
            ) : (
              <div className={styles.fotoPlaceholder}>
                <span>+</span>
              </div>
            )}
          </div>
          <input
            ref={inputFileRef}
            type="file"
            accept="image/*"
            onChange={handleCambioFoto}
            style={{ display: 'none' }}
          />
        </div>

        <h2 className={styles.nombreUsuario}>
          {usuario?.displayName || usuario?.email?.split('@')[0] || 'Usuario'}
        </h2>

        <div className={styles.seccion}>
          <h3 className={styles.seccionTitulo}>Mis deseos</h3>
          <div className={styles.estadoItem}>
            <span className={styles.estadoTexto}>Activado</span>
            <span className={styles.candado}>🔒</span>
          </div>
        </div>

        <div className={styles.seccion} onClick={() => navigate('/ajustes')}>
          <h3 className={styles.seccionTitulo}>Ajustes</h3>
          <span className={styles.flecha}>›</span>
        </div>

        <div className={styles.seccion}>
          <h3 className={styles.seccionTitulo}>Deseos cumplidos ({deseosCumplidos})</h3>
        </div>
      </div>

      <div className={styles.footer}>
        <p className={styles.footerTexto}>WIZH es gratis.</p>
        <p className={styles.footerSubtexto}>Si te ayuda, apóyanos con una donación.</p>
        <div className={styles.metodoPago}>
          <img src="/assets/paypal-logo.png" alt="PayPal" className={styles.paypalLogo} />
          <img src="/assets/stripe-logo.png" alt="Stripe" className={styles.stripeLogo} />
        </div>
        <button className={styles.botonApoyo}>Apoyar WIZH</button>
      </div>
    </div>
  );
};

export default Perfil;
