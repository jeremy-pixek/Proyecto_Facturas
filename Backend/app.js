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



app.use('/api', facturaRoutes);

// Ruta para guardar una factura
app.post('/guardar-factura', async (req, res) => {
    const { cliente, fecha, productos } = req.body;

    const client = await poolProyecto_Factura.connect();
    try {
        await client.query('BEGIN');

        // 1. Insertar la factura (cliente) para generar el factura_id
        const queryCliente = `
            INSERT INTO Proyecto_Facturas.facturas.cliente (cliente, fecha)
            VALUES ($1, $2) RETURNING factura_id;
        `;
        const valuesCliente = [cliente, fecha];
        const resultCliente = await client.query(queryCliente, valuesCliente);
        const facturaId = resultCliente.rows[0].factura_id;  // Obtener el factura_id generado

        // 2. Insertar los productos en la tabla productosFactura usando el factura_id
        const queryProducto = `
            INSERT INTO Proyecto_Facturas.facturas.productosFactura (factura_id, producto, cantidad, precio, total)
            VALUES ($1, $2, $3, $4, $5)
        `;
        
        for (const producto of productos) {
            const valuesProducto = [facturaId, producto.nombre, producto.cantidad, producto.precio, producto.total];
            await client.query(queryProducto, valuesProducto);
        }

        // Confirmar la transacción
        await client.query('COMMIT');

        // Devolver el factura_id generado para mostrarlo en el frontend
        res.json({ success: true, facturaId });

    } catch (error) {
        // Si algo falla, revertimos la transacción
        await client.query('ROLLBACK');
        console.error('Error al guardar la factura:', error);
        res.json({ success: false, message: 'Error al guardar la factura' });
    } finally {
        client.release();
    }
});

app.post('/guardar-factura', async (req, res) => {
    const { facturaId, cliente, fecha, productos } = req.body;

    if (!facturaId || !cliente || !fecha || !productos || productos.length === 0) {
        return res.status(400).json({ success: false, message: 'Faltan datos de la factura' });
    }

    const client = await poolProyecto_Factura.connect();

    try {
        await client.query('BEGIN');  // Iniciar transacción

        // Guardamos la factura
        const facturaQuery = `
            INSERT INTO Proyecto_Facturas.facturas.cliente (factura_id, cliente, fecha)
            VALUES ($1, $2, $3) RETURNING id;
        `;
        const facturaValues = [facturaId, cliente, fecha];
        const facturaResult = await client.query(facturaQuery, facturaValues);
        const facturaIdGuardada = facturaResult.rows[0].id;  // Obtener el ID de la factura recién insertada

        // Guardamos los productos de la factura
        for (const producto of productos) {
            const productoQuery = `
                INSERT INTO Proyecto_Facturas.facturas.productosFactura (factura_id, producto, cantidad, precio, total)
                VALUES ($1, $2, $3, $4, $5);
            `;
            const productoValues = [
                facturaIdGuardada,  // Referencia a la factura recién insertada
                producto.producto,
                producto.cantidad,
                producto.precio,
                producto.total
            ];
            await client.query(productoQuery, productoValues);
        }

        await client.query('COMMIT');  // Confirmar la transacción
        res.status(200).json({ success: true, message: 'Factura guardada correctamente' });
    } catch (error) {
        await client.query('ROLLBACK');  // Si algo falla, revertimos la transacción
        console.error('Error al guardar la factura:', error);
        res.status(500).json({ success: false, message: 'Error al guardar la factura' });
    } finally {
        client.release();  // Liberamos la conexión
    }
});

// Ruta para registrar un usuario
app.post('/backend/registro', ControlUsuario.registerUser);  // Usamos el controlador para manejar el registro
app.post('/backend/login', ControlUsuario.loginUser); // Este es el URL que deberías consumir.

// Servir los archivos estáticos desde la carpeta "public"
app.use(express.static(path.join(__dirname, '../public')));

// Enviar el archivo "login.html" si no se encuentra la ruta específica
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/login.html'));
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
