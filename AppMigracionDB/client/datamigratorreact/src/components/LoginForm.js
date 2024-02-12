// LoginForm.js
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, TextField } from '@mui/material';
import axios from 'axios';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import * as yup from 'yup';

// Esquema de validación
const schema = yup.object({
    usuario: yup.string().required('El nombre de usuario es requerido'),
    contrasena: yup.string().required('La contraseña es requerida'),
    token: yup.string().required('El token es requerido'),
});

function LoginForm({ onSuccess }) {
    const { control, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    });

    const onSubmit = async data => {
        try {
            const response = await axios.post('http://localhost:3004/login', data);
            if (response.data.userId) {
                localStorage.setItem('accessToken', response.data.token);
                localStorage.setItem('userId', response.data.userId);
                onSuccess(); // Llamar a onSuccess para manejar la redirección
            } else {
                throw new Error('UserId no está presente en la respuesta del servidor');
            }
        } catch (error) {
            Swal.fire('Error', 'Error al iniciar sesión', 'error');
            console.error(error);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1 }}>
            <Controller
                name="usuario"
                control={control}
                defaultValue=""
                render={({ field }) => <TextField {...field} fullWidth margin="normal" label="Nombre de Usuario" error={!!errors.usuario} helperText={errors.usuario?.message} />}
            />
            <Controller
                name="contrasena"
                control={control}
                defaultValue=""
                render={({ field }) => <TextField {...field} fullWidth margin="normal" label="Contraseña" type="password" error={!!errors.contrasena} helperText={errors.contrasena?.message} />}
            />
            <Controller
                name="token"
                control={control}
                defaultValue=""
                render={({ field }) => <TextField {...field} fullWidth margin="normal" label="Token" error={!!errors.token} helperText={errors.token?.message} />}
            />
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>Iniciar Sesión</Button>
        </Box>
    );
}

export default LoginForm;