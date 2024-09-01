import React, { useState } from 'react';
import { Button, Modal, Box, TextField, IconButton, InputAdornment } from '@mui/material';
import ppcApi from "../../api/PpcApi";
import { useAuthStore } from "../../hooks/useAuthStore";
import Swal from 'sweetalert2';
 
import { Eye, EyeOff} from "lucide-react";
export const CambiarPass = ({ open, onClose }) => {
    const { user } = useAuthStore();
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleChange = (prop) => (event) => {
        setNewPassword(event.target.value);
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmNewPassword) {
            onClose();
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Las nuevas contraseñas no coinciden',
            });
            return;
        }

        try {
            const response = await ppcApi.post('/auth/changepass', {
                id: user.uid,
                newpass: newPassword
            });

            if (response.data.ok) {
                setNewPassword('');
                setConfirmNewPassword('');
                Swal.fire({
                    icon: 'success',
                    title: 'Contraseña cambiada',
                    text: response.data.msg,
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error al cambiar la contraseña',
                });
            }
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error al cambiar la contraseña',
            });
        }

        onClose();
    };

    const handleClose = () => {
        onClose();
    };

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="edit-modal-title"
            aria-describedby="edit-modal-description"
        >
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                }}
            >
                <h2 id="edit-modal-title">CAMBIAR CONTRASEÑA</h2>
                <form onSubmit={handleChangePassword}>
                    <TextField
                        margin="dense"
                        id="new-password"
                        name="new-password"
                        label="Nueva Contraseña"
                        type={showPassword ? 'text' : 'password'}
                        fullWidth
                        value={newPassword}
                        onChange={handleChange('newPassword')}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        edge="end"
                                    >
                                        {showPassword ? <EyeOff/> : <Eye />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    <TextField
                        margin="dense"
                        id="confirm-new-password"
                        name="confirm-new-password"
                        label="Confirmar Nueva Contraseña"
                        type="password"
                        fullWidth
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                    />
                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                        <Button onClick={handleClose} color="secondary" sx={{ mr: 2 }}>
                            Cancelar
                        </Button>
                        <Button type="submit" variant="contained" color="primary">
                            Aceptar
                        </Button>
                    </Box>
                </form>
            </Box>
        </Modal>
    );
};
