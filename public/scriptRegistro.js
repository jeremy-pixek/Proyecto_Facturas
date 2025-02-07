// Obtener el formulario y los campos
const registerForm = document.getElementById('registerForm');
const nameInput = document.getElementById('nombre');
const passwordInput = document.getElementById('contraseña');
const confirmPasswordInput = document.getElementById('confirmcontraseña');
const errorMessage = document.getElementById('error-message');
//esta parte de arriba lo que hace es que busca los elementos que tenes en tu html y lo convierte en variales
//para acceder a sus propiedades y poder leer lo que tienen o setearle valores



//la parte de abajo es una funcion que esta escuchando cuando vos das click al boton Submit, 
//el toma ese evento y opera segun lo que vos le digas que haga
// Evento que se dispara cuando se envía el formulario
registerForm.addEventListener('submit', async function (event) {
    event.preventDefault();  // Evita el envío del formulario
    // aqui ya es cosa de verificar con los campos que creo la informacion. 
    // Verificar si las contraseñas coinciden
    if (passwordInput.value !== confirmPasswordInput.value) {
        errorMessage.style.display = 'inline';  // Mostrar mensaje de error
        return;  // No enviamos los datos si las contraseñas no coinciden
    } else {
        errorMessage.style.display = 'none';  // Si las contraseñas coinciden, ocultamos el mensaje
    }
    // Crear objeto con los datos del formulario
    const userData = {
        nombre: nameInput.value,
        contraseña: passwordInput.value
    };

    //esta parte se encarga de llamar al backend para consumir los metodos Internos

    // lo que dibe body es el request que le pasa y que en el backend esta esperando esa informacion
    //y esto lo que hace es que la respuesta del backend la guarda en un variable llamada response
    // Enviar datos al servidor usando fetch

    const response = await fetch('/backend/registro', {
        method: 'POST',  // Método POST
        headers: {
            'Content-Type': 'application/json'  // Indicamos que los datos son en formato JSON
        },
        body: JSON.stringify(userData)  // Convertimos el objeto a formato JSON
    });

    if (response.ok) {
        // Redirigir a login si el registro fue exitoso
        window.location.href = 'login.html';
    } else {
        const errorData = await response.json();  // Obtenemos los datos del error
        alert(`Error: ${errorData.message || 'Hubo un problema al registrar el usuario.'}`);
    }});

// Función para regresar a la pestaña anterior
const backButton = document.getElementById('button');
backButton.addEventListener('click', function () {
    window.history.back();
});


