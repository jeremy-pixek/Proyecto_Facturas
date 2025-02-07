document.getElementById('agregar-producto').addEventListener('click', function () {
// Acumularemos los productos en un array
let productosFactura = [];

document.getElementById('agregar-producto').addEventListener('click', function () {
    // Obtener los datos de entrada
    const facturaId = document.getElementById('factura-id-input').value;
    const cliente = document.getElementById('cliente-input').value;
    const fecha = document.getElementById('fecha-input').value;
    const producto = document.getElementById('producto-input').value;
    const cantidad = parseInt(document.getElementById('cantidad-input').value);
    const precio = parseFloat(document.getElementById('precio-input').value);

    if (facturaId && cliente && fecha && producto && cantidad && precio) {
        // Calcular el total para ese producto
        const total = cantidad * precio;

        // Agregar el producto al array de productos de la factura
        productosFactura.push({ producto, cantidad, precio, total });

        // Crear una nueva fila en la tabla
        const tbody = document.getElementById('detalle-factura');
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${producto}</td>
            <td>${cantidad}</td>
            <td>${precio.toFixed(2)}</td>
            <td>${total.toFixed(2)}</td>
        `;
        tbody.appendChild(fila);

        // Actualizar el total general
        actualizarTotal();

        // Actualizar los datos de la factura
        document.getElementById('factura-id').innerText = 'Factura #' + facturaId;
        document.getElementById('cliente').innerText = 'Cliente: ' + cliente;
        document.getElementById('fecha').innerText = 'Fecha: ' + fecha;

        // Limpiar los campos de entrada después de agregar el producto
        document.getElementById('producto-input').value = '';
        document.getElementById('cantidad-input').value = '';
        document.getElementById('precio-input').value = '';
    } else {
        alert('Por favor, complete todos los campos.');
    }
});

// Función para enviar los datos al servidor
function guardarFacturaEnBaseDeDatos(facturaId, cliente, fecha) {
    const datosFactura = {
        facturaId: facturaId,
        cliente: cliente,
        fecha: fecha,
        productos: productosFactura // Ahora enviamos todos los productos
    };

    fetch('/guardar-factura', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datosFactura)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log('Factura guardada correctamente');
        } else {
            console.error('Error al guardar la factura');
        }
    })
    .catch(error => {
        console.error('Error en la conexión al servidor:', error);
    });
}});


function generarPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
  // Ocultar los botones "editar" y "eliminar" antes de generar el PDF
  const botonesEditar = document.querySelectorAll('.editar');
  const botonesEliminar = document.querySelectorAll('.eliminar');

  // Ocultar todos los botones de editar y eliminar
  botonesEditar.forEach(boton => boton.style.display = 'none');
  botonesEliminar.forEach(boton => boton.style.display = 'none');


    html2canvas(document.querySelector("#factura")).then(canvas => {
        const imgData = canvas.toDataURL("image/png");
        const imgWidth = 190;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        doc.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
        doc.save("factura.pdf");
        // Restaurar la visibilidad de los botones después de generar el PDF
      botonesEditar.forEach(boton => boton.style.display = 'inline-block');
      botonesEliminar.forEach(boton => boton.style.display = 'inline-block');
    });
}


// Evento para regresar a la página anterior
const backButton = document.getElementById('Regresar');
backButton.addEventListener('click', function () {
    window.history.back();
});

cargarFactura("");

function actualizarHistorial() {
    const historialLista = document.getElementById('historial-lista');
    historialLista.innerHTML = ''; // Limpiar lista antes de actualizar

    historial.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.acción}: ${item.producto} - Cantidad: ${item.cantidad}, Precio: ${item.precio.toFixed(2)}, Total: ${item.total.toFixed(2)}`;
        historialLista.appendChild(li);
    });
}

// Llamar a esta función después de cada acción para actualizar el historial
actualizarHistorial();


