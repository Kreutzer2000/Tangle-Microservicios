import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, TextField } from '@mui/material';
import axios from 'axios';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import * as yup from 'yup';

// Esquema de validación de Yup
const schema = yup.object({
    nombre: yup.string().required('Nombre es requerido').matches(/^[a-zA-Z\s]+$/, 'Solo letras'),
    apellido: yup.string().required('Apellido es requerido').matches(/^[a-zA-Z\s]+$/, 'Solo letras'),
    email: yup.string().required('Email es requerido').email('Email inválido'),
    telefono: yup.string().required('Teléfono es requerido').matches(/^\d+$/, 'Solo números'),
    usuario: yup.string().required('Usuario es requerido').matches(/^[a-zA-Z0-9]+$/, 'Solo letras y números'),
    contrasena: yup.string().required('Contraseña es requerida'),
});

function RegisterForm({ onRegisterSuccess }) {
    const { control, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    });

    const onSubmit = async data => {
        try {
            console.log('Registrando...')
            console.log(data);
            const response = await axios.post('http://localhost:3004/register', data);
            if (response.status === 201) {
                Swal.fire('Registrado con Éxito', 'El usuario ha sido registrado exitosamente.', 'success')
                    .then(() => {
                        reset(); // Limpia los campos del formulario
                        onRegisterSuccess(); // Llama a la función de éxito pasada como prop
                    });
            }
        } catch (error) {
            Swal.fire('Error al Registrar', error.response?.data || 'Error en el servidor', 'error');
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1 }}>
            <Controller
                name="nombre"
                control={control}
                defaultValue=""
                render={({ field }) => <TextField {...field} fullWidth margin="normal" label="Nombre" error={!!errors.nombre} helperText={errors.nombre?.message} />}
            />
            <Controller
                name="apellido"
                control={control}
                defaultValue=""
                render={({ field }) => <TextField {...field} fullWidth margin="normal" label="Apellido" error={!!errors.apellido} helperText={errors.apellido?.message} />}
            />
            <Controller
                name="email"
                control={control}
                defaultValue=""
                render={({ field }) => <TextField {...field} fullWidth margin="normal" label="Email" error={!!errors.email} helperText={errors.email?.message} />}
            />
            <Controller
                name="telefono"
                control={control}
                defaultValue=""
                render={({ field }) => <TextField {...field} fullWidth margin="normal" label="Teléfono" error={!!errors.telefono} helperText={errors.telefono?.message} />}
            />
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
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>Registrar</Button>
        </Box>
    );
}

export default RegisterForm;
