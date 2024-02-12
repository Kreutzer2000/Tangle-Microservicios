// src/components/Footer.js
import { Box, Container, Typography } from '@mui/material';
import React from 'react';

function Footer() {
    return (
        <Box component="footer" sx={{ bgcolor: 'background.paper', py: 3, mt: 'auto' }}>
            <Container maxWidth="lg">
                <Typography variant="body2" color="text.secondary" align="center">
                    © {new Date().getFullYear()} Migraciones DB
                </Typography>
                <Typography variant="subtitle1" align="center" color="text.secondary" component="p">
                    Simplificando la migración de bases de datos.
                </Typography>
            </Container>
        </Box>
    );
}

export default Footer;
