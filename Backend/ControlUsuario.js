// ControlUsuario.js
const bcrypt = require('bcrypt');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const { client } = require('./db');  
const Notiflix = require('notiflix');

//******************************************* Registrar usuario ******************************************************** */
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


//****************************************************** Inicio de sesion **************************************************************** */


async function loginUser(req, res) {
    const { name, password } = req.body;  // Obtener los datos del frontend (nombre y contraseña)

    try {
        const database = client.db('myDataBase'); 
        const collection = database.collection('users');

        // Verificar si el usuario existe
        const user = await collection.findOne({ name: name });  // Asegúrate de esperar la respuesta de la base de datos
        if (!user) {
            return res.status(400).json({ message: 'Usuario o contraseña incorrectos' });
        }

        // Comparar la contraseña ingresada con la almacenada en la base de datos
        try {
            console.log('Contraseña proporcionada:', password);
            console.log('Hash almacenado:', user.password);

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(400).json({ message: 'Usuario o contraseña incorrectos' });
            }

        } catch (err) {
            console.error('Error al comparar contraseñas', err);
            return res.status(500).json({ message: 'Error interno al comparar contraseñas', error: err.message });
        }

        // Generar un JWT para la sesión
        const token = jwt.sign(
            { username: user.name }, // Datos que se incluirán en el token
            process.env.SESSION_SECRET,  
            { expiresIn: '2h' }  
        );

        // Devolver el token al cliente
        res.status(200).json({ message: 'Inicio de sesión exitoso', token: token });
    } catch (error) {
        console.log('Error al iniciar sesión:', error);
        res.status(500).json({ message: 'Hubo un error al iniciar sesión', error: error.message });
    }
}

module.exports = { registerUser, loginUser };
