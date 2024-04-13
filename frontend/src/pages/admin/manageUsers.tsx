import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  DatatableWrapper,
  Filter,
  Pagination,
  PaginationOptions,
  TableBody,
  TableHeader,
  TableColumnType,
  BulkCheckboxControl,
  useCreateCheckboxHandlers
} from 'react-bs-datatable';
import { Col, Row, Table, Button } from 'react-bootstrap';
import { useAuth } from '../../AuthProvider';
import { baseUrl } from "../../config";

interface User {
  id: any; // Asumiendo que cada usuario tiene un ID único.
  name: string;
  surname: string;
  email: string;
  phone: string;
  type: string;
  actions: JSX.Element;
}


const ManageUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const { token, user } = useAuth();

  type ArrayElementType = typeof users[number] & {
    actions: any;
  };
  
  const headers: TableColumnType<ArrayElementType>[] = [
    {
      prop: 'name',
      title: 'Nombre',
      isFilterable: true,
      isSortable: true,
    },
    {
      prop: 'surname',
      title: 'Apellidos',
      isSortable: true,
      isFilterable: true,
    },
    {
      prop: 'email',
      title: 'Email',
      isSortable: true,
      isFilterable: true,
    },
    {
      prop: 'phone',
      title: 'Teléfono',
      isSortable: true,
      isFilterable: true,
    },
    {
      prop: 'type',
      title: 'Rol',
      isSortable: true,
      isFilterable: true,
    },
    {
      prop: 'actions',
      title: 'Acciones',
      cell: (row: ArrayElementType) => (
        //<div className="text-center">
        <>
          <Button variant="btn btn-primary me-2" size="sm" onClick={() => alert('Edit user ' + row.name)}>Editar</Button>
          <Button variant="btn btn-danger" size="sm" onClick={() => alert('Delete user ' + row.name)}>Borrar</Button>
        </>
        
      ),
    },
  ];


  useEffect(() => {
    const fetchUsers = async () => {
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
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
   fetchUsers();
  }, [token]);

  //<Table striped hover bordered responsive>

  return (
    <div className="container mt-3">
      <h2 className="text-center text-decoration-underline mb-4">Gestor de Usuarios</h2>
      <div className="table-container shadow-sm p-3 mb-5 bg-white rounded">
        <DatatableWrapper
          body={users}
          headers={headers}
          paginationOptionsProps={{
            initialState: {
              rowsPerPage: 5,
              options: [5, 10, 25, 50, 100]
            }
          }}
        >
          <Row className="mb-3 align-items-center justify-content-between">
            <Col xs={3} sm={2} md={2}>
              {/* Selector de "Rows per page" al principio */}
              <PaginationOptions />
            </Col>
            <Col xs={12} sm={6} md={4}>
              <Row>
                <Col xs={12} className="mt-4">
                  {/* Filtrar resultados */}
                  <div className="mt-2">
                    <Filter placeholder="Filtrar resultados..." />
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
          <Table striped hover responsive>
            <TableHeader />
            <TableBody />
          </Table>
          <Row>
            <Col xs={12} className="d-flex justify-content-end">
              {/* Paginación en la parte inferior derecha */}
              <Pagination />
            </Col>
          </Row>
        </DatatableWrapper>
      </div>
    </div>
  );
};


export default ManageUsers;
