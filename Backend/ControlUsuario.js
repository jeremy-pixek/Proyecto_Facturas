// ControlUsuario.js
const bcrypt = require('bcrypt');
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
