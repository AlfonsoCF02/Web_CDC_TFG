import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Modal, Button, Spinner } from 'react-bootstrap';
import { baseUrl } from "../../config";

/******************************************************************************
 *
 * @author          Alfonso Cabezas Fernández
 * 
 * Con la ayuda de la herramienta de inteligencia artificial ChatGPT
 * 
 * @description    Página de visualización de las reservas del sistema.
 *  
 ******************************************************************************/

interface Reservation {
    id: string;
    orderer: string;
    userName: string;
    email: string;
    dateCreation: Date;
    dateArrival: Date;
    participants: number;
    price: number;
}

const ManageReservations = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchReservations = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${baseUrl}/api/reservation/reservations`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setReservations(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching reservations:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  function formatDisplayDate(isoDateString: any) {
    const date = new Date(isoDateString);
    return date.toLocaleDateString('es', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    });
  }
  
  useEffect(() => {
    if (!isLoading) {
      $('#reservationsTable').DataTable({
        data: reservations.map(reservation => ({
          id: reservation.id,
          orderer: reservation.orderer,
          userName: reservation.userName,
          email: reservation.email,
          dateCreation: reservation.dateCreation,
          dateArrival: reservation.dateArrival,
          participants: reservation.participants,
          price: reservation.price,
          actions: `<div class="text-center">
            <button class="btn btn-danger btn-sm" data-delete-reservation-id="${reservation.id}">Eliminar</button>
          </div>`
        })),
        lengthMenu: [[4, 10, 25, 50, 100, -1], [4, 10, 25, 50, 100, "Todos"]],
        destroy: true,
        columns: [
          { title: "ID", data: "id" },
          { title: "Usuario", data: "userName" },
          { title: "Ordenante", data: "orderer" },
          { title: "Email", data: "email" },
          { 
            title: "Creada", 
            data: "dateCreation",
            render: function(data, type) {
              return type === 'display' ? formatDisplayDate(data) : data;
            }
          },
          { 
            title: "Llegada", 
            data: "dateArrival",
            render: function(data, type) {
              return type === 'display' ? formatDisplayDate(data) : data;
            }
          },
          { title: "Visitantes", data: "participants" },
          { title: "Precio", data: "price" },
          { title: "Acciones", data: "actions" }
        ],
        columnDefs: [
          { className: 'align-middle ', targets: '_all' }, // Centra horizontalmente los datos en todas las columnas
          { className: 'text-center', targets: [6] }
        ],
        dom: "<'row'<'col-sm-12 col-md-6'l><'col-sm-12 col-md-6'f>>" +
             "<'row'<'col-sm-12'tr>>" +
             "<'row'<'col-md-4'i><'col-md-4 text-center'B><'col-md-4'p>>",
        buttons: [
          {
            extend: 'excelHtml5',
            text: 'Exportar a Excel',
            title: 'Reservas de Cárnicas Dehesa Chaparral',
            className: 'btn btn-success'
          },
          {
            extend: 'pdfHtml5',
            text: 'Exportar a PDF',
            className: 'btn btn-danger',
            orientation: 'landscape',
            title: 'Reservas de Cárnicas Dehesa Chaparral',
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

      $('#reservationsTable').on('click', 'button[data-delete-reservation-id]', function () {
        const reservationId = $(this).data('delete-reservation-id');
        const reservation = reservations.find(reservation => reservation.id === reservationId);
        if (reservation) {
          setSelectedReservation(reservation);
          // Abrir el modal de eliminación al hacer clic en el botón de eliminar
          setShowDeleteModal(true);
        }
      });
    }
    styleDataTablesElements();
  }, [isLoading, reservations]);

  const styleDataTablesElements = () => {
    $('.dataTables_info').parent().removeClass('col-md-4').addClass('col-md-4 text-center');
    $('.dt-buttons').parent().removeClass('col-md-4').addClass('col-md-4 text-center mt-3');
    $('.pagination').parent().removeClass('col-md-4').addClass('d-flex ms-auto justify-content-center justify-content-md-end mt-3');
  };

  const handleDeleteReservation = async () => {
    if (selectedReservation) {
      setIsDeleting(true); // Activar el spinner de carga al iniciar la eliminación
      try {
        await axios.delete(`${baseUrl}/api/reservation/delete/${selectedReservation.id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        // Actualizar la lista de reservas después de eliminar
        fetchReservations();
      } catch (error) {
        console.error('Error al eliminar la reserva:', error);
      } finally {
        setIsDeleting(false); // Desactivar el spinner de carga al finalizar la eliminación
        setShowDeleteModal(false); // Cerrar el modal después de completar la eliminación
      }
    }
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
      <h2 className="text-center text-decoration-underline mb-4">Gestor de Reservas</h2>
      <div className="table-container shadow-sm p-3 mb-5 bg-white rounded">
        <table id="reservationsTable" className="table table-striped table-hover" style={{ width: "100%" }}></table>
      </div>
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmación de Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás seguro de que deseas eliminar esta reserva?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDeleteReservation}>
            {isDeleting ? 'Eliminando... ' : 'Eliminar'}
            {isDeleting && <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ManageReservations;
