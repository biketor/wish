import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { collection, addDoc, query, where, getDocs, updateDoc } from 'firebase/firestore';
import styles from './CrearDeseo1.module.css';

function CrearDeseo1() {
  const { usuario } = useAuth();
  const navigate = useNavigate();
  const [deseo, setDeseo] = useState('');
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  const handleGuardar = async () => {
    if (!deseo.trim()) {
      setError('Por favor escribe tu deseo');
      return;
    }

    setCargando(true);
    setError('');

    try {
      // Buscar si ya existe un deseo1 para este usuario
      const q = query(
        collection(db, 'deseos'),
        where('userId', '==', usuario.uid),
        where('tipo', '==', 'deseo1')
      );
      
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // Si existe, actualizar
        const docRef = querySnapshot.docs[0].ref;
        await updateDoc(docRef, {
          texto: deseo,
          fechaActualizacion: new Date()
        });
        console.log('Deseo actualizado exitosamente');
      } else {
        // Si no existe, crear uno nuevo
        await addDoc(collection(db, 'deseos'), {
          texto: deseo,
          userId: usuario.uid,
          userName: usuario.displayName || usuario.email,
          fecha: new Date(),
          tipo: 'deseo1'
        });
        console.log('Deseo guardado exitosamente');
      }
      
      setDeseo(''); // Limpiar el textarea
      alert('¡Deseo guardado exitosamente!');
    } catch (error) {
      console.error('Error al guardar deseo:', error);
      setError('Error al guardar. Intenta nuevamente.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className={styles.page}>
      {/* Patrón de espirales de fondo */}
      <div className={styles.pattern} />

      <div className={styles.content}>
        {/* Header con logo y campo de texto en la misma fila */}
        <div className={styles.header}>
          {/* Logo a la izquierda */}
          <img src="/assets/logo.png" alt="WIZH" className={styles.logo} />
          
          {/* Contenedor derecho: campo de texto + texto y botón */}
          <div className={styles.formWrapper}>
            {/* Campo de texto */}
            <textarea
              value={deseo}
              onChange={(e) => setDeseo(e.target.value)}
              placeholder=""
              className={styles.textarea}
            />
            
            {/* Texto y botón alineados con el campo */}
            <div className={styles.actions}>
              <p className={styles.label}>
                Escribe tu primer deseo
              </p>
              <button
                onClick={handleGuardar}
                disabled={cargando}
                className={styles.button}
              >
                {cargando ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </div>
        </div>

        {error && (
          <p className={styles.error}>
            {error}
          </p>
        )}

        {/* Espaciador */}
        <div className={styles.spacer} />

        {/* Frase motivacional */}
        <div className={styles.quote}>
          <p className={styles.quoteText}>
            <span className={styles.gold}>"Confío que el</span>{' '}
            <span className={styles.white}>universo</span><br />
            <span className={styles.white}>conspirará</span>{' '}
            <span className={styles.gold}>para que mis</span><br />
            <span className={styles.gold}>sueños se hagan</span>{' '}
            <span className={styles.white}>realidad</span><br />
            <span className={styles.gold}>en el momento perfecto"</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default CrearDeseo1;
