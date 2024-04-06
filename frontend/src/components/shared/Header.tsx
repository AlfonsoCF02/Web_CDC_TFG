import React from 'react';
import logo from '../../assets/images/logo_cdc.png';
import './Header.css';

const Header: React.FC = () => {
  return (
    <>

    {/* Codigo base tomado de: https://getbootstrap.com/docs/5.3/examples/headers/ */}
    
    <div className="container">
        
      <header className="d-flex flex-wrap align-items-center justify-content-center justify-content-md-between p-3 py-3 mb-4 border-bottom">
        
        <div className="col-md-2 mb-2 mb-md-0">
          <a href="/" className="d-inline-flex link-body-emphasis text-decoration-none">
          <img className="bi img-fluid" src={logo} alt="Bootstrap" style={{ maxHeight: '55px', width: 'auto' }}  />
          </a>
        </div>
  
        <ul className="nav col-12 col-md-auto mb-2 justify-content-center mb-md-0">
          <li><a href="#" className="nav-link px-2 link-secondary">Home</a></li>
          <li><a href="#" className="nav-link px-2">Catálogo</a></li>
          <li><a href="#" className="nav-link px-2">Reservas</a></li>
          <li><a href="#" className="nav-link px-2">Productos</a></li>
          <li><a href="#" className="nav-link px-2">About</a></li>
        </ul>
  
        <div className="col-md-3 text-end">
          <button type="button" className="btn btn-outline-primary me-2">Login</button>
          <button type="button" className="btn btn-primary">Registro</button>
        </div>

        <a href="#" className="d-flex align-items-center text-dark text-decoration-none" aria-label="Ir a la cesta de la compra">
            <i className="bi bi-cart-check fs-4"></i>
        </a>

      </header>
    </div>



    <div className="container">
    <header className="p-3 py-3 mb-4 border-bottom">
        <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
        <a href="/" className="d-flex align-items-center mb-2 mb-lg-0 text-decoration-none me-3">
            <img src={logo} alt="Bootstrap" className="bi me-2" style={{ maxHeight: '55px', width: 'auto' }} />
        </a>

        <ul className="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
            <li><a href="#" className="nav-link px-2 text-secondary">Home</a></li>
            <li><a href="#" className="nav-link px-2">Catálogo</a></li>
            <li><a href="#" className="nav-link px-2">Reservas</a></li>
            <li><a href="#" className="nav-link px-2">Productos</a></li>
            <li><a href="#" className="nav-link px-2">About</a></li>
        </ul>

        <div className="text-end">
            <button type="button" className="btn btn-outline-primary me-2">Login</button>
            <button type="button" className="btn btn-primary me-5">Registro</button>
        </div>

        <a href="#" className="d-flex align-items-center text-dark text-decoration-none" aria-label="Ir a la cesta de la compra">
            <i className="bi bi-cart4 fs-4"></i>
        </a>

        </div>
    </header>
    </div>



    <div className="container">
    <header className="p-3 py-3 mb-4 border-bottom">
        <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">

        <ul className="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
            <li><a href="#" className="nav-link px-2 text-secondary">Home</a></li>
            <li><a href="#" className="nav-link px-2">Catálogo</a></li>
            <li><a href="#" className="nav-link px-2">Reservas</a></li>
            <li><a href="#" className="nav-link px-2">Productos</a></li>
            <li><a href="#" className="nav-link px-2">About</a></li>
        </ul>

        <div className="text-end">
            <button type="button" className="btn btn-outline-primary me-2">Login</button>
            <button type="button" className="btn btn-primary me-5">Registro</button>
        </div>

        <a href="#" className="d-flex align-items-center text-dark text-decoration-none" aria-label="Ir a la cesta de la compra">
            <i className="bi bi-bag-check fs-4"></i>
        </a>

        </div>
        </header>
    </div>



    </>
  );
};

export default Header;
