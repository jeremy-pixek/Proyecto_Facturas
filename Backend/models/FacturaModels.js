const poolProyecto_Factura = require('C:/Users/USUARIO/OneDrive/Escritorio/Proyecto_Facturas/Backend/Config/db');  // Conexión a la base de datos

// Obtener una factura por su ID
const obtenerFacturaPorId = async (id) => {
    const query = 'SELECT * FROM Proyecto_Facturas.facturas.cliente WHERE id = $1';
    const result = await poolProyecto_Factura.query(query, [id]);
    return result.rows[0];  // Retorna la factura encontrada
};

// Obtener todos los productos de una factura
const obtenerProductosFactura = async (facturaId) => {
    const query = 'SELECT * FROM Proyecto_Facturas.facturas.productosFactura WHERE factura_id = $1';
    const result = await poolProyecto_Factura.query(query, [facturaId]);
    return result.rows;  // Retorna los productos de la factura
};

// Obtener el total de la factura
const obtenerTotalFactura = async (facturaId) => {
    const query = 'SELECT SUM(total) AS total FROM Proyecto_Facturas.facturas.productosFactura WHERE factura_id = $1';
    const result = await poolProyecto_Factura.query(query, [facturaId]);
    return result.rows[0].total;  // Retorna el total de la factura
};

// Crear una nueva factura
const crearFactura = async (facturaId, cliente, fecha) => {
    const query = `
        INSERT INTO Proyecto_Facturas.facturas.cliente (cliente, fecha)
        VALUES ($1, $2)
        RETURNING id;
    `;
    const values = [facturaId, cliente, fecha];
    const result = await poolProyecto_Factura.query(query, values);
    return result.rows[0].id;  // Retorna el ID de la factura creada
};

// Guardar productos en una factura
const guardarProductosFactura = async (facturaId, productos) => {
    const query = `
        INSERT INTO Proyecto_Facturas.facturas.productosFactura (factura_id, producto, cantidad, precio, total)
        VALUES ($1, $2, $3, $4, $5);
    `;
    for (const producto of productos) {
        const values = [facturaId, producto.nombre, producto.cantidad, producto.precio, producto.total];
        await poolProyecto_Factura.query(query, values);
    }
};

module.exports = {
    obtenerFacturaPorId,
    obtenerProductosFactura,
    obtenerTotalFactura,
    crearFactura,
    guardarProductosFactura,
};
