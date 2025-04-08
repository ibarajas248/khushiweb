document.addEventListener("DOMContentLoaded", function () {
    // Obtener los parámetros de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const idSubparte = urlParams.get("id_subparte");
    const subparteNombre = urlParams.get("subparte");
    const idProducto = urlParams.get("id_producto");

    // Mostrar los datos de la subparte
    document.getElementById("subparte-id").textContent = idSubparte;
    document.getElementById("subparte-nombre").textContent = subparteNombre;
    document.getElementById("producto-id").textContent = idProducto;

    // Cargar operaciones al inicio
    cargarOperaciones(idSubparte, idProducto);

    // Vincular la función agregarOperación al submit del formulario
    document.getElementById("form-agregar-operacion").addEventListener("submit", function (event) {
        event.preventDefault(); // Evitar la recarga de la página
        agregarOperacion(idSubparte, idProducto);
    });
});

// Función para cargar las operaciones asignadas
function cargarOperaciones(idSubparte, idProducto) {
    if (idSubparte && idProducto) {
        fetch(`https://khushiconfecciones.com/app_khushi/buscar_operaciones_asignadas_a_producto.php?id_producto=${idProducto}&id_subparte=${idSubparte}`)
            .then(response => response.json())
            .then(data => {
                const operacionesContainer = document.getElementById("operaciones-container");
                operacionesContainer.innerHTML = ""; // Limpiar contenido anterior

                if (data.length > 0) {
                    // Crear la tabla
                    const tabla = document.createElement("table");
                    tabla.classList.add("tabla-operaciones");

                    // Crear encabezados de la tabla
                    const encabezado = document.createElement("thead");
                    encabezado.innerHTML = `
                        <tr>
                            <th>ID Operación</th>
                            <th>Operación</th>
                            <th>Cantidad</th>
                            <th>Máquina</th>
                           <!-- <th>Operación Inventario</th> -->
                            <th>Precio</th>
                            <th>Acciones</th>
                        </tr>
                    `;
                    tabla.appendChild(encabezado);

                    // Crear cuerpo de la tabla
                    const cuerpo = document.createElement("tbody");
                    data.forEach(operacion => {
                        const fila = document.createElement("tr");
                        fila.innerHTML = `
                            <td>${operacion.id_operaciones}</td>
                            <td>${operacion.operaciones}</td>
                            <td>${operacion.cantidad}</td>
                            <td>${operacion.maquina}</td>
                            <!-- <td>${operacion.op_inventario}</td> -->

                            <td>${operacion.precio}</td>
                            <td class="accion-eliminar">
                                 <img src="../../../assets/lapiz.png" alt="Eliminar" class="icono-eliminar" onclick="eliminarOperacion(${operacion.id_operaciones}, this)">
                                 <img src="../../../assets/eliminar.png" alt="Eliminar" class="icono-eliminar" onclick="eliminarOperacion(${operacion.id_operaciones}, this)">
                            </td>

                        `;
                        cuerpo.appendChild(fila);
                    });

                    // Añadir el cuerpo a la tabla
                    tabla.appendChild(cuerpo);
                    operacionesContainer.appendChild(tabla);
                } else {
                    operacionesContainer.innerHTML = "<p>No hay operaciones asignadas.</p>";
                }
            })
            .catch(error => {
                console.error("Error al obtener las operaciones:", error);
                document.getElementById("operaciones-container").innerHTML =
                    "<p>Error al cargar las operaciones.</p>";
            });
    } else {
        document.getElementById("operaciones-container").innerHTML =
            "<p>Faltan parámetros para cargar las operaciones.</p>";
    }
}


// Agregar botón de descarga
document.addEventListener("DOMContentLoaded", function () {
    //const btnDescargar = document.createElement("button");
    //btnDescargar.textContent = "Descargar Excel";
   // btnDescargar.classList.add("back-button");
    //btnDescargar.addEventListener("click", descargarExcel);
    
    //const contenedor = document.querySelector(".contenido-principal");
    //contenedor.appendChild(btnDescargar);
});

function agregarOperacion() {
    // Mostrar el mensaje de carga
    const loadingMessage = document.getElementById("loading-message");
    const responseMessage = document.getElementById("response-message");
    loadingMessage.style.display = "block";
    responseMessage.style.display = "none"; // Ocultar mensaje anterior

    // Obtener los valores de los campos de entrada
    const nombreOperacion = document.getElementById("operacion-nueva").value;
    const cantidadOperaciones = document.getElementById("cantidad-nueva").value;
    const maquina = document.getElementById("maquina-nueva").value;
    const precio = document.getElementById("precio-nuevo").value;

    // Validar los campos (asegurarse de que no estén vacíos y que los valores sean válidos)
    if (!nombreOperacion || !cantidadOperaciones || !maquina || !precio) {
        responseMessage.textContent = "Todos los campos son obligatorios.";
        responseMessage.style.color = "red";
        responseMessage.style.display = "block";
        loadingMessage.style.display = "none";
        return;
    }

    if (isNaN(cantidadOperaciones) || cantidadOperaciones <= 0) {
        responseMessage.textContent = "La cantidad debe ser un número válido mayor que 0.";
        responseMessage.style.color = "red";
        responseMessage.style.display = "block";
        loadingMessage.style.display = "none";
        return;
    }

    if (isNaN(precio) || precio <= 0) {
        responseMessage.textContent = "El precio debe ser un número válido mayor que 0.";
        responseMessage.style.color = "red";
        responseMessage.style.display = "block";
        loadingMessage.style.display = "none";
        return;
    }

    // Crear los datos que se enviarán en la solicitud POST
    const data = new FormData();
    data.append("operaciones", nombreOperacion);
    data.append("cantidad", cantidadOperaciones);
    data.append("maquina", maquina);
    data.append("precio", precio);

    // Hacer la solicitud POST
    fetch('https://khushiconfecciones.com/app_khushi/agregar_operaciones.php', {
        method: 'POST',
        body: data
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error en la respuesta del servidor');
        }
        return response.json();  // Convertir la respuesta a JSON
    })
    .then(data => {
        // Comprobamos si la respuesta del servidor es exitosa
        if (data.success) {
            // Mensaje de éxito
            responseMessage.textContent = "Operación agregada con éxito.";
            responseMessage.style.color = "green";
            responseMessage.style.display = "block";
            setTimeout(obtenerUltimaOperacion, 3000);
        } else {
            // Mensaje de error si el servidor devuelve un error
            responseMessage.textContent = `Error: ${data.message || 'No se pudo agregar la operación'}`;
            responseMessage.style.color = "red";
            responseMessage.style.display = "block";
        }
        // Ocultar el mensaje de carga
        loadingMessage.style.display = "none";
    })
    .catch((error) => {
        console.error("Error:", error);
        // Mensaje de error
        responseMessage.textContent = `Error al agregar la operación: ${error.message}`;
        responseMessage.style.color = "red";
        responseMessage.style.display = "block";
        // Ocultar el mensaje de carga
        loadingMessage.style.display = "none";
    });
}

function obtenerUltimaOperacion() {

    

    let subparteId = document.getElementById("subparte-id").textContent;
    let subparteNombre = document.getElementById("subparte-nombre").textContent;
    let productoId = document.getElementById("producto-id").textContent;
    const precio = document.getElementById("precio-nuevo").value;
    // Crear un objeto FormData para enviar los parámetros como un f
    fetch('https://khushiconfecciones.com/app_khushi/buscar_ultima_operacion.php')
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al obtener la última operación');
        }
        return response.json();
    })
    .then(data => {
        console.log("Última operación obtenida:", data);
        let precio = document.getElementById("precio-nuevo").value;
        agregarPrecio('https://khushiconfecciones.com/app_khushi/insertar_precio_operacion.php',data.id_operaciones,precio);
        agregarOperacionProducto('https://khushiconfecciones.com/app_khushi/insert_operacion_a_producto.php',data.id_operaciones);
        cargarOperaciones(subparteId,productoId);
        
        alert(`ID Operación: ${data.id_operaciones}, Operación: ${data.operaciones}, Cantidad: ${data.cantidad}, Máquina: ${data.maquina}, Precio: ${data.precio}`);
    })
    .catch(error => {
        console.error("Error:", error);
        alert("No se pudo obtener la última operación.");
    });
}

function agregarOperacionProducto(URL, idOperacion) {

    let subparteId = document.getElementById("subparte-id").textContent;
    let subparteNombre = document.getElementById("subparte-nombre").textContent;
    let productoId = document.getElementById("producto-id").textContent;
    const precio = document.getElementById("precio-nuevo").value;
    // Crear un objeto FormData para enviar los parámetros como un formulario
    let formData = new FormData();
    formData.append("id_operaciones", idOperacion);
    formData.append("id_subparte", subparteId);
    formData.append("id_producto", productoId);

    // Realizar la solicitud POST con fetch
    fetch(URL, {
        method: "POST",
        body: formData
    })
    .then(response => response.text())  // Convertir la respuesta a texto
    .then(data => {
    
        console.log("Response:", data);
       // alert("Operación asociada a producto");
    })
    .catch(error => {
        console.error("Error en la solicitud:", error);
        alert("Error en la solicitud: " + error);
    });
}

// Función para mostrar mensajes de estado
function mostrarMensaje(mensaje, color) {
    const responseMessage = document.getElementById("response-message");
    const loadingMessage = document.getElementById("loading-message");
    
    responseMessage.textContent = mensaje;
    responseMessage.style.color = color;
    responseMessage.style.display = "block";
    loadingMessage.style.display = "none";

}


function agregarPrecio(URL,idOperacion,precio) {
    let subparteId = document.getElementById("subparte-id").textContent;
    let subparteNombre = document.getElementById("subparte-nombre").textContent;
    let productoId = document.getElementById("producto-id").textContent;
    let parametros = new URLSearchParams();


    // Obtener los valores de los campos de entrada
    
    
    parametros.append("id_operacion", idOperacion);
    parametros.append("id_subparte", subparteId);
    parametros.append("id_producto", productoId);
    parametros.append("precio", precio);
    
    
    fetch(URL, {
        method: "POST",
        body: parametros,
    })
    .then(response => response.text())
    .then(data => {
        console.log("Response:", data);
        //alert("Precio agregado");
    })
    .catch(error => {
        console.error("Error en la solicitud:", error);
        alert("Error en la solicitud: " + error);
    });
}


async function obtenerUltimaOperacionValor() {
    try {
        let response = await fetch('https://khushiconfecciones.com/app_khushi/buscar_ultima_operacion.php');
        if (!response.ok) {
            throw new Error('Error al obtener la última operación');
        }

        let data = await response.json();
        console.log("Última operación obtenida:", data);

        //alert(`ID Operación: ${data.id_operaciones}, Operación: ${data.operaciones}, Cantidad: ${data.cantidad}, Máquina: ${data.maquina}, Precio: ${data.precio}`);

        return data.id_operaciones; // ✅ Retorna el valor de 'operaciones'
    } catch (error) {
        console.error("Error:", error);
        alert("No se pudo obtener la última operación.");
        return null; // Retorna null en caso de error
    }
}


function descargarExcel() {
    const tabla = document.querySelector(".tabla-operaciones");
    if (!tabla) {
        alert("No hay datos para descargar.");
        return;
    }
    
    // Crear una hoja de cálculo
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.table_to_sheet(tabla);
    XLSX.utils.book_append_sheet(wb, ws, "Operaciones");
    
    // Descargar el archivo
    XLSX.writeFile(wb, "operaciones_subparte.xlsx");
}



// subir desde excel 

let datosExcel = [];

function leerArchivo() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.xlsx, .xls';
    input.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {

            // Mostrar el nombre del archivo en el span
            document.getElementById("nombre-archivo").textContent = `Archivo seleccionado: ${file.name}`;
            const reader = new FileReader();
            reader.readAsArrayBuffer(file);
            reader.onload = (e) => {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];
                datosExcel = XLSX.utils.sheet_to_json(sheet);
                console.log('Datos cargados:', datosExcel);
                alert('Archivo cargado correctamente.');
            };
        }
    });
    input.click();
}

function descargarPlantillaExcel() {
    // Crear un nuevo libro de Excel
    const wb = XLSX.utils.book_new();

    // Definir los encabezados de la plantilla
    const datos = [
        ["operaciones", "cantidad", "maquina", "op_inventario","precio"], // Encabezados
        ["", "", "", "",""] // Fila vacía para que el usuario complete
    ];

    // Crear una hoja de cálculo
    const ws = XLSX.utils.aoa_to_sheet(datos);

    // Añadir la hoja al libro
    XLSX.utils.book_append_sheet(wb, ws, "Plantilla");

    // Descargar el archivo Excel
    XLSX.writeFile(wb, "plantilla_operaciones.xlsx");
}


function procesarExcel() {
    if (datosExcel.length === 0) {
        alert('Por favor, carga un archivo primero.');
        return;
    }
    
    datosExcel.forEach((fila) => {
        const formData = new FormData();
        formData.append('operaciones', fila.operaciones);
        formData.append('cantidad', fila.cantidad);
        formData.append('maquina', fila.maquina);
        formData.append('op_inventario', fila.op_inventario || 'si');
        

        
        fetch('https://khushiconfecciones.com/app_khushi/agregar_operaciones.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => console.log('Respuesta:', data))
        .catch(error => console.error('Error:', error));
    });
    alert('Datos enviados correctamente.');
}





async function procesarExcel2() {
    if (datosExcel.length === 0) {
        alert('Por favor, carga un archivo primero.');
        return;
    }

    

    for (let fila of datosExcel) {
        const formData = new FormData();
        formData.append('operaciones', fila.operaciones);
        formData.append('cantidad', fila.cantidad);
        formData.append('maquina', fila.maquina);
        formData.append('op_inventario', fila.op_inventario || 'si');
        //formData.append('ultimaOperacion', ultimaOperacion); // ✅ Enviar la última operación
        
        

        try {
            let response = await fetch('https://khushiconfecciones.com/app_khushi/agregar_operaciones.php', {
                method: 'POST',
                body: formData
            });
            let data = await response.json();
            console.log('Respuesta:', data);

            if (data.success) {

                // Esperar la última operación antes de procesar las filas
                let ultimaOperacion = await obtenerUltimaOperacionValor();
                let precio = fila.precio;
                agregarPrecio('https://khushiconfecciones.com/app_khushi/insertar_precio_operacion.php',ultimaOperacion,precio);
                agregarOperacionProducto('https://khushiconfecciones.com/app_khushi/insert_operacion_a_producto.php',ultimaOperacion);
                
                let subparteId = document.getElementById("subparte-id").textContent;
                let productoId = document.getElementById("producto-id").textContent;
                
                cargarOperaciones(subparteId,productoId);
                console.log("Última operación obtenida______:", ultimaOperacion);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }
    alert('Datos enviados correctamente.');
}




