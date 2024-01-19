const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
const Usuario = require('./models/Usuario');
const { encryptText, decryptText } = require('./utils/authUtils');

const app = express();
//app.use(express.json());

app.use(express.json({ limit: '4gb' }));
app.use(express.urlencoded({ limit: '4gb', extended: true }));

app.use(cors({
    origin: 'http://localhost:8080' // Asegúrate de cambiar esto según el origen de tus solicitudes
}));

connectDB();

app.get('/getProfile', async (req, res) => {
    try {
        const userId = req.query.userId; // Obteniendo el ID del usuario desde la query string
        console.log(userId);
        const user = await Usuario.findById(userId).select('nombre apellido email usuario numeroTelefono');
        //console.log(user);
        
        let nombreDescifrado, apellidoDescifrado, emailDescifrado, usuarioDescifrado, numeroTelefonoDescifrado = null;

        if(user.nombre) nombreDescifrado = await decryptText(user.nombre);
        if(user.apellido) apellidoDescifrado = await decryptText(user.apellido);
        if(user.email) emailDescifrado = await decryptText(user.email);
        if(user.usuario) usuarioDescifrado = await decryptText(user.usuario);
        // console.log(usuarioDescifrado);
        if (user.numeroTelefono && user.numeroTelefono.length > 0) {
            try {
                // console.log(user.numeroTelefono + ' ' + user.numeroTelefono.length);
                numeroTelefonoDescifrado = await decryptText(user.numeroTelefono);
            } catch (error) {
                console.error('Error al desencriptar el número de teléfono:', error.message);
            }
        }

        const userDescifrado = new Usuario({
            nombre: nombreDescifrado,
            apellido: apellidoDescifrado,
            email: emailDescifrado,
            usuario: usuarioDescifrado,
            numeroTelefono: numeroTelefonoDescifrado,
        });

        console.log(userDescifrado);
        if (!userDescifrado) {
            return res.status(404).send('Usuario no encontrado');
        }
        res.json(userDescifrado);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error en el servidor');
    }
});

app.post('/updateProfile', async (req, res) => {
    
    try {
        const { userId, nombre, apellido, email, usuario, numeroTelefono } = req.body;
        console.log( userId, nombre, apellido, email, usuario, numeroTelefono);

        // Asumiendo que tienes funciones para encriptar y desencriptar
        // que serían similares a 'encryptText' y 'decryptText' que ya usas.

        // Encriptar los datos antes de guardarlos
        const encryptedNombre = await encryptText(nombre);
        const encryptedApellido = await encryptText(apellido);
        const encryptedEmail = await encryptText(email);
        const encryptedUsuario = await encryptText(usuario);
        const encryptedNumeroTelefono = await encryptText(numeroTelefono);

        // Encuentra el usuario por ID y actualiza
        const updatedUser = await Usuario.findByIdAndUpdate(userId, {
            $set: {
                nombre: encryptedNombre,
                apellido: encryptedApellido,
                email: encryptedEmail,
                usuario: encryptedUsuario,
                numeroTelefono: encryptedNumeroTelefono
            }
        }, { new: true });

        if (!updatedUser) {
            return res.status(404).send('Usuario no encontrado');
        }

        // Desencriptar los datos antes de enviarlos de vuelta al cliente
        let nombreDescifrado, apellidoDescifrado, emailDescifrado, usuarioDescifrado, numeroTelefonoDescifrado = null;

        if(updatedUser.nombre) nombreDescifrado = await decryptText(updatedUser.nombre);
        if(updatedUser.apellido) apellidoDescifrado = await decryptText(updatedUser.apellido);
        if(updatedUser.email) emailDescifrado = await decryptText(updatedUser.email);
        if(updatedUser.usuario) usuarioDescifrado = await decryptText(updatedUser.usuario);
        // console.log(usuarioDescifrado);
        if (updatedUser.numeroTelefono && updatedUser.numeroTelefono.length > 0) {
            try {
                numeroTelefonoDescifrado = await decryptText(updatedUser.numeroTelefono);
            } catch (error) {
                console.error('Error al desencriptar el número de teléfono:', error.message);
            }
        }

        res.json({
            nombre: nombreDescifrado,
            apellido: apellidoDescifrado,
            email: emailDescifrado,
            usuario: usuarioDescifrado,
            numeroTelefono: numeroTelefono
        });
    } catch (error) {
        console.error('Error al actualizar el perfil del usuario:', error);
        res.status(500).send('Error interno del servidor');
    }

});

// UserService - Ejemplo de ruta para obtener información del usuario
app.get('/getUserInfo/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await Usuario.findById(userId).select('-contrasena -token'); // Excluye campos sensibles

        if (!user) {
            return res.status(404).send('Usuario no encontrado');
        }

        // Desencriptar los datos antes de enviarlos de vuelta al cliente
        let nombreDescifrado, apellidoDescifrado, emailDescifrado, usuarioDescifrado, numeroTelefonoDescifrado = null;

        if(user.nombre) nombreDescifrado = await decryptText(user.nombre);
        if(user.apellido) apellidoDescifrado = await decryptText(user.apellido);
        if(user.email) emailDescifrado = await decryptText(user.email);
        if(user.usuario) usuarioDescifrado = await decryptText(user.usuario);
        // console.log(usuarioDescifrado);
        if (user.numeroTelefono && user.numeroTelefono.length > 0) {
            try {
                numeroTelefonoDescifrado = await decryptText(user.numeroTelefono);
            } catch (error) {
                console.error('Error al desencriptar el número de teléfono:', error.message);
            }
        }

        const userDescifrado = new Usuario({
            nombre: nombreDescifrado,
            apellido: apellidoDescifrado,
            email: emailDescifrado,
            usuario: usuarioDescifrado,
            numeroTelefono: numeroTelefonoDescifrado,
        });
        
        console.log(userDescifrado);
        res.json(userDescifrado);
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

// Nuevo endpoint para obtener todos los usuarios
app.get('/getAllUsers', async (req, res) => {
    try {
        const users = await Usuario.find({}).select('-contrasena -token'); // Excluye campos sensibles
        if (!users || users.length === 0) {
            return res.status(404).send('No se encontraron usuarios');
        }

        // Desencriptar los datos de cada usuario
        const usersDescifrados = await Promise.all(users.map(async (user) => {
            let nombreDescifrado, apellidoDescifrado, emailDescifrado, usuarioDescifrado, numeroTelefonoDescifrado = null;

            if(user.nombre) nombreDescifrado = await decryptText(user.nombre);
            if(user.apellido) apellidoDescifrado = await decryptText(user.apellido);
            if(user.email) emailDescifrado = await decryptText(user.email);
            if(user.usuario) usuarioDescifrado = await decryptText(user.usuario);
            if(user.numeroTelefono) numeroTelefonoDescifrado = await decryptText(user.numeroTelefono);

            return {
                ...user.toObject(), // Convertir a objeto plano y mantener los campos existentes
                nombre: nombreDescifrado,
                apellido: apellidoDescifrado,
                email: emailDescifrado,
                usuario: usuarioDescifrado,
                numeroTelefono: numeroTelefonoDescifrado
            };
        }));
        console.log(usersDescifrados);
        res.json(usersDescifrados);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error en el servidor');
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`UserService running on port ${PORT}`);
});
