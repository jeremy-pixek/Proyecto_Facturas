const bcrypt = require('bcrypt');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const { poolProyecto_Factura } = require('C:/Users/USUARIO/OneDrive/Escritorio/Proyecto_Facturas/Backend/Config/db');  // Importa el pool de conexiones

//******************************************* Registrar usuario ******************************************************** */
// Funcion para insertar logs


async function logEvent(accion, detalles, estado) {
    const logQuery = `
        INSERT INTO Historial.logs (accion, detalles, estado)
        VALUES ($1, $2, $3)
    `;
    const logValues = [accion, detalles, estado];

    try {
        await poolProyecto_Factura.query(logQuery, logValues);
    } catch (logError) {
        console.error('Error al registrar log:', logError);
    }
}

async function registerUser(req, res) {
    const { nombre, contraseña } = req.body;  // Obtener los datos del frontend (nombre y contraseña)
    try {

        // Encriptar la contraseña
        const hashedPassword = await bcrypt.hash(contraseña, 10);

        // Crear el nuevo usuario
        const insertUserQuery = `
            INSERT INTO login.usuarios (nombre, contraseña)
            VALUES ($1, $2)
        `;

        const insertUserValues = [nombre, hashedPassword];
        // Insertar el nuevo usuario en la base de datos
        await poolProyecto_Factura.query(insertUserQuery, insertUserValues);
        console.log('Nuevo usuario registrado');


    } catch (error) {
        console.error('Error al registrar usuario:', error.message);

        // Insertar un log de error
        await logEvent('Registro de usuario', `Nombre: ${nombre}, Error: ${error.message}`, 'fallido');
    }
}

//****************************************************** Inicio de sesion ****************************************************** */

async function logEvent(accion, detalles, estado) {
    const logQuery = `
        INSERT INTO Historial.logs (accion, detalles, estado)
        VALUES ($1, $2, $3)
    `;
    const logValues = [accion, detalles, estado];

    try {
        // Insertar el log en la base de datos
        await poolProyecto_Factura.query(logQuery, logValues);
    } catch (logError) {
        // Si no se puede insertar el log, imprimir el error
        console.error('Error al registrar log:', logError);
    }
}


async function loginUser(req, res) {
    const { nombre, contraseña } = req.body;  

    try {
        // Verificar si el usuario existe
        const getUserQuery = 'SELECT * FROM login.usuarios WHERE nombre = $1';  
        const getUserValues = [nombre];

        const userResult = await poolProyecto_Factura.query(getUserQuery, getUserValues);

        if (userResult.rows.length === 0) {
            // Registrar intento de inicio de sesión fallido
            await logEvent('Intento de inicio de sesión', `Usuario: ${nombre}`, 'fallido');
            return res.status(400).json({ message: 'Usuario o contraseña incorrectos' });
        }

        const user = userResult.rows[0];  // Obtener el primer usuario si existe

        // Comparar la contraseña ingresada con la almacenada en la base de datos
        const isPasswordValid = await bcrypt.compare(contraseña, user.contraseña);
        if (!isPasswordValid) {
            // Registrar intento de inicio de sesión fallido
            await logEvent('Intento de inicio de sesión', `Usuario: ${nombre}, Contraseña incorrecta`, 'fallido');
            return res.status(400).json({ message: 'Usuario o contraseña incorrectos' });
        }

        // Generar un JWT para la sesión
        const token = jwt.sign(
            { nombre: user.nombre }, // Datos que se incluirán en el token
            process.env.SESSION_SECRET,
            { expiresIn: '2h' }  // Expiración del token
        );

        // Devolver el token al cliente
        res.status(200).json({ message: 'Inicio de sesión exitoso', token: token });
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({ message: 'Hubo un error al iniciar sesión', error: error.message });
    }
}
module.exports = { registerUser, loginUser };
