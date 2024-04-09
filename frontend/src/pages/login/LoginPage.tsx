import { useState, ChangeEvent, FormEvent } from 'react';
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
  const [emailTouched, setEmailTouched] = useState(false);
  const [emailError, setEmailError] = useState('');
  
  const [password, setPassword] = useState('');
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setEmailTouched(true);
    validateEmail(e.target.value);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setPasswordTouched(true);
    validatePassword(e.target.value);
  };

  const validateEmail = (email: string) => {
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setEmailError('El email no es válido.');
    } else {
      setEmailError('');
    }
  };

  const validatePassword = (password: string) => {
    if (password.length < 1) {
      setPasswordError('Por favor, ingrese su contraseña.');
    } else {
      setPasswordError('');
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {

    event.preventDefault();

    //Para validar al pulsar el botón de login marcar como tocados los campos
    setEmailTouched(true);
    setPasswordTouched(true);

    validateEmail(email);
    validatePassword(password);

    if (!emailError && !passwordError && email && password) {
      console.log("Login exitoso.");
      // Aquí iría la lógica para manejar el inicio de sesión
    }
    
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const getInputClass = (error: string, touched: boolean) => {
    if (!touched) return 'form-control';
    return `form-control ${error ? 'is-invalid' : touched ? 'is-valid' : ''}`;
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
                  <form noValidate onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label htmlFor="email">E-Mail</label>
                      <input 
                        id="email" 
                        type="email" 
                        className={getInputClass(emailError, emailTouched)}
                        name="email" 
                        value={email} 
                        onChange={handleEmailChange} 
                        autoFocus 
                      />
                      {emailError && <div className="invalid-feedback">{emailError}</div>}
                    </div>
                    <div className="mb-3 position-relative">
                      <label htmlFor="password">Password</label>
                      <input 
                        id="password" 
                        type={showPassword ? "text" : "password"} 
                        className={getInputClass(passwordError, passwordTouched)}
                        name="password" 
                        value={password} 
                        onChange={handlePasswordChange}
                      />
                      {passwordError && <div className="invalid-feedback">{passwordError}</div>}
                      <i 
                        className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'} position-absolute eye-icon ${passwordTouched ? 'eye-icon-adjusted' : ''}`}
                        onClick={toggleShowPassword}
                      />
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
                      ¿No tienes cuenta? <a href="/registro">Crear una</a>
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
