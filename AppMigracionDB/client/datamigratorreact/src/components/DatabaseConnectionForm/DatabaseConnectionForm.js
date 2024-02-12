// src/components/DatabaseConnectionForm/DatabaseConnectionForm.js
import { Box, Button, TextField, Typography } from '@mui/material';
import { useState } from 'react';

function DatabaseConnectionForm({ dbType, onSubmit }) {
    const [details, setDetails] = useState({ host: '', port: '', user: '', password: '' });

    const handleChange = (e) => {
        setDetails({ ...details, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(details);
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2, width: '100%' }}>
            <Typography variant="h6">{`Conectar a ${dbType}`}</Typography>
            <TextField name="host" label="Host" fullWidth margin="normal" value={details.host} onChange={handleChange} />
            <TextField name="port" label="Puerto" fullWidth margin="normal" value={details.port} onChange={handleChange} />
            <TextField name="user" label="Usuario" fullWidth margin="normal" value={details.user} onChange={handleChange} />
            <TextField name="password" label="Contraseña" type="password" fullWidth margin="normal" value={details.password} onChange={handleChange} />
            <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>Conectar</Button>
        </Box>
    );
}

export default DatabaseConnectionForm;
