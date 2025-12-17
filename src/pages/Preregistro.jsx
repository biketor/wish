import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '../hooks/useGoogleLogin';
import styles from './Preregistro.module.css';

function Preregistro() {
  const navigate = useNavigate();
  const { loginConGoogle, cargando, error } = useGoogleLogin();

  return (
    <div className="app">
      <main>
        <div className="container">
          <div className="logo">
            <img src="/assets/logo.png" alt="WIZH Logo" className="logo-img" />
          </div>

          <div className={styles.intro}>
            <p className={styles.introText}>
              Regístrate crea tus deseo<br />y comienza a creer.
            </p>
          </div>

          <div className="form">
            <button
              className={`btn-primary ${styles.btnEmail}`}
              onClick={() => navigate('/registro')}
            >
              <img src="/icons/email.svg" alt="Email" className={styles.icon} />
              Registrate con Email
            </button>
            <button
              className={`btn-secondary ${styles.btnGoogle}`}
              onClick={loginConGoogle}
              disabled={cargando}
            >
              <img src="/icons/google.svg" alt="Google" className={styles.icon} />
              {cargando ? 'Cargando...' : 'Continuar con Google'}
            </button>
          </div>

          {error && (
            <p className={styles.error}>
              {error}
            </p>
          )}

          <div className="login-link">
            <p>¿Ya tienes cuenta?</p>
            <Link to="/login">INICIAR SESIÓN</Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Preregistro;
