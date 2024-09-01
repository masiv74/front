import React, { useState, useEffect } from "react";
import AsyncSelect from "react-select/async";
import ppcApi from "../../api/PpcApi";
import { useAuthStore } from "../../hooks/useAuthStore";
import {
  Button,
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  Select as MuiSelect,
} from "@mui/material";
import Swal from "sweetalert2";

export const CrearUsuariosim = () => {
  const { user } = useAuthStore();
  const [tpUser, setTpUser] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellidoP, setApellidoP] = useState("");
  const [apellidoM, setApellidoM] = useState("");
  const [celular, setCelular] = useState("");
  const [email, setEmail] = useState("");
  const [ndocumento, setNdocumento] = useState("");
  const [password, setPassword] = useState("");
  const [selectedDistrito, setSelectedDistrito] = useState(null);
  const [tpUserOptions, setTpUserOptions] = useState([]); //

  const resetForm = () => {
    setTpUser("");
    setNombre("");
    setApellidoP("");
    setApellidoM("");
    setEmail("");
    setNdocumento("");
    setPassword("");
    setSelectedDistrito(null);
    setCelular("");
  };
  const handleTpUserChange = (event) => {
    setTpUser(event.target.value);
  };
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
  const loadDistritos = async (inputValue) => {
    try {
      const response = await ppcApi.get("/getadmin/distritos", {
        params: {
          search: inputValue,
        },
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
      if (!nombre || !apellidoP || !ndocumento || !selectedDistrito) {
        return Swal.fire({
          icon: "warning",
          title: "Advertencia",
          text: "Por favor, completa todos los campos obligatorios.",
          customClass: {
            popup: "swal-custom-zindex", // Nombre de clase personalizada
          },
        });
      }

      // Validar que el número de documento tenga exactamente 8 dígitos y sea numéricoSS
      const ndocumentoRegex = /^[0-9]{8}$/;
      if (!ndocumentoRegex.test(ndocumento)) {
        return Swal.fire({
          icon: "warning",
          title: "Advertencia",
          text: "El número de documento debe ser de 8 dígitos.",
          customClass: {
            popup: "swal-custom-zindex", // Nombre de clase personalizada
          },
        });
      }
      const celularRegex = /^[0-9]{9}$/;
      if (!celularRegex.test(celular)) {
        return Swal.fire({
          icon: "warning",
          title: "Advertencia",
          text: "El número de celular debe ser de 9 dígitos.",
          customClass: {
            popup: "swal-custom-zindex", // Nombre de clase personalizada
          },
        });
      }

      const usuarioData = {
        nombre: nombre.toUpperCase(),
        apellidoP: apellidoP.toUpperCase(),
        apellidoM: apellidoM.toUpperCase(),
        datospersonales: `${apellidoP} ${apellidoM} ${nombre}`.toUpperCase(),
        email: email ? email.toUpperCase() : null,
        celular: celular,
        ndocumento: ndocumento ? ndocumento.toUpperCase() : null,
        tpUser: tpUser,
        password: password,
        ubigeo: selectedDistrito ? selectedDistrito.value.toUpperCase() : null,
        fchCreacion: new Date(),
        ucreate : user.uid
      };

      const response = await ppcApi.post("/auth/new", usuarioData);

      if (response.data.ok) {
        Swal.fire({
          icon: "success",
          title: "Usuario creado",
          text: "El usuario ha sido creado exitosamente.",
          customClass: {
            popup: "swal-custom-zindex", // Nombre de clase personalizada
          },
        });
        resetForm();
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: response.data.msg,
          customClass: {
            popup: "swal-custom-zindex", // Nombre de clase personalizada
          },
        });
      }
    } catch (error) {
      const errorMsg = error.response?.data?.msg || "error";
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: errorMsg,
        customClass: {
          popup: "swal-custom-zindex", // Nombre de clase personalizada
        },
      });
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded-lg shadow-lg">
      <h2 className="text-center text-green-600 text-xl font-semibold mb-4">
        CREAR USUARIO
      </h2>

      <FormControl variant="outlined" size="small" fullWidth margin="normal">
        <InputLabel
          id="tpuser-select-label"
          color="success"
          className="text-green-600"
        >
          Tipo de Usuario
        </InputLabel>
        <MuiSelect
          labelId="tpuser-select-label"
          id="tpuser-select"
          value={tpUser}
          onChange={handleTpUserChange}
          label="Tipo de Usuario"
          color="success"
          className=""
          sx={{
            color: "black",
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "green",
              "&:hover": {
                borderColor: "green", // Change this to your desired hover color
              },
              "&:focus": {
                borderColor: "green", // Change this to your desired focus color
              },
            },
          }}
        >
          {tpUserOptions
             .filter(option => !["01", "02"].includes(option.idTipoUsuario))
            .map((option) => (
              <MenuItem key={option.idTipoUsuario} value={option.idTipoUsuario}>
                {option.nombreTipoUsuario}
              </MenuItem>
            ))}
        </MuiSelect>
      </FormControl>

      <TextField
        label="Nombre"
        variant="outlined"
        fullWidth
        size="small"
        margin="normal"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        className="bg-white mb-4"
        InputLabelProps={{
          className: "text-green-600",
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "green",
            },
            "&:hover fieldset": {
              borderColor: "darkgreen",
            },
            "&.Mui-focused fieldset": {
              borderColor: "green",
            },
          },
          "& .MuiInputLabel-outlined.Mui-focused": {
            color: "green",
          },
        }}
      />
      <TextField
        label="Apellido Paterno"
        variant="outlined"
        fullWidth
        size="small"
        margin="normal"
        value={apellidoP}
        onChange={(e) => setApellidoP(e.target.value)}
        className="bg-white mb-4"
        InputLabelProps={{
          className: "text-green-600",
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "green",
            },
            "&:hover fieldset": {
              borderColor: "darkgreen",
            },
            "&.Mui-focused fieldset": {
              borderColor: "green",
            },
          },
          "& .MuiInputLabel-outlined.Mui-focused": {
            color: "green",
          },
        }}
      />
      <TextField
        label="Apellido Materno"
        variant="outlined"
        fullWidth
        size="small"
        margin="normal"
        value={apellidoM}
        onChange={(e) => setApellidoM(e.target.value)}
        className="bg-white mb-4"
        InputLabelProps={{
          className: "text-green-600",
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "green",
            },
            "&:hover fieldset": {
              borderColor: "darkgreen",
            },
            "&.Mui-focused fieldset": {
              borderColor: "green",
            },
          },
          "& .MuiInputLabel-outlined.Mui-focused": {
            color: "green",
          },
        }}
      />

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
        label="Celular"
        variant="outlined"
        fullWidth
        size="small"
        margin="normal"
        value={celular}
        onChange={(e) => setCelular(e.target.value)}
        className="bg-white mb-4"
        InputLabelProps={{
          className: "text-green-600",
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "green",
            },
            "&:hover fieldset": {
              borderColor: "darkgreen",
            },
            "&.Mui-focused fieldset": {
              borderColor: "green",
            },
          },
          "& .MuiInputLabel-outlined.Mui-focused": {
            color: "green",
          },
        }}
      />
      <TextField
        label="Email"
        variant="outlined"
        fullWidth
        size="small"
        margin="normal"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="bg-white mb-4"
        InputLabelProps={{
          className: "text-green-600",
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "green",
            },
            "&:hover fieldset": {
              borderColor: "darkgreen",
            },
            "&.Mui-focused fieldset": {
              borderColor: "green",
            },
          },
          "& .MuiInputLabel-outlined.Mui-focused": {
            color: "green",
          },
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
        InputLabelProps={{
          className: "text-green-600",
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "green",
            },
            "&:hover fieldset": {
              borderColor: "darkgreen",
            },
            "&.Mui-focused fieldset": {
              borderColor: "green",
            },
          },
          "& .MuiInputLabel-outlined.Mui-focused": {
            color: "green",
          },
        }}
      />
      <TextField
        label="Password"
        variant="outlined"
        fullWidth
        size="small"
        margin="normal"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="bg-white mb-4"
        InputLabelProps={{
          className: "text-green-600",
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "green",
            },
            "&:hover fieldset": {
              borderColor: "darkgreen",
            },
            "&.Mui-focused fieldset": {
              borderColor: "green",
            },
          },
          "& .MuiInputLabel-outlined.Mui-focused": {
            color: "green",
          },
        }}
      />
      <Button
        onClick={handleCreateUser}
        color="success"
        variant="contained"
        className="mt-4 bg-green-600 text-white w-full"
        sx={{
          "&:hover": {
            backgroundColor: "darkgreen",
          },
        }}
      >
        Crear
      </Button>
    </div>
  );
};
