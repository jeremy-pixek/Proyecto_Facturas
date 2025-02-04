const express = require('express');
const router = express.Router();
const facturaController = require('/controllers/facturaController');

router.get('/', facturaController.obtenerFacturas);

router.get('/:id', facturaController.obtenerFacturaPorId);

router.post('/', facturaController.crearFactura);

router.put('/:id', facturaController.actualizarFactura);

router.delete('/:id', facturaController.eliminarFactura);

router.get('/:id/pdf', facturaController.generarFacturaPDF);

module.exports = router;




















