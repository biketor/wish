import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useEmailAuth } from '../hooks/useEmailAuth';
import styles from './Auth.module.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { iniciarSesion, cargando, error } = useEmailAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await iniciarSesion(email, password);
  };

  return (
    <div className="app">
      <main>
        <div className="container">
          {/* Flecha de regreso */}
          <Link
            to="/preregistro"
            aria-label="Volver a Preregistro"
            className={styles.backArrow}
          >
            <img src="/icons/arrow-left.svg" alt="Volver" className={styles.arrowIcon} />
          </Link>
          <div className="logo">
            <img src="/assets/logo.png" alt="WIZH Logo" className="logo-img" />
          </div>

          <form className="form" id="wizFormLogin" onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="email"
                placeholder="Tu email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                placeholder="Tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && (
              <p className={styles.error}>
                {error}
              </p>
            )}
            <button type="submit" className="btn-primary" disabled={cargando}>
              {cargando ? 'Iniciando...' : 'Iniciar sesión'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default Login;
