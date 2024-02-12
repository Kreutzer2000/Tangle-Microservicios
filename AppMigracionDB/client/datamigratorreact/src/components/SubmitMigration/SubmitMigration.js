// src/components/SubmitMigration/SubmitMigration.js
import { Button } from '@mui/material';
import React from 'react';

function SubmitMigration({ onMigrate }) {
    return <Button variant="contained" color="secondary" onClick={onMigrate}>Iniciar Migración</Button>;
}

export default SubmitMigration;
