const express = require('express');
const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');
const path = require('path');
require('dotenv').config();  // Para cargar las variables de entorno desde el archivo .env

const app = express();
const port = 5000;  // El puerto que usará el backend

app.use(express.json());  // Para recibir datos en formato JSON

// URI de conexión a MongoDB (utiliza el URI del archivo .env)
const uri = process.env.MONGODB_URI || "mongodb+srv://<JeremyAlexander>:<7799581-32>@cluster0.i3sqc.mongodb.net/";

// Crear la instancia de MongoClient
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Conexión a MongoDB y creación de usuario de prueba
async function createTestUser() {
  try {
    await client.connect(); // Conectar a MongoDB
    console.log('Conexión a MongoDB exitosa');

    // Nombre de la base de datos y colección
    const database = client.db('myDataBase');  // Aquí puedes cambiar el nombre de la base de datos
    const collection = database.collection('users'); // Aquí se usa la colección "users"

    // Encriptar la contraseña para mayor seguridad
    const hashedPassword = await bcrypt.hash('123456', 10);
    const newUser = {
      name: "Jeremy Amador",
      password: hashedPassword, // Guardar la contraseña encriptada
    };

    // Insertar el nuevo usuario en la base de datos
    await collection.insertOne(newUser);
    console.log('Usuario de prueba creado');

  } catch (error) {
    console.error('Error al crear el usuario de prueba:', error);
  }
}

// Llamar a la función para crear el usuario de prueba al inicio
createTestUser();

// Endpoint de login
app.post('/login', async (req, res) => {
  const { name, password } = req.body;  // Recibir nombre y contraseña desde el cuerpo de la petición

  try {
    await client.connect(); // Conectar a MongoDB
    const database = client.db('myDataBase');  // Usar la base de datos "myDataBase"
    const collection = database.collection('users'); // Usar la colección "users"

    // Buscar el usuario por email
    const user = await collection.findOne({ name });

    if (user) {
      // Comparar la contraseña con la encriptada en la base de datos
      const match = await bcrypt.compare(password, user.password);

      if (match) {
        res.status(200).send('Login exitoso');
      } else {
        res.status(401).send('Contraseña incorrecta');
      }
    } else {
      res.status(404).send('Usuario no encontrado');
    }
  } catch (error) {
    console.error('Error al procesar el login:', error);
    res.status(500).send('Error en el servidor');
  }
});

// Servir archivos estáticos (HTML, CSS, JS) desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Redirigir todas las rutas al archivo index.html del frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
