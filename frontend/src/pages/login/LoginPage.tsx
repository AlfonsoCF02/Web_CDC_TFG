import React, { useState } from 'react';
import logo from '../../assets/images/logo_cdc.png';
import '../../assets/css/my-login.css';

/******************************************
 *
 * Codigo base tomado de:
 *
 * @author          Muhamad Nauval Azhar
 * @copyright       Copyright (c) 2018 Muhamad Nauval Azhar
 * @license         My Login is licensed under the MIT license.
 * @github          https://github.com/nauvalazhar/my-login
 *
 * Posteriores modificado por:
 * 
 * @author          Alfonso Cabezas Fernández
 * 
 * Con la ayuda de la herramienta de inteligencia artificial ChatGPT
 * 
 * @description    Página de inicio de sesión
 * 
 ******************************************/

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [validated, setValidated] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setValidated(true);
    setFormSubmitted(true);

    // Incluir la lógica para manejar el envío del formulario
    
  };

  return (
    <div className="my-login-page">
      <section className="h-100">
        <div className="container h-100">
          <div className="row justify-content-md-center align-items-center h-100">
            <div className="card-wrapper">
              <div className="brand">
                <img src={logo} alt="Logo" />
              </div>
              <div className="card">
                <div className="card-body">
                  <h4 className="card-title">Login</h4>
                  <form 
                    className={`my-login-validation ${validated ? 'was-validated' : ''}`} 
                    noValidate 
                    onSubmit={handleSubmit}
                  >
                    <div className="mb-3">
                      <label htmlFor="email">E-Mail</label>
                      <input 
                        id="email" 
                        type="email" 
                        className="form-control" 
                        name="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                        autoFocus 
                      />
                      <div className="invalid-feedback">
                        El email no es válido.
                      </div>
                    </div>
                    <div className="mb-3 position-relative">
                      <label htmlFor="password">Password</label>
                      <input 
                        id="password" 
                        type={showPassword ? "text" : "password"} 
                        className="form-control" 
                        name="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                      />
                      <i 
                        className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'} position-absolute eye-icon ${formSubmitted && validated ? 'eye-icon-adjusted' : ''}`}
                        onClick={() => setShowPassword(!showPassword)}
                      />
                      <div className="invalid-feedback">
                        Debes introducir tu contraseña.
                      </div>
                    </div>
                    <div className="mb-3 d-flex flex-wrap justify-content-between align-items-center">
                      <div className="form-check mb-2 mb-lg-0">
                        <input 
                          type="checkbox" 
                          name="remember" 
                          id="remember" 
                          className="form-check-input" 
                        />
                        <label htmlFor="remember" className="form-check-label">Recuérdame</label>
                      </div>
                      <a href="/forgot-password" className="mb-2 mb-lg-0">Olvidé mi contraseña</a>
                    </div>
                    <div className="d-grid mb-3">
                      <button type="submit" className="btn btn-primary">Login</button>
                    </div>
                    <div className="mt-4 text-center">
                      ¿No tienes cuenta? <a href="/register">Crear una</a>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LoginPage;
