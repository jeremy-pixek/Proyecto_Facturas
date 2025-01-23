const express = require('express');
const path = require('path');
const app = express();
const port = 5000;  // El puerto que usará el backend

// Servir archivos estáticos (HTML, CSS, JS) desde la carpeta 'public'
app.use(express.static(path.join(__dirname, '../public')));

// Ejemplo de una ruta API
app.get('/api', (req, res) => {
});

// Redirigir todas las rutas al archivo index.html del frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor backend corriendo en http://localhost:${port}`);
});
