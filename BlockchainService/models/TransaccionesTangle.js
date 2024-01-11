// En archivo models/TransaccionesTangle.js
const mongoose = require('mongoose');

const transaccionesTangleSchema = new mongoose.Schema({
    usuarioId: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' },
    hashSHA3: String,
    blockId: String,
    fechaTransaccion: { type: Date, default: Date.now },
    protocolVersion: Number,
    parents: [String],  // Suponiendo que es un array de strings
    payloadType: Number,
    payloadTag: String,
    payloadData: String,
    nonce: String,
    archivoCifradoURL: String
}, { versionKey: false });

const TransaccionesTangle = mongoose.model('TransaccionesTangle', transaccionesTangleSchema);

module.exports = TransaccionesTangle;
