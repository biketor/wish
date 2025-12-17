import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registrarConEmail, iniciarSesionConEmail } from '../services/authService';

export const useEmailAuth = () => {
  const navigate = useNavigate();
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  const registrar = async (email, password, nombre) => {
    setError('');
    setCargando(true);

    const resultado = await registrarConEmail(email, password, nombre);

    if (resultado.success) {
      console.log('Usuario registrado:', resultado.user);
      navigate('/crear-deseo');
    } else {
      setError(resultado.error);
    }

    setCargando(false);
  };

  const iniciarSesion = async (email, password) => {
    setError('');
    setCargando(true);

    const resultado = await iniciarSesionConEmail(email, password);

    if (resultado.success) {
      console.log('Sesión iniciada:', resultado.user);
      navigate('/crear-deseo');
    } else {
      setError(resultado.error);
    }

    setCargando(false);
  };

  return {
    registrar,
    iniciarSesion,
    cargando,
    error,
    setError
  };
};
