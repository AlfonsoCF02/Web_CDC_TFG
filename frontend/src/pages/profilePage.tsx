import React from 'react';
import { useAuth } from '../AuthProvider';
import { Card } from 'react-bootstrap';
import { BiUser, BiIdCard, BiEnvelope, BiLock, BiPhone } from 'react-icons/bi'; // Importación de más iconos

const ProfileView: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return <div>No hay datos de usuario disponibles.</div>;
  }

  const { id, name, surname, email, type, phone } = user;

  return (
    <div className="container mt-3" style={{ maxWidth: '600px' }}> {/* Contenedor más pequeño */}
      <div className="text-center mb-4">
        <BiUser style={{ fontSize: '5rem', color: '#007bff' }} />
      </div>
      <Card>
        <Card.Body>
          <Card.Title className="text-center mb-4">Perfil de Usuario</Card.Title>
          <ul className="list-group list-group-flush">
            <li className="list-group-item d-flex align-items-center">
              <BiIdCard className="me-2" /><strong>ID:&nbsp;</strong>{id}
            </li>
            <li className="list-group-item d-flex align-items-center">
              <BiUser className="me-2" /><strong>Nombre:&nbsp;</strong>{name}&nbsp;{surname}
            </li>
            <li className="list-group-item d-flex align-items-center">
              <BiEnvelope className="me-2" /><strong>Email:&nbsp;</strong>{email}
            </li>
            <li className="list-group-item d-flex align-items-center">
              <BiLock className="me-2" /><strong>Tipo:&nbsp;</strong>{type}
            </li>
            <li className="list-group-item d-flex align-items-center">
              <BiPhone className="me-2" /><strong>Teléfono:&nbsp;</strong>{phone}
            </li>
          </ul>
          <div className="text-center mt-4">
            <a href={`/edit-user/${id}`} className="btn btn-primary">Editar</a>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ProfileView;
