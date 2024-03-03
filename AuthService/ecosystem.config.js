module.exports = {
    apps: [{
        name: "authservice",
        script: "./index.js",
        watch: true,
        env: {
            "NODE_ENV": "development",
            "PORT": 3004,
            // Agrega aquí otras variables de entorno específicas de desarrollo
        },
        env_production: {
            "NODE_ENV": "production",
            "PORT": 3004,
            // Agrega aquí otras variables de entorno específicas de producción
        }
    }]
};