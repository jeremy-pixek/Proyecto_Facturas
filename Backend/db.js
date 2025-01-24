const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI || "mongodb+srv://JeremyAlexander:7799581-32@cluster0.i3sqc.mongodb.net/";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Conectar a la base de datos
async function connectDB() {
    try {
        await client.connect();
        console.log('Conexión a MongoDB exitosa');
    } catch (error) {
        console.error('Error al conectar con MongoDB:', error);
    }
}

// Exportar la función de conexión y el cliente
module.exports = { connectDB, client };
