const express = require('express');
const multer = require('multer');
const fs = require('fs').promises;
const { BlobServiceClient } = require('@azure/storage-blob');

const app = express();
const upload = multer({ dest: 'uploads/' });

const AZURE_STORAGE_CONNECTION_STRING = 'DefaultEndpointsProtocol=https;AccountName=tanglestore;AccountKey=ZTFvf57GOFp+IF1mEwwcbkJ1BYyYZm3+bTuxYDiVNbvAzKYfPEV5ZlDhzBk0+xuErUL8V53QpckE+AStfKK+xg==;EndpointSuffix=core.windows.net'; // Obtén esto desde el portal de Azure
const containerName = 'storagetangle';
const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);

app.post('/uploadToAzure', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded');
    }

    try {
        const file = req.file;
        const azureBlobUrl = await uploadFileToAzureBlob(file);
        res.json({ azureBlobUrl });
    } catch (error) {
        console.error('Error uploading to Azure:', error);
        res.status(500).send('Server error');
    }
});

async function uploadFileToAzureBlob(file) {
    if (!file || !file.originalname) {
        throw new Error('No file provided or file is missing name property.');
    }

    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blobName = new Date().getTime() + file.originalname;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    // Lee el archivo del sistema de archivos de forma asíncrona
    const fileData = await fs.readFile(file.path);
    
    // Pasa los datos del archivo a uploadData
    const uploadBlobResponse = await blockBlobClient.uploadData(fileData);
    console.log(uploadBlobResponse + '\n' + "Este es el uploadBlobResponse");
    
    // Establece el nivel de acceso del blob a "anónimo de solo lectura"
    await blockBlobClient.setAccessTier("Hot");  // Puedes cambiar "Cool" a "Hot" si prefieres ese nivel de acceso

    // Elimina el archivo temporal de forma asíncrona
    await fs.unlink(file.path);
    return blockBlobClient.url; // Esta es la URL que guardarás en la base de datos
}

const PORT = process.env.PORT || 3006;
app.listen(PORT, () => {
    console.log(`StorageService running on port ${PORT}`);
});
