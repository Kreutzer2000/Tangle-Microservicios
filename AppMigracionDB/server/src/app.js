const express = require('express');
const migrationRoutes = require('./routes/migrationRoutes');

const app = express();
const port = process.env.PORT || 3010;

app.use(express.json());

app.use('/api/migration', migrationRoutes);

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});

module.exports = app;
