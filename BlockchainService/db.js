const mongoose = require('mongoose');

// Habilita la depuración de Mongoose para ver las operaciones en la consola
mongoose.set('debug', true);

const connectDB = async () => {
    try {
        const mongoURI = 'mongodb+srv://rdipaolaj:I6v7oE7mhjXEcFNe@clustertangle.dy18lpe.mongodb.net/tangle';
        // Opciones ajustadas para la versión actual de Mongoose y MongoDB
        const options = {
            serverSelectionTimeoutMS: 5000, // Tiempo de espera para la selección del servidor
        };

        await mongoose.connect(mongoURI, options);
        console.log('MongoDB Connected Successfully');
    } catch (err) {
        console.error('MongoDB Connection Error:', err);
        process.exit(1); // Sale del proceso con un estado de error
    }
};

module.exports = connectDB;

