import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import logo from '../../assets/images/logo_cdc.png';
import { useAuth } from '../../AuthProvider';

const Header: React.FC = () => {
  const { user, logout } = useAuth(); // Obtener el estado de autenticación del contexto
  const navigate = useNavigate();

  return (
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
            <li><a href="/catalogue" className="nav-link px-2">Catálogo</a></li>
            <li><a href="#" className="nav-link px-2">Reservas</a></li>
            <li><a href="/catalogue" className="nav-link px-2">Productos</a></li>
            <li><a href="/#quienes-somos" className="nav-link px-2">About</a></li>
          </ul>
          {/* Contenedor de botones de Login y Registro / logout / funcionalidades */}
          <div className="nav col-12 col-lg-auto justify-content-center justify-content-lg-start mb-2 mb-lg-0 align-items-center text-center">
            <div className="d-lg-flex flex-lg-row justify-content-center justify-content-lg-start">
              {/* Usuario no identificado */}
              {user ? (
                <>
                  {/* Botón de logout */}
                  <button type="button" className="btn btn-outline-primary mb-2 mb-lg-0" onClick={logout}>Logout</button>
                  {/* Desplegable de perfil para usuarios logueados */}
                  {(user.type === 'user' || user.type === 'admin') && (
                    <div className="dropdown ms-2 me-2">
                      <button className="btn btn-primary dropdown-toggle mb-2 mb-lg-0" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                        Perfil
                      </button>
                      <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                        <li><a className="dropdown-item" href="/profile">Mi perfil</a></li>
                        <li><a className="dropdown-item" href="/my-orders">Mis Pedidos</a></li>
                        <li><a className="dropdown-item" href="#">Mis Reservas</a></li>
                        <li><a className="dropdown-item" href={`/edit-user/${user.id}`}>Modificar Usuario</a></li>
                        <li><a className="dropdown-item" href="">Cambiar Contraseña</a></li>
                      </ul>
                    </div>
                  )}
                  {/* Botón de zona administrador para usuarios admin */}
                  {user.type === 'admin' && (
                    <div className="dropdown">
                    <button className="btn btn-success dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                      Zona Administrador
                    </button>
                    <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                      <li><a className="dropdown-item" href="/manage-users">Administrar Usuarios</a></li>
                      <li><a className="dropdown-item" href="/manage-orders">Administrar Pedidos</a></li>
                      <li><a className="dropdown-item" href="#">Administrar Reservas</a></li>
                      <li><a className="dropdown-item" href="/manage-products">Administrar Productos</a></li>
                      <li><a className="dropdown-item" href="/manage-categories">Administrar Categorías</a></li>
                    </ul>
                  </div>
                  )}
                </>
              ) : (
                <>
                  {/* Botones de login y registro */}
                  <button type="button" className="btn btn-outline-primary mb-2 mb-lg-0" onClick={() => navigate('/login')}>Login</button>
                  <button type="button" className="btn btn-primary mb-2 mb-lg-0 ms-2 me-2" onClick={() => navigate('/registro')}>Registro</button>
                </>
              )}
            </div>
            {/* Icono de la cesta */}
            <Link to="/basket" className="text-dark text-decoration-none ms-lg-5 d-inline-block d-lg-flex" aria-label="Ir a la cesta de la compra">
                <i className="bi bi-cart4 fs-4"></i>
            </Link>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header;
