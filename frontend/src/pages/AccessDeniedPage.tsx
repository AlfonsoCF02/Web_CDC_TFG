import React from 'react';
import { useNavigate } from 'react-router-dom';

const AccessDeniedPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>No tienes permisos para acceder a esta página</h2>
      <button
        className="btn btn-danger" // Clase de Bootstrap para el botón
        onClick={() => navigate('/')} // Navega hacia la ruta principal
        style={{ marginTop: '20px' }} // Espacio adicional para estética
      >
        Ir a la página principal
      </button>
    </div>
  );
};

export default AccessDeniedPage;
