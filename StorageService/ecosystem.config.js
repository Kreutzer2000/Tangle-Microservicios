module.exports = {
    apps: [{
        name: "storageservice",
        script: "./index.js",
        watch: true,
        env: {
            "NODE_ENV": "development",
            "PORT": 3006,
            // Aquí se pueden agregar más variables de entorno específicas de desarrollo
        },
        env_production: {
            "NODE_ENV": "production",
            "PORT": 3006,
            // Aquí se pueden agregar más variables de entorno específicas de producción
        }
    }]
};
