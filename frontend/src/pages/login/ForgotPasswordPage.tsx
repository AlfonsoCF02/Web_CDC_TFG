import React, { useState, ChangeEvent, FormEvent } from 'react';
import logo from '../../assets/images/logo_cdc.png';
import '../../assets/css/my-login.css';

/******************************************************************************
 *
 * @author          Alfonso Cabezas Fernández
 * 
 * Con la ayuda de la herramienta de inteligencia artificial ChatGPT
 * 
 * @description    Página de reseteo de la contraseña
 * 
 ******************************************************************************/

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [emailError, setEmailError] = useState<string>('');
  const [emailValid, setEmailValid] = useState<boolean | null>(null);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError('Por favor, ingrese un email válido.');
      setEmailValid(false);
      return false;
    } else {
      setEmailError('');
      setEmailValid(true);
      return true;
    }
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value;
    setEmail(email);
    validateEmail(email);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const emailIsValid = validateEmail(email);

    if (emailIsValid) {
      console.log("Formulario enviado con éxito.");
      // Aquí se implementaría la lógica de envío del formulario de recuperación de contraseña
    } else {
      console.log("Por favor, ingrese un email válido.");
    }
  };

  const getValidationClass = (isValid: boolean | null): string => {
    return isValid === null ? '' : isValid ? 'is-valid' : 'is-invalid';
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
                  <h4 className="card-title">¿Olvidaste tu contraseña?</h4>
                  <form onSubmit={handleSubmit} noValidate>
                    <div className="mb-3 position-relative">
                      <label htmlFor="email">Email</label>
                      <input 
                        id="email" 
                        type="email" 
                        className={`form-control ${getValidationClass(emailValid)}`}
                        name="email" 
                        value={email} 
                        onChange={handleEmailChange} 
                        required 
                      />
                      {emailValid === false && <div className="invalid-feedback">{emailError}</div>}
                    </div>
                    <div className="mb-3 text-center">
                      <p>Si el email está registrado le enviaremos su nueva contraseña.</p>
                    </div>
                    <div className="d-grid mb-3">
                      <button type="submit" className="btn btn-primary">Restablecer contraseña</button>
                    </div>
                    <div className="mt-3 text-center">
                      ¿Recordaste tu contraseña? <a href="/login">Iniciar sesión</a>
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

export default ForgotPasswordPage;
