// src/components/Layout.js
import { Box } from '@mui/material';
import React, { useState } from 'react';
import Footer from './Footer';
import Header from './Header';
import Sidebar from './Sidebar';

function Layout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh', // Asegura que el contenedor tome al menos el 100% de la altura de la ventana
        }}>
            <Header onMenuClick={toggleSidebar} />
            <Sidebar open={sidebarOpen} onClose={toggleSidebar} />
            <Box component="main" sx={{ flexGrow: 1, py: 3 }}>
                {children}
            </Box>
            <Footer />
        </Box>
    );
}

export default Layout;
