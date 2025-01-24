const express = require('express');
const path = require('path');
const userController = require('./ControlUsuario');  // Importamos el controlador de usuarios
const { connectDB } = require('./db');  // Importamos la función de conexión a la base de datos

const app = express();
const port = 5000;

app.use(express.json());

// Conectar a la base de datos antes de iniciar el servidor
connectDB();

// Endpoint para registrar un nuevo usuario (usando la función del controlador)
app.post('/register', userController.registerUser);  // Usamos el controlador para manejar la ruta de registro

app.use(express.static(path.join(__dirname, '../public')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
