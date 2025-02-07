const poolTransportedb = require('../Config/db');  // Conexión a la base de datos

// Obtener una factura por su ID
const obtenerFacturaPorId = async (id) => {
    const query = 'SELECT * FROM transportedb.facturas.cliente WHERE id = $1';
    const result = await poolTransportedb.query(query, [id]);
    return result.rows[0];  // Retorna la factura encontrada
};

// Obtener todos los productos de una factura
const obtenerProductosFactura = async (facturaId) => {
    const query = 'SELECT * FROM transportedb.facturas.productoFactura WHERE factura_id = $1';
    const result = await poolTransportedb.query(query, [facturaId]);
    return result.rows;  // Retorna los productos de la factura
};

// Obtener el total de la factura
const obtenerTotalFactura = async (facturaId) => {
    const query = 'SELECT SUM(total) AS total FROM transportedb.facturas.productoFactura WHERE factura_id = $1';
    const result = await poolTransportedb.query(query, [facturaId]);
    return result.rows[0].total;  // Retorna el total de la factura
};

// Crear una nueva factura
const crearFactura = async (facturaId, cliente, fecha) => {
    const query = `
        INSERT INTO transportedb.facturas.cliente (factura_id, cliente, fecha)
        VALUES ($1, $2, $3)
        RETURNING id;
    `;
    const values = [facturaId, cliente, fecha];
    const result = await poolTransportedb.query(query, values);
    return result.rows[0].id;  // Retorna el ID de la factura creada
};

// Guardar productos en una factura
const guardarProductosFactura = async (facturaId, productos) => {
    const query = `
        INSERT INTO transportedb.facturas.productoFactura (factura_id, producto, cantidad, precio, total)
        VALUES ($1, $2, $3, $4, $5);
    `;
    for (const producto of productos) {
        const values = [facturaId, producto.nombre, producto.cantidad, producto.precio, producto.total];
        await poolTransportedb.query(query, values);
    }
};

module.exports = {
    obtenerFacturaPorId,
    obtenerProductosFactura,
    obtenerTotalFactura,
    crearFactura,
    guardarProductosFactura,
};
