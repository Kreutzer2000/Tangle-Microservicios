module.exports = {
    apps: [{
        name: "userservice",
        script: "./index.js",
        watch: true,
        env: {
            "NODE_ENV": "development",
            "PORT": 3001,
            // Aquí se pueden agregar más variables de entorno específicas de desarrollo
        },
        env_production: {
            "NODE_ENV": "production",
            "PORT": 3001,
            // Aquí se pueden agregar más variables de entorno específicas de producción
        }
    }]
};
