import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Splash from './pages/Splash';
import Preregistro from './pages/Preregistro';
import Registro from './pages/Registro';
import Login from './pages/Login';
import CrearDeseo1 from './pages/CrearDeseo1';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route path="/" element={<Splash />} />
          <Route path="/preregistro" element={<Preregistro />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/login" element={<Login />} />
          <Route path="/crear-deseo" element={<CrearDeseo1 />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
