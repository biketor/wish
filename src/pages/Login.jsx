import React from 'react';
import { Link } from 'react-router-dom';

function Login() {
  return (
    <div className="app">
      <main>
        <div className="container">
          {/* Flecha de regreso */}
          <Link
            to="/preregistro"
            aria-label="Volver a Preregistro"
            style={{
              position: 'fixed',
              top: 16,
              left: 16,
              zIndex: 1000,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: 'rgba(0,0,0,0.25)'
            }}
          >
            <img src="/icons/arrow-left.svg" alt="Volver" style={{ width: 22, height: 22 }} />
          </Link>
          <div className="logo">
            <img src="/assets/logo.png" alt="WIZH Logo" className="logo-img" />
          </div>

          <form className="form" id="wizFormLogin">
            <div className="form-group">
              <input type="email" placeholder="Tu email" required />
            </div>
            <div className="form-group">
              <input type="password" placeholder="Tu contraseña" required />
            </div>
            <button type="submit" className="btn-primary">Iniciar sesión</button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default Login;
