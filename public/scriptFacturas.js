async function cargarFactura(id) {
    try {
        const response = await fetch('http://localhost:5000/factura/${id}');
        const factura = await response.json();

        document.getElementById("factura-id").textContent = `Factura #${factura._id}`;
        document.getElementById("cliente").textContent = `Cliente: ${factura.cliente}`;
        document.getElementById("fecha").textContent = `Fecha: ${factura.fecha}`;

        let total = 0;
        let detalleHTML = "";

        factura.detalles.forEach(item => {
            let subtotal = item.cantidad * item.precio;
            total += subtotal;
            detalleHTML += `<tr>
                <td>${item.descripcion}</td>
                <td>${item.cantidad}</td>
                <td>$${item.precio.toFixed(2)}</td>
                <td>$${subtotal.toFixed(2)}</td>
            </tr>`;
        });

        document.getElementById("detalle-factura").innerHTML = detalleHTML;
        document.getElementById("total").innerHTML = <strong>$${total.toFixed(2)}</strong>;
    } catch (error) {
        console.error("Error al cargar la factura:", error);
    }
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


const backButton = document.getElementById('button-Regresar');
backButton.addEventListener('click', function () {
    window.history.back();
});

// Cargar una factura con un ID específico de MongoDB (reemplázalo con un ID real)
cargarFactura("65e4a7f8b28c5e0012345678");