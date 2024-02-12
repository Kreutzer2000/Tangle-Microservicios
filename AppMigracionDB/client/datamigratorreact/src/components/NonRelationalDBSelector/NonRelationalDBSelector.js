// src/components/DatabaseConnectionForm/NonRelationalDBSelector.js
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import React from 'react';

function NonRelationalDBSelector({ onChange }) {
    const handleDBChange = (event) => {
        onChange(event.target.value);
    };

    return (
        <FormControl fullWidth margin="normal">
            <InputLabel id="non-relational-db-selector-label">Base de Datos No Relacional</InputLabel>
            <Select
                labelId="non-relational-db-selector-label"
                id="non-relational-db-selector"
                onChange={handleDBChange}
                label="Base de Datos No Relacional"
            >
                <MenuItem value="MongoDB">MongoDB</MenuItem>
                <MenuItem value="Redis">Redis</MenuItem>
                {/* Más bases de datos aquí */}
            </Select>
        </FormControl>
    );
}

export default NonRelationalDBSelector;
