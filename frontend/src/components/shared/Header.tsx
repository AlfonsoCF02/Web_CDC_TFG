import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/images/logo_cdc.png';

const Header: React.FC = () => {

const navigate = useNavigate();

  return (
    
    <>
    {/* Codigo base tomado de: https://getbootstrap.com/docs/5.3/examples/headers/ */}
    <div className="container">
      <header className="p-3 mb-4 border-bottom">
        <div className="d-flex flex-column flex-lg-row align-items-center justify-content-between flex-wrap">
          {/* Logo */}
          <a href="/" className="mb-2 mb-lg-0 text-decoration-none me-lg-4">
            <img src={logo} alt="Bootstrap" style={{ maxHeight: '55px', width: 'auto' }} />
          </a>
          {/* Home */}
          <ul className="nav col-12 col-lg-auto justify-content-center justify-content-lg-start mb-2 mb-lg-0 me-lg-auto">
            <li><a href="/" className="nav-link px-2 text-secondary">Home</a></li>
            <li><a href="#" className="nav-link px-2">Catálogo</a></li>
            <li><a href="#" className="nav-link px-2">Reservas</a></li>
            <li><a href="#" className="nav-link px-2">Productos</a></li>
            <li><a href="/about" className="nav-link px-2">About</a></li>
          </ul>
          {/* Contenedor de botones de Login y Registro */}
          <div className="nav col-12 col-lg-auto justify-content-center justify-content-lg-start mb-2 mb-lg-0 align-items-center text-center">
            <div className="d-lg-flex flex-lg-row justify-content-center justify-content-lg-start">
              <button type="button" className="btn btn-outline-primary mb-2 mb-lg-0" onClick={() => navigate('/login')}>Login</button>
              <button type="button" className="btn btn-primary mb-2 mb-lg-0 ms-2 me-2" onClick={() => navigate('/registro')}>Registro</button>
            </div>
            {/* Icono de la cesta */}
            <a href="#" className="text-dark text-decoration-none ms-lg-5 d-inline-block d-lg-flex" aria-label="Ir a la cesta de la compra">
              <i className="bi bi-cart4 fs-4"></i>
            </a>
          </div>
        </div>
      </header>
    </div>
    </>
    
  );
};

export default Header;
