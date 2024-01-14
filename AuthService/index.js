// AuthService/index.js
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { generateRandomToken, encryptToken, sendTokenByEmail, encryptText, decryptText, generateAccessToken } = require('./authUtils');
const axios = require('axios');

const userServiceURL = 'http://localhost:3001';
const app = express();
app.use(cors()); // Habilitar CORS
app.use(cookieParser());
app.use(express.json());
app.use(express.json({ limit: '4gb' }));
app.use(express.urlencoded({ limit: '4gb', extended: true }));

app.post('/register', async (req, res) => {
    console.log("Solicitud recibida en /register");
    // Aquí trasladas la lógica para registrar un usuario desde server.js
    const { nombre, apellido, email, usuario, contrasena, telefono } = req.body;

    if (!telefono || !usuario || !contrasena) {
        return res.status(400).send('Los campos obligatorios no están completos.');
    }

    const rawToken = generateRandomToken();
    const encryptedToken = encryptToken(rawToken);

    console.log('Token:', rawToken); // Token sin cifrar
    console.log('Encrypted Token:', encryptedToken); // Token cifrado
    
    // Espera a que cada campo sea cifrado antes de continuar
    const encryptedNombre = await encryptText(String(nombre));
    const encryptedApellido = await encryptText(String(apellido));
    const encryptedEmail = await encryptText(String(email));
    const encryptedUsuario = await encryptText(String(usuario));
    const encryptedContrasena = await encryptText(String(contrasena));
    const encryptedTelefono = await encryptText(String(telefono));
    
    // Envía el token por correo electrónico
    sendTokenByEmail(email, rawToken);

    try {

        const response = await axios.post(`${userServiceURL}/createUser`, {
            token: encryptedToken,
            nombre: encryptedNombre,
            apellido: encryptedApellido,
            email: encryptedEmail,
            usuario: encryptedUsuario,
            contrasena: encryptedContrasena,
            numeroTelefono: encryptedTelefono,
            activo: true
        });

        if (response.status === 201) {
            res.status(201).send('Usuario registrado con éxito');
        } else {
            res.status(response.status).send('Error al registrar usuario');
        }
    } catch (err) {
        //console.error(err);
        sql.close();
        res.status(500).send('Error en el servidor');
    }
});

app.post('/login', async (req, res) => {
    // Aquí trasladas la lógica para iniciar sesión desde server.js
    const { usuario, contrasena, token } = req.body;
    console.log('Received login request for user:', usuario);  // Añade un log aquí
    console.log(usuario, contrasena, token);
    //const hash = crypto.createHash('sha256').update(contrasena).digest('hex');
    // Verificar si el token proporcionado es válido
    const encryptedToken = encryptToken(token);
    try {
        // Realiza una solicitud al UserService para obtener el usuario por token
        const userResponse = await axios.get(`${userServiceURL}/getUserByToken/${encryptedToken}`);
        const user = userResponse.data;
        console.log(user);
        if (user) {
            // Aquí asumimos que tus funciones de descifrado devuelven una promesa
            const nombreDescifrado = await decryptText(user.nombre);
            const apellidoDescifrado = await decryptText(user.apellido);
            const emailDescifrado = await decryptText(user.email);
            const usuarioDescifrado = await decryptText(user.usuario);
            const contrasenaDescifrada = await decryptText(user.contrasena);

            const contrasenaString = String(contrasenaDescifrada); // Esto se utiliza para poder hacer una cadena todas las contraseñas y poder comparlas luego
            
            if ( /*user.contrasena*/ contrasenaString === contrasena && /*user.usuario*/usuarioDescifrado === usuario) {
                console.log("Entro");
                const accessToken = generateAccessToken(usuarioDescifrado, user._id);
                console.log( accessToken + "Este es el token");
                res.cookie('token', accessToken, { httpOnly: true });
                return res.status(200).json({ message: 'Inicio de sesión exitoso', token: accessToken });
            } else {
                return res.status(401).json({ message: 'Credenciales inválidas' });
            }
        } else {
            res.status(401).json({ message: 'No existe el Usuario' });
        }

    } catch (err) {
        console.error(err);
        sql.close();
        res.status(err.response?.status || 500).json({ message: err.message || 'Error en el servidor' });
    }
});

app.get('/logout', (req, res) => {
    // Lógica para cerrar sesión
    res.clearCookie('token');
    res.status(200).send('Sesión cerrada con éxito');
});

const PORT = process.env.PORT || 3004;
app.listen(PORT, () => {
    console.log(`AuthService running on port ${PORT}`);
});
