const express = require('express');
const connectDB = require('./db');
const Usuario = require('./models/Usuario');

const app = express();
//app.use(express.json());

app.use(express.json({ limit: '4gb' }));
app.use(express.urlencoded({ limit: '4gb', extended: true }));

connectDB();

app.get('/getProfile', async (req, res) => {
    // Aquí necesitarás una manera de identificar al usuario, por ejemplo, a través de un ID en la solicitud
    // const userId = req.query.userId;
    // Lógica para obtener el perfil del usuario usando Mongoose
});

app.post('/updateProfile', async (req, res) => {
    // const userId = req.body.userId;
    // Lógica para actualizar el perfil del usuario usando Mongoose
});

// UserService - Ejemplo de ruta para obtener información del usuario
app.get('/getUserInfo/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await Usuario.findById(userId).select('-contrasena -token'); // Excluye campos sensibles
        if (!user) {
            return res.status(404).send('Usuario no encontrado');
        }
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error en el servidor');
    }
});

app.post('/createUser', async (req, res) => {
    // Lógica para crear un nuevo usuario
    const { token, nombre, apellido, email, usuario, contrasena, numeroTelefono, activo } = req.body;

    try {
        const nuevoUsuario = new Usuario({
            token,
            nombre,
            apellido,
            email,
            usuario,
            contrasena,
            numeroTelefono,
            activo
        });

        await nuevoUsuario.save();
        res.status(201).send('Usuario creado con éxito');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al crear usuario');
    }
});

// Endpoint para buscar un usuario por su token cifrado
app.get('/getUserByToken/:token', async (req, res) => {
    try {
        const token = req.params.token;
        const user = await Usuario.findOne({ token });
        if (!user) {
            return res.status(404).send('Usuario no encontrado');
        }
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error en el servidor');
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`UserService running on port ${PORT}`);
});
