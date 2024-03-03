// AuthService/index.js
require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` });
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { generateRandomToken, encryptToken, sendTokenByEmail, encryptText, decryptText, generateAccessToken } = require('./authUtils');
const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

const upload = multer({ dest: 'uploads/' }); // Configura multer para guardar archivos subidos

// Lista de orígenes permitidos
const whitelist = [
    process.env.CLIENT_REACT_URL,
    process.env.APP_TANGLE_LOCAL,
    process.env.APP_TANGLE_DOMAIN,
    process.env.AUTH_SERVICE_URL,
    process.env.USER_SERVICE_URL,
    process.env.FACIAL_RECOGNITION_SERVICE_URL,
    process.env.ENCRYPTION_SERVICE_URL,
];

// Opciones de CORS
const corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            // Origin está en la lista blanca o no se ha especificado (solicitudes sin servidor, p.ej. Postman)
            console.log('Acceso permitido desde el siguiente origen:', origin);
            callback(null, true);
        } else {
            console.log('Intento de acceso no autorizado desde el siguiente origen:', origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true, // Permitir envío de cookies y headers de autenticación
};

const userServiceURL = process.env.USER_SERVICE_URL;
const app = express();
app.use(cors(corsOptions)); // Habilitar CORS
app.use(cookieParser());
app.use(express.json());
app.use(express.json({ limit: '4gb' }));
app.use(express.urlencoded({ limit: '4gb', extended: true }));

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*"); // o en lugar de "*", especifica los dominios permitidos
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/', (req, res) => {
    console.log("Solicitud recibida en /");
    res.send('AuthService is running');
});

app.post('/register', upload.single('faceImage'), async (req, res) => {
    console.log("Solicitud recibida en /register");
    // Aquí trasladas la lógica para registrar un usuario desde server.js
    const { nombre, apellido, email, usuario, contrasena, telefono } = req.body;

    console.log(req.file.path + "Este es el archivo");
    // Asume que 'faceImage' es el campo en el que se carga la imagen del rostro
    if (!req.file) {
        return res.status(400).send('Imagen de rostro requerida');
    }

    // Preparar la imagen para enviar al servicio de reconocimiento facial
    const formData = new FormData();
    formData.append('file', fs.createReadStream(req.file.path));

    if (!telefono || !usuario || !contrasena) {
        return res.status(400).send('Los campos obligatorios no están completos.');
    }
    
    // Espera a que cada campo sea cifrado antes de continuar
    const encryptedNombre = await encryptText(String(nombre));
    const encryptedApellido = await encryptText(String(apellido));
    const encryptedEmail = await encryptText(String(email));
    const encryptedUsuario = await encryptText(String(usuario));
    const encryptedContrasena = await encryptText(String(contrasena));
    const encryptedTelefono = await encryptText(String(telefono));

    // Envía el token por correo electrónico
    // sendTokenByEmail(email, rawToken);
    console.log(formData.getHeaders());
    try {

        // Llamada al servicio de reconocimiento facial para registrar el rostro
        const responseFace = await axios.post(`${process.env.FACIAL_RECOGNITION_SERVICE_URL}/register`, formData, {
            headers: {
                ...formData.getHeaders(),
            },
        });

        if (responseFace.status === 201) {
            const user_id = responseFace.data.user_id;
            console.log(`Usuario registrado con éxito en el servicio de reconocimiento facial: ${user_id}`);

            // Ahora, cuando llamas a UserService para crear un usuario, incluyes este faceId
            const response = await axios.post(`${userServiceURL}/createUser`, {
                faceId: user_id,
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

        } else {
            // Manejo de la respuesta de reconocimiento facial
            return res.status(500).send('Error al registrar el rostro');
        }

    } catch (err) {
        console.error(err);
        res.status(500).send('Error en el servidor');
    }
});

app.post('/login', async (req, res) => {
    console.log("Solicitud recibida en /login")
    // Aquí trasladas la lógica para iniciar sesión desde server.js
    // const { usuario, contrasena, token } = req.body;
    // console.log(usuario, contrasena, token);
    //const hash = crypto.createHash('sha256').update(contrasena).digest('hex');
    // Verificar si el token proporcionado es válido
    // const encryptedToken = encryptToken(token);
    const { usuario, contrasena } = req.body;

    if (!req.file) {
        return res.status(400).send('Imagen de rostro requerida');
    }
    try {
        // Realiza una solicitud al UserService para obtener el usuario por token
        const userResponse = await axios.get(`${userServiceURL}/getUserByToken/${encryptedToken}`);
        const user = userResponse.data;
        //console.log(user);
        //console.log(user._id);
        if (user) {
            // Aquí asumimos que tus funciones de descifrado devuelven una promesa
            const usuarioDescifrado = await decryptText(user.usuario);
            const contrasenaDescifrada = await decryptText(user.contrasena);

            const contrasenaString = String(contrasenaDescifrada); // Esto se utiliza para poder hacer una cadena todas las contraseñas y poder comparlas luego

            if ( /*user.contrasena*/ contrasenaString === contrasena && /*user.usuario*/usuarioDescifrado === usuario) {
                console.log("Entro");
                const accessToken = generateAccessToken(usuarioDescifrado, user._id);
                console.log(accessToken + "Este es el token");
                res.cookie('token', accessToken, { httpOnly: true });
                console.log(user._id + "Este es el id del usuario")
                return res.status(200).json({
                    message: 'Inicio de sesión exitoso',
                    token: accessToken,
                    userId: user._id  // Envía el _id del usuario
                });
            } else {
                return res.status(401).json({ message: 'Credenciales inválidas' });
            }
        } else {
            res.status(401).json({ message: 'No existe el Usuario' });
        }

    } catch (err) {
        console.error(err);
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
