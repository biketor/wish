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

      // Mantener solo los últimos 120 puntos (aproximadamente 2.5 segundos)
      if (trayectoriaRef.current.length > 120) {
        trayectoriaRef.current.shift();
      }

      // Analizar si completó el 8 horizontal (empezar a analizar con menos puntos)
      if (trayectoriaRef.current.length > 60) {
        const resultado = detectarOchoHorizontal();
        if (resultado) {
          setEstado('exito');
          toast.success('¡Movimiento completado correctamente!');
          window.removeEventListener('deviceorientation', manejarMovimiento);
          
          // Redirigir al home después de 2 segundos
          setTimeout(() => {
            navigate('/home');
          }, 2000);
        }
      }
    };

    window.addEventListener('deviceorientation', manejarMovimiento);

    // Timeout de 10 segundos
    const timeout = setTimeout(() => {
      if (estado === 'activo') {
        setEstado('fallo');
        toast.error('Intenta nuevamente. Recuerda hacer un 8 horizontal.');
      }
    }, 10000);

    return () => {
      window.removeEventListener('deviceorientation', manejarMovimiento);
      clearTimeout(timeout);
    };
  }, [estado]);

  // Algoritmo para detectar patrón de 8 horizontal
  const detectarOchoHorizontal = () => {
    const trayectoria = trayectoriaRef.current;
    if (trayectoria.length < 80) return false;

    // Extraer valores X (vertical) e Y (horizontal)
    const valoresX = trayectoria.map(p => p.x);
    const valoresY = trayectoria.map(p => p.y);
    
    // Rangos de movimiento
    const rangoX = Math.max(...valoresX) - Math.min(...valoresX);
    const rangoY = Math.max(...valoresY) - Math.min(...valoresY);
    
    console.log('Detección 8:', { rangoX, rangoY, puntos: trayectoria.length });
    
    // El movimiento debe ser predominantemente HORIZONTAL
    // Ratio Y/X debe ser al menos 1.5:1 (más flexible)
    if (rangoY < rangoX * 1.5) {
      console.log('❌ No es horizontal suficiente');
      return false;
    }
    
    // Detectar cruces por el centro en el eje horizontal (Y)
    let cruces = 0;
    const centroY = (Math.max(...valoresY) + Math.min(...valoresY)) / 2;
    
    for (let i = 1; i < valoresY.length; i++) {
      if ((valoresY[i-1] < centroY && valoresY[i] >= centroY) ||
          (valoresY[i-1] > centroY && valoresY[i] <= centroY)) {
        cruces++;
      }
    }

    console.log('Cruces detectados:', cruces);

    // Un 8 horizontal debe (criterios más flexibles):
    // - Cruzar el centro al menos 3 veces (más fácil)
    // - Tener movimiento horizontal amplio (>30 grados, reducido)
    // - Movimiento vertical limitado (<40 grados, más permisivo)
    const cumple = cruces >= 3 && rangoY > 30 && rangoX < 40;
    
    if (cumple) {
      console.log('✅ 8 horizontal detectado!');
    }
    
    return cumple;
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
