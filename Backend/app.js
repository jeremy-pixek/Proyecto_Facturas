const express = require('express');
const path = require('path');
const ControlUsuario = require('./ControlUsuario');  // Controlador con la lógica del registro
const { connectDB } = require('./db');  // Función de conexión a la base de datos

const app = express();
const port = 5000;

// Middleware para recibir datos en formato JSON
app.use(express.json());

// Conectar a la base de datos
connectDB();

// Ruta para registrar un usuario
app.post('/backend/ControlUsuario', ControlUsuario.registerUser);  // Usamos el controlador para manejar el registro

// Servir los archivos estáticos desde la carpeta "public"
app.use(express.static(path.join(__dirname, '../public')));

// Enviar el archivo "index.html" si no se encuentra la ruta específica
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
