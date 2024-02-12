// src/views/SqlServerMigration.js
import { Box, Checkbox, Container, FormControlLabel, Typography } from '@mui/material';
import React, { useState } from 'react';
import DatabaseConnectionForm from '../components/DatabaseConnectionForm/DatabaseConnectionForm';
import Layout from '../components/Layout';
import MigrationOptions from '../components/MigrationOptions/MigrationOptions';
import NonRelationalDBSelector from '../components/NonRelationalDBSelector/NonRelationalDBSelector';
import SubmitMigration from '../components/SubmitMigration/SubmitMigration';

function SqlServerMigration() {
    const [sqlServerDetails, setSqlServerDetails] = useState({});
    const [nosqlDetails, setNosqlDetails] = useState({});
    const [migrationOptions, setMigrationOptions] = useState({});
    const [selectedNosqlDB, setSelectedNosqlDB] = useState('');
    const [generateScript, setGenerateScript] = useState(false);

    const handleNonRelationalDBChange = (dbName) => {
        setSelectedNosqlDB(dbName);
    };

    const handleMigrationStart = () => {
        const migrationData = {
            sqlServer: sqlServerDetails,
            nosql: nosqlDetails,
            options: migrationOptions,
            targetDB: selectedNosqlDB,
            generateScript: generateScript
        };
        console.log('Iniciar proceso de migración con:', migrationData);
        // Aquí enviarías la solicitud al backend para realizar la migración
    };

    return (
        <Layout>
            <Container maxWidth="lg">
                <Box my={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Typography variant="h4" gutterBottom>Migración desde SQL Server</Typography>
                    <DatabaseConnectionForm dbType="SQL Server" onSubmit={setSqlServerDetails} />
                    <NonRelationalDBSelector onChange={handleNonRelationalDBChange} />
                    {selectedNosqlDB && !generateScript && (
                        <DatabaseConnectionForm dbType={selectedNosqlDB} onSubmit={setNosqlDetails} />
                    )}
                    
                    <FormControlLabel 
                        control={<Checkbox checked={generateScript} onChange={(e) => setGenerateScript(e.target.checked)} />} 
                        label="Generar script de migración en lugar de conectar directamente" 
                    />
                    <MigrationOptions onChange={setMigrationOptions} />
                    <SubmitMigration onMigrate={handleMigrationStart} />
                </Box>
            </Container>
        </Layout>
    );
}

export default SqlServerMigration;