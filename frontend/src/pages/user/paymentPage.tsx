import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthProvider';
import { baseUrl } from '../../config';

type ProductoCesta = {
  id: string;
  nombre: string;
  cantidad: number;
  precio: number;
  url: string;
  stock: number;
};

interface FieldState {
  value: string;
  touched: boolean;
  isValid: boolean;
  errorMessage: string;
}

interface FieldsState {
  [key: string]: FieldState;
}

const PaymentPage: React.FC = () => {
  // Recuperar datos de la cesta del almacenamiento local
  const savedCart = localStorage.getItem('cart');
  const cesta: { [productId: string]: ProductoCesta } = savedCart ? JSON.parse(savedCart) : {};
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Estado para los valores de los campos y sus estados de validación
  const [fields, setFields] = useState<FieldsState>({
    firstName: { value: '', touched: false, isValid: false, errorMessage: 'Por favor, introduce tu nombre.' },
    street: { value: '', touched: false, isValid: false, errorMessage: 'Por favor, introduce tu dirección.' },
    number: { value: '', touched: false, isValid: false, errorMessage: 'Por favor, introduce un teléfono válido.' },
    province: { value: '', touched: false, isValid: false, errorMessage: 'Por favor, introduce tu provincia.' },
    cp: { value: '', touched: false, isValid: false, errorMessage: 'Por favor, introduce un código postal válido.' },
    country: { value: '', touched: false, isValid: false, errorMessage: 'Por favor, introduce tu país.' },
    ccName: { value: '', touched: false, isValid: false, errorMessage: 'Por favor, introduce el titular de la tarjeta.' },
    ccNumber: { value: '', touched: false, isValid: false, errorMessage: 'Por favor, introduce un número de tarjeta válido.' },
    ccExpiration: { value: '', touched: false, isValid: false, errorMessage: 'Por favor, introduce la fecha de expiración.' },
    ccCvv: { value: '', touched: false, isValid: false, errorMessage: 'Por favor, introduce el CVV.' }
  });

  // Estado para controlar la validación global del formulario
  const [isValid, setIsValid] = useState<boolean>(false);
  const { user } = useAuth();

  // Función para manejar cambios en los campos
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const isValid = validateField(name, value);
    setFields((prevFields) => ({
      ...prevFields,
      [name]: { ...prevFields[name], value, touched: true, isValid }
    }));
    validateForm();
  };

  // Función para validar un campo
  const validateField = (name: string, value: string): boolean => {
    switch (name) {
      case 'firstName':
      case 'street':
      case 'province':
      case 'country':
      case 'ccName':
        return value.trim() !== '';
      case 'number':
        return /^\d{9}$/.test(value);
      case 'cp':
        return /^\d+$/.test(value.trim()) && value.trim().length >= 1;
      case 'ccNumber':
        return /^\d{16}$/.test(value);
      case 'ccExpiration':
        const [month, year] = value.split('/');
        const currentYear = new Date().getFullYear() % 100; // Obtener los últimos dos dígitos del año actual
        return /^\d{2}\/\d{2}$/.test(value) && parseInt(year) >= 24 && parseInt(month) >= 1 && parseInt(month) <= 12 && parseInt(year) >= currentYear;
      case 'ccCvv':
        return /^\d{3}$/.test(value);
      default:
        return true;
    }
  };

  // Función para validar todos los campos del formulario
  const validateForm = () => {
    const formIsValid = Object.values(fields).every(field => field.isValid);
    setIsValid(formIsValid);
  };

  const totalGlobal = Object.values(cesta).reduce((acc, item) => acc + item.precio * item.cantidad, 0);

  // Función para manejar el clic en el botón "Pagar"
  const handlePagar = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    // Marcar todos los campos como "touched"
    const touchedFields = Object.keys(fields).reduce((acc, fieldName) => {
      acc[fieldName] = { ...fields[fieldName], touched: true };
      return acc;
    }, {} as FieldsState);
    setFields(touchedFields);
    
    const formIsValid = Object.values(fields).every(field => field.isValid);

    if (formIsValid) {
      setIsLoading(true);
      const pedido = {
        userID: user ? user.id : '', // ID de usuario logueado
        name: fields.firstName.value, // Nombre del cliente
        street: fields.street.value, // Calle
        number: fields.number.value,// Número
        province: fields.province.value, // Provincia
        cp: fields.cp.value, // Código Postal
        country: fields.country.value, // País
        ccName: fields.ccName.value, // Titular de la tarjeta
        ccNumber: fields.ccNumber.value, // Número de tarjeta de crédito
        ccExpiration: fields.ccExpiration.value, // Fecha de expiración de la tarjeta
        ccCvv: fields.ccCvv.value, // CVV de la tarjeta
        productos: Object.values(cesta).map(item => ({
          productID: item.id,
          quantity: item.cantidad,
          price: item.precio
        })),
        import: totalGlobal // Importe total del pedido (se calcula utilizando totalGlobal)
    };
    try {

      const response = await axios.post(`${baseUrl}/api/order/create`, pedido);

      localStorage.removeItem('cart');

      alert('Pedido realizado con éxito');

      if(user){
        navigate('/my-orders');
      }else{
        navigate(`/order-completed`);
      }
    } catch (error: any) {
      console.error('Error al enviar el pedido:', error);
      if (error.response && error.response.data && error.response.data.error) {
        // Muestra el mensaje de error personalizado enviado desde el servidor
        // Puedes manejar el error de acuerdo a tu lógica específica aquí
        console.error('Error del servidor:', error.response.data.error);
      } else if (error.response) {
        // Si el servidor envió un error pero no en el formato esperado
        console.error('Error en el servidor:', error.response.status);
      } else {
        // Si no hay respuesta del servidor (problema de red o servidor caído)
        console.error('No se puede conectar al servidor. Por favor, revise su conexión a internet.');
      }
    }
    setIsLoading(false);
  } else {
      console.log('Formulario de pago NO enviado');
  }
};

  return (
    <main className="container mt-3">
      <h2 className="mb-4">Tramitar Pedido</h2>
      <div className="row g-5">
        {/* Sección de la cesta */}
        <div className="col-md-5 col-lg-4 order-md-last">
          <div className="card mb-3">
            <div className="card-header">
              <h4 className="d-flex justify-content-between align-items-center mb-3">
                <span className="text-primary">Tu Cesta</span>
                <span className="badge bg-primary rounded-pill">{Object.keys(cesta).length}</span>
              </h4>
            </div>
            <ul className="list-group mb-3">
              {/* Mostrar los productos de la cesta */}
              {Object.values(cesta).map(item => (
                <li key={item.id} className="list-group-item d-flex justify-content-between lh-sm">
                  <div>
                    <h6 className="my-0">{item.nombre}</h6>
                    <small className="text-muted">{item.cantidad} x {item.precio}€</small>
                  </div>
                  <span className="text-muted">{(item.precio * item.cantidad).toFixed(2)}€</span>
                </li>
              ))}
              <li className="list-group-item d-flex justify-content-between">
                <span>Total (EUR)</span>
                <strong>{totalGlobal.toFixed(2)}€</strong>
              </li>
            </ul>
            {/* Botón "Pagar" */}
            <div className="container mb-3">
              <Button variant="primary" className="w-100" onClick={handlePagar} disabled={isLoading}>
                {isLoading ? 'Procesando pago...' : null}
                {isLoading ? <span className="spinner-border spinner-border-sm ms-2" role="status" aria-hidden="true"></span> : 'Pagar'}
              </Button>
            </div>
          </div>
        </div>
        {/* Sección de datos personales y de pago */}
        <div className="col-md-7 col-lg-8">
          <div className="card mb-3">
            <div className="card-header">Datos de envío</div>
            <div className="card-body">
              <form className="needs-validation" noValidate>
                {/* Campos de datos personales */}
                <div className="row g-3">
                  <div className="col-md-12">
                    <label htmlFor="firstName" className="form-label">Nombre</label>
                    <input
                      type="text"
                      className={`form-control ${fields.firstName.touched && !fields.firstName.isValid ? 'is-invalid' : fields.firstName.isValid ? 'is-valid' : ''}`}
                      id="firstName"
                      name="firstName"
                      value={fields.firstName.value}
                      onChange={handleChange}
                      required
                    />
                    <div className="invalid-feedback">{fields.firstName.errorMessage}</div>
                  </div>
                  <div className="col-12">
                    <label htmlFor="street" className="form-label">Dirección</label>
                    <input
                      type="text"
                      className={`form-control ${fields.street.touched && !fields.street.isValid ? 'is-invalid' : fields.street.isValid ? 'is-valid' : ''}`}
                      id="street"
                      name="street"
                      value={fields.street.value}
                      onChange={handleChange}
                      required
                    />
                    <div className="invalid-feedback">{fields.street.errorMessage}</div>
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="province" className="form-label">Provincia</label>
                    <input
                      type="text"
                      className={`form-control ${fields.province.touched && !fields.province.isValid ? 'is-invalid' : fields.province.isValid ? 'is-valid' : ''}`}
                      id="province"
                      name="province"
                      value={fields.province.value}
                      onChange={handleChange}
                      required
                    />
                    <div className="invalid-feedback">{fields.province.errorMessage}</div>
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="cp" className="form-label">Código Postal</label>
                    <input
                      type="text"
                      className={`form-control ${fields.cp.touched && !fields.cp.isValid ? 'is-invalid' : fields.cp.isValid ? 'is-valid' : ''}`}
                      id="cp"
                      name="cp"
                      value={fields.cp.value}
                      onChange={handleChange}
                      required
                    />
                    <div className="invalid-feedback">{fields.cp.errorMessage}</div>
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="country" className="form-label">País</label>
                    <input
                      type="text"
                      className={`form-control ${fields.country.touched && !fields.country.isValid ? 'is-invalid' : fields.country.isValid ? 'is-valid' : ''}`}
                      id="country"
                      name="country"
                      value={fields.country.value}
                      onChange={handleChange}
                      required
                    />
                    <div className="invalid-feedback">{fields.country.errorMessage}</div>
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="number" className="form-label">Teléfono</label>
                    <input
                      type="text"
                      className={`form-control ${fields.number.touched && !fields.number.isValid ? 'is-invalid' : fields.number.isValid ? 'is-valid' : ''}`}
                      id="number"
                      name="number"
                      value={fields.number.value}
                      onChange={handleChange}
                      required
                    />
                    <div className="invalid-feedback">{fields.number.errorMessage}</div>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div className="card mb-3">
            <div className="card-header">Datos de pago con tarjeta de crédito</div>
            <div className="card-body">
              <form className="needs-validation" noValidate>
                {/* Campos de datos de pago con tarjeta de crédito */}
                <div className="row g-3">
                  <div className="col-md-6">
                    <label htmlFor="cc-name" className="form-label">Titular de la tarjeta</label>
                    <input
                      type="text"
                      className={`form-control ${fields.ccName.touched && !fields.ccName.isValid ? 'is-invalid' : fields.ccName.isValid ? 'is-valid' : ''}`}
                      id="cc-name"
                      name="ccName"
                      value={fields.ccName.value}
                      onChange={handleChange}
                      required
                    />
                    <div className="invalid-feedback">{fields.ccName.errorMessage}</div>
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="cc-number" className="form-label">Número de tarjeta de crédito</label>
                    <input
                      type="text"
                      className={`form-control ${fields.ccNumber.touched && !fields.ccNumber.isValid ? 'is-invalid' : fields.ccNumber.isValid ? 'is-valid' : ''}`}
                      id="cc-number"
                      name="ccNumber"
                      value={fields.ccNumber.value}
                      onChange={handleChange}
                      required
                    />
                    <div className="invalid-feedback">{fields.ccNumber.errorMessage}</div>
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="cc-expiration" className="form-label">Fecha de expiración</label>
                    <input
                      type="text"
                      className={`form-control ${fields.ccExpiration.touched && !fields.ccExpiration.isValid ? 'is-invalid' : fields.ccExpiration.isValid ? 'is-valid' : ''}`}
                      id="cc-expiration"
                      name="ccExpiration"
                      value={fields.ccExpiration.value}
                      onChange={handleChange}
                      required
                    />
                    <div className="invalid-feedback">{fields.ccExpiration.errorMessage}</div>
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="cc-cvv" className="form-label">CVV</label>
                    <input
                      type="text"
                      className={`form-control ${fields.ccCvv.touched && !fields.ccCvv.isValid ? 'is-invalid' : fields.ccCvv.isValid ? 'is-valid' : ''}`}
                      id="cc-cvv"
                      name="ccCvv"
                      value={fields.ccCvv.value}
                      onChange={handleChange}
                      required
                    />
                    <div className="invalid-feedback">{fields.ccCvv.errorMessage}</div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default PaymentPage;
