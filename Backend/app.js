const express = require('express');
const session = require('express-session');
const path = require('path');
const ControlUsuario = require('./ControlUsuario');  // Controlador con la lógica del registro
const { connectDB } = require('./db');  // Función de conexión a la base de datos
const dotenv = require('dotenv');  // Para cargar variables de entorno

dotenv.config();  // Cargar las variables de entorno

const app = express();
const port = 5000;

// Middleware para recibir datos en formato JSON
app.use(express.json());

// Configuración de express-session para manejar sesiones
app.use(session({
    secret: process.env.SESSION_SECRET,  // Clave secreta para firmar las sesiones
    resave: false,                      // No volver a guardar la sesión si no ha cambiado
    saveUninitialized: true,            // Guardar sesiones que no están inicializadas
    cookie: { secure: false }           // Si estás usando HTTPS, pon esto en 'true'
}));

// Conectar a la base de datos
connectDB();

// Ruta para registrar un usuario
app.post('/backend/ControlUsuario', ControlUsuario.registerUser);  // Usamos el controlador para manejar el registro
app.post('/backend/login', ControlUsuario.loginUser);



// Ruta para iniciar sesión y crear la sesión
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Aquí validas el usuario y la contraseña con la base de datos (ejemplo)
    // Supongamos que la autenticación es correcta:
    if (username === 'name' && password === 'password') {
        // Almacenamos el usuario en la sesión
        req.session.user = { username };
        res.send('Inicio de sesión exitoso');
    } else {
        res.status(401).send('Credenciales incorrectas');
    }
});

// Ruta protegida: solo accesible si el usuario está autenticado
app.get('/inicio', (req, res) => {
    if (req.session.user) {
        res.send(`Bienvenido ${req.session.user.username}`);
    } else {
        res.status(401).send('No estás autenticado');
    }
});

// Servir los archivos estáticos desde la carpeta "public"
app.use(express.static(path.join(__dirname, '../public')));

// Enviar el archivo "index.html" si no se encuentra la ruta específica
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/login.html'));
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
