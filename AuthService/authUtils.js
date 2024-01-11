const crypto = require('crypto');
const axios = require('axios');
const jwt = require('jsonwebtoken');

// Aquí trasladas funciones como generateRandomToken, encryptToken, sendTokenByEmail desde server.js

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
        await axios.post('http://localhost:3002/sendEmail', { email, token });
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

module.exports = {
    generateRandomToken,
    encryptToken,
    sendTokenByEmail,
    //encryptText
    //decryptText
    generateAccessToken,
};
