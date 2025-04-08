let idProduccion;

document.addEventListener("DOMContentLoaded", function () {
    obtenerDatosURL(); // Asigna valores desde la URL
    idProduccion = document.getElementById("id").textContent; // Asigna el ID producción
    
    console.log("ID Producción:", idProduccion);
    
    // Asegurar que el idProduccion tenga un valor antes de usarlo
    if (idProduccion) {
        cargarOperacionesLote("https://khushiconfecciones.com/app_khushi/consultas_lotes/buscar_operaciones_por_lote.php?id_producto_orden_compra=" + idProduccion);
    } else {
        console.error("El ID de producción no está definido.");
    }
});

document.getElementById("btn-sin-asignar").addEventListener("click", function() {
    ;
    cargarOperacionesLote("https://khushiconfecciones.com/app_khushi/consultas_lotes/buscar_operaciones_por_lote_filtro.php?id_producto_orden_compra="+idProduccion+"&empleado=null");
  });

document.getElementById("btn-asignado").addEventListener("click", function() {
    ;
    cargarOperacionesLote("https://khushiconfecciones.com/app_khushi/consultas_lotes/buscar_operaciones_por_lote_filtro.php?id_producto_orden_compra="+idProduccion+"&empleado=no null");

});
  

function obtenerDatosURL() {
    const params = new URLSearchParams(window.location.search);
    document.getElementById("id").textContent = params.get("id") || "";
    document.getElementById("nombre").textContent = params.get("nombre") || "";
    document.getElementById("cantidad").textContent = params.get("cantidad") || "";
    document.getElementById("precio").textContent = params.get("precio") || "";
}

function cargarOperacionesLote(url) {
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la respuesta del servidor');
            }
            return response.json();
        })
        .then(data => {
            const tbody = document.getElementById("productos-tbody");
            tbody.innerHTML = ""; // Limpiar la tabla antes de insertar nuevos datos
            
            data.forEach(item => {
                const fila = document.createElement("tr");
                fila.innerHTML = `
                    <td>${item.id_lotes_operaciones}</td>
                    <td>${item.operaciones}</td>
                    <td>${item.subparte}</td>
                    <td>${item.cantidad}</td>
                    <td>${item.lote}</td>
                    <td>${item.completado}</td>
                    <td>${item.habilitado}</td>
                    <td>${item.empleado || 'No asignado'}</td>
                `;
                tbody.appendChild(fila);
            });
        })
        .catch(error => {
            document.getElementById("mensaje-error").innerText = "Error de conexión: " + error.message;
        });
}
