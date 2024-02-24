const crypto = require('crypto');
const axios = require('axios');
const https = require('https');
const jwt = require('jsonwebtoken');
const encryptionServiceURL = 'http://homomorphicencryptionservice.luxen.club';

// Crear una instancia de Axios con un agente HTTPS que ignora los errores de certificado SSL
const axiosInstance = axios.create({
    httpsAgent: new https.Agent({  
        rejectUnauthorized: false
    })
});

// Función para generar un token aleatorio
function generateRandomToken() {
    const tokenLength = 20; // Longitud deseada del token
    const possibleCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=';
    
    let token = '';
    for (let i = 0; i < tokenLength; i++) {
        const randomIndex = Math.floor(Math.random() * possibleCharacters.length);
        token += possibleCharacters[randomIndex];
    }

    return token;
}

// Función para cifrar el token con SHA-256
function encryptToken(token) {
    return crypto.createHash('sha256').update(token).digest('hex');
}

// Modificar la función sendTokenByEmail para usar EmailService
async function sendTokenByEmail(email, token) {
    try {
        await axios.post('http://emailservice.luxen.club/sendEmail', { email, token });
        console.log('Email enviado con éxito');
    } catch (error) {
        console.error('Error al enviar el email:', error);
        throw error; // O maneja el error como prefieras
    }
}

function generateAccessToken(username, userId) {  // Asegúrate de incluir userId aquí
    const payload = {
        username,
        userId,  // incluye userId en el payload
        // ... otros datos que quieras incluir
    };
    const token = jwt.sign(payload, 'clave_secreta', { expiresIn: '1h' });  // asume que jwt es una instancia de jsonwebtoken
    console.log(token);
    return token;
}

async function encryptText(text) {
    console.log('Request body for encryption:', text);
    try {
        const response = await axiosInstance.post(`${encryptionServiceURL}/Encryption/encrypt`, JSON.stringify(text), {
            headers: { 'Content-Type': 'application/json' }
        });

        return response.data; // El texto cifrado
    } catch (error) {
        console.error('Error al encriptar el texto:', error);
        throw error;
    }
}

async function decryptText(encryptedText) {
    try {
        const response = await axiosInstance.post(`${encryptionServiceURL}/Encryption/decrypt`, JSON.stringify(encryptedText), { 
            headers: { 'Content-Type': 'application/json' } 
        });
        return response.data; // El texto desencriptado
    } catch (error) {
        console.error('Error al desencriptar el texto:', error);
        throw error;
    }
}

module.exports = {
    generateRandomToken,
    encryptToken,
    sendTokenByEmail,
    encryptText,
    decryptText,
    generateAccessToken,
};
