import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Preregistro() {
  const navigate = useNavigate();
  return (
    <div className="app">
      <main>
        <div className="container">
          <div className="logo">
            <img src="/assets/logo.png" alt="WIZH Logo" className="logo-img" />
          </div>

          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <p style={{ fontSize: '1.2rem', lineHeight: '1.6', marginBottom: '30px' }}>
              Regístrate crea tus deseo<br />y comienza a creer.
            </p>
          </div>

          <div className="form">
            <button
              className="btn-primary"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}
              onClick={() => navigate('/registro')}
            >
              <img src="/icons/email.svg" alt="Email" style={{ width: '20px', height: '20px' }} />
              Registrate con Email
            </button>
            <button className="btn-secondary" style={{ backgroundColor: '#ffffff', color: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
              <img src="/icons/google.svg" alt="Google" style={{ width: '20px', height: '20px' }} />
              Continuar con Google
            </button>
          </div>

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
