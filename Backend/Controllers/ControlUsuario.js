const bcrypt = require('bcrypt');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const { poolTransportedb } = require('C:/Users/TECNOSUM/Desktop/Proyecto/backend/config/db');  // Importa el pool de conexiones

//******************************************* Registrar usuario ******************************************************** */
async function registerUser(req, res) {
    const { nombre, contraseña } = req.body;  // Obtener los datos del frontend (nombre y contraseña)

    try {
        // Verificar si el usuario ya existe
        const checkUserQuery = 'SELECT * FROM transportedb.login.usuarios WHERE nombre = $1';  // Asegúrate de tener una tabla de usuarios en PostgreSQL
        const checkUserValues = [nombre];

        const existingUserResult = await poolTransportedb.query(checkUserQuery, checkUserValues);


        if (existingUserResult.rows.length > 0) {
            return res.status(400).send('El usuario ya existe');
        }

        // Encriptar la contraseña
        const hashedPassword = await bcrypt.hash(contraseña, 10);

        // Crear el nuevo usuario
        const insertUserQuery = `
            INSERT INTO transportedb.login.usuarios (nombre, contraseña)
            VALUES ($1, $2)
        `;
        const insertUserValues = [nombre, hashedPassword];

        // Insertar el nuevo usuario en la base de datos
        await poolTransportedb.query(insertUserQuery, insertUserValues);
        console.log('Nuevo usuario registrado');

        res.status(201).send('Usuario registrado exitosamente');
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        res.status(500).send('Hubo un error al registrar el usuario');
    }
}

//****************************************************** Inicio de sesion ****************************************************** */

async function loginUser(req, res) {
    const { nombre, contraseña } = req.body;  // Obtener los datos del frontend (nombre y contraseña)

    try {
        // Verificar si el usuario existe
        const getUserQuery = 'SELECT * FROM transportedb.login.usuarios WHERE nombre = $1';  // Asegúrate de tener una tabla de usuarios en PostgreSQL
        const getUserValues = [nombre];

        const userResult = await poolTransportedb.query(getUserQuery, getUserValues);

        if (userResult.rows.length === 0) {
            return res.status(400).json({ message: 'Usuario o contraseña incorrectos' });
        }

        const user = userResult.rows[0];  // Obtener el primer usuario si existe

        // Comparar la contraseña ingresada con la almacenada en la base de datos
        const isPasswordValid = await bcrypt.compare(contraseña, user.contraseña);
        if (!isPasswordValid) {
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
