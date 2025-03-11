const express = require('express');
const session = require('express-session');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser'); // Asegúrate de tener esta importación para bodyParser
const ControlUsuario = require('./Controllers/ControlUsuario');
const facturaRoutes = require('./routes/FacturaRoutes');
const { poolProyecto_Factura } = require('C:/Users/USUARIO/OneDrive/Escritorio/Proyecto_Facturas/Backend/Config/db');  // Asegúrate de que el pool de PostgreSQL esté importado correctamente
const dotenv = require('dotenv');  // Para cargar variables de entorno
dotenv.config();  // Cargar las variables de entorno

const app = express();
const port = 5000;

// Middleware para recibir datos en formato JSON
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // Asegúrate de que bodyParser esté configurado aquí

// Configuración de express-session para manejar sesiones
app.use(session({
    secret: process.env.SESSION_SECRET,  // Clave secreta para firmar las sesiones
    resave: false,                       // No volver a guardar la sesión si no ha cambiado
    saveUninitialized: true,             // Guardar sesiones que no están inicializadas
    cookie: { secure: false }            // Si estás usando HTTPS, pon esto en 'true'
}));

// Conectar a la base de datos (asegurándote que la función connectDB esté en db.js)

app.use('/api', facturaRoutes);

// Ruta para guardar una factura




// Ruta para registrar un usuario
app.post('/backend/registro', ControlUsuario.registerUser);  // Usamos el controlador para manejar el registro
app.post('/backend/login', ControlUsuario.loginUser); // Este es el URL que deberías consumir.

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
