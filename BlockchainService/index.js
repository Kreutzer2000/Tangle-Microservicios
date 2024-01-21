const express = require('express');
const cors = require('cors');
const { Client, Block, hexToUtf8, utf8ToHex, Utils, TaggedDataPayload } = require('@iota/sdk');
const connectDB = require('./db');
const TransaccionesTangle = require('./models/TransaccionesTangle'); // Asegúrate de ajustar la ruta
const axios = require('axios');
const userServiceURL = 'http://localhost:3001';

const app = express();
app.use(express.json());

// Habilitar CORS para todas las rutas
app.use(cors());

connectDB();

// Creación del cliente de IOTA
const client = new Client({
    //nodes: ['https://api.testnet.shimmer.network'],
    nodes: ['http://35.194.18.16:14265']
});

const clients = [
    new Client({ nodes: ['http://35.194.18.16:14265'] }), // Nodo 1
    new Client({ nodes: ['http://35.194.18.16:14266'] }), // Nodo 2
    new Client({ nodes: ['http://35.194.18.16:14267'] }), // Nodo 3
    new Client({ nodes: ['http://35.194.18.16:14268'] }),  // Nodo 4
    new Client({ nodes: ['https://api.testnet.shimmer.network'] })  // Nodo de Pruebas
];

app.post('/upload', async (req, res) => {
    const { hash, usuarioId, azureBlobUrl } = req.body;
    console.log(usuarioId + '\n' + "Este es el usuario");
    console.log(azureBlobUrl + '\n' + "Esta es la url");
    console.log(hash + '\n' + "Este es el hash");
    if (!hash || !usuarioId) {
        return res.status(400).send('Faltan datos requeridos');
    }

    const options = {
        tag: utf8ToHex('Hello'),
        data: utf8ToHex(hash)
    };

    try {
        const mnemonic = Utils.generateMnemonic();
        const secretManager = { mnemonic };

        // Crear y enviar el bloque con la carga útil
        const blockIdAndBlock = await client.buildAndPostBlock(secretManager, options);
        console.log('Block sent: ', blockIdAndBlock, '\n');

        const fetchedBlock = await client.getBlock(blockIdAndBlock[0]);
        console.log('Block data: ', fetchedBlock);

        const block = new Block();
        block.protocolVersion = fetchedBlock.protocolVersion;
        block.parents = fetchedBlock.parents;
        block.payload = fetchedBlock.payload;
        block.nonce = fetchedBlock.nonce;

        const blockId = await client.postBlock(block);
        console.log('Block ID:', blockId);

        // Crear una nueva transacción en MongoDB
        const nuevaTransaccion = new TransaccionesTangle({
            usuarioId,
            hashSHA3: hash,
            blockId,
            protocolVersion: block.protocolVersion,
            parents: block.parents,
            payloadType: block.payload.type,
            payloadTag: block.payload.tag,
            payloadData: block.payload.data,
            nonce: block.nonce,
            archivoCifradoURL: azureBlobUrl
        });

        await nuevaTransaccion.save();
        res.json({ blockId });
    } catch (iotaError) {
        console.error('Error sending message to the Tangle:', iotaError);
        res.status(500).send('Server error');
    }
});

app.get('/retrieve/:blockId', async (req, res) => {
    console.log("Entro a retrieve");
    const blockId = req.params.blockId;
    console.log(blockId + '\n' + "Este es el blockId");

    try {
        //const transaccion = await TransaccionesTangle.findOne({ blockId }).populate('usuarioId');
        const transaccion = await TransaccionesTangle.findOne({ blockId });
        if (!transaccion) {
            return res.status(404).send('Transacción no encontrada');
        }

        // Recuperar información del bloque de la red Tangle
        const fetchedBlock = await retrieveBlockFromNodesParallel(blockId);

        if (!fetchedBlock || !(fetchedBlock.payload instanceof TaggedDataPayload)) {
            return res.status(400).send('Invalid block payload or block not found');
        }

        const payload = fetchedBlock.payload;
        const encryptedFileDataBase64 = hexToUtf8(payload.data);

        // Solicitar información del usuario al UserService
        const userInfoResponse = await axios.get(`${userServiceURL}/getUserInfo/${transaccion.usuarioId}`);
        const userInfo = userInfoResponse.data;

        // Crear un objeto que contenga tanto los datos de la base de datos como los datos de Tangle
        const responseData = {
            encryptedFileData: encryptedFileDataBase64,
            transaccion,
            userInfo
        };

        res.send(responseData);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Server error');
    }
});

app.get('/retrieveByPhone/:phone/:userId', async (req, res) => {
    console.log("Entro a retrieveByPhone");
    const { phone, userId } = req.params;
    console.log(phone + '\n' + "Este es el phone" + '\n' + userId + '\n' + "Este es el userId");
    try {
        // Obtener los detalles del usuario del otro microservicio
        const userInfoResponse = await axios.get(`${userServiceURL}/getUserInfo/${userId}`);
        const userInfo = userInfoResponse.data;
        console.log(userInfo + '\n' + "Este es el userInfo");
        // Verificar que el número de teléfono coincida
        if (userInfo.numeroTelefono !== phone) {
            return res.status(404).send('Número de teléfono no coincide con el usuario.');
        }
        
        // Buscar transacciones en la base de datos para el usuarioId dado
        const transacciones = await TransaccionesTangle.find({ usuarioId: userId });
        console.log(transacciones + '\n' + "Estas son las transacciones");
        if (!transacciones || transacciones.length === 0) {
            console.log('No se encontraron transacciones para el usuario con ID:', userId);
            return res.status(404).send('No se encontraron transacciones.');
        }

        // Procesar los resultados y enviarlos
        const result = await Promise.all(transacciones.map(async transaccion => {
            try {
                // Recuperar el bloque desde la red Tangle usando la función existente
                const fetchedBlock = await retrieveBlockFromNodesParallel(transaccion.blockId);

                // Aquí puedes procesar fetchedBlock según sea necesario
                // Por ejemplo, puedes convertir la información del bloque a un formato específico

                return {
                    dbData: {
                        // datos relevantes de la transacción
                        blockId: transaccion.blockId,
                        hashSHA3: transaccion.hashSHA3,
                        archivoCifradoURL: transaccion.archivoCifradoURL,
                        fechaTransaccion: transaccion.fechaTransaccion,
                        // ... otros datos de la transacción ...
                    },
                    userInfo: userInfo, // Agregar la información del usuario
                    blockData: fetchedBlock // Agregar la información del bloque Tangle
                };
            } catch (error) {
                console.error('Error al recuperar el bloque Tangle:', error);
                return null; // O maneja el error como consideres adecuado
            }
        }));

        const filteredResult = result.filter(item => item !== null); // Filtrar elementos nulos
        console.log(filteredResult + '\n' + "Este es el filteredResult");
        if (filteredResult.length > 0) {
            res.json(filteredResult);
        } else {
            res.status(404).send('No se encontraron transacciones con los datos del bloque.');
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Error del servidor');
    }
});

const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
    console.log(`BlockchainService running on port ${PORT}`);
});

// Función para recuperar un bloque de la red Tangle (versión paralela) - Se usa
async function retrieveBlockFromNodesParallel(blockId) {
    const blockPromises = clients.map(client => client.getBlock(blockId).catch(e => null));
    const results = await Promise.all(blockPromises);
    const fetchedBlock = results.find(block => block !== null);
    if (!fetchedBlock) {
        throw new Error('Block not found on any node');
    }
    return fetchedBlock;
}