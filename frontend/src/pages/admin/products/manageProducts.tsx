import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Modal, Button, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { baseUrl } from "../../../config";

/******************************************************************************
 *
 * @author          Alfonso Cabezas Fernández
 * 
 * Con la ayuda de la herramienta de inteligencia artificial ChatGPT
 * 
 * @description    Página de gestión de productos para el administrador
 * 
 ******************************************************************************/

interface Product {
    id: string;
    name: string;
    price: number;
    stock: number;
    category: string;
    //imageURL: string;
  }
  
const ManageProductos = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${baseUrl}/api/product/products`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setProducts(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      $('#productsTable').DataTable({
        data: products.map(product => ({
          name: product.name,
          price: product.price,
          stock: product.stock,
          category: product.category,
          //imageURL: product.imageURL,
          actions: `<div class="text-center">
                      <button class="btn btn-primary btn-sm me-2" onclick="document.getElementById('edit-button-${product.id}').click()">Editar</button>
                      <button class="btn btn-danger btn-sm" onclick="document.getElementById('delete-button-${product.id}').click()">Eliminar</button>
                    </div>`
        })),
        destroy: true,
        columns: [
          { title: "Nombre", data: "name" },
          { title: "Precio", data: "price" },
          { title: "Stock", data: "stock" },
          { title: "Categoría", data: "category" },
          //{ title: "Image URL", data: "imageURL" },
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
            title: 'Productos',
            className: 'btn btn-success'
          },
          {
            extend: 'pdfHtml5',
            text: 'Exportar a PDF',
            className: 'btn btn-danger',
            orientation: 'landscape',
            title: 'Productos',
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
  }, [isLoading, products]);

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

  const handleDeleteProduct = async (id: string) => {
    if (id) {
      setIsDeleting(true);
      try {
        await axios.delete(`${baseUrl}/api/product/delete`, {
            data: { id }, // Envía el ID en el cuerpo de la petición
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setShowDeleteModal(false);
        fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
      }
      setIsDeleting(false);
    }
  };

  return (
    <div className="container mt-3">
      <h2 className="text-center text-decoration-underline mb-4">Gestor de Productos</h2>
      <div className="d-flex justify-content-center mb-4">
        <Button variant="success" onClick={() => navigate('/create-product')}>Crear Producto</Button>
      </div>
      <div className="table-container shadow-sm p-3 mb-5 bg-white rounded">
        <table id="productsTable" className="table table-striped table-hover" style={{ width: "100%" }}></table>
      </div>
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Eliminar Producto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás seguro de que deseas eliminar el producto {currentProduct?.name}?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancelar</Button>
          <Button variant="danger" onClick={() => currentProduct && handleDeleteProduct(currentProduct.id)}>
            {isDeleting ? 'Eliminando... ' : 'Eliminar'}
            {isDeleting && <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />}
          </Button>
        </Modal.Footer>
      </Modal>
      {products.map(product => (
        <React.Fragment key={product.id}>
          <button id={`edit-button-${product.id}`} style={{ display: 'none' }} onClick={() => navigate(`/edit-product/${product.id}`)}></button>
          <button id={`delete-button-${product.id}`} style={{ display: 'none' }} onClick={() => {
            setCurrentProduct(product);
            setShowDeleteModal(true);
          }}></button>
        </React.Fragment>
      ))}
    </div>
  );
};

export default ManageProductos;
