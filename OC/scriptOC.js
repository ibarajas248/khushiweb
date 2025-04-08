document.addEventListener("DOMContentLoaded", function () {
    const apiUrl = "https://khushiconfecciones.com/app_khushi/buscar_oc_empresa.php?id_empresa=1";
    const tbody = document.getElementById("productos-tbody");
    const mensajeError = document.getElementById("mensaje-error");
    
    // Llamar a la función al cargar la página
    cargarOrdenesDeCompra();

    // Agregar evento al botón de agregar OC
    document.getElementById("submit").addEventListener("click", function(event) {
        event.preventDefault();
        agregarOC("https://khushiconfecciones.com/app_khushi/agregar_oc_empresa.php");
    });
});

// Ahora la función está en un ámbito global y puede ser llamada desde cualquier parte
function cargarOrdenesDeCompra() {
    fetch("https://khushiconfecciones.com/app_khushi/buscar_oc_empresa.php?id_empresa=1")
        .then(response => {
            if (!response.ok) {
                throw new Error("Error en la respuesta de la API");
            }
            return response.json();
        })
        .then(data => {
            const tbody = document.getElementById("productos-tbody");
            tbody.innerHTML = ""; // Limpiar contenido previo
            data.forEach(item => {
                const row = document.createElement("tr");

                row.innerHTML = `
                    <td>${item.idOrdenCompra}</td>
                    <td>${item.ordendeCompra}</td>
                    <td class="accion-eliminar">
                        <img src="../assets/lapiz.png" alt="Editar" title="Editar" class="icono-editar" style="cursor:pointer; width:20px; margin-right:10px;">
                        <img src="../assets/eliminar.png" alt="Eliminar" title="Eliminar" class="icono-eliminar" style="cursor:pointer; width:20px;">
                    </td>
                `;

                // Click general en la fila
                row.addEventListener("click", function () {
                    window.location.href = `detalleoc/detalle_oc.html?id=${item.idOrdenCompra}&oc=${encodeURIComponent(item.ordendeCompra)}`;
                });

                // Íconos individuales
                const editarIcon = row.querySelector(".icono-editar");
                const eliminarIcon = row.querySelector(".icono-eliminar");

                editarIcon.addEventListener("click", function (event) {
                    event.stopPropagation();
                    abrirModal(item.idOrdenCompra, item.ordendeCompra);
                });

                eliminarIcon.addEventListener("click", function (event) {
                    event.stopPropagation();
                    if (confirm("¿Estás seguro de que quieres eliminar esta orden de compra?")) {
                        eliminarOC("https://khushiconfecciones.com/app_khushi/eliminar_oc.php", item.idOrdenCompra);
                    }
                });

                tbody.appendChild(row);
            });
        })
        .catch(error => {
            const mensajeError = document.getElementById("mensaje-error");
            mensajeError.textContent = "Error al cargar los datos.";
            console.error("Error:", error);
        });
}


function mostrarAdvertencia() {
    if (confirm("¿Estás seguro de que quieres abrir el modal?")) {
        abrirModal();
    }
}

function abrirModal(id, ordenCompra) {
    document.getElementById("editIdOrdenCompra").value = id;
    document.getElementById("editOrdenCompra").value = ordenCompra;
    document.getElementById("modalEditar").style.display = "flex";
}

// Cerrar modal
document.getElementById("cerrarModal").addEventListener("click", function () {
    document.getElementById("modalEditar").style.display = "none";
});

document.getElementById("formEditar").addEventListener("submit", async function (event) {
    event.preventDefault();

    const idOrdenCompra = document.getElementById("editIdOrdenCompra").value.trim();
    const ordenCompra = document.getElementById("editOrdenCompra").value.trim();

    if (!idOrdenCompra || !ordenCompra) {
        alert("Todos los campos son obligatorios.");
        return;
    }

    const formData = new URLSearchParams();
    formData.append("idOrdenCompra", idOrdenCompra);
    formData.append("ordendeCompra", ordenCompra);

    try {
        const response = await fetch("https://khushiconfecciones.com/app_khushi/editar_oc.php", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: formData.toString()
        });

        const data = await response.text();
        console.log("Respuesta del servidor:", data);

        if (data.includes("actualizada correctamente")) {
            alert("Orden de compra actualizada correctamente.");
            document.getElementById("modalEditar").style.display = "none";
            cargarOrdenesDeCompra(); // Recargar lista después de editar
        } else {
            alert("Error: " + data);
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Error de conexión con el servidor.");
    }
});

function agregarOC(URL) {
    let oc = document.getElementById("operacion-nueva").value;
    let idEmpresa = 1;

    if (oc.trim() === "") {
        alert("Por favor, ingresa una orden de compra.");
        return;
    }

    let parametros = new URLSearchParams();
    parametros.append("ordendeCompra", oc);
    parametros.append("id_empresa", idEmpresa);

    fetch(URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: parametros.toString()
    })
    .then(response => response.text()) 
    .then(data => {
        console.log("Response:", data);
        alert("Orden de compra creada satisfactoriamente");

        document.getElementById("operacion-nueva").value = ""; // Limpiar input
        cargarOrdenesDeCompra(); // Recargar lista después de agregar
    })
    .catch(error => {
        console.error("Error en la solicitud:", error);
        alert("Error en la solicitud: " + error);
    });
}

function eliminarOC(URL, idOrdenCompra) {
    let formData = new FormData();
    formData.append("idOrdenCompra", idOrdenCompra);

    fetch(URL, {
        method: "POST",
        body: formData
    })
    .then(response => response.text()) 
    .then(response => {
        alert("Orden de compra eliminada satisfactoriamente");
        cargarOrdenesDeCompra(); // Recargar lista después de eliminar
    })
    .catch(error => {
        alert("Error: " + error);
    });
}
