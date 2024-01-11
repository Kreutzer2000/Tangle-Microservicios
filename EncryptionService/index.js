// EncryptionService/index.js
const express = require('express');
const SEAL = require('node-seal');

const app = express();
app.use(express.json());

let sealObjects;

// Función para inicializar el sistema de cifrado homomórfico
async function initializeSeal() {
    const seal = await SEAL();
    const schemeType = seal.SchemeType.bfv;
    const polyModulusDegree = 4096;
    const bitSizes = [36, 36, 37];
    const bitSize = 20;

    const parms = seal.EncryptionParameters(schemeType);

    parms.setPolyModulusDegree(polyModulusDegree);
    parms.setCoeffModulus(seal.CoeffModulus.Create(polyModulusDegree, Int32Array.from(bitSizes)));
    parms.setPlainModulus(seal.PlainModulus.Batching(polyModulusDegree, bitSize));

    const context = seal.Context(parms, true, seal.SecurityLevel.tc128);

    const keyGenerator = seal.KeyGenerator(context);
    const publicKey = keyGenerator.createPublicKey();
    const secretKey = keyGenerator.secretKey();

    return {
        seal,
        context,
        keyGenerator,
        publicKey,
        secretKey
    };
}

// Inicializa SEAL al iniciar el servicio
initializeSeal().then(objects => {
    sealObjects = objects;
    console.log("SEAL inicializado correctamente");
});

// Endpoint para cifrar texto
app.post('/encrypt', async (req, res) => {
    const { text } = req.body;
    if (!text) {
        return res.status(400).send('Texto a cifrar es requerido');
    }

    try {
        const encryptedText = await encryptText(text); // Utiliza tu función de cifrado
        res.json({ encryptedText });
    } catch (error) {
        res.status(500).send('Error al cifrar el texto');
    }
});

// Endpoint para descifrar texto
app.post('/decrypt', async (req, res) => {
    const { encryptedText } = req.body;
    if (!encryptedText) {
        return res.status(400).send('Texto cifrado es requerido');
    }

    try {
        const decryptedText = await decryptText(encryptedText); // Utiliza tu función de descifrado
        res.json({ decryptedText });
    } catch (error) {
        res.status(500).send('Error al descifrar el texto');
    }
});

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
    console.log(`EncryptionService running on port ${PORT}`);
});

// Función para cifrar texto
async function encryptText(text) {
    if (!sealObjects) {
        throw new Error("SEAL no está inicializado");
    }

    try {
        const batchEncoder = sealObjects.seal.BatchEncoder(sealObjects.context);
        const textArray = Int32Array.from(text.split('').map(char => char.charCodeAt(0)));
        const plaintext = sealObjects.seal.PlainText();
        batchEncoder.encode(textArray, plaintext);

        const encryptor = sealObjects.seal.Encryptor(sealObjects.context, sealObjects.publicKey);
        const ciphertext = sealObjects.seal.CipherText();
        encryptor.encrypt(plaintext, ciphertext);

        // Serializar el CipherText a un Buffer y luego a Base64
        const buffer = ciphertext.save();
        console.log("Buffer serializado:", buffer);
        console.log("Tamaño del buffer serializado (antes de Base64):", buffer.length);
        return buffer.toString('base64');
    } catch (error) {
        console.error('Error al cifrar el texto:', error);
        throw error;
    }
}

async function decryptText(encryptedText) {
    //console.log("Texto cifrado recibido:", encryptedText);
    if (!sealObjects) {
        console.error("Error: SEAL no está inicializado.");
        throw new Error("SEAL no está inicializado");
    }

    try {
        // Convierte la cadena Base64 de nuevo a un Buffer
        const buffer = Buffer.from(encryptedText, 'base64');
        //console.log("Buffer convertido:", buffer.toString('hex'));
        console.log("Buffer convertido (Base64 a buffer):", buffer);
        console.log("Tamaño del buffer (después de Base64):", buffer.length);

        // Cargar el CipherText desde el Buffer
        const ciphertext = sealObjects.seal.CipherText();
        if (!ciphertext.load(sealObjects.context, buffer)) {
            throw new Error("Error al cargar CipherText desde el buffer");
        }

        console.log("Ciphertext cargado correctamente");

        // Proceso de descifrado
        const decryptor = sealObjects.seal.Decryptor(sealObjects.context, sealObjects.secretKey);
        const decryptedPlaintext = sealObjects.seal.PlainText();
        decryptor.decrypt(ciphertext, decryptedPlaintext);
        console.log("Texto descifrado exitosamente");

        // Decodificar el Plaintext
        const batchEncoder = sealObjects.seal.BatchEncoder(sealObjects.context);
        const decodedArray = batchEncoder.decode(decryptedPlaintext);
        const decodedText = String.fromCharCode.apply(null, decodedArray);
        console.log("Texto descifrado:", decodedText);

        return decodedText;
    } catch (error) {
        console.error('Error al descifrar el texto:', error);
        throw error;
    }
}