document.getElementById("login-form").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevenir el envío por defecto

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const alerta = document.getElementById("alerta");

    // Aquí puedes aplicar cifrado si lo necesitas
    const contraseniaEncriptada = password;

    const url = `https://khushiconfecciones.com/app_khushi/validar_inicio_sesion_web.php?usuario=${encodeURIComponent(username)}&contrasenia=${encodeURIComponent(contraseniaEncriptada)}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (Array.isArray(data) && data.length > 0) {
                const user = data[0];
                alerta.className = "alert alert-success";
                alerta.textContent = "Inicio de sesión correcto";
                alerta.classList.remove("d-none");

                console.log("Usuario:", user.usuario);
                console.log("Rol:", user.Rol);
                console.log("ID Usuario:", user.id);
                console.log("ID Empresa:", user.id_empresa);

                // Redirigir si quieres
                window.location.href = "productos/productosBootstrap.html";
            } else {
                alerta.className = "alert alert-danger";
                alerta.textContent = "Usuario o contraseña incorrectos";
                alerta.classList.remove("d-none");
            }
        })
        .catch(error => {
            alerta.className = "alert alert-warning";
            alerta.textContent = "Error al conectar con el servidor";
            alerta.classList.remove("d-none");
            console.error("Error:", error);
        });
});