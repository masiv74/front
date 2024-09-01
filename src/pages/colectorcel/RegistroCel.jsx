import React, { useState } from "react";
import AsyncSelect from "react-select/async";
import ppcApi from "../../api/PpcApi";
import { useAuthStore } from "../../hooks/useAuthStore";
import sideppc from "../../assets/side-ppc.png";
 
import { Button, TextField, Box } from "@mui/material";
import Swal from "sweetalert2";

export const RegistroCel = () => {
  const { user } = useAuthStore();

  const [dper, setDper] = useState("");
  const [sector, setSector] = useState("");
  const [celular, setCelular] = useState("");
  const [ndocumento, setNdocumento] = useState("");
  const [selectedDistrito, setSelectedDistrito] = useState({
    label: user.distrito,
    value: user.ubigeo,
  });

  const resetForm = (selectedDistrito) => {
    setDper("");
    setSector("");
    setNdocumento("");
    setCelular("");
    setSelectedDistrito(selectedDistrito); // Mantener el último distrito seleccionado
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
        usercreate: user.uid,
        distrito: selectedDistrito ? selectedDistrito.label.toUpperCase() : null,
      };
  
      const response = await ppcApi.post("/colector/registro-directo", usuarioData);
  
      if (response.data.ok) {
        Swal.fire({
          icon: "success",
          title: "Usuario creado",
          text: "El usuario ha sido creado exitosamente.",
          customClass: { popup: "swal-custom-zindex" },
        });
        resetForm(selectedDistrito); // Mantiene el último distrito seleccionado
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: response.data.message,
          customClass: { popup: "swal-custom-zindex" },
        });
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Error al registrar los datos.";
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: errorMsg,
        customClass: { popup: "swal-custom-zindex" },
      });
    }
  };
  const handleGenerateLink = async () => {
    try {
        const response = await ppcApi.post(
          `/colector/generar-enlace/${user.distrito}/${user.ubigeo}/${user.uid}`
        );
    
        if (response.data.ok) {
          const link = response.data.enlace;
    
          Swal.fire({
            icon: "success",
            title: "Enlace generado",
            html: `
              <div style="display: flex; flex-direction: column; align-items: center;">
                <div style="margin-bottom: 10px; word-break: break-all;">
                  ${link.substring(0, 30)}... 
                </div>
                <button id="copyLinkButton" style="background-color: #4caf50; color: white; padding: 5px 10px; border: none; cursor: pointer;">
                  Copiar enlace
                </button>
              </div>
            `,
            customClass: { popup: "swal-custom-zindex" },
            didOpen: () => {
              const copyLinkButton = document.getElementById("copyLinkButton");
              copyLinkButton.addEventListener("click", () => {
                navigator.clipboard.writeText(link).then(() => {
                  copyLinkButton.textContent = "Enlace copiado";
                });
              });
            },
          });
        } else {
            const errorMsg = error.response.data.message 
          Swal.fire({
            icon: "error",
            title: "Error",
            text: errorMsg,
            customClass: { popup: "swal-custom-zindex" },
          });
        }
      } catch (error) {
        console.error("Error al generar el enlace:", error);
        const errorMsg = error.response.data[0].message 
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: errorMsg,
          customClass: { popup: "swal-custom-zindex" },
        });
      }
    };

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded-lg shadow-lg mt-16">
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
          menu: (provided) => ({ ...provided, zIndex: 999, backgroundColor: "white" }),
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
        <Button
          onClick={handleGenerateLink}
          color="secondary"
          variant="contained"
          className="bg-blue-600 text-white w-full"
          sx={{ "&:hover": { backgroundColor: "darkblue" } }}
        >
          GENERAR ENLACE
        </Button>
      </Box>
    </div>
  );
};
