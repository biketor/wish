import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './Styles.css';
import { registerSW } from 'virtual:pwa-register';

registerSW({
  onRegistered() {
    console.log('Service Worker registrado');
  },
  onRegisterError(error) {
    console.log('Error SW', error);
  }
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
