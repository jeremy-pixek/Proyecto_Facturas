const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const poolTransportedb = require('C:/Users/TECNOSUM/Desktop/Proyecto/backend/config/db');  // Conexión a la base de datos

exports.guardarFactura = async (req, res) => {
    const { cliente, fecha, productos } = req.body;

    const client = await poolTransportedb.connect();
    try {
        await client.query('BEGIN');

        // Insertar la factura sin factura_id (autoincrementable)
        const insertFacturaQuery = `
            INSERT INTO transportedb.facturas.cliente (cliente, fecha)
            VALUES ($1, $2) RETURNING factura_id;
        `;
        const insertFacturaValues = [cliente, fecha];
        const insertFacturaResult = await client.query(insertFacturaQuery, insertFacturaValues);

        // Recuperamos el factura_id generado
        const facturaIdGuardada = insertFacturaResult.rows[0].factura_id;  
        console.log('Factura ID Generada:', facturaIdGuardada);  // Imprimir el ID generado

        // Guardar los productos relacionados a esa factura
        for (const producto of productos) {
            const insertProductoQuery = `
                INSERT INTO transportedb.facturas.productosFactura (factura_id, producto, cantidad, precio, total)
                VALUES ($1, $2, $3, $4, $5);
            `;
            const productoValues = [facturaIdGuardada, producto.nombre, producto.cantidad, producto.precio, producto.total];
            console.log('Valores para la inserción del producto:', valuesProducto);

            await client.query(insertProductoQuery, productoValues);
        }

        await client.query('COMMIT');
        
        // Devolvemos el número de factura para mostrarlo en el frontend
        res.status(200).json({ success: true, facturaId: facturaIdGuardada });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error(error);
        res.status(500).json({ success: false, message: 'Error al guardar la factura' });
    } finally {
        client.release();
    }
};
exports.obtenerFacturaPorId = async (req, res) => {
    const { id } = req.params;
    try {
        const query = `SELECT * FROM transportedb.facturas.cliente WHERE id = $1`;
        const result = await poolTransportedb.query(query, [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ mensaje: "Factura no encontrada" });
        }
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener la factura", error });
    }
};

exports.crearFactura = async (req, res) => {
    try {
        const nuevaFactura = new Factura(req.body);
        await nuevaFactura.save();
        res.status(201).json(nuevaFactura);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al crear la factura", error });
    }
};

exports.actualizarFactura = async (req, res) => {
    try {
        const facturaActualizada = await Factura.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!facturaActualizada) return res.status(404).json({ mensaje: "Factura no encontrada" });
        res.json(facturaActualizada);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al actualizar la factura", error });
    }
};

exports.eliminarFactura = async (req, res) => {
    try {
        const facturaEliminada = await Factura.findByIdAndDelete(req.params.id);
        if (!facturaEliminada) return res.status(404).json({ mensaje: "Factura no encontrada" });
        res.json({ mensaje: "Factura eliminada correctamente" });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al eliminar la factura", error });
    }
};

exports.generarFacturaPDF = async (req, res) => {
    try {
        const { factura_id } = req.params;

        // Consultar la base de datos para obtener los detalles de la factura
        const facturaQuery = `SELECT * FROM transportedb.facturas.cliente WHERE factura_id = $1`;
        const facturaResult = await poolTransportedb.query(facturaQuery, [factura_id]);
        if (facturaResult.rows.length === 0) {
            return res.status(404).json({ mensaje: "Factura no encontrada" });
        }

        const factura = facturaResult.rows[0];

        // Crear el PDF
        const doc = new PDFDocument();
        const filePath = path.join(__dirname, '../facturas', `factura_${factura.id}.pdf`);  // Usa factura.factura_id aquí si es necesario
        doc.fontSize(20).text(`Factura #${factura.factura_id}`, { align: 'center' });

        doc.fontSize(20).text(`Factura #${factura.factura_id}`, { align: 'center' });
        doc.fontSize(12).text(`Cliente: ${factura.cliente}`);
        doc.fontSize(12).text(`Fecha: ${factura.fecha}`);

        // Obtener los productos asociados a la factura
        const productosQuery = `SELECT * FROM transportedb.facturas.productosFactura WHERE factura_id = $1`;
        const productosResult = await poolTransportedb.query(productosQuery, [factura.id]);

        doc.text('Productos:', { underline: true });
        productosResult.rows.forEach((producto, index) => {
            doc.text(`${index + 1}. ${producto.producto} - Cantidad: ${producto.cantidad}, Precio: $${producto.precio.toFixed(2)}, Total: $${producto.total.toFixed(2)}`);
        });

        // Calcular el total general
        const totalFacturaQuery = `SELECT SUM(total) AS total FROM transportedb.facturas.productosFactura WHERE factura_id = $1`;
        const totalFacturaResult = await poolTransportedb.query(totalFacturaQuery, [factura.id]);
        doc.text(`Total: $${totalFacturaResult.rows[0].total.toFixed(2)}`, { align: 'right' });

        doc.end();

        // Enviar el archivo PDF generado al cliente
        res.sendFile(filePath);
    } catch (error) {
        console.error('Error al generar la factura PDF:', error);
        res.status(500).json({ mensaje: "Error al generar el PDF", error });
    }
};
