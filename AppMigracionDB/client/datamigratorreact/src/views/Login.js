// Login.js
import { Box, Container, Link as MuiLink, Typography } from '@mui/material';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm';

function Login() {
    const navigate = useNavigate();

    const handleLoginSuccess = () => {
        navigate('/home'); // Cambia '/ruta-destino' por la ruta a la que deseas redirigir después del login
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography component="h1" variant="h5">Iniciar Sesión</Typography>
                <LoginForm onSuccess={handleLoginSuccess} />
                <MuiLink component={Link} to="/register" variant="body2">{"¿No tienes cuenta? Regístrate"}</MuiLink>
            </Box>
        </Container>
    );
}

export default Login;