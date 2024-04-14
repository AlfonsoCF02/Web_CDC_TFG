import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { baseUrl } from "../../config";

const ManageCategories = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchCategorias = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${baseUrl}/api/category/categories`);
        setData(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setIsLoading(false);
      }
    };
    fetchCategorias();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      // Asegúrate de que DataTables se inicialice solo después de que los datos estén listos y el DOM esté cargado.
      const table = $('#categoriasTable').DataTable({
        data: data,
        lengthMenu: [[5, 10, 25, 50, 100, -1], [5, 10, 25, 50, 100, "Todos"]],
        columns: [
          { title: "ID", data: "id" },
          { title: "Categoría", data: "categoria" },
          // Añade más columnas según sea necesario.
        ],
        dom: "<'row'<'col-sm-12 col-md-6'l><'col-sm-12 col-md-6'f>>" +
             "<'row'<'col-sm-12'tr>>" +
             "<'row'<'col-md-4'i><'col-md-4 text-center'B><'col-md-4'p>>", // Ajuste del DOM
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
            pageSize: 'A4',
            
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
  
      // Ajusta los estilos de los elementos de DataTables según sea necesario
      // Esto puede incluir alinear los botones en el centro y mover la paginación a la derecha
      styleDataTablesElements();
    }
  }, [isLoading, data]);
  
  const styleDataTablesElements = () => {
    // Alinear la información de la paginación al centro
    $('.dataTables_info').parent().removeClass('col-md-4').addClass('col-md-4 text-center');
    $('.dt-buttons').parent().removeClass('col-md-4').addClass('col-md-4 text-center mt-3');
    $('.pagination').parent().removeClass('col-md-4').addClass('d-flex ms-auto justify-content-center justify-content-md-end mt-3 ');
  };
  
  if (isLoading) {
    return <div className="text-center">Cargando...</div>;
  }

  return (
    <div className="container mt-3">
        <h2 className="text-center text-decoration-underline mb-4">Gestor de Categorías</h2>
        <div className="table-container shadow-sm p-3 mb-5 bg-white rounded">
            <table id="categoriasTable" className="table table-striped table-hover" style={{ width: "100%" }}>
        </table>
        </div>
    </div>
  );
};

export default ManageCategories;
