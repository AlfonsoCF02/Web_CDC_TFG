import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Modal, Button, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { baseUrl } from "../../config";

/******************************************************************************
 *
 * @author          Alfonso Cabezas Fernández
 * 
 * Con la ayuda de la herramienta de inteligencia artificial ChatGPT
 * 
 * @description    Página de gestión de usuarios para el administrador
 * 
 ******************************************************************************/

interface User {
  id: string;
  name: string;
  surname: string;
  email: string;
  phone: string;
  type: string;
}

const ManageUsers = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isDeletin, setisDeletin] = useState(false);
  const navigate = useNavigate();

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${baseUrl}/api/user/users`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setUsers(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      $('#usersTable').DataTable({
        data: users.map(user => ({
          name: user.name,
          surname: user.surname,
          email: user.email,
          phone: user.phone,
          type: user.type,
          actions: `<div class="text-center">
                      <button class="btn btn-primary btn-sm me-2" onclick="document.getElementById('edit-button-${user.id}').click()">Editar</button>
                      <button class="btn btn-danger btn-sm" onclick="document.getElementById('delete-button-${user.id}').click()">Eliminar</button>
                    </div>`
        })),
        destroy: true,
        columns: [
          { title: "Nombre", data: "name" },
          { title: "Apellidos", data: "surname" },
          { title: "Email", data: "email" },
          { title: "Teléfono", data: "phone" },
          { title: "Tipo", data: "type" },
          { title: "Acciones", data: "actions" }
        ],
        lengthMenu: [[5, 10, 25, 50, 100, -1], [5, 10, 25, 50, 100, "Todos"]],
        columnDefs: [
          { className: 'align-middle ', targets: '_all' },
        ],
        dom: "<'row'<'col-sm-12 col-md-6'l><'col-sm-12 col-md-6'f>>" +
             "<'row'<'col-sm-12'tr>>" +
             "<'row'<'col-md-4'i><'col-md-4 text-center'B><'col-md-4'p>>",
        buttons: [
          {
            extend: 'excelHtml5',
            text: 'Exportar a Excel',
            title: 'Usuarios de Cárnicas Dehesa Chaparral',
            className: 'btn btn-success'
          },
          {
            extend: 'pdfHtml5',
            text: 'Exportar a PDF',
            className: 'btn btn-danger',
            orientation: 'landscape',
            title: 'Usuarios de Cárnicas Dehesa Chaparral',
            pageSize: 'A4'
          }
        ],
        language: {
          processing: "Procesando...",
          lengthMenu: "Mostrar _MENU_ registros por página",
          zeroRecords: "No se encontraron resultados",
          emptyTable: "No hay datos disponibles en la tabla",
          info: "Mostrando de _START_ a _END_ de un total de _TOTAL_ registros",
          infoEmpty: "Mostrando 0 a 0 de 0 registros",
          infoFiltered: "(filtrado de _MAX_ registros totales)",
          search: "Buscar:",
        }
      });
    }
    styleDataTablesElements();
  }, [isLoading, users]);

  const styleDataTablesElements = () => {
    // Alinear la información de la paginación al centro
    $('.dataTables_info').parent().removeClass('col-md-4').addClass('col-md-4 text-center');
    $('.dt-buttons').parent().removeClass('col-md-4').addClass('col-md-4 text-center mt-3');
    $('.pagination').parent().removeClass('col-md-4').addClass('d-flex ms-auto justify-content-center justify-content-md-end mt-3 ');
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

  const handleDeleteUser = async (id: string) => {
    if (id) {
      try {
        setisDeletin(true);
        await axios.delete(`${baseUrl}/api/user/delete/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setShowDeleteModal(false);  // Cierra el modal de confirmación
        setisDeletin(false);  // Desactiva el spinner de carga
        fetchUsers();  // Actualiza la lista de usuarios tras eliminar uno
      } catch (error) {
        setisDeletin(false);
        console.error('Error deleting user:', error);
        // Aquí puedes manejar el error, por ejemplo, mostrando un mensaje al usuario
      }
    }
  };
  

  return (
    <div className="container mt-3">
      <h2 className="text-center text-decoration-underline mb-4">Gestor de Usuarios</h2>
      <div className="table-container shadow-sm p-3 mb-5 bg-white rounded">
        <table id="usersTable" className="table table-striped table-hover" style={{ width: "100%" }}></table>
      </div>
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Eliminar Usuario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás seguro de que deseas eliminar al usuario {currentUser?.name}?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancelar</Button>
          <Button variant="danger" onClick={() => currentUser && handleDeleteUser(currentUser.id)}>
            {isDeletin ? 'Eliminando... ' : null}
            {isDeletin ? <span className="spinner-border spinner-border-sm ms-2" role="status" aria-hidden="true"></span> : 'Eliminar'}
          </Button>
        </Modal.Footer>
      </Modal>
      {users.map(user => (
        <React.Fragment key={user.id}>
          <button id={`edit-button-${user.id}`} style={{ display: 'none' }} onClick={() => navigate(`/edit-user/${user.id}`)}></button>
          <button id={`delete-button-${user.id}`} style={{ display: 'none' }} onClick={() => {
            setCurrentUser(user);
            setShowDeleteModal(true);
          }}></button>
        </React.Fragment>
      ))}
    </div>
  );
};

export default ManageUsers;
