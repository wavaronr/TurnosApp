require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
const personasRouter = require('./routes/personas.routes.js');
const programmingRouter = require('./routes/programming.routes.js'); // Importar rutas de programación

app.use('/api/personas', personasRouter);
app.use('/api/programming', programmingRouter); // Usar rutas de programación

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('¡API de BackendTurnos funcionando!');
});

// --- Conexión a MongoDB y arranque del servidor ---

// Usar la URI de la variable de entorno. Esto es mucho más seguro y flexible.
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('Error: La variable de entorno MONGODB_URI no está definida.');
    console.error('Por favor, añade tu cadena de conexión de MongoDB Atlas a un archivo .env');
    process.exit(1);
}

mongoose.connect(MONGODB_URI, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
})
.then(() => {
    console.log("Conexión con MongoDB establecida exitosamente");
    // Solo iniciar el servidor si la conexión a la base de datos es exitosa
    app.listen(PORT, () => {
        console.log(`Servidor corriendo en el puerto: ${PORT}`);
    });
})
.catch(err => {
    console.error("Error al conectar con MongoDB:", err);
    process.exit(1); // Salir del proceso si no se puede conectar a la BD
});
