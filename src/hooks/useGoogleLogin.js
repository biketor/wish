import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { iniciarSesionConGoogle } from '../services/authService';

export const useGoogleLogin = () => {
  const navigate = useNavigate();
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  const loginConGoogle = async () => {
    setError('');
    setCargando(true);

    const resultado = await iniciarSesionConGoogle();

    if (resultado.success) {
      console.log('Usuario autenticado con Google:', resultado.user);
      navigate('/crear-deseo');
    } else {
      setError(resultado.error);
    }

    setCargando(false);
  };

  return {
    loginConGoogle,
    cargando,
    error
  };
};
