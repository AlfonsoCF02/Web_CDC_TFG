import React from 'react';
import { useNavigate } from 'react-router-dom';

/******************************************************************************
 *
 * @author          Alfonso Cabezas Fernández
 * 
 * Con la ayuda de la herramienta de inteligencia artificial ChatGPT
 * 
 * @description    Página de "Página No Encontrada"
 * 
 ******************************************************************************/

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>Página No Encontrada</h2>
      <p>Lo sentimos, la página que estás buscando no existe.</p>
      <button
        className="btn btn-danger" // Clase de Bootstrap para hacer el botón rojo
        onClick={() => navigate('/')} // Navega hacia la ruta principal
      >
        Ir a la página principal
      </button>
    </div>
  );
};

export default NotFoundPage;
