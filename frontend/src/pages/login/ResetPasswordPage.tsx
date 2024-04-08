import React, { useState, ChangeEvent, FormEvent } from 'react';
import logo from '../../assets/images/logo_cdc.png';
import '../../assets/css/my-login.css';

const ResetPasswordPage: React.FC = () => {
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [passwordError, setPasswordError] = useState<string>('');
  const [confirmPasswordError, setConfirmPasswordError] = useState<string>('');
  const [passwordValid, setPasswordValid] = useState<boolean | null>(null);
  const [confirmPasswordValid, setConfirmPasswordValid] = useState<boolean | null>(null);

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

  const handleNewPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setNewPassword(newPassword);
    validateNewPassword(newPassword);
    //Para validar siempre si las contraseñas coinciden
    //validateConfirmPassword(newPassword, confirmPassword);
    if (confirmPassword.length > 0) {
      validateConfirmPassword(newPassword, confirmPassword);
    }
  };

  const handleConfirmPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const confirmPassword = e.target.value;
    setConfirmPassword(confirmPassword);
    validateConfirmPassword(newPassword, confirmPassword);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (newPassword && confirmPassword && passwordValid && confirmPasswordValid) {
      console.log("Formulario enviado con éxito.");
      // Implementa la lógica de envío aquí
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
                <h4 className="card-title">Restablecer contraseña</h4>
          <form onSubmit={handleSubmit} noValidate>
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
                className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'} position-absolute eye-icon was-validated eye-icon-adjusted`}
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
                className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'} position-absolute eye-icon eye-icon-adjusted`}
                onClick={toggleShowPassword}
              />
            </div>
            <div className="d-grid mb-3">
              <button type="submit" className="btn btn-primary">Restablecer contraseña</button>
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

export default ResetPasswordPage;
