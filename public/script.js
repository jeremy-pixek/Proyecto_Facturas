// Obtener el formulario y los campos
const registerForm = document.getElementById('registerForm');
const nameInput = document.getElementById('name');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirmPassword');
const errorMessage = document.getElementById('error-message');

// Evento que se dispara cuando se envía el formulario
registerForm.addEventListener('submit', async function(event) {
    event.preventDefault();  // Evita el envío del formulario

    // Verificar si las contraseñas coinciden
    if (passwordInput.value !== confirmPasswordInput.value) {
        errorMessage.style.display = 'inline';  // Mostrar mensaje de error
        return;  // No enviamos los datos si las contraseñas no coinciden
    } else {
        errorMessage.style.display = 'none';  // Si las contraseñas coinciden, ocultamos el mensaje
    }

    // Crear objeto con los datos del formulario
    const userData = {
        name: nameInput.value,
        password: passwordInput.value
    };

    try {
        // Enviar datos al servidor usando fetch
        const response = await fetch('/backend/ControlUsuario', {
            method: 'POST',  // Método POST
            headers: {
                'Content-Type': 'application/json'  // Indicamos que los datos son en formato JSON
            },
            body: JSON.stringify(userData)  // Convertimos el objeto a formato JSON
        });

        // Manejar la respuesta del servidor
        const responseData = await response.json();

        if (response.ok) {
            alert('Usuario registrado exitosamente');
            // Redirigir a otra página o limpiar el formulario
        } else {
            alert(responseData.error || 'Hubo un problema al registrar el usuario');
        }
    } catch (error) {
        console.error('Error al enviar los datos:', error);
        alert('Hubo un problema al registrar el usuario.');
    }
});
