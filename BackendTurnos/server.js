require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
const personasRouter = require('./routes/personas.routes.js');
app.use('/api/personas', personasRouter);

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('¡API de BackendTurnos funcionando!');
});

// Conexión a MongoDB en memoria y arranque del servidor
async function startServer() {
    try {
        const mongoServer = await MongoMemoryServer.create();
        const uri = mongoServer.getUri();

        await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("Conexión con MongoDB en memoria establecida exitosamente");

        app.listen(PORT, () => {
            console.log(`Servidor corriendo en el puerto: ${PORT}`);
        });

    } catch (err) {
        console.error("Error al iniciar el servidor:", err);
        process.exit(1);
    }
}

startServer();
