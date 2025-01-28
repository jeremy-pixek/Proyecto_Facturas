// ControlUsuario.js
const bcrypt = require('bcrypt');
require('dotenv').config();
const { client } = require('./db');  

// Lógica para registrar un nuevo usuario
async function registerUser(req, res) {

    const { name, password } = req.body;  // Obtener los datos del frontend (nombre y contraseña)

    try {
        const database = client.db('myDataBase'); 
        const collection = database.collection('users');

        // Verificar si el usuario ya existe
        const existingUser = await collection.findOne({ name: name });
        if (existingUser) {
            return res.status(400).send('El usuario ya existe');
        }

        // Encriptar la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear el nuevo usuario
        const newUser = {
            name: name,
            password: hashedPassword
        };

        // Insertar el nuevo usuario en la base de datos
        await collection.insertOne(newUser);
        console.log('Nuevo usuario registrado');

        res.status(201).send('Usuario registrado exitosamente');
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        res.status(500).send('Hubo un error al registrar el usuario');
    }
}

// Exporta la función para que pueda ser utilizada en otros archivos
module.exports = { registerUser };

async function loginUser(req, res) {
    const { name, password } = req.body;  // Obtener los datos del frontend (nombre y contraseña)

    try {
        const database = client.db('myDataBase'); 
        const collection = database.collection('users');

        // Verificar si el usuario existe
        const user = await collection.findOne({ name: name });
        if (!user) {
            return res.status(400).send('Usuario o contraseña incorrectos');
        }

        // Comparar la contraseña ingresada con la almacenada en la base de datos
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).send('Usuario o contraseña incorrectos');
        }

        // Generar un JWT para la sesión
        const token = jwt.sign(
            { userId: user._id, username: user.name }, // Datos que se incluirán en el token
            'tu_clave_secreta',  // Clave secreta para firmar el token (esto debe ser algo seguro y no se debe exponer)
            { expiresIn: '1h' }  // Expiración del token (1 hora en este caso)
        );

        // Devolver el token al cliente
        res.status(200).json({ message: 'Inicio de sesión exitoso', token: token });
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).send('Hubo un error al iniciar sesión');
    }
}

// Exportar las funciones para que puedan ser utilizadas en otros archivos
module.exports = { registerUser, loginUser };
