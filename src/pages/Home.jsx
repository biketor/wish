import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { obtenerTodosLosDeseos } from '../services/deseoService';
import styles from './Home.module.css';

const Home = () => {
  const { usuario, cerrarSesion } = useAuth();
  const navigate = useNavigate();
  const [deseosCumplidos, setDeseosCumplidos] = useState(0);

  useEffect(() => {
    const cargarDeseos = async () => {
      if (!usuario?.uid) return;
      
      try {
        const deseos = await obtenerTodosLosDeseos(usuario.uid);
        const cumplidos = Object.values(deseos).filter(d => d.cumplido).length;
        setDeseosCumplidos(cumplidos);
      } catch (error) {
        console.error('Error cargando deseos:', error);
      }
    };

    cargarDeseos();
  }, [usuario]);

  const handleCerrarSesion = async () => {
    try {
      await cerrarSesion();
      navigate('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <div className={styles.page}>
      <img src="/assets/logo.png" alt="WIZH" className={styles.logo} />
      <img 
        src="/assets/perfil.png" 
        alt="Perfil" 
        className={styles.perfilIcon}
        onClick={() => navigate('/perfil')}
      />
      
      <div className={styles.content}>
        <img 
          src="/assets/triskel-home.png" 
          alt="Triskel" 
          className={styles.triskelImage}
        />

        <div className={styles.estadisticas}>
          <span className={styles.textoCumplidos}>Deseos cumplidos</span>
          {' '}          
          <span className={styles.cantidadCumplidos}>{deseosCumplidos}</span>
        </div>
      </div>
    </div>
  );
};

export default Home;
