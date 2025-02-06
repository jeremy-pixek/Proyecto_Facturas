document.getElementById('Salir').addEventListener('click', function() {
    // Elimina el token JWT del localStorage
    localStorage.removeItem('authToken');  // Ajusta 'authToken' si tu clave es diferente

    // Redirige al usuario a la página de login
    window.location.href = '/login';  // Cambia '/login' por la URL de tu página de login
});
