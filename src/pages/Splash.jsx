import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { cerrarSesion } from '../services/authService';
import styles from './Splash.module.css';

function Splash() {
  const { usuario } = useAuth();

  const handleCerrarSesion = async () => {
    await cerrarSesion();
  };

  return (
    <div className="app">
      <main>
        <div className={`container ${styles.container}`}>
          <div className="logo">
            <Link to="/preregistro" aria-label="Ir a Preregistro">
              <img src="/assets/logo.png" alt="WIZH Logo" className="logo-img" />
            </Link>
          </div>

          {usuario ? (
            <div className={styles.userInfo}>
              <p className={styles.welcomeText}>
                ¡Bienvenido, {usuario.displayName || usuario.email}!
              </p>
              <p className={styles.sessionText}>
                Sesión iniciada correctamente
              </p>
              <button
                onClick={handleCerrarSesion}
                className={`btn-primary ${styles.logoutBtn}`}
              >
                Cerrar sesión
              </button>
            </div>
          ) : (
            <p className={styles.startText}>
              Haz clic en el logo para comenzar
            </p>
          )}
        </div>
      </main>
    </div>
  );
}

export default Splash;
