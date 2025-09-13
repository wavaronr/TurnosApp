require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Conexión a MongoDB
const uri = process.env.MONGO_URI;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const connection = mongoose.connection;
connection.once('open', () => {
    console.log("Conexión con MongoDB establecida exitosamente");
});
connection.on('error', (err) => {
    console.log("Error de conexión con MongoDB:", err);
    process.exit();
});

// Rutas
const personasRouter = require('./routes/personas.routes.js');
app.use('/api/personas', personasRouter);


// Ruta de prueba
app.get('/', (req, res) => {
    res.send('¡API de BackendTurnos funcionando!');
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto: ${PORT}`);
});
