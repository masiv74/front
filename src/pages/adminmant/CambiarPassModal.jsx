import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, IconButton, InputAdornment } from '@mui/material';
import { Eye, EyeOff } from 'lucide-react';
import Swal from 'sweetalert2';
import ppcApi from "../../api/PpcApi";

export const CambiarPassModal = ({ open, onClose, userId }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const handleMouseDownPassword = (event) => event.preventDefault();

  const handleChangePassword = async () => {
    onClose(); // Cierra el modal primero
    if (newPassword !== confirmNewPassword) {
       
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Las nuevas contraseñas no coinciden',
        customClass: {
            popup: 'z-50' // Asegura que la alerta esté en la capa más alta
          }
        });
      return;
     
    }

    try {
      const response = await ppcApi.post('/auth/changepass', {
        id: userId,
        newpass: newPassword,
      });

      if (response.data.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Contraseña cambiada',
          text: response.data.msg,
        });
        onClose();
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: response.data.msg || 'Error al cambiar la contraseña',
        });
        onClose();
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al cambiar la contraseña',
      });
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Cambiar Contraseña</DialogTitle>
      <DialogContent>
        <TextField
          label="Nueva Contraseña"
          variant="outlined"
          fullWidth
          size="small"
          margin="normal"
          type={showPassword ? 'text' : 'password'}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <TextField
          label="Confirmar Nueva Contraseña"
          variant="outlined"
          fullWidth
          size="small"
          margin="normal"
          type="password"
          value={confirmNewPassword}
          onChange={(e) => setConfirmNewPassword(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancelar
        </Button>
        <Button onClick={handleChangePassword} color="primary" variant="contained">
          Cambiar
        </Button>
      </DialogActions>
    </Dialog>
  );
};
