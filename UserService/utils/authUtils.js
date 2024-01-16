const axios = require('axios');
const https = require('https');
const encryptionServiceURL = 'https://localhost:7147';

// Crear una instancia de Axios con un agente HTTPS que ignora los errores de certificado SSL
const axiosInstance = axios.create({
    httpsAgent: new https.Agent({  
        rejectUnauthorized: false
    })
});

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
    // console.log('Request body for decrypText:', encryptedText);
    try {
        // Asegúrate de que encryptedText es una cadena
        const requestData = typeof encryptedText === 'string' ? encryptedText : JSON.stringify(encryptedText);

        // Realizar la solicitud POST
        const response = await axiosInstance.post(`${encryptionServiceURL}/Encryption/decrypt`, requestData, { 
            headers: { 'Content-Type': 'application/json' } 
        });

        // Registro para depuración
        console.log('Decryption response:', response.data);

        return String(response.data); // El texto desencriptado
    } catch (error) {
        // Registro detallado del error
        console.error('Error al desencriptar el texto:', error);
        console.error('Error details:', error.response ? error.response.data : error);

        throw error;
    }
}

module.exports = {
    encryptText,
    decryptText,
};