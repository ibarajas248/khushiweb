const apiUrl = "https://khushiconfecciones.com/app_khushi/recycler.php?id_empresa=1";
document.addEventListener("DOMContentLoaded", function () {
    

    obtenerProductos(apiUrl);
    configurarEventos();
});

function obtenerProductos(url) {
    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log("Respuesta de la API:", data);
            if (Array.isArray(data) && data.length > 0) {
                mostrarProductos(data);
            } else {
                mostrarMensajeError("No hay productos disponibles.");
            }
        })
        .catch(error => {
            console.error("Error al obtener los productos:", error);
            mostrarMensajeError("No se pudieron cargar los productos.");
        });
}

function mostrarMensajeError(mensaje) {
    let mensajeError = document.getElementById("mensaje-error");
    if (mensajeError) mensajeError.textContent = mensaje;
}

function configurarEventos() {
    let agregarProductoBtn = document.getElementById("agregar-producto-btn");
    if (agregarProductoBtn) {
        agregarProductoBtn.addEventListener("click", mostrarFormularioProducto);
    }

    let productoForm = document.getElementById("productoForm");
    if (productoForm) {
        productoForm.addEventListener("submit", agregarProducto);
    }

    let closeModalBtn = document.getElementById("close-modal");
    let modal = document.getElementById("modal-agregar-producto");
    if (closeModalBtn && modal) {
        closeModalBtn.addEventListener("click", () => modal.style.display = "none");
        window.addEventListener("click", event => {
            if (event.target === modal) modal.style.display = "none";
        });
    }
}

function mostrarProductos(data) {
    let tbody = document.getElementById("productos-tbody");
    if (!tbody) return;
    tbody.innerHTML = "";

    data.forEach(producto => {
        let fila = document.createElement("tr");
        fila.dataset.id = producto.id_producto;
        fila.onclick = () => {
            window.location.href = `detalle/detalle.html?id=${producto.id_producto}&producto=${encodeURIComponent(producto.producto)}&precio=${producto.precio}&imagen=${encodeURIComponent(producto.url_foto || '')}`;
        };
        fila.innerHTML = `
            <td>${producto.id_producto}</td>
            <td>${producto.producto}</td>
            <td>$${producto.precio}</td>
            <td>${producto.url_foto ? `<img src="${producto.url_foto}" alt="${producto.producto}" class="producto-img">` : "Sin imagen"}</td>

            <td class="accion-eliminar">
                <img src="../assets/lapiz.png" alt="Editar" class="icono-eliminar" onclick="event.stopPropagation(); editarProducto(${producto.id_producto})">
                <img src="../assets/eliminar.png" alt="Eliminar" class="icono-eliminar" onclick="event.stopPropagation(); eliminarProducto(${producto.id_producto})">
            </td>
        `;

        tbody.appendChild(fila);
    });
}

function eliminarProducto(idProducto) {
    if (confirm("¿Estás seguro de que deseas eliminar este producto?")) {
        fetch("https://khushiconfecciones.com/app_khushi/eliminar_producto.php", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: `id_producto=${idProducto}`
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log("Producto eliminado exitosamente:", data);
                document.querySelector(`#productos-tbody tr[data-id="${idProducto}"]`)?.remove();
            } else {
                alert("No se pudo eliminar el producto: " + data.message);
            }
        })
        .catch(error => {
            console.error("Error al eliminar producto:", error);
            alert("No se pudo eliminar el producto.");
        });
    }
}

function mostrarFormularioProducto() {
    let modal = document.getElementById("modal-agregar-producto");
    if (!modal) return;
    modal.style.display = "block";
}

function agregarProducto(event) {
    event.preventDefault();
    let formData = new FormData(event.target);
    fetch("https://khushiconfecciones.com/app_khushi/insertar_producto.php", {
        method: "POST",
        body: formData
    })
    .then(response => response.text())
    .then(data => {
        let mensaje = document.getElementById("mensaje");
        if (mensaje) mensaje.textContent = data;
        obtenerProductos(apiUrl);
    })
    .catch(error => {
        let mensaje = document.getElementById("mensaje");
        if (mensaje) mensaje.textContent = "Error en la solicitud";
        console.error("Error:", error);
    });
}
