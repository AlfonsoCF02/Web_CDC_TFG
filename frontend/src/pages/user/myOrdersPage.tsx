import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Modal, Button, Spinner, Table, Form } from 'react-bootstrap';
import { baseUrl } from "../../config";
import { useAuth } from '../../AuthProvider';

/******************************************************************************
 *
 * @author          Alfonso Cabezas Fernández
 * 
 * Con la ayuda de la herramienta de inteligencia artificial ChatGPT
 * 
 * @description    Página de visualización de los pedidos del usuario
 * 
 ******************************************************************************/

interface Order {
  id: string;
  userName: string;
  import: string;
  dateCreation: Date;
  dateDelivery: Date;
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
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<Order[]>([]);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const fetchOrders = async () => {
    setIsLoading(true); 
    try {
      const response = await axios.get<Order[]>(`${baseUrl}/api/order/myorders/${localStorage.getItem('id')}`, {
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

  function formatDisplayDate(dateString: any) {
    if (!dateString || dateString.toLowerCase() === 'pendiente') {
      return dateString; // Devuelve el valor original si es 'Pendiente' o es un valor falso
    }
  
    const date = new Date(dateString);
    if (!isNaN(date.getTime())) {
      return date.toLocaleDateString('es', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit'
      });
    } else {
      return "Fecha no válida"; // O puedes devolver una cadena vacía o un mensaje de error específico
    }
  }

  useEffect(() => {
    if (!isLoading) {
      $('#ordersTable').DataTable({
        data: data.map(order => ({
          id: order.id,
          import: order.import,
          dateCreation: order.dateCreation,
          dateDelivery: order.dateDelivery,
          state: order.state,
          actions: `<div class="text-center">
          <button class="btn btn-primary btn-sm me-1" data-order-id="${order.id}">Detalles</button>
        </div>`
        })),
        lengthMenu: [[5, 10, 25, 50, 100, -1], [5, 10, 25, 50, 100, "Todos"]],
        destroy: true,
        columns: [
          { title: "ID", data: "id" },
          { title: "Importe", data: "import" },
          {
            title: "Creado",
            data: "dateCreation",
            render: function(data, type) {
              return type === 'display' ? formatDisplayDate(data) : data;
            }
          },
          {
            title: "Entregado",
            data: "dateDelivery",
            render: function(data, type) {
              return type === 'display' ? formatDisplayDate(data) : data;
            }
          },
          { title: "Estado", data: "state" },
          { title: "Acciones", data: "actions" }
        ],
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
            title: 'Mis Pedidos de Cárnicas Dehesa Chaparral',
            className: 'btn btn-success'
          },
          {
            extend: 'pdfHtml5',
            text: 'Exportar a PDF',
            className: 'btn btn-danger',
            orientation: 'landscape',
            title: 'Mis Pedidos de Cárnicas Dehesa Chaparral',
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

      $('#ordersTable').on('click', 'button[data-order-id]', function () {
        const orderId = $(this).data('order-id');
        const order = data.find(order => order.id === orderId);
        if (order) {
          setSelectedOrder(order);
          setShowDetailsModal(true);
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
      <h2 className="text-center text-decoration-underline mb-4">Mis Pedidos</h2>
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
              <p><strong>Fecha de Creación:</strong> {formatDisplayDate(selectedOrder.dateCreation)}</p>
              <p><strong>Fecha de Entrega:</strong> {formatDisplayDate(selectedOrder.dateDelivery)}</p>
              <p><strong>Estado:</strong> {selectedOrder.state}</p>
              <p><strong>Ordenante:</strong> {selectedOrder.ordererName}</p>
              <p><strong>Teléfono:</strong> {selectedOrder.ordererPhone}</p>
              <p><strong>Dirección de Entrega:</strong> {selectedOrder.address}</p>
              <p><strong>Email del Ordenante:</strong> {selectedOrder.userEmail}</p>
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
      </Modal>
    </div>
  );
};

export default ManageOrders;
