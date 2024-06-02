import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import 'react-calendar/dist/Calendar.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { baseUrl } from '../../config';

/******************************************************************************
 *
 * @author          Alfonso Cabezas Fernández
 * 
 * Con la ayuda de la herramienta de inteligencia artificial ChatGPT
 * 
 * @description    Página de "Crear Reserva"
 * 
 ******************************************************************************/

interface FieldState {
  value: string;
  touched: boolean;
  isValid: boolean;
  errorMessage: string;
}

interface FieldsState {
  [key: string]: FieldState;
}

interface AvailabilityResponse {
  available: boolean;
  availableSlots: number;
}

const CreateReservation: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [availabilityMessage, setAvailabilityMessage] = useState('');
  const [availableSlots, setAvailableSlots] = useState<number>(0);
  const [isDateValid, setIsDateValid] = useState(true); // Estado para controlar si la fecha es válida
  const [reservationId, setReservationId] = useState<string | null>(null); // Estado para almacenar el ID de la reserva
  const [showModal, setShowModal] = useState(false); // Estado para controlar la visibilidad del modal
  const navigate = useNavigate();

  const [fields, setFields] = useState<FieldsState>({
    name: { value: '', touched: false, isValid: false, errorMessage: 'Por favor, introduce tu nombre.' },
    email: { value: '', touched: false, isValid: false, errorMessage: 'Por favor, introduce un email válido.' },
    participants: { value: '', touched: false, isValid: false, errorMessage: 'Por favor, selecciona el número de participantes.' },
    price: { value: '', touched: false, isValid: false, errorMessage: '' },
    selectedDate: { value: '', touched: false, isValid: false, errorMessage: '' },
    ccName: { value: '', touched: false, isValid: false, errorMessage: 'Por favor, introduce el titular de la tarjeta.' },
    ccNumber: { value: '', touched: false, isValid: false, errorMessage: 'Por favor, introduce un número de tarjeta válido.' },
    ccExpiration: { value: '', touched: false, isValid: false, errorMessage: 'Por favor, introduce una fecha de expiración válida.' },
    ccCvv: { value: '', touched: false, isValid: false, errorMessage: 'Por favor, introduce un CVV válido.' },
  });

  useEffect(() => {
    if (selectedDate) {
      // Realizar la llamada a la API para verificar disponibilidad
      checkAvailability(selectedDate);
    }
  }, [selectedDate]);

  const checkAvailability = async (date: Date) => {
    // Ensure the date is not in the past
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);  // Clear the time part to compare only dates

    if (date < currentDate) {
        setIsDateValid(false); // Si la fecha es anterior a hoy, establecer isDateValid en false
        setAvailabilityMessage('La fecha seleccionada no puede ser anterior a hoy.');
        setFields(prevFields => ({
            ...prevFields,
            selectedDate: { value: '', touched: true, isValid: false, errorMessage: 'La fecha seleccionada no puede ser anterior a hoy.' },
        }));
        return false;
    } else {
        setIsDateValid(true); // Si la fecha es válida, establecer isDateValid en true
    }

    try {
        // Formatting the date to YYYY-MM-DD for the API call
        const dateString = date.toLocaleDateString('en-CA', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
        const response = await axios.get<AvailabilityResponse>(`${baseUrl}/api/reservation/checkavailability/${dateString}`);
        const { available, availableSlots } = response.data;
        setAvailableSlots(availableSlots);

        if (available) {
            setAvailabilityMessage('');
            setFields(prevFields => ({
                ...prevFields,
                selectedDate: { value: date.toISOString(), touched: true, isValid: true, errorMessage: '' },
            }));
            return true;
        } else {
            setAvailabilityMessage('No quedan plazas disponibles para la fecha seleccionada.');
            setFields(prevFields => ({
                ...prevFields,
                selectedDate: { value: '', touched: true, isValid: false, errorMessage: 'No quedan plazas disponibles para la fecha seleccionada.' },
            }));
            return false;
        }
    } catch (error) {
        console.error('Error al verificar disponibilidad:', error);
        setAvailabilityMessage('Error al verificar disponibilidad. Por favor, inténtalo de nuevo más tarde.');
        setFields(prevFields => ({
            ...prevFields,
            selectedDate: { value: '', touched: true, isValid: false, errorMessage: 'Error al verificar disponibilidad.' },
        }));
        return false;
    }
  };

  const handleDateChange = (value: Date | Date[] | any) => {
    const newDate = Array.isArray(value) ? value[0] : value;
    setSelectedDate(newDate);
    checkAvailability(newDate);
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const isValid = validateField(name, value);
    setFields((prevFields) => ({
      ...prevFields,
      [name]: { ...prevFields[name], value, touched: true, isValid },
    }));
  };
  
  const validateField = (name: string, value: string): boolean => {
    switch (name) {
      case 'name':
        return value.trim() !== '';
      case 'email':
        return /\S+@\S+\.\S+/.test(value);
      case 'participants':
        return value !== '' && parseInt(value) <= availableSlots;
      case 'ccName':
        return value.trim() !== '';
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

  const calculatePrice = (participants: number): number => {
    return participants * 5;
  };

  const handleReservar = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();

    let allFieldsValid = true;
    const updatedFields = Object.keys(fields).reduce<FieldsState>((acc, fieldName) => {
      const field = fields[fieldName];
      const isValid = validateField(fieldName, field.value);
  
      if (!isValid) {
        allFieldsValid = false;
      }
  
      acc[fieldName] = {
        ...field,
        touched: true,
        isValid: isValid,
        errorMessage: isValid ? '' : field.errorMessage
      };
  
      return acc;
    }, {});
  
    setFields(updatedFields); 
  
    if (allFieldsValid) {
      setIsLoading(true);
      // Collect reservation data
      const reservationData = {
        userID: localStorage.getItem('id') || '', // Get userID from localStorage or use empty string if not present
        orderer: fields.name.value,
        email: fields.email.value,
        dateArrival: selectedDate.toLocaleDateString('en-CA'), // Format date as YYYY-MM-DD
        participants: parseInt(fields.participants.value),
        price: calculatePrice(parseInt(fields.participants.value))
      };

      try {
        console.log('Reservando visita:', reservationData);
        const response = await axios.post(`${baseUrl}/api/reservation/create`, reservationData);
        setReservationId(response.data.id); // Guardar el ID de la reserva
        setShowModal(true); // Mostrar el modal después de la reserva

      } catch (error) {
        console.error('Error al reservar la visita:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const renderParticipantOptions = () => {
    const options = [];
    for (let i = 1; i <= availableSlots; i++) {
      options.push(<option key={i} value={i}>{i}</option>);
    }
    return options;
  };

  const handleCloseModal = () => {
    setShowModal(false);
    if(localStorage.getItem('id')){
      navigate('/my-reservations');
    }else{
      navigate(`/`);
    }
  };

  return (
    <main className="container mt-3">
      <div className="mb-3">
        <h2 className="text-center">Reserva una visita con nosotros</h2>
      </div>
      <div className="card mb-3">
        <div className="card-header">Datos de la reserva</div>
        <div className="card-body">
          <div>
            <p className='text-center'>Selecciona una fecha:</p>
            <div className="d-flex justify-content-center">
                <Calendar onChange={handleDateChange} value={selectedDate} />
            </div>
            <div className="mb-3">
              <label htmlFor="selectedDate" className="form-label mt-5">
                Fecha seleccionada
              </label>
              <input
                type="text"
                className={`form-control ${fields.selectedDate && fields.selectedDate.touched && !fields.selectedDate.isValid ? 'is-invalid' : fields.selectedDate && fields.selectedDate.isValid ? 'is-valid' : ''}`}
                id="selectedDate"
                name="selectedDate"
                value={selectedDate.toLocaleDateString('es', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit'
                  })}
                readOnly
              />
              <div className="invalid-feedback">{fields.selectedDate && fields.selectedDate.errorMessage}</div>
            </div>
          </div>
          {/* Formulario */}
          <form noValidate>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                Nombre
              </label>
              <input
                type="text"
                className={`form-control ${fields.name.touched && !fields.name.isValid ? 'is-invalid' : fields.name.isValid ? 'is-valid' : ''}`}
                id="name"
                name="name"
                value={fields.name.value}
                onChange={handleChange}
              />
              <div className="invalid-feedback">{fields.name.errorMessage}</div>
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                className={`form-control ${fields.email.touched && !fields.email.isValid ? 'is-invalid' : fields.email.isValid ? 'is-valid' : ''}`}
                id="email"
                name="email"
                value={fields.email.value}
                onChange={handleChange}
              />
              <div className="invalid-feedback">{fields.email.errorMessage}</div>
            </div>
            <div className="mb-3">
              <label htmlFor="participants" className="form-label">
                Participantes: (disponibles: {availableSlots})
              </label>
              <select
                className={`form-select ${fields.participants.touched && !fields.participants.isValid ? 'is-invalid' : fields.participants.isValid ? 'is-valid' : ''}`}
                id="participants"
                name="participants"
                value={fields.participants.value}
                onChange={handleChange}
              >
                <option value="">Selecciona...</option>
                {renderParticipantOptions()}
              </select>
              <div className="invalid-feedback">{fields.participants.errorMessage}</div>
            </div>
            <div className="mb-3 text-center">
              <label htmlFor="price" className="form-label">
                <strong className="fs-5">Precio: {calculatePrice(parseInt(fields.participants.value || '0'))} €</strong>
              </label>
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
                        placeholder="MM/YY"
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
            <div className="text-center">
              <Button variant="primary" onClick={handleReservar} disabled={isLoading || !isDateValid}>
                {isLoading ? 'Procesando pago...' : null}
                {isLoading ? <span className="spinner-border spinner-border-sm ms-2" role="status" aria-hidden="true"></span> : 'Reservar'}
              </Button>
            </div>
          </form>
        </div>
      </div>
      {/* Modal de confirmación */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Reserva realizada correctamente</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          La reserva con identificador <strong>{reservationId}</strong> ha sido realizada correctamente.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => handleCloseModal()}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </main>
  );
};

export default CreateReservation;
