import React, { useState, useMemo } from "react";
import ppcApi from "../../api/PpcApi";
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Button,
  TablePagination,
} from "@mui/material";
import Swal from "sweetalert2";
import * as XLSX from "xlsx"; // Importa XLSX para manejar la exportación a Excel
import { useAuthStore } from "../../hooks/useAuthStore";
export const ViewRegistrosCelus = () => {
  const { user } = useAuthStore(); 
  const [registros, setRegistros] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleSearch = async () => {
     

    Swal.fire({
      title: "Cargando...",
      text: "Por favor, espere",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const response = await ppcApi.get(`/getadmin/obt/datos/${user.uid}`);
      if (response.data.ok) {
        const data = response.data.data;
        if (data.length > 0) {
          setRegistros(data);
          Swal.close();
        } else {
          Swal.fire({
            icon: "info",
            title: "Sin registros",
            text: "No se encontraron registros para este usuario.",
          });
          setRegistros([]); // Asegurarse de que no se muestren datos antiguos
        }
        setPage(0);
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        Swal.fire({
          icon: "info",
          title: "Sin registros",
          text: error.response.data.message,
        });
        setRegistros([]); // Asegurarse de que no se muestren datos antiguos
      } else {
        console.error("Error al obtener los registros:", error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Ocurrió un error al cargar los registros!",
        });
      }
    }
  };

  // Función para exportar a Excel
  const handleExportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(registros);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Registros");

    XLSX.writeFile(workbook, "RegistrosVecinos.xlsx");
  };

  const memoizedData = useMemo(() => {
    return rowsPerPage > 0
      ? registros.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
      : registros;
  }, [registros, page, rowsPerPage]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      <div className="container mx-auto px-4 sm:px-8">
        <div className="py-8">
          <h2 className="text-2xl leading-tight mb-4">
            Ver Registros 
          </h2>
          <div className="flex flex-row items-center space-x-2 mb-4">
           

            <Button variant="contained" color="success" onClick={handleSearch}>
              Buscar
            </Button>

            <Button
              variant="contained"
              color="primary"
              onClick={handleExportToExcel}
              disabled={true} // Deshabilitar si no hay registros {registros.length === 0}
            >
              Exportar a Excel
            </Button>
          </div>

          <TableContainer component={Paper}>
            <Table>
              <TableHead className="bg-gradient-to-r from-green-500 via-green-600 to-green-700">
                <TableRow>
                  <TableCell align="center">#</TableCell>
                  <TableCell align="center">Vecino</TableCell>
                  <TableCell align="center">Distrito</TableCell>
                  <TableCell align="center">Celular</TableCell>
                  <TableCell align="center">Sector</TableCell>
                  <TableCell align="center">N° Documento</TableCell>
                  <TableCell align="center">Recolector</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {memoizedData.length > 0 ? (
                  memoizedData.map((registro, index) => (
                    <TableRow key={index}>
                      <TableCell align="center">
                        {page * rowsPerPage + index + 1}
                      </TableCell>
                      <TableCell align="center">{registro.vecino}</TableCell>
                      <TableCell align="center">{registro.distrito}</TableCell>
                      <TableCell align="center">{registro.celular}</TableCell>
                      <TableCell align="center">{registro.sector}</TableCell>
                      <TableCell align="center">
                        {registro.ndocumento}
                      </TableCell>
                      <TableCell align="center">
                        {registro.recolector}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      No existen registros o datos disponibles.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[5, 10, 20]}
            component="div"
            count={registros.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Filas por página"
          />
        </div>
      </div>
    </>
  );
};
