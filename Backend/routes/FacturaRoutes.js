const express = require('express');
const { guardarFactura, generarFacturaPDF } = require('../Controllers/FacturaController'); // Verifica que la ruta sea correcta

const router = express.Router();

// Ruta para guardar la factura
router.post('/guardar-factura', guardarFactura);

// Ruta para generar el PDF de la factura
router.get('/factura/:id/pdf', generarFacturaPDF);  // Asegúrate de que 'generarFacturaPDF' esté definido y exportado en el controlador

module.exports = router;