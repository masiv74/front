import React, { useState, useEffect } from "react";
import AsyncSelect from "react-select/async";
import { useParams } from "react-router-dom";
import ppcApi from "../../api/PpcApi";
import { Button, TextField, Box } from "@mui/material";
import sideppc from "../../assets/side-ppc.png";
import Swal from "sweetalert2";

export const RegistroCelConEnlace = () => {
  const { token } = useParams();
  const [dper, setDper] = useState("");
  const [sector, setSector] = useState("");
  const [celular, setCelular] = useState("");
  const [ndocumento, setNdocumento] = useState("");
  const [selectedDistrito, setSelectedDistrito] = useState(null);
  const [userCreate, setUserCreate] = useState("");
  const [isTokenValid, setIsTokenValid] = useState(true);

  useEffect(() => {
    if (token) {
      const fetchDecodedToken = async () => {
        try {
          const response = await ppcApi.get(
            `/colector/decodificar-token/${token}`
          );

          if (response.data.ok) {
            const decodedToken = response.data.decodedToken;
            setSelectedDistrito({
              label: decodedToken.distrito,
              value: decodedToken.ubigeo,
            });
            setUserCreate(decodedToken.uid);
          } else {
            setIsTokenValid(false);
            Swal.fire({
              icon: "error",
              title: "Enlace inválido o expirado",
              text: response.data.message,
            });
          }
        } catch (error) {
          const errorMsg = error.response?.data?.message ||
            "El enlace ha caducado o es inválido.";
          setIsTokenValid(false);
          Swal.fire({
            icon: "error",
            title: "Enlace inválido",
            text: errorMsg,
          });
        }
      };

      fetchDecodedToken();
    }
  }, [token]);

  const resetForm = () => {
    setDper("");
    setSector("");
    setNdocumento("");
    setCelular("");
    setSelectedDistrito(null);
  };

  const loadDistritos = async (inputValue) => {
    try {
      const response = await ppcApi.get("/getadmin/distritos", {
        params: { search: inputValue },
      });

      if (response.data.distri) {
        return response.data.distri.map((distrito) => ({
          label: distrito.distrito,
          value: distrito.ubigeo,
        }));
      } else {
        return [];
      }
    } catch (error) {
      console.error("Error fetching distritos:", error);
      return [];
    }
  };

  const handleCreateUser = async () => {
    try {
      if (!dper || !sector || !ndocumento || !selectedDistrito) {
        return Swal.fire({
          icon: "warning",
          title: "Advertencia",
          text: "Por favor, completa todos los campos obligatorios.",
          customClass: { popup: "swal-custom-zindex" },
        });
      }

      const ndocumentoRegex = /^[0-9]{8}$/;
      if (!ndocumentoRegex.test(ndocumento)) {
        return Swal.fire({
          icon: "warning",
          title: "Advertencia",
          text: "El número de documento debe ser de 8 dígitos.",
          customClass: { popup: "swal-custom-zindex" },
        });
      }

      const celularRegex = /^[0-9]{9}$/;
      if (!celularRegex.test(celular)) {
        return Swal.fire({
          icon: "warning",
          title: "Advertencia",
          text: "El número de celular debe ser de 9 dígitos.",
          customClass: { popup: "swal-custom-zindex" },
        });
      }

      const usuarioData = {
        datospersonales: dper.toUpperCase(),
        sector: sector.toUpperCase(),
        celular: celular,
        ndocumento: ndocumento,
        ubigeo: selectedDistrito ? selectedDistrito.value.toUpperCase() : null,
        distrito: selectedDistrito
          ? selectedDistrito.label.toUpperCase()
          : null,
        usercreate: userCreate,
      };

      const response = await ppcApi.post(
        `/colector/formulario/${token}`,
        usuarioData
      );

      if (response.data.ok) {
        Swal.fire({
          icon: "success",
          title: "Usuario creado",
          text: "El usuario ha sido creado exitosamente.",
          customClass: { popup: "swal-custom-zindex" },
        }).then(() => {
          resetForm();
          window.location.reload(); // Recargar la página después de cerrar la alerta
        });
        resetForm();
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: response.data.msg,
          customClass: { popup: "swal-custom-zindex" },
        });
      }
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Error al registrar los datos.";
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: errorMsg,
        customClass: { popup: "swal-custom-zindex" },
      });
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded-lg shadow-lg mt-40">
      {isTokenValid ? (
        <>
         <div className="flex items-center justify-center bg-white p-4 ">
            <img
              src={sideppc}
              alt="Logo PPC"
              className="w-16 h-16 object-contain mr-2 bg-white"
            />
            <div className="flex flex-col justify-center text-center">
              <span className="text-green-600 text-xl font-semibold leading-none">
                PARTIDO POPULAR
              </span>
              <span className="text-green-600 text-xl font-semibold leading-none">
                CRISTIANO
              </span>
            </div>
          </div>

          <AsyncSelect
            cacheOptions={false}
            loadOptions={loadDistritos}
            onChange={setSelectedDistrito}
            value={selectedDistrito}
            className="mt-4"
            placeholder="Seleccione un distrito..."
            noOptionsMessage={() => "No se encontraron opciones"}
            loadingMessage={() => "Cargando..."}
            styles={{
              menu: (provided) => ({
                ...provided,
                zIndex: 999,
                backgroundColor: "white",
              }),
              control: (provided) => ({
                ...provided,
                zIndex: 998,
                borderColor: "green",
                "&:hover": { borderColor: "darkgreen" },
              }),
              placeholder: (provided) => ({ ...provided, color: "gray" }),
              singleValue: (provided) => ({ ...provided, color: "black" }),
            }}
          />
          <TextField
            label="Nombre Completo"
            variant="outlined"
            fullWidth
            size="small"
            margin="normal"
            value={dper}
            onChange={(e) => setDper(e.target.value)}
            className="bg-white mb-4"
            InputLabelProps={{ className: "text-green-600" }}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "green" },
                "&:hover fieldset": { borderColor: "darkgreen" },
                "&.Mui-focused fieldset": { borderColor: "green" },
              },
              "& .MuiInputLabel-outlined.Mui-focused": { color: "green" },
            }}
          />
          <TextField
            label="Sector"
            variant="outlined"
            fullWidth
            size="small"
            margin="normal"
            value={sector}
            onChange={(e) => setSector(e.target.value)}
            className="bg-white mb-4"
            InputLabelProps={{ className: "text-green-600" }}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "green" },
                "&:hover fieldset": { borderColor: "darkgreen" },
                "&.Mui-focused fieldset": { borderColor: "green" },
              },
              "& .MuiInputLabel-outlined.Mui-focused": { color: "green" },
            }}
          />
          <TextField
            label="Celular"
            variant="outlined"
            fullWidth
            size="small"
            margin="normal"
            value={celular}
            onChange={(e) => setCelular(e.target.value)}
            className="bg-white mb-4"
            InputLabelProps={{ className: "text-green-600" }}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "green" },
                "&:hover fieldset": { borderColor: "darkgreen" },
                "&.Mui-focused fieldset": { borderColor: "green" },
              },
              "& .MuiInputLabel-outlined.Mui-focused": { color: "green" },
            }}
          />
          <TextField
            label="N° Documento"
            variant="outlined"
            fullWidth
            size="small"
            margin="normal"
            value={ndocumento}
            onChange={(e) => setNdocumento(e.target.value)}
            className="bg-white mb-4"
            InputLabelProps={{ className: "text-green-600" }}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "green" },
                "&:hover fieldset": { borderColor: "darkgreen" },
                "&.Mui-focused fieldset": { borderColor: "green" },
              },
              "& .MuiInputLabel-outlined.Mui-focused": { color: "green" },
            }}
          />

          <Box display="flex" justifyContent="space-between">
            <Button
              onClick={handleCreateUser}
              color="success"
              variant="contained"
              className="bg-green-600 text-white w-full"
              sx={{ "&:hover": { backgroundColor: "darkgreen" }, mr: 1 }}
            >
              REGISTRAR
            </Button>
          </Box>
        </>
      ) : (
        <h3 className="text-center text-red-600 text-xl font-semibold mb-4">
          Enlace inválido o expirado
        </h3>
      )}
    </div>
  );
};
