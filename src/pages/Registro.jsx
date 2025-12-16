import React from 'react';

function Registro() {
  return (
    <div className="app">
      <main>
        <div className="container">
          <div className="logo">
            <img src="/assets/logo.png" alt="WIZH Logo" className="logo-img" />
          </div>

          <form className="form" id="wizFormRegistro">
            <div className="form-group">
              <input type="text" placeholder="Tu nombre y apellido" required />
            </div>
            <div className="form-group">
              <input type="email" placeholder="Tu email" required />
            </div>
            <div className="checkbox-group">
              <label>
                <input type="checkbox" required />
                <span>
                  Al registrarte o utilizar esta aplicación, aceptas regirte por nuestros Términos y Condiciones y
                  reconoces haber leído nuestra Política de Privacidad.
                </span>
              </label>
            </div>
            <button type="submit" className="btn-primary">Ok</button>
          </form>

          <div className="login-link">
            <p>¿Ya tienes cuenta?</p>
            <a href="#">INICIAR SESIÓN</a>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Registro;
