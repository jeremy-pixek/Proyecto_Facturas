const Factura = require('/models/FacturaModels');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');


exports.obtenerFacturas = async (req, res) => {
    try {
        const facturas = await Factura.find();
        res.json(facturas);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener las facturas", error });
    }
};


exports.obtenerFacturaPorId = async (req, res) => {
    try {
        const factura = await Factura.findById(req.params.id);
        if (!factura) return res.status(404).json({ mensaje: "Factura no encontrada" });
        res.json(factura);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener la factura", error });
    }
}
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
            const factura = await Factura.findById(req.params.id);
        } catch (error) {
            res.status(500).json({ mensaje: "Error al generar la factura", error });
        }
    }
};