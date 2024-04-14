import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Modal, Button, Spinner } from 'react-bootstrap';
import { baseUrl } from "../../config";

interface Category {
  id: string;
  categoria: string;
}

const ManageCategories = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<Category[]>([]); 
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Category>({ id: '', categoria: '' });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [categoryTouched, setCategoryTouched] = useState(false);
  const [categoryError, setCategoryError] = useState('');
  
  const fetchCategorias = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${baseUrl}/api/category/categories`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setData(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategorias();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      $('#categoriasTable').DataTable({
        data: data.map(item => ({
          id: item.id,
          categoria: item.categoria,
          acciones: `<div class="text-center">
                      <button class="btn btn-primary btn-sm me-2" onclick="document.getElementById('edit-button-${item.id}').click()">Editar</button>
                      <button class="btn btn-danger btn-sm" onclick="document.getElementById('delete-button-${item.id}').click()">Eliminar</button>
                     </div>`
        })),
        lengthMenu: [[5, 10, 25, 50, 100, -1], [5, 10, 25, 50, 100, "Todos"]],
        destroy: true, // Esta opción permite reinicializar el DataTable
        columns: [
          { title: "ID", data: "id" },
          { title: "Categoría", data: "categoria" },
          { title: "Acciones", data: "acciones" }
        ],
        dom: "<'row'<'col-sm-12 col-md-6'l><'col-sm-12 col-md-6'f>>" +
             "<'row'<'col-sm-12'tr>>" +
             "<'row'<'col-md-4'i><'col-md-4 text-center'B><'col-md-4'p>>",
        buttons: [
          {
            extend: 'excelHtml5',
            text: 'Exportar a Excel',
            title: 'Categorías de Cárnicas Dehesa Chaparral',
            className: 'btn btn-success'
          },
          {
            extend: 'pdfHtml5',
            text: 'Exportar a PDF',
            className: 'btn btn-danger',
            orientation: 'landscape',
            title: 'Categorías de Cárnicas Dehesa Chaparral',
            pageSize: 'A4'
          }
        ],
        language: {
          processing: "Procesando...",
          lengthMenu: "Mostrar _MENU_registros por página",
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
  }, [isLoading, data]);

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

  const handleEdit = (id: string, categoria:string) => {
    setCurrentCategory({ id, categoria });
    setShowEditModal(true);
  };

  const handleDelete = (id: string) => {
    setCurrentCategory({ id, categoria: '' });
    setShowDeleteModal(true);
  };

  const saveChanges = async () => {
    if (currentCategory && currentCategory.id) {
      // Resetea el estado de error antes de validar de nuevo
      setCategoryTouched(true);
      validateCategory(currentCategory.categoria);

      if (currentCategory.categoria) {
        try {
          const response = await axios.put(`${baseUrl}/api/category/update/${currentCategory.id}`, {
            categoria: currentCategory.categoria
          }, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          });
          setShowEditModal(false);
          refreshData(); 
        } catch (error:any) {
          if (error.response && error.response.status === 409) {
            setCategoryError('Ya existe otra categoría con ese nombre.');
          } else {
            console.error('Error updating category:', error);
            setCategoryError('Error al actualizar la categoría. Intente nuevamente.');
          }
        }
      }
    }
  };
  

const confirmDelete = async () => {
  if (currentCategory && currentCategory.id) {
    try {
      await axios.delete(`${baseUrl}/api/category/delete/${currentCategory.id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setShowDeleteModal(false);
      refreshData(); // Refresca la lista de categorías después de eliminar
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  }
};

const handleCreateCategory = async () => {
  setCategoryTouched(true);
  validateCategory(newCategoryName);
  if (newCategoryName && !categoryError) {
    try {
      const response = await axios.post(`${baseUrl}/api/category/create`, {
        categoria: newCategoryName
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      closeAndResetModal();
      fetchCategorias();
    } catch (error:any) {
      if (error.response && error.response.status === 409) {
        setCategoryError('La categoría ya existe.'); // Manejar el error específico de categoría duplicada
      } else {
        setCategoryError('Error al crear la categoría. Intente nuevamente.');
      }
    }
  }
};


const validateCategory = (name: string) => {
  if (!name.trim()) {
    setCategoryError('Por favor, introduce un nombre para la categoría.');
  } else {
    setCategoryError('');
  }
};

const closeAndResetModal = () => {
  setShowCreateModal(false);
  setNewCategoryName('');
  setCategoryError('');
  setCategoryTouched(false);
};

const getInputClass = () => {
  if (!categoryTouched) return 'form-control';
  return `form-control ${categoryError ? 'is-invalid' : 'is-valid'}`;
};

  const refreshData = () => {
    setIsLoading(true);
    fetchCategorias(); 
  };

  return (
    <div className="container mt-3">
      <h2 className="text-center text-decoration-underline mb-4">Gestor de Categorías</h2>
      <div className="d-flex justify-content-center mb-4">
        <Button variant="success" onClick={() => setShowCreateModal(true)}>Crear Categoría</Button>
      </div>
      <div className="table-container shadow-sm p-3 mb-5 bg-white rounded">
        <table id="categoriasTable" className="table table-striped table-hover" style={{ width: "100%" }}></table>
      </div>
      {/* Modales aquí */}
      <Modal show={showEditModal} onHide={() => {
        setShowEditModal(false);
        setCategoryError(''); // Limpiar el error al cerrar el modal
      }} centered>
        <Modal.Header closeButton>
          <Modal.Title>Editar Categoría</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="mb-3">
              <label htmlFor="categoria" className="form-label">Nombre de la Categoría</label>
              <input type="text" className="form-control" id="categoria" value={currentCategory.categoria} onChange={(e) => setCurrentCategory({...currentCategory, categoria: e.target.value})} />
              {categoryError && <div className="invalid-feedback d-block">{categoryError}</div>}
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>Cerrar</Button>
          <Button variant="primary" onClick={saveChanges}>Guardar Cambios</Button>
        </Modal.Footer>
      </Modal>;
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Eliminar Categoría</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás seguro de que deseas eliminar la categoría {currentCategory.categoria}?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancelar</Button>
          <Button variant="danger" onClick={() => confirmDelete()}>Eliminar</Button>
        </Modal.Footer>
      </Modal>
      {/* Modal para crear categoría */}
      <Modal show={showCreateModal} onHide={closeAndResetModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Crear Nueva Categoría</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="mb-2">Introduce el nombre de la nueva categoría:</p>
          <input 
            type="text" 
            className={getInputClass()}
            value={newCategoryName} 
            onChange={(e) => {
              setNewCategoryName(e.target.value);
              setCategoryTouched(true);
              validateCategory(e.target.value);
            }} 
            onBlur={() => setCategoryTouched(true)}
          />
          {categoryError && <div className="invalid-feedback d-block">{categoryError}</div>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeAndResetModal}>Cerrar</Button>
          <Button variant="primary" onClick={handleCreateCategory}>Crear</Button>
        </Modal.Footer>
      </Modal>
      {/* Botones ocultos para disparar modales */}
      {data.map(item => (
        <React.Fragment key={item.id}>
          <button id={`edit-button-${item.id}`} style={{ display: 'none' }} onClick={() => handleEdit(item.id, item.categoria)}></button>
          <button id={`delete-button-${item.id}`} style={{ display: 'none' }} onClick={() => handleDelete(item.id)}></button>
        </React.Fragment>
      ))}
    </div>
  );
};

export default ManageCategories;
