// src/components/Sidebar.js
import CloudIcon from '@mui/icons-material/Cloud';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import HomeIcon from '@mui/icons-material/Home';
import StorageIcon from '@mui/icons-material/Storage';
import { Collapse, Divider, Drawer, List, ListItem, ListItemIcon, ListItemText, ListSubheader } from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Sidebar({ open, onClose }) {
    const [relationalOpen, setRelationalOpen] = useState(false);
    const [nonRelationalOpen, setNonRelationalOpen] = useState(false);
    const [otherOptionsOpen, setOtherOptionsOpen] = useState(false);
    const navigate = useNavigate();

    const handleItemClick = (path) => {
        // Aquí implementa la navegación usando por ejemplo useNavigate() de react-router-dom o tu lógica de enrutamiento
        console.log(`Navegar a ${path}`);
        navigate(path);
        onClose(); // Cierra el menú después de la selección
    };

    return (
        <Drawer anchor="left" open={open} onClose={onClose}>
            <List
                sx={{ width: '250px' }}
                subheader={
                    <ListSubheader component="div">
                        Menú Principal
                    </ListSubheader>
                }
            >
                <ListItem button onClick={() => handleItemClick('/home')}>
                    <ListItemIcon><HomeIcon /></ListItemIcon>
                    <ListItemText primary="Home" />
                </ListItem>
                <ListItem button onClick={() => setRelationalOpen(!relationalOpen)}>
                    <ListItemIcon><StorageIcon /></ListItemIcon>
                    <ListItemText primary="Bases de Datos Relacionales" />
                    {relationalOpen ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse in={relationalOpen} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        <ListItem button sx={{ pl: 4 }} onClick={() => handleItemClick('/sql-server-migration')}>
                            <ListItemText primary="SQL Server" />
                        </ListItem>
                        <ListItem button sx={{ pl: 4 }} onClick={() => handleItemClick('/postgres')}>
                            <ListItemText primary="PostgreSQL" />
                        </ListItem>
                        <ListItem button sx={{ pl: 4 }} onClick={() => handleItemClick('/mysql')}>
                            <ListItemText primary="MySQL" />
                        </ListItem>
                        {/* Más bases de datos relacionales aquí */}
                    </List>
                </Collapse>

                <ListItem button onClick={() => setNonRelationalOpen(!nonRelationalOpen)}>
                    <ListItemIcon><CloudIcon /></ListItemIcon>
                    <ListItemText primary="Bases de Datos No Relacionales" />
                    {nonRelationalOpen ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse in={nonRelationalOpen} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        <ListItem button sx={{ pl: 4 }} onClick={() => handleItemClick('/mongodb')}>
                            <ListItemText primary="MongoDB" />
                        </ListItem>
                        <ListItem button sx={{ pl: 4 }} onClick={() => handleItemClick('/redis')}>
                            <ListItemText primary="Redis" />
                        </ListItem>
                        {/* Más bases de datos no relacionales aquí */}
                    </List>
                </Collapse>

                <Divider />

                <ListItem button onClick={() => setOtherOptionsOpen(!otherOptionsOpen)}>
                    <ListItemText primary="Otras Opciones" />
                    {otherOptionsOpen ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse in={otherOptionsOpen} timeout="auto" unmountOnExit>
                    {/* Aquí puedes agregar más opciones si es necesario */}
                </Collapse>
            </List>
        </Drawer>
    );
}

export default Sidebar;
