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

    
        // Enviar datos al servidor usando fetch
        const response = await fetch('/backend/ControlUsuario', {
            method: 'POST',  // Método POST
            headers: {
                'Content-Type': 'application/json'  // Indicamos que los datos son en formato JSON
            },
            body: JSON.stringify(userData)  // Convertimos el objeto a formato JSON
        });

        // Manejar la respuesta del servidor

       
        const responseData =  response.json();
        var e =response.ok;
        var t = response.error;// esto tampoco

        var  r =  responseData.error;// no funciona esto te va a dar un error 

        console.log(response);
        if (response.ok) {
            alert('Usuario registrado exitosamente');
            // Redirigir a otra página o limpiar el formulario
        }
    
});
