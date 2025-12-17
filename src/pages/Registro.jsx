import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useEmailAuth } from '../hooks/useEmailAuth';
import styles from './Auth.module.css';

function Registro() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [aceptaTerminos, setAceptaTerminos] = useState(false);
  const { registrar, cargando, error, setError } = useEmailAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!aceptaTerminos) {
      setError('Debes aceptar los términos y condiciones');
      return;
    }

    await registrar(email, password, nombre);
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

          <form className="form" id="wizFormRegistro" onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="text"
                placeholder="Tu nombre y apellido"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
            </div>
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
                placeholder="Tu contraseña (mínimo 6 caracteres)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength="6"
              />
            </div>
            <div className="checkbox-group">
              <label>
                <input
                  type="checkbox"
                  checked={aceptaTerminos}
                  onChange={(e) => setAceptaTerminos(e.target.checked)}
                  required
                />
                <span>
                  Al registrarte o utilizar esta aplicación, aceptas regirte por nuestros Términos y Condiciones y
                  reconoces haber leído nuestra Política de Privacidad.
                </span>
              </label>
            </div>
            {error && (
              <p className={styles.error}>
                {error}
              </p>
            )}
            <button type="submit" className="btn-primary" disabled={cargando}>
              {cargando ? 'Registrando...' : 'Ok'}
            </button>
          </form>

          <div className="login-link">
            <p>¿Ya tienes cuenta?</p>
            <Link to="/login">INICIAR SESIÓN</Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Registro;
