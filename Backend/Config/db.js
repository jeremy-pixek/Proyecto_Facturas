const { Pool } = require('pg');  // Asegúrate de usar 'Pool', que es el constructor para crear una instancia de pool.

const poolProyecto_Factura = new Pool({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'Jeremy05089?',
    database: 'Proyecto_Facturas'
});

poolProyecto_Factura.connect()
    .then(() => console.log("Conectado a la base de datos"))
    .catch(err => console.log("Error al conectar a la base de datos", err));

module.exports = { poolProyecto_Factura }; 
