import React from 'react';
import { useAuth } from '../AuthProvider';

const ProfileView: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return <div>No hay datos de usuario disponibles.</div>;
  }

  const { id, name, surname, email, type, phone } = user;

  return (
    <div className="container mt-2" style={{ maxWidth: '600px' }}>
      <div className="text-center mb-2">
        <i className="bi bi-person-circle" style={{ fontSize: '4rem', color: '#007bff' }}></i>
      </div>
      <div className="card">
        <div className="card-body">
          <h4 className="card-title text-center mb-4">Perfil de Usuario</h4>
          <ul className="list-group list-group-flush">
            <li className="list-group-item d-flex align-items-center">
              <i className="bi bi-card-list me-2"></i><strong>ID:&nbsp;</strong>{id}
            </li>
            <li className="list-group-item d-flex align-items-center">
              <i className="bi bi-person me-2"></i><strong>Nombre:&nbsp;</strong>{name}&nbsp;{surname}
            </li>
            <li className="list-group-item d-flex align-items-center">
              <i className="bi bi-envelope me-2"></i><strong>Email:&nbsp;</strong>{email}
            </li>
            <li className="list-group-item d-flex align-items-center">
              <i className="bi bi-telephone me-2"></i><strong>Teléfono:&nbsp;</strong>{phone}
            </li>
            <li className="list-group-item d-flex align-items-center">
              <i className="bi bi-lock me-2"></i><strong>Tipo:&nbsp;</strong>{type}
            </li>
          </ul>
          <div className="text-center mt-3">
            <a href={`/edit-user/${id}`} className="btn btn-primary">Editar</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
