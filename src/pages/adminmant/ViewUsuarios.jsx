import React, { useState, useMemo, useEffect } from "react";
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
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  TablePagination,
  Switch,
  IconButton,
} from "@mui/material";
import Swal from "sweetalert2";
import { useAuthStore } from "../../hooks/useAuthStore";
import { PencilLine } from "lucide-react";
import { CambiarPassModal } from "./CambiarPassModal";

export const ViewUsuarios = () => {
  const { user } = useAuthStore();
  const [tpUser, setTpUser] = useState("");
  const [tpUserOptions, setTpUserOptions] = useState([]);
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentTpUser, setCurrentTpUser] = useState("");
  const [openPasswordModal, setOpenPasswordModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  useEffect(() => {
    const fetchTpUsers = async () => {
      try {
        const response = await ppcApi.get("/getadmin/tpusers");
        if (response.data.ok) {
          setTpUserOptions(response.data.tpuser);
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "No se pudieron cargar los tipos de usuario.",
          });
        }
      } catch (error) {
        console.error("Error fetching tpusers:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Hubo un problema al cargar los tipos de usuario.",
        });
      }
    };

    fetchTpUsers();
  }, []);

  const handleSearchClick = async () => {
    if (!tpUser) {
      return Swal.fire({
        icon: "warning",
        title: "Advertencia",
        text: "Por favor, selecciona un tipo de usuario primero",
      });
    }

    Swal.fire({
      title: "Cargando...",
      text: "Por favor, espere",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const response = await ppcApi.get(`/getadmin/usuarios/${tpUser}/${user.uid}`);
      setUsers(response.data.users);
      setPage(0);
      setCurrentTpUser(tpUser);
    } catch (error) {
      console.error("Error fetching users:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Ocurrió un error al cargar los usuarios!",
      });
    } finally {
      Swal.close();
    }
  };

  const handleSwitchChange = async (id, checked) => {
    try {
      const response = await ppcApi.put(`/auth/editstatus/${id}`, {
        activo: checked,
      });

      const updatedUsers = users.map((user) => {
        if (user.id === id) {
          return { ...user, activo: response.data.usuario.activo };
        }
        return user;
      });

      setUsers(updatedUsers);
      Swal.fire({
        icon: "success",
        title: "Estado actualizado",
        text: `El estado del usuario con ID: ${id} ha sido actualizado.`,
      });
    } catch (error) {
      console.error("Error updating state:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Hubo un problema al actualizar el estado del usuario.",
      });
    }
  };

  const handleChangePasswordClick = (id) => {
    setSelectedUserId(id);
    setOpenPasswordModal(true);
  };

  const memoizedData = useMemo(() => {
    return rowsPerPage > 0
      ? users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
      : users;
  }, [users, page, rowsPerPage]);

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
          <h2 className="text-2xl leading-tight mb-4">Usuarios por Tipo</h2>
          <div className="flex flex-row items-center space-x-2 mb-4">
            <FormControl variant="outlined" size="small">
              <InputLabel id="tpuser-select-label">Seleccione Tipo de Usuario</InputLabel>
              <Select
                labelId="tpuser-select-label"
                id="tpuser-select"
                value={tpUser}
                onChange={(event) => setTpUser(event.target.value)}
                label="Seleccione Tipo de Usuario"
                style={{ minWidth: "120px" }}
              >
                {tpUserOptions.map((option) => (
                  <MenuItem key={option.idTipoUsuario} value={option.idTipoUsuario}>
                    {option.nombreTipoUsuario}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              variant="contained"
              color="success"
              onClick={handleSearchClick}
            >
              Buscar
            </Button>
          </div>

          <TableContainer component={Paper}>
            <Table>
            <TableHead className="bg-gradient-to-r from-green-500 via-green-600 to-green-700">

                <TableRow>
                  <TableCell align="center">#</TableCell>
                  <TableCell align="center">Datos Personales</TableCell>
                  <TableCell align="center">N° Documento</TableCell>
                  <TableCell align="center">Distrito</TableCell>
                  <TableCell align="center">Celular</TableCell>
                  <TableCell align="center">Email</TableCell>
                  <TableCell align="center">Tipo de Usuario</TableCell>
                  <TableCell align="center">Activo</TableCell>
                  <TableCell align="center">Cambiar Contraseña</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {memoizedData.length > 0 ? (
                  memoizedData.map((user, index) => (
                    <TableRow key={index}>
                      <TableCell align="center">
                        {page * rowsPerPage + index + 1}
                      </TableCell>
                      <TableCell align="center">{user.datospersonales}</TableCell>
                      <TableCell align="center">{user.ndocumento}</TableCell>
                      <TableCell align="center">{user.distrito}</TableCell>
                      <TableCell align="center">{user.celular}</TableCell>
                      <TableCell align="center">{user.email}</TableCell>
                      <TableCell align="center">{user.tipoUsuario}</TableCell>
                      <TableCell align="center">
                        <Switch
                          checked={user.activo}
                          onChange={(e) => handleSwitchChange(user.id, e.target.checked)}
                          color="primary"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          color="primary"
                          size="small"
                          onClick={() => handleChangePasswordClick(user.id)}
                        >
                          <PencilLine size={20} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={9}
                      align="center"
                    >
                      No hay datos disponibles
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[5, 10, 20]}
            component="div"
            count={users.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Filas por página"
          />
        </div>
      </div>

      {openPasswordModal && (
        <CambiarPassModal
          open={openPasswordModal}
          onClose={() => setOpenPasswordModal(false)}
          userId={selectedUserId}
        />
      )}
    </>
  );
};
