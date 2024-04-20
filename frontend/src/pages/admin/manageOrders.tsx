import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Modal, Button, Spinner, Table, Form } from 'react-bootstrap';
import { baseUrl } from "../../config";

interface Order {
  id: string;
  userName: string;
  import: string;
  dateCreation: string;
  dateDelivery: string;
  state: string;
  ordererName: string;
  ordererPhone: string;
  address: string;
  userEmail: string;
  userPhone: string;
  products: {
    productName: string;
    quantity: number;
    pricePerUnit: string;
  }[];
}

const ManageOrders = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<Order[]>([]);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showAdminModal, setShowAdminModal] = useState(false); // Definir el estado showAdminModal
  const [newState, setNewState] = useState('');

  const fetchOrders = async () => {
    setIsLoading(true); 
    try {
        const response = await axios.get<Order[]>(`${baseUrl}/api/order/orders`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setData(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setIsLoading(false);
      }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      $('#ordersTable').DataTable({
        data: data.map(order => ({
          id: order.id,
          userName: order.userName,
          import: order.import,
          dateCreation: order.dateCreation,
          dateDelivery: order.dateDelivery,
          state: order.state,
          actions: `<div class="text-center">
          <button class="btn btn-primary btn-sm me-1" data-order-id="${order.id}">Detalles</button>
          <button class="btn btn-danger btn-sm" data-admin-order-id="${order.id}">Administrar</button>
        </div>`

      })),
        lengthMenu: [[5, 10, 25, 50, 100, -1], [5, 10, 25, 50, 100, "Todos"]],
        destroy: true,
        columns: [
          { title: "ID", data: "id" },
          { title: "Usuario", data: "userName" },
          { title: "Importe", data: "import" },
          { title: "Creado", data: "dateCreation" },
          { title: "Entregado", data: "dateDelivery" },
          { title: "Estado", data: "state" },
          { title: "Acciones", data: "actions" }
        ],
        dom: "<'row'<'col-sm-12 col-md-6'l><'col-sm-12 col-md-6'f>>" +
             "<'row'<'col-sm-12'tr>>" +
             "<'row'<'col-md-4'i><'col-md-4 text-center'B><'col-md-4'p>>",
        buttons: [
          {
            extend: 'excelHtml5',
            text: 'Exportar a Excel',
            title: 'Pedidos de Cárnicas Dehesa Chaparral',
            className: 'btn btn-success'
          },
          {
            extend: 'pdfHtml5',
            text: 'Exportar a PDF',
            className: 'btn btn-danger',
            orientation: 'landscape',
            title: 'Pedidos de Cárnicas Dehesa Chaparral',
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

// Dentro del useEffect donde se inicializa el DataTable
$('#ordersTable').on('click', 'button[data-order-id]', function () {
    const orderId = $(this).data('order-id');
    const order = data.find(order => order.id === orderId);
    if (order) {
      setSelectedOrder(order);
      setShowDetailsModal(true);
    }
  });
  
  // Agregar este código para mostrar el modal de administrar cuando se hace clic en el botón "Administrar"
  $('#ordersTable').on('click', 'button[data-admin-order-id]', function () {
    const orderId = $(this).data('admin-order-id');
    const order = data.find(order => order.id === orderId);
    if (order) {
      setSelectedOrder(order);
      setShowAdminModal(true); // Mostrar el modal de administrar
    }
  });
  
    }
    styleDataTablesElements();
  }, [isLoading, data]);

  const styleDataTablesElements = () => {
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

  return (
    <div className="container mt-3">
      <h2 className="text-center text-decoration-underline mb-4">Gestor de Pedidos</h2>
      <div className="table-container shadow-sm p-3 mb-5 bg-white rounded">
        <table id="ordersTable" className="table table-striped table-hover" style={{ width: "100%" }}></table>
      </div>
      <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Detalles del Pedido</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOrder && (
            <div>
              <p><strong>Importe:</strong> €{selectedOrder.import}</p>
              <p><strong>Fecha de Creación:</strong> {selectedOrder.dateCreation}</p>
              <p><strong>Fecha de Entrega:</strong> {selectedOrder.dateDelivery}</p>
              <p><strong>Estado:</strong> {selectedOrder.state}</p>
              <p><strong>Ordenante:</strong> {selectedOrder.ordererName}</p>
              <p><strong>Teléfono Ordenante:</strong> {selectedOrder.ordererPhone}</p>
              <p><strong>Dirección de Entrega:</strong> {selectedOrder.address}</p>
              <p><strong>Email de Usuario:</strong> {selectedOrder.userEmail}</p>
              <p><strong>Productos:</strong></p>
              <Table striped bordered hover responsive>
                <thead className="text-center align-middle">
                  <tr>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Precio Ud.</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody className="text-center align-middle">
                  {selectedOrder.products.map(product => (
                    <tr key={product.productName}>
                      <td>{product.productName}</td>
                      <td>{product.quantity}</td>
                      <td>{parseFloat(product.pricePerUnit).toFixed(2)}€</td>
                      <td>{(product.quantity * parseFloat(product.pricePerUnit)).toFixed(2)}€</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetailsModal(false)}>Cerrar</Button>
        </Modal.Footer>
      </Modal>
      <Modal show={showAdminModal} onHide={() => setShowAdminModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Administrar Pedido</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOrder && (
            <div>
              <Form.Group controlId="exampleForm.ControlSelect1">
                <Form.Label>Seleccione el nuevo estado del pedido</Form.Label>
                <Form.Control as="select" onChange={(e) => setNewState(e.target.value)}>
                  <option value="">Seleccione un valor</option>
                  <option value="creado">Creado</option>
                  <option value="enviado">Enviado</option>
                  <option value="completado">Completado</option>
                </Form.Control>
              </Form.Group>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAdminModal(false)}>Cancelar</Button>
          <Button variant="primary" onClick={handleStateChange}>Guardar Cambios</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );

  async function handleStateChange() {
    if (selectedOrder && selectedOrder.id) {
        try {
            const response = await axios.put(`${baseUrl}/api/order/updateState`, {
                orderId: selectedOrder.id,
                newState: newState
            }, {
              headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
        setShowAdminModal(false);
        fetchOrders();
      } catch (error) {
        console.error('Error al actualizar el estado del pedido:', error);
      }
    }
  }
  

};

export default ManageOrders;
