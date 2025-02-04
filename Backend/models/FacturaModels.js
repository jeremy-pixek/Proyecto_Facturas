const mongoose = require('mongoose');
const cors = require('cors');


const FacturaSchema = new mongoose.Schema({
    Cliente: String,
    Fecha: String,
    Detalles: [{
        Descripcion: String,
        Cantidad: Number,
        Precio: Number
    }],
});


const FacturaModel = mongoose.model('Factura', FacturaSchema);
























