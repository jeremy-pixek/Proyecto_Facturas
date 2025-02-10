// Acumularemos los productos en un array
let productosFactura = [];

document.getElementById('agregar-producto').addEventListener('click', function () {
    // Obtener los datos de entrada
    const cliente = document.getElementById('cliente-input').value;
    const fecha = document.getElementById('fecha-input').value;
    const producto = document.getElementById('producto-input').value;
    console.log("Producto recibido:", producto);
    const cantidad = parseInt(document.getElementById('cantidad-input').value);
    const precio = parseFloat(document.getElementById('precio-input').value);

    if (cliente && fecha && producto && cantidad && precio) {
        // Calcular el total para ese producto
        const total = cantidad * precio;

        // Agregar el producto al array de productos de la factura
        productosFactura.push({ producto, cantidad, precio, total });
        console.log("Producto recibido:", productosFactura);

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

        // Llamar a la función para actualizar el total
        actualizarTotal();



        // Limpiar los campos de entrada después de agregar el producto
        document.getElementById('producto-input').value = '';
        document.getElementById('cantidad-input').value = '';
        document.getElementById('precio-input').value = '';

        // Enviar la factura y los productos al backend (si es la primera vez)
        guardarFacturaEnBaseDeDatos(cliente, fecha, productosFactura);
    } else {
        alert('Por favor, complete todos los campos.');
    }
});

function actualizarTotal() {
    // Sumar los totales de todos los productos
    const totalFactura = productosFactura.reduce((total, producto) => total + producto.total, 0);

    // Asegurarse de que el elemento existe antes de intentar modificarlo
    const totalElement = document.getElementById('total');
    if (totalElement) {
        totalElement.innerText = `Total: $${totalFactura.toFixed(2)}`;
    } else {
        console.error('El elemento con id "total" no se encuentra en el HTML.');
    }
}

// Función para enviar los datos de la factura al servidor
function guardarFacturaEnBaseDeDatos(cliente, fecha, productos) {
    const datosFactura = {
        cliente: cliente,
        fecha: fecha,
        productos: productos // Solo enviamos los productos
    };

    // Enviar los datos de la factura al servidor
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
            // Aquí obtienes el facturaId devuelto por el servidor
            const facturaId = data.facturaIdGuardada;  // Asegúrate de que el backend devuelva facturaId

            console.log('Factura guardada con éxito, ID:', facturaId);

            // Ahora, con el facturaId disponible, podemos guardar los productos
            productos.forEach(producto => {
                const valuesProducto = [facturaId, producto.nombre, producto.cantidad, producto.precio, producto.total];

                // Imprimir los valores del producto para depuración
                console.log('Valores del producto:', valuesProducto);

                // Enviar el producto al servidor
                fetch('/guardar-producto', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ valuesProducto })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        console.log('Producto guardado con éxito');
                    } else {
                        console.error('Error al guardar el producto:', data.message);
                    }
                })
                .catch(error => {
                    console.error('Error en la conexión al servidor:', error);
                });
            });

        } else {
            console.error('Error al guardar la factura:', data.message);
        }
    })
    .catch(error => {
        console.error('Error en la conexión al servidor:', error);
    });
}


function generarPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();


    html2canvas(document.querySelector("#factura")).then(canvas => {
        const imgData = canvas.toDataURL("image/png");
        const imgWidth = 190;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        doc.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
        doc.save("factura.pdf");

    });
}

// Evento para regresar a la página anterior
const backButton = document.getElementById('Regresar');
backButton.addEventListener('click', function () {
    window.history.back();
});

// Llamar a la función cargarFactura
function cargarFactura(facturaId) {
    console.log('Cargando factura con ID:', facturaId);

    // Aquí puedes hacer otra solicitud para obtener los detalles de la factura si lo necesitas
    fetch(`/obtener-factura/${facturaId}`)
        .then(response => response.json())
        .then(factura => {
            // Actualizar la información básica de la factura
            document.getElementById('cliente').innerText = `Cliente: ${factura.cliente}`;
            document.getElementById('fecha').innerText = `Fecha: ${factura.fecha}`;

            // Ahora agregar los productos de la factura
            const tbody = document.getElementById('detalle-factura');
            tbody.innerHTML = '';  // Limpiar las filas anteriores si las hay

            factura.productos.forEach(producto => {
                const fila = document.createElement('tr');
                fila.innerHTML = `
                    <td>${producto.producto}</td>
                    <td>${producto.cantidad}</td>
                    <td>${producto.precio.toFixed(2)}</td>
                    <td>${producto.total.toFixed(2)}</td>
                `;
                tbody.appendChild(fila);
            });

            // Si también quieres mostrar el total, puedes actualizarlo aquí
            actualizarTotal();
        })
        .catch(error => {
            console.error('Error al cargar la factura:', error);
        });
}
