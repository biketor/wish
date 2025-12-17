import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';
import { guardarDeseo, obtenerDeseo } from '../services/deseoService';
import styles from './CrearDeseo.module.css';

const CONFIGURACIONES = {
  deseo1: {
    backgroundColor: '#0a1929',
    label: 'Escribe tu primer deseo',
    nextRoute: '/crear-deseo-2',
    prevRoute: null,
    quote: {
      parts: [
        { text: '"Confío que el', color: 'gold' },
        { text: 'universo', color: 'white' },
        { text: 'conspirará', color: 'white' },
        { text: 'para que mis', color: 'gold' },
        { text: 'sueños se hagan', color: 'gold' },
        { text: 'realidad', color: 'white' },
        { text: 'en el momento perfecto"', color: 'gold' },
      ]
    }
  },
  deseo2: {
    backgroundImage: '/assets/background-deseo2.png',
    label: 'Escribe tu segundo deseo',
    nextRoute: '/crear-deseo-3',
    prevRoute: '/crear-deseo',
    quote: {
      parts: [
        { text: '"Tengo la', color: 'gold' },
        { text: 'esperanza', color: 'white' },
        { text: 'que', color: 'gold' },
        { text: 'cada paso que doy, me', color: 'white' },
        { text: 'acercan', color: 'white' },
        { text: 'más a mis', color: 'gold' },
        { text: 'anhelos"', color: 'white' },
      ]
    }
  },
  deseo3: {
    backgroundImage: '/assets/background-deseo3.png',
    label: 'Escribe tu tercer deseo',
    nextRoute: null,
    prevRoute: '/crear-deseo-2',
    quote: {
      parts: [
        { text: '"Tengo la', color: 'gold' },
        { text: 'fe inquebrantable', color: 'white' },
        { text: 'que mis deseos se', color: 'gold' },
        { text: 'cumplirán"', color: 'white' },
      ]
    }
  }
};

function CrearDeseo({ tipo = 'deseo1' }) {
  const { usuario } = useAuth();
  const navigate = useNavigate();
  const [deseo, setDeseo] = useState('');
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');

  const config = CONFIGURACIONES[tipo];

  useEffect(() => {
    const cargarDeseo = async () => {
      if (!usuario?.uid) return;
      
      try {
        const textoGuardado = await obtenerDeseo(usuario.uid, tipo);
        if (textoGuardado) {
          setDeseo(textoGuardado);
        }
      } catch (err) {
        console.error('Error cargando deseo:', err);
      } finally {
        setCargando(false);
      }
    };

    cargarDeseo();
  }, [usuario, tipo]);

  const handleGuardar = async () => {
    if (!deseo.trim()) {
      setError('Por favor escribe tu deseo');
      return;
    }

    setGuardando(true);
    setError('');

    try {
      await guardarDeseo(
        usuario.uid,
        tipo,
        deseo,
        usuario.displayName || usuario.email
      );
      
      toast.success('✨ ¡Deseo guardado exitosamente!');
      
      // Limpiar el campo y navegar al siguiente
      if (config.nextRoute) {
        setDeseo(''); // Limpiar antes de navegar
        setTimeout(() => navigate(config.nextRoute), 800);
      }
    } catch (error) {
      console.error('Error al guardar deseo:', error);
      
      if (error.message.includes('network') || error.code === 'unavailable') {
        toast.error('Sin conexión. Guardado localmente, se sincronizará después.');
      } else {
        setError('Error al guardar. Intenta nuevamente.');
        toast.error('Error al guardar deseo');
      }
    } finally {
      setGuardando(false);
    }
  };

  const pageStyle = config.backgroundImage
    ? {
        backgroundImage: `url(${config.backgroundImage})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }
    : {
        background: `${config.backgroundColor} url(/assets/background.png) center/cover no-repeat fixed`,
        ...(config.backgroundBlendMode && { backgroundBlendMode: config.backgroundBlendMode })
      };

  if (cargando) {
    return (
      <div className={styles.page} style={pageStyle}>
        <div className={styles.content}>
          <div className={styles.skeleton}>
            <div className={styles.skeletonLogo} />
            <div className={styles.skeletonTextarea} />
            <div className={styles.skeletonButton} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page} style={pageStyle}>
      {config.prevRoute && (
        <Link to={config.prevRoute} className={styles.backArrow} aria-label="Volver">
          <img src="/icons/arrow-left.svg" alt="Atrás" className={styles.arrowIcon} />
        </Link>
      )}

      <div className={styles.pattern} />

      <div className={styles.content}>
        <div className={styles.header}>
          <img src="/assets/logo.png" alt="WIZH" className={styles.logo} />
          
          <div className={styles.formWrapper}>
            <textarea
              value={deseo}
              onChange={(e) => setDeseo(e.target.value)}
              placeholder=""
              className={styles.textarea}
              disabled={guardando}
            />
            
            <div className={styles.actions}>
              <p className={styles.label}>{config.label}</p>
              <button
                onClick={handleGuardar}
                disabled={guardando || !deseo.trim()}
                className={styles.button}
              >
                {guardando ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </div>
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.spacer} />

        <div className={styles.quote}>
          <p className={styles.quoteText}>
            {config.quote.parts.map((part, index) => (
              <React.Fragment key={index}>
                <span className={part.color === 'gold' ? styles.gold : styles.white}>
                  {part.text}
                </span>
                {index < config.quote.parts.length - 1 && ' '}
                {(index === 1 || index === 3 || index === 5) && <br />}
              </React.Fragment>
            ))}
          </p>
        </div>
      </div>
    </div>
  );
}

export default CrearDeseo;
