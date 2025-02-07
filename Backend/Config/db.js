const { Pool } = require('pg');  // Asegúrate de usar 'Pool', que es el constructor para crear una instancia de pool.

const poolTransportedb = new Pool({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'Jeremy05089',
    database: 'transportedb'
});

poolTransportedb.connect()
    .then(() => console.log("Conectado a la base de datos"))
    .catch(err => console.log("Error al conectar a la base de datos", err));

module.exports = { poolTransportedb };  // Exporta la instancia para usarla en otros archivos
