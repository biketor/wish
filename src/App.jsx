import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from './contexts/AuthContext';
import { sincronizarPendientes } from './services/deseoService';
import Splash from './pages/Splash';
import Preregistro from './pages/Preregistro';
import Registro from './pages/Registro';
import Login from './pages/Login';
import CrearDeseo from './pages/CrearDeseo';
import Reel from './pages/Reel';
import Home from './pages/Home';
import Perfil from './pages/Perfil';

function App() {
  useEffect(() => {
    // Sincronizar pendientes cuando carga la app
    const sync = async () => {
      const resultado = await sincronizarPendientes();
      if (resultado) {
        console.log('Deseos pendientes sincronizados');
      }
    };
    
    // Sincronizar al cargar y cuando vuelva la conexión
    sync();
    window.addEventListener('online', sync);
    
    return () => window.removeEventListener('online', sync);
  }, []);

  return (
    <AuthProvider>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Toaster 
          position="top-center" 
          richColors
          toastOptions={{
            style: {
              background: 'rgba(212, 175, 55, 0.95)',
              color: '#1a1a1a',
              border: '1px solid #d4af37',
              fontWeight: '500',
            },
          }}
        />
        <Routes>
          <Route path="/" element={<Splash />} />
          <Route path="/preregistro" element={<Preregistro />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/login" element={<Login />} />
          <Route path="/crear-deseo" element={<CrearDeseo tipo="deseo1" />} />
          <Route path="/crear-deseo-2" element={<CrearDeseo tipo="deseo2" />} />
          <Route path="/crear-deseo-3" element={<CrearDeseo tipo="deseo3" />} />
          <Route path="/reel" element={<Reel />} />
          <Route path="/home" element={<Home />} />
          <Route path="/perfil" element={<Perfil />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
