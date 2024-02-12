import { Box, Container, Link as MuiLink, Typography } from '@mui/material';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import RegisterForm from '../components/RegisterForm';

function Register() {

    const navigate = useNavigate();

    const handleRegisterSuccess = () => {
      navigate('/login'); // Cambia '/login' por la ruta de inicio de sesión en tu aplicación
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography component="h1" variant="h5">Registro de Usuario</Typography>
                <RegisterForm onRegisterSuccess={handleRegisterSuccess} />
                <MuiLink component={Link} to="/" variant="body2">{"¿Ya tienes cuenta? Inicia sesión"}</MuiLink>
            </Box>
        </Container>
    );
}

export default Register;
