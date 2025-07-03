let  idOrdenCompra,ordendeCompra;
let idProductoSeleccionado
let productoSeleccionado;

document.addEventListener("DOMContentLoaded", function () {
    const params = new URLSearchParams(window.location.search);
     idOrdenCompra = params.get("id");
    ordendeCompra = params.get("oc");

    if (idOrdenCompra && ordendeCompra) {
        document.getElementById("idOrdenCompra").textContent = idOrdenCompra;
        document.getElementById("ordendeCompra").textContent = decodeURIComponent(ordendeCompra);

        // Construye la URL de la API correctamente
        const url = `https://khushiconfecciones.com/app_khushi/buscar_operaciones_oc.php?id_oc=${idOrdenCompra}`;
        
        // Llama a la función para obtener los productos
        fetchProductos(url);
    } else {
        document.getElementById("detalle-card").innerHTML = "<p>Error: Datos no disponibles</p>";
    }


    // spinner 
    const url = "https://khushiconfecciones.com/app_khushi/recycler.php?id_empresa=1"; // Reemplaza con tu URL
            const selectProducto = document.getElementById("productoSelect");
            let idsProductos = [];

            fetch(url)
                .then(response => response.json())
                .then(data => {
                    selectProducto.innerHTML = ""; // Limpiar opciones previas
                    idsProductos = []; // Reiniciar lista de IDs
                    
                    data.forEach(item => {
                        let option = document.createElement("option");
                        option.value = item.id_producto;
                        option.textContent = item.producto;
                        selectProducto.appendChild(option);
                        
                        idsProductos.push(item.id_producto);
                    });
                })
                .catch(error => {
                    console.error("Error de conexión:", error);
                    alert("Error de conexión");
                });

            selectProducto.addEventListener("change", function() {
                let selectedIndex = selectProducto.selectedIndex;
                idProductoSeleccionado = idsProductos[selectedIndex];
                productoSeleccionado = selectProducto.options[selectedIndex].text;
                
                console.log("Producto seleccionado:", productoSeleccionado, "ID:", idProductoSeleccionado);
            });


});

function fetchProductos(url) {
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
    const tableBody = document.getElementById("productosBody");
    tableBody.innerHTML = "";

    if (!data || data.length === 0) {
        tableBody.innerHTML = "<tr><td colspan='5'>No hay productos disponibles</td></tr>";
        return;
    }

    let rows = data.map(producto => `
        <tr onclick="redireccionar('${producto.id_oc}', '${producto.producto}', '${producto.cantidad_de_productos}', '${producto.lotes}', '${producto.id}')">
            <td>${producto.id}</td>    
            <td>${producto.id_oc}</td>
            <td>${producto.producto}</td>
            <td>${producto.cantidad_de_productos}</td>
            <td>${producto.lotes}</td>
            <td class="accion-eliminar">
                <img src="../../assets/lapiz.png" alt="Editar" title="Editar" class="icono-editar" style="cursor:pointer; width:20px; margin-right:10px;">
                <img src="../../assets/eliminar.png" alt="Eliminar" title="Eliminar" class="icono-eliminar" data-id="${producto.id}" style="cursor:pointer; width:20px;">
            </td>
        </tr>
    `).join("");

    tableBody.insertAdjacentHTML("beforeend", rows);

    // 🔁 Aquí sí se pueden asignar eventos, porque los elementos ya existen
    document.querySelectorAll(".icono-eliminar").forEach(icono => {
        icono.addEventListener("click", function(event) {
            event.stopPropagation(); // Evita redirección al hacer clic en eliminar
            const idProductoOC = this.getAttribute("data-id");

            if (confirm("¿Estás seguro de que deseas eliminar este producto?")) {
                eliminarProductoEnOC("https://khushiconfecciones.com/app_khushi/eliminar_producto_oc.php", idProductoOC);
            }
        });
    });
    document.querySelectorAll(".icono-editar").forEach(icono => {
    icono.addEventListener("click", function(event) {
        event.stopPropagation(); // Evita que se dispare el onclick de la fila
        alert("Edición no disponible");
    });
});
})

        .catch(error => console.error("Error al obtener los datos: ", error));
}


function redireccionar(id_oc, nombre, cantidad, precio, id) {
    const params = new URLSearchParams({ id_oc, id, nombre, cantidad, precio });
    window.location.href = `operaciones_lotes/operaciones_lotes.html?${params.toString()}`;
}




function eliminarProductoEnOC(url, idProductoOC) {
    const parametros = new URLSearchParams();
    parametros.append("id", idProductoOC);

    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: parametros
    })
    .then(response => response.text())
    .then(data => {
        console.log("Respuesta al eliminar:", data);
        alert("Producto eliminado exitosamente");
        // Recargar productos actualizados
        const urlActualizar = `https://khushiconfecciones.com/app_khushi/buscar_operaciones_oc.php?id_oc=${idOrdenCompra}`;
        fetchProductos(urlActualizar);
    })
    .catch(error => {
        console.error("Error al eliminar:", error);
        alert("Error al eliminar el producto");
    });
}






document.getElementById("btnAgregarOperacion").addEventListener("click", function() {
    const url = "https://khushiconfecciones.com/app_khushi/agregar_producto_oc.php";  // Reemplaza con la URL real
    agregarProductoOC(url);
});

function agregarProductoOC(url) {
    const parametros = new URLSearchParams();

    console.log("ID Orden de Compra:", idOrdenCompra);
    console.log("ID Producto Seleccionado:", idProductoSeleccionado);
    console.log("Producto Seleccionado:", productoSeleccionado);
    console.log("Orden de Compra:", ordendeCompra);
    console.log("Lotes:", document.getElementById("lotes").value);
    console.log("Cantidad de Productos:", document.getElementById("Cantidad").value);

    parametros.append("id_oc", idOrdenCompra);
    parametros.append("id_producto", idProductoSeleccionado);
    parametros.append("ordenCompra", ordendeCompra );
    parametros.append("producto", productoSeleccionado);
    parametros.append("lotes", document.getElementById("lotes").value);
    parametros.append("cantidad_de_productos", document.getElementById("Cantidad").value);
    parametros.append("precio_venta", document.getElementById("precio_venta").value);

    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: parametros
    })
    .then(response => response.text())  
    .then(data => {
        console.log("Response:", data);
        alert("Operación Exitosa");
        document.getElementById("form-agregar-operacion").reset();
        const urlActualizar = `https://khushiconfecciones.com/app_khushi/buscar_operaciones_oc.php?id_oc=${idOrdenCompra}`;
        fetchProductos(urlActualizar); 
    })
    .catch(error => {
        console.error("Error en la solicitud:", error);
        alert("Error en la solicitud: " + error);
    });
}


