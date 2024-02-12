// src/components/Header.js
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuIcon from '@mui/icons-material/Menu';
import { AppBar, IconButton, Menu, MenuItem, Toolbar, Typography } from '@mui/material';
import axios from 'axios';
import React from 'react';
import { useNavigate } from 'react-router-dom';

function Header({ onMenuClick }) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const navigate = useNavigate();

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = async () => {
        // Aquí implementa la lógica para cerrar sesión
        try {
            // Llamada al endpoint de logout del microservicio
            const response = await axios.get('http://localhost:3004/logout', { withCredentials: true });
            console.log(response.data);
            
            // Si la llamada es exitosa, limpia localStorage y redirige al login
            localStorage.removeItem('accessToken');
            localStorage.removeItem('userId');
            handleClose();
            navigate('/login');
        } catch (error) {
            console.error('Logout failed', error);
            // Manejar aquí el error si la llamada falla
        }
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <IconButton edge="start" color="inherit" aria-label="menu" onClick={onMenuClick}>
                    <MenuIcon />
                </IconButton>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Migraciones DB
                </Typography>
                <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleMenu}
                    color="inherit"
                >
                    <AccountCircle />
                </IconButton>
                <Menu
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                >
                    <MenuItem onClick={handleClose}>Perfil</MenuItem>
                    <MenuItem onClick={handleLogout}>Cerrar Sesión</MenuItem>
                </Menu>
            </Toolbar>
        </AppBar>
    );
    
}

export default Header;
