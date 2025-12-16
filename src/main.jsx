import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './Styles.css';

// Service Worker se registra automáticamente en build
// En desarrollo, no es necesario registrar manualmente

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
