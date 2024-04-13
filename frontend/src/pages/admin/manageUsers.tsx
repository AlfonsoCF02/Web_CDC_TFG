import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DatatableWrapper, Filter, Pagination, PaginationOptions, TableBody, TableHeader, TableColumnType } from 'react-bs-datatable';
import { Col, Row, Table, Button, Modal, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate para redirecciones
import { useAuth } from '../../AuthProvider';
import { baseUrl } from "../../config";

interface User {
  id: any;
  name: string;
  surname: string;
  email: string;
  phone: string;
  type: string;
  actions: JSX.Element;
}

const ManageUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const { token } = useAuth();
  const navigate = useNavigate();

  const headers: TableColumnType<User>[] = [
    { prop: 'name', title: 'Nombre', isFilterable: true, isSortable: true },
    { prop: 'surname', title: 'Apellidos', isSortable: true, isFilterable: true },
    { prop: 'email', title: 'Email', isSortable: true, isFilterable: true },
    { prop: 'phone', title: 'Teléfono', isSortable: true, isFilterable: true },
    { prop: 'type', title: 'Rol', isSortable: true, isFilterable: true },
    {
      prop: 'actions',
      title: 'Acciones',
      cell: (row: User) => (
        <div className="text-center">
          <Button variant="primary me-2" size="sm" onClick={() => navigate(`/edit-user/${row.id}`, { state: { email: row.email } })}>Editar</Button>
          <Button variant="danger" size="sm" onClick={() => { setUserToDelete(row); setShowDeleteModal(true); }}>Eliminar</Button>
        </div>
      ),
    },
  ];

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${baseUrl}/api/user/users`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      // Aquí, transforma los datos si es necesario para que coincidan con tu estructura de `User`.
      setUsers(response.data.map((user: any) => ({
        ...user,
        actions: "Defined in headers" // Las acciones se manejan en la definición de headers.
      })));
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [token]);


  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '40vh' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  const handleDeleteUser = async () => {
    if (userToDelete) {
      try {
        await axios.delete(`${baseUrl}/api/user/delete/${userToDelete.id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setShowDeleteModal(false);
        fetchUsers(); // Refresca la lista de usuarios después de eliminar
      } catch (error) {
        //console.error('Error deleting user:', error);
      }
    }
  };

  return (
    <div className="container mt-3">
      <h2 className="text-center text-decoration-underline mb-4">Gestor de Usuarios</h2>
      <div className="table-container shadow-sm p-3 mb-5 bg-white rounded">
        <DatatableWrapper body={users} headers={headers} paginationOptionsProps={{ initialState: { rowsPerPage: 5, options: [5, 10, 25, 50, 100] }}}>
          <Row className="mb-3 align-items-center justify-content-between">
            <Col xs={3} sm={2} md={2}><PaginationOptions /></Col>
            <Col xs={12} sm={6} md={4}>
              <Row><Col xs={12} className="mt-4"><div className="mt-2"><Filter placeholder="Filtrar resultados..." /></div></Col></Row>
            </Col>
          </Row>
          <Table striped hover responsive><TableHeader /><TableBody /></Table>
          <Row><Col xs={12} className="d-flex justify-content-end"><Pagination /></Col></Row>
        </DatatableWrapper>
      </div>

      {/* Modal de confirmación para eliminar usuario */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>¿Seguro que desea eliminar a este usuario?</Modal.Body>
        <Modal.Footer>
          <Button variant="light" onClick={() => setShowDeleteModal(false)}>Cancelar</Button>
          <Button variant="danger" onClick={handleDeleteUser}>Eliminar</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ManageUsers;
