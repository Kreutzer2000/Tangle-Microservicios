// src/components/MigrationOptions/MigrationOptions.js
import { Checkbox, FormControlLabel, FormGroup, TextField } from '@mui/material';
import { useState } from 'react';

function MigrationOptions({ onChange }) {
    const [options, setOptions] = useState({ database: '', tables: [] });

    const handleDatabaseChange = (event) => {
        setOptions({ ...options, database: event.target.value });
        onChange(options);
    };

    const handleTableChange = (table, isChecked) => {
        const updatedTables = isChecked
            ? [...options.tables, table]
            : options.tables.filter(t => t !== table);

        setOptions({ ...options, tables: updatedTables });
        onChange({ ...options, tables: updatedTables });
    };

    return (
        <FormGroup>
            <TextField label="Database" variant="outlined" fullWidth margin="normal" value={options.database} onChange={handleDatabaseChange} />
            <div>
                {/* Aquí puedes agregar un loop para renderizar checkboxes para las tablas */}
                <FormControlLabel control={<Checkbox onChange={(e) => handleTableChange('Table1', e.target.checked)} />} label="Table1" />
                <FormControlLabel control={<Checkbox onChange={(e) => handleTableChange('Table2', e.target.checked)} />} label="Table2" />
                {/* Más tablas aquí */}
            </div>
        </FormGroup>
    );
}

export default MigrationOptions;
