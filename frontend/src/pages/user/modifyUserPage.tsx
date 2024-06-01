import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button, Form, Spinner, Modal } from 'react-bootstrap'; // Importar Modal
import { useAuth } from '../../AuthProvider';
import { baseUrl } from "../../config";

interface User {
  id: string;
  name: string;
  surname: string;
  email: string;
  phone: number;
  password: string;
  type: string;
}

const EditUserPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { token, user: currentUser } = useAuth();
  const navigate = useNavigate();
  const [isUpdating, setisUpdating] = useState(false);
  const { id } = useParams<{ id: string }>();

  const [user, setUser] = useState<User | null>({
    id: '',
    name: '',
    surname: '',
    email: '',
    phone: 0,
    password: '',
    type: '',
  });

  const [touched, setTouched] = useState({
    name: false,
    surname: false,
    email: false,
    phone: false,
    password: false,
    type: false,
  });

  const [errors, setErrors] = useState({
    name: '',
    surname: '',
    email: '',
    phone: '',
    password: '',
    type: '',
  });

  const [showPassword, setShowPassword] = useState(false);

  // Estado para el modal
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${baseUrl}/api/user/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
        navigate('/'); // Redirige a la página de inicio o a la página de error
      }
      setIsLoading(false);
    };

    fetchUser();
  }, [id, token, navigate]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUser(current => current ? { ...current, [name]: value } : null);
    setTouched(current => ({ ...current, [name]: true }));
    
    // Validamos el campo de contraseña solo si se ha ingresado algo
    if (name === 'password' && value.trim() === '') {
      setErrors(current => ({ ...current, [name]: '' })); // Limpiamos el error
    } else {
      validateField(name, value); // Validamos el campo si se ha ingresado algo
    }
  };

  const validateField = (name: string, value: string) => {
    let errorMessage = '';

    switch (name) {
      case 'name':
        errorMessage = value.trim() === '' ? 'Por favor ingrese un nombre.' : '';
        break;
      case 'surname':
        errorMessage = value.trim() === '' ? 'Por favor ingrese sus apellidos.' : '';
        break;
      case 'email':
        errorMessage = !/^\S+@\S+\.\S+$/.test(value) ? 'Por favor ingrese un correo electrónico válido.' : '';
        break;
      case 'phone':
        errorMessage = !/^\d{9}$/.test(value) ? 'Por favor ingrese un número de teléfono válido.' : '';
        break;
      case 'password':
        errorMessage = value.trim().length < 8 ? 'La contraseña debe tener al menos 8 caracteres.' : '';
        break;
      case 'type':
        errorMessage = value.trim() === '' ? 'Por favor seleccione un rol.' : '';
        break;
      default:
        break;
    }

    setErrors(current => ({ ...current, [name]: errorMessage }));
  };

  
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) return;
  
    // Verificamos si hay errores en algún campo
    const formIsValid = Object.values(errors).every(error => error === '');
  
    if (!formIsValid) {
      console.error('El formulario contiene errores.');
      return;
    }
  
    // Continuar con el envío del formulario si todos los campos son válidos
    setisUpdating(true);
    // Verificamos si el campo de contraseña está vacío o es indefinido
    if (!user.password || user.password.trim() === '') {
      // Si está vacío o es indefinido, eliminamos el campo de contraseña del objeto user para evitar cambios
      const { password, ...userDataWithoutPassword } = user;
      try {
        await axios.put(`${baseUrl}/api/user/update/${id}`, userDataWithoutPassword, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
          if(currentUser && currentUser.type === 'admin' && currentUser.id != user.id){
            navigate('/manage-users');
          }else{
            navigate(`/profile`);
          }
      } catch (error) {
        console.error('Error updating user:', error);
        setShowModal(true); // Mostrar el modal en caso de error
      }
    } else {
      // Si no está vacío, procedemos con la validación y el envío del formulario
      try {
        await axios.put(`${baseUrl}/api/user/update/${id}`, user, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setisUpdating(false);
        if(currentUser && currentUser.type === 'admin' && currentUser.id != user.id){
            navigate('/manage-users');
        }else{
            navigate(`/profile`);
        }
      } catch (error) {
        console.error('Error updating user:', error);
        setShowModal(true); // Mostrar el modal en caso de error
      }
    }
    setisUpdating(false);
  };
  

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '40vh' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (!user) {
    return <div>User not found</div>; // manejo cuando no se encuentra el usuario
  }

  return (
    <div className="my-login-page">
      <section className="h-100">
        <div className="container h-100">
          <div className="row justify-content-md-center align-items-center h-100">
            <div className="card-wrapper">
              <div className="card">
                <div className="card-body">
                  <h4 className="card-title">Editar Usuario</h4>
                  <Form onSubmit={handleSubmit} noValidate> {/* Agregamos noValidate al formulario */}
                    <Form.Group className="mb-3" controlId="name">
                      <Form.Label>Nombre</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={user.name}
                        onChange={handleChange}
                        required
                        isInvalid={touched.name && errors.name !== ''}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.name}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="surname">
                      <Form.Label>Apellidos</Form.Label>
                      <Form.Control
                        type="text"
                        name="surname"
                        value={user.surname}
                        onChange={handleChange}
                        required
                        isInvalid={touched.surname && errors.surname !== ''}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.surname}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="email">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={user.email}
                        onChange={handleChange}
                        required
                        isInvalid={touched.email && errors.email !== ''}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.email}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="phone">
                      <Form.Label>Teléfono</Form.Label>
                      <Form.Control
                        type="tel" 
                        name="phone"
                        value={user.phone}
                        onChange={handleChange}
                        required
                        isInvalid={touched.phone && errors.phone !== ''}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.phone}
                      </Form.Control.Feedback>
                    </Form.Group >
                    <Form.Group className="mb-3 position-relative " controlId="password">
                      <Form.Label>Contraseña</Form.Label>
                      <Form.Control
                        type={showPassword ? "text" : "password"}
                        name="password"
                        onChange={handleChange}
                        required
                        isInvalid={touched.password && errors.password !== ''}
                        className={`form-control ${touched.password ? 'is-touched' : ''}`}
                      />
                      <i
                        className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'} position-absolute mt-2 me-2 eye-icon ${errors.password ? 'me-4' : ''}`}
                        onClick={() => setShowPassword(!showPassword)}
                      />
                      {touched.password && errors.password && (
                        <Form.Control.Feedback type="invalid">
                          {errors.password}
                        </Form.Control.Feedback>
                      )}
                    </Form.Group>
                    {currentUser && currentUser.type === 'admin' && (
                    <section className="h-100">
                        <div className="container h-100">
                            <div className="row justify-content-md-center align-items-center h-100">
                                <div className="card-wrapper">
                                    <div className="card">
                                        <div className="card-body">
                                        <Form.Group className="mb-3" controlId="role">
                                            <Form.Label className="text-danger fw-bold">Permisos</Form.Label>
                                            <Form.Control
                                            as="select"
                                            name="type"
                                            value={user.type}
                                            onChange={handleChange}
                                            required
                                            isInvalid={touched.type && errors.type !== ''}
                                            >
                                            <option value="user">Usuario</option>
                                            <option value="admin">Administrador</option>
                                            </Form.Control>
                                            <Form.Control.Feedback type="invalid">
                                            {errors.type}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>                  
                    )}
                    <Button variant="primary" type="submit">
                      {isUpdating ? 'Actualizando... ' : null}
                      {isUpdating ? <span className="spinner-border spinner-border-sm ms-2" role="status" aria-hidden="true"></span> : 'Actualizar Usuario'}
                    </Button>
                  </Form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Error</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Ya existe un usuario con ese email.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default EditUserPage;
