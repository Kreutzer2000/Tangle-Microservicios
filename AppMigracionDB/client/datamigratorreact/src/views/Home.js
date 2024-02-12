// src/views/Home.js
import { Box, Container, Paper, Typography } from '@mui/material';
import React from 'react';
import Layout from '../components/Layout';

function Home() {
    return (
        <Layout>
            <Container maxWidth="lg" sx={{ my: 4 }}> {/* Ajusta los márgenes verticales */}
                <Box my={4} sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center', // Centra el contenido
                }}>
                    <Typography variant="h4" gutterBottom>
                        Bienvenido al Sistema de Migraciones DB
                    </Typography>
                    <Paper elevation={3} sx={{ p: 2, width: '100%', maxWidth: '720px' }}>
                        <Typography variant="body1">
                            Aquí puedes administrar y ejecutar migraciones entre diferentes bases de datos, ya sean relacionales o no relacionales.
                        </Typography>
                        {/* Agregar más contenido según sea necesario */}
                    </Paper>
                </Box>
            </Container>
        </Layout>
    );
}

export default Home;
