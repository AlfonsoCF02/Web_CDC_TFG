import React, { useState, ChangeEvent, FormEvent } from 'react';
import logo from '../../assets/images/logo_cdc.png';
import '../../assets/css/my-login.css';

/******************************************
 *
 * @author          Alfonso Cabezas Fernández
 * 
 * Con la ayuda de la herramienta de inteligencia artificial ChatGPT
 * 
 * @description    Página de reseteo de la contraseña
 * 
 ******************************************/

const RegisterPage: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [termsAccepted, setTermsAccepted] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [nameError, setNameError] = useState<string>('');
  const [lastNameError, setLastNameError] = useState<string>('');
  const [emailError, setEmailError] = useState<string>('');
  const [phoneError, setPhoneError] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');
  const [confirmPasswordError, setConfirmPasswordError] = useState<string>('');
  const [termsAcceptedError, setTermsAcceptedError] = useState<string>('');
  const [nameValid, setNameValid] = useState<boolean | null>(null);
  const [lastNameValid, setLastNameValid] = useState<boolean | null>(null);
  const [emailValid, setEmailValid] = useState<boolean | null>(null);
  const [phoneValid, setPhoneValid] = useState<boolean | null>(null);
  const [passwordValid, setPasswordValid] = useState<boolean | null>(null);
  const [confirmPasswordValid, setConfirmPasswordValid] = useState<boolean | null>(null);
  const [termsAcceptedValid, setTermsAcceptedValid] = useState<boolean | null>(null);

  const validateName = (name: string): boolean => {
    if (name.trim() === '') {
      setNameError('Por favor, ingrese su nombre.');
      setNameValid(false);
      return false;
    } else {
      setNameError('');
      setNameValid(true);
      return true;
    }
  };

  const validateLastName = (lastName: string): boolean => {
    if (lastName.trim() === '') {
      setLastNameError('Por favor, ingrese sus apellidos.');
      setLastNameValid(false);
      return false;
    } else {
      setLastNameError('');
      setLastNameValid(true);
      return true;
    }
  };

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

  const validatePhone = (phone: string): boolean => {
    if (phone.length !== 9){
      setPhoneError('Por favor, ingrese un número de teléfono válido.');
      setPhoneValid(false);
      return false;
    } else {
      setPhoneError('');
      setPhoneValid(true);
      return true;
    }
  };

  const validateNewPassword = (password: string): boolean => {
    if (password.length < 8) {
      setPasswordError('La contraseña debe tener más de 8 caracteres.');
      setPasswordValid(false);
      return false;
    } else {
      setPasswordError('');
      setPasswordValid(true);
      return true;
    }
  };

  const validateConfirmPassword = (password: string, confirmPassword: string): boolean => {
    if (password !== confirmPassword) {
      setConfirmPasswordError('Las contraseñas no coinciden.');
      setConfirmPasswordValid(false);
      return false;
    } else {
      setConfirmPasswordError('');
      setConfirmPasswordValid(true);
      return true;
    }
  };

  const validateTermsAccepted = (termsAccepted: boolean): boolean => {
    if (!termsAccepted) {
      setTermsAcceptedError('Debe aceptar los términos y condiciones.');
      setTermsAcceptedValid(false);
      return false;
    } else {
      setTermsAcceptedError('');
      setTermsAcceptedValid(true);
      return true;
    }
  };

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setName(name);
    validateName(name);
  };

  const handleLastNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const lastName = e.target.value;
    setLastName(lastName);
    validateLastName(lastName);
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value;
    setEmail(email);
    validateEmail(email);
  };

  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
    const phone = e.target.value;
    setPhone(phone);
    validatePhone(phone);
  };

  const handleNewPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setNewPassword(newPassword);
    validateNewPassword(newPassword);
    if (confirmPassword) validateConfirmPassword(newPassword, confirmPassword);
  };

  const handleConfirmPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const confirmPassword = e.target.value;
    setConfirmPassword(confirmPassword);
    validateConfirmPassword(newPassword, confirmPassword);
  };

  const handleTermsChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTermsAccepted(e.target.checked);
    validateTermsAccepted(e.target.checked);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nameIsValid = validateName(name);
    const lastNameIsValid = validateLastName(lastName);
    const emailIsValid = validateEmail(email);
    const phoneIsValid = validatePhone(phone);
    const newPasswordIsValid = validateNewPassword(newPassword);
    const confirmPasswordIsValid = validateConfirmPassword(newPassword, confirmPassword);
    const termsAcceptedIsValid = validateTermsAccepted(termsAccepted);
  
    if(confirmPasswordValid == null){
      setConfirmPasswordError('Por favor, ingrese la contraseña.');
      setConfirmPasswordValid(false);
    }

    if (nameIsValid && lastNameIsValid && emailIsValid && phoneIsValid && newPasswordIsValid && confirmPasswordIsValid && termsAcceptedIsValid) {
      console.log("Formulario enviado con éxito.");
      // Aquí se implementaría la lógica de envío del formulario
    } else {
      console.log("Por favor, complete todos los campos y acepte los términos y condiciones.");
    }
  };

  const getValidationClass = (isValid: boolean | null): string => {
    return isValid === null ? '' : isValid ? 'is-valid' : 'is-invalid';
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
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
                  <h4 className="card-title">Registro</h4>
                  <form onSubmit={handleSubmit} noValidate>
                    <div className="mb-3 position-relative">
                      <label htmlFor="name">Nombre</label>
                      <input 
                        id="name" 
                        type="text" 
                        className={`form-control ${getValidationClass(nameValid)}`}
                        name="name" 
                        value={name} 
                        onChange={handleNameChange} 
                        required 
                      />
                      {nameValid === false && <div className="invalid-feedback">{nameError}</div>}
                    </div>
                    <div className="mb-3 position-relative">
                      <label htmlFor="last-name">Apellidos</label>
                      <input 
                        id="last-name" 
                        type="text" 
                        className={`form-control ${getValidationClass(lastNameValid)}`}
                        name="last-name" 
                        value={lastName} 
                        onChange={handleLastNameChange} 
                        required 
                      />
                      {lastNameValid === false && <div className="invalid-feedback">{lastNameError}</div>}
                    </div>
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
                    <div className="mb-3 position-relative">
                      <label htmlFor="phone">Número de Teléfono</label>
                      <input 
                        id="phone" 
                        type="tel" 
                        className={`form-control ${getValidationClass(phoneValid)}`}
                        name="phone" 
                        value={phone} 
                        onChange={handlePhoneChange} 
                        required 
                      />
                      {phoneValid === false && <div className="invalid-feedback">{phoneError}</div>}
                    </div>
                    <div className="mb-3 position-relative">
                      <label htmlFor="new-password">Nueva contraseña</label>
                      <input 
                        id="new-password" 
                        type={showPassword ? "text" : "password"} 
                        className={`form-control ${getValidationClass(passwordValid)}`}
                        name="new-password" 
                        value={newPassword} 
                        onChange={handleNewPasswordChange} 
                        required 
                      />
                      {passwordValid === false && <div className="invalid-feedback">{passwordError}</div>}
                      <i 
                        className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'} position-absolute eye-icon was-validated ${ passwordValid != null ? 'eye-icon-adjusted' : ''}`}
                        onClick={toggleShowPassword}
                      />
                    </div>
                    <div className="mb-3 position-relative">
                      <label htmlFor="confirm-password">Repetir contraseña</label>
                      <input 
                        id="confirm-password" 
                        type={showPassword ? "text" : "password"} 
                        className={`form-control ${getValidationClass(confirmPasswordValid)}`}
                        name="confirm-password" 
                        value={confirmPassword} 
                        onChange={handleConfirmPasswordChange} 
                        required 
                      />
                      {confirmPasswordValid === false && <div className="invalid-feedback">{confirmPasswordError}</div>}
                      <i 
                        className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'} position-absolute eye-icon ${ confirmPasswordValid != null ? 'eye-icon-adjusted' : ''}`}
                        onClick={toggleShowPassword}
                      />
                    </div>
                    <div className="mb-3 form-check">
                      <input 
                        type="checkbox" 
                        className={`form-check-input ${getValidationClass(termsAcceptedValid)}`}
                        id="terms-checkbox" 
                        checked={termsAccepted} 
                        onChange={handleTermsChange} 
                        required 
                      />
                      <label className="form-check-label" htmlFor="terms-checkbox">
                        Acepto los términos y condiciones
                      </label>
                      {termsAcceptedValid === false && <div className="invalid-feedback">{termsAcceptedError}</div>}
                    </div>
                    <div className="d-grid mb-3">
                      <button type="submit" className="btn btn-primary">Registrar</button>
                    </div>
                    <div className="mt-3 text-center">
                      ¿Ya tienes una cuenta? <a href="/login">Iniciar sesión</a>
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

export default RegisterPage;
