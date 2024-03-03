module.exports = {
    apps: [{
        name: "emailservice",
        script: "./index.js",
        watch: true,
        env: {
            "NODE_ENV": "development",
            "PORT": 3002,
            // Aquí se pueden agregar más variables de entorno específicas de desarrollo
        },
        env_production: {
            "NODE_ENV": "production",
            "PORT": 3002,
            // Aquí se pueden agregar más variables de entorno específicas de producción
        }
    }]
};
