import React from 'react';
import { Link } from 'react-router-dom';

function Splash() {
  return (
    <div className="app">
      <main>
        <div className="container" style={{ display: 'grid', placeItems: 'center', minHeight: '70vh' }}>
          <div className="logo">
            <Link to="/preregistro" aria-label="Ir a Preregistro">
              <img src="/assets/logo.png" alt="WIZH Logo" className="logo-img" />
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Splash;
