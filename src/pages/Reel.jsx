import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import styles from './Reel.module.css';

const Reel = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const estadoInicial = searchParams.get('estado') || 'instrucciones';
  const [estado, setEstado] = useState(estadoInicial); // instrucciones, activo, exito, fallo
  const [permisoConcedido, setPermisoConcedido] = useState(false);
  const trayectoriaRef = useRef([]);
  const ultimaPosicionRef = useRef({ x: 0, y: 0, z: 0 });

  // Solicitar permisos para iOS
  const solicitarPermisos = async () => {
    if (typeof DeviceOrientationEvent !== 'undefined' && 
        typeof DeviceOrientationEvent.requestPermission === 'function') {
      try {
        const permiso = await DeviceOrientationEvent.requestPermission();
        if (permiso === 'granted') {
          setPermisoConcedido(true);
          iniciarDeteccion();
        } else {
          toast.error('Se necesitan permisos para detectar el movimiento');
        }
      } catch (error) {
        console.error('Error solicitando permisos:', error);
        toast.error('Error al solicitar permisos');
      }
    } else {
      // Android o navegadores que no requieren permiso
      setPermisoConcedido(true);
      iniciarDeteccion();
    }
  };

  const iniciarDeteccion = () => {
    setEstado('activo');
    trayectoriaRef.current = [];
  };

  // Detectar movimiento
  useEffect(() => {
    if (estado !== 'activo') return;

    const manejarMovimiento = (event) => {
      const { alpha, beta, gamma } = event;
      
      // Guardar posición actual
      const posicion = {
        x: beta,  // Inclinación adelante/atrás
        y: gamma, // Inclinación izquierda/derecha
        timestamp: Date.now()
      };

      trayectoriaRef.current.push(posicion);

      // Mantener solo los últimos 150 puntos (aproximadamente 3 segundos)
      if (trayectoriaRef.current.length > 150) {
        trayectoriaRef.current.shift();
      }

      // Analizar si completó el 8 horizontal
      if (trayectoriaRef.current.length > 100) {
        const resultado = detectarOchoHorizontal();
        if (resultado) {
          setEstado('exito');
          toast.success('¡Movimiento completado correctamente!');
          window.removeEventListener('deviceorientation', manejarMovimiento);
        }
      }
    };

    window.addEventListener('deviceorientation', manejarMovimiento);

    // Timeout de 15 segundos
    const timeout = setTimeout(() => {
      if (estado === 'activo') {
        setEstado('fallo');
        toast.error('Intenta nuevamente. Recuerda hacer un 8 horizontal.');
      }
    }, 15000);

    return () => {
      window.removeEventListener('deviceorientation', manejarMovimiento);
      clearTimeout(timeout);
    };
  }, [estado]);

  // Algoritmo para detectar patrón de 8 horizontal
  const detectarOchoHorizontal = () => {
    const trayectoria = trayectoriaRef.current;
    if (trayectoria.length < 100) return false;

    // Extraer valores Y (movimiento horizontal)
    const valoresY = trayectoria.map(p => p.y);
    
    // Detectar cruces por el centro
    let cruces = 0;
    const centro = (Math.max(...valoresY) + Math.min(...valoresY)) / 2;
    
    for (let i = 1; i < valoresY.length; i++) {
      if ((valoresY[i-1] < centro && valoresY[i] >= centro) ||
          (valoresY[i-1] > centro && valoresY[i] <= centro)) {
        cruces++;
      }
    }

    // Un 8 horizontal debe cruzar el centro al menos 3 veces
    // y tener movimiento amplio
    const rangoY = Math.max(...valoresY) - Math.min(...valoresY);
    
    return cruces >= 3 && rangoY > 30;
  };

  const reintentar = () => {
    navigate('/reel'); // Limpia la URL
    setEstado('instrucciones');
    trayectoriaRef.current = [];
  };

  return (
    <div 
      className={styles.page}
      style={(estado === 'exito' || estado === 'fallo') ? {
        backgroundImage: estado === 'exito' ? 'url(/assets/exitoso.png)' : 'url(/assets/fallido.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      } : {}}
    >
      <div className={styles.content}>
        
        {estado === 'instrucciones' && (
          <div className={styles.instrucciones}>
            <h2 className={styles.titulo}>Realiza el gesto mágico</h2>
            <div className={styles.guia}>
              <div className={styles.simboloInfinito}>∞</div>
              <p className={styles.texto}>
                Dibuja un <strong>8 horizontal</strong> (símbolo del infinito)
                moviendo tu celular en el aire
              </p>
            </div>
            <button 
              className={styles.botonComenzar}
              onClick={solicitarPermisos}
            >
              Comenzar
            </button>
          </div>
        )}

        {estado === 'activo' && (
          <div className={styles.deteccion}>
            <img 
              src="/assets/designer.png" 
              alt="Adivina" 
              className={styles.designerImage}
            />
            <div className={styles.indicador}>
              <div className={styles.simboloInfinito}>∞</div>
              <p>Realiza el movimiento...</p>
            </div>
          </div>
        )}

        {estado === 'exito' && (
          <div className={styles.resultado}>
            {/* Imagen como background */}
          </div>
        )}

        {estado === 'fallo' && (
          <div className={styles.resultado}>
            <button 
              className={styles.botonReintentar}
              onClick={reintentar}
            >
              Reintentar
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default Reel;
