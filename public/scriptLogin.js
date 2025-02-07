const loginForm = document.getElementById('loginForm');
const nameInput = document.getElementById('nombre');
const passwordInput = document.getElementById('contraseña');


loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();  // Prevenir que el formulario se envíe de forma tradicional


    const DataUser = {
        nombre: nameInput.value,
        contraseña: passwordInput.value
    };
    console.log("Datos que estamos enviando:", DataUser);


    // Enviar datos al backend para login
    try {
        console.log("Enviando solicitud a:", '/backend/login');

        const response = await fetch('/backend/login', {
            method: 'POST',  // Método POST
            headers: {
                'Content-Type': 'application/json'  // Indicamos que los datos son en formato JSON
            },
            body: JSON.stringify(DataUser)  // Convertimos el objeto a formato JSON
        });

        console.log("Respuesta del servidor:", response);


        if (response.ok) {
            console.log("Error", response)
            const data = response.json();
            console.log("Token recibido:", data.token); 
            localStorage.setItem('authToken', data.token);  // Guardar el token en localStorage
            window.location.href = 'inicio.html';  // Redirigir al inicio
        } else {
            console.log("Error en la respuesta:", response.statusText);
            alert('Error al iniciar sesión');
        }
    }
    catch (error) {
        console.error('Error al iniciar sesión:', error);
        alert('Hubo un error en el servidor');
    }
});


















































