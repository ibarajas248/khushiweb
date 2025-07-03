function openSidebar() {
    document.getElementById("sidebar").classList.add("active");
}

function closeSidebar() {
    document.getElementById("sidebar").classList.remove("active");
}

// Cerrar sidebar si se hace clic fuera de él
document.addEventListener("click", function(event) {
    let sidebar = document.getElementById("sidebar");
    let sidebarBtn = document.querySelector(".sidebar-btn");

    if (!sidebar.contains(event.target) && !sidebarBtn.contains(event.target)) {
        sidebar.classList.remove("active");
    }
});

let datosCompletos = [];
let paginaActual = 1;
const registrosPorPagina = 20;
let datosFiltrados = []; // NUEVO array filtrado

document.addEventListener("DOMContentLoaded", function () {
    // Cargar datos desde el servidor
    fetch("https://khushiconfecciones.com/app_khushi/consultas_lotes/buscar_asignadas_completadas.php")
        .then(response => response.json())
        .then(data => {
            datosCompletos = data;
            datosFiltrados = data;
            cargarPagina(paginaActual);
        })
        .catch(error => {
            console.error("Error al cargar los datos:", error);
            document.getElementById("mensaje-error").textContent = "Error al cargar los datos.";
        });

    // 👉 Filtro general
    document.getElementById("buscador").addEventListener("input", function () {
        const texto = this.value.toLowerCase();

        datosFiltrados = datosCompletos.filter(item =>
            (item.producto && item.producto.toLowerCase().includes(texto)) ||
            (item.nombre && item.nombre.toLowerCase().includes(texto)) ||
            (item.Apellidos && item.Apellidos.toLowerCase().includes(texto)) ||
            (item.lote && item.lote.toLowerCase().includes(texto))
        );

        paginaActual = 1;
        cargarPagina(paginaActual);
    });

    // 👉 Filtros por columna
    [
        "filtro-id", "filtro-producto", "filtro-subparte", "filtro-operaciones",
        "filtro-nombre", "filtro-apellidos", "filtro-lote", "filtro-fecha"
    ].forEach(id => {
        const input = document.getElementById(id);
        input.addEventListener("input", aplicarFiltrosPorColumna);
    });
});

function cargarPagina(pagina) {
    const tbody = document.getElementById("productos-tbody");
    tbody.innerHTML = "";

    const inicio = (pagina - 1) * registrosPorPagina;
    const fin = inicio + registrosPorPagina;
    const datosPaginados = datosFiltrados.slice(inicio, fin);

    datosPaginados.forEach(item => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${item.id_lotes_operaciones}</td>
            <td>${item.producto}</td>
            <td>${item.subparte}</td>
            <td>${item.operaciones}</td>
            <td>${item.cantidad}</td>
            <td>${item.nombre}</td>
            <td>${item.Apellidos}</td>
            <td>${item.lote}</td>
            <td>${item.cantidad}</td>
            <td>${item.fecha}</td>
        `;
        tbody.appendChild(fila);
    });

    actualizarBotones();
}


function actualizarBotones() {
    const paginacionDiv = document.getElementById("paginacion");
    paginacionDiv.innerHTML = "";
    const totalPaginas = Math.ceil(datosCompletos.length / registrosPorPagina);

    for (let i = 1; i <= totalPaginas; i++) {
        const boton = document.createElement("button");
        boton.textContent = i;
        boton.onclick = () => {
            paginaActual = i;
            cargarPagina(paginaActual);
        };
        paginacionDiv.appendChild(boton);
    }
}


function actualizarBotones() {
    const totalPaginas = Math.ceil(datosCompletos.length / registrosPorPagina);

    document.getElementById("pagina-actual").textContent = `Página ${paginaActual} de ${totalPaginas}`;

    const btnAnterior = document.getElementById("btn-anterior");
    const btnSiguiente = document.getElementById("btn-siguiente");

    btnAnterior.disabled = paginaActual === 1;
    btnSiguiente.disabled = paginaActual === totalPaginas;

    btnAnterior.onclick = () => {
        if (paginaActual > 1) {
            paginaActual--;
            cargarPagina(paginaActual);
        }
    };

    btnSiguiente.onclick = () => {
        if (paginaActual < totalPaginas) {
            paginaActual++;
            cargarPagina(paginaActual);
        }
    };
}

document.getElementById("btnDescargarExcel").addEventListener("click", function () {
    const datosParaExcel = datosCompletos.map(item => ({
        ID: item.id_lotes_operaciones,
        Producto: item.producto,
        Subparte: item.subparte,
        Operaciones: item.operaciones,
        Cantidad: item.cantidad,
        Nombre: item.nombre,
        Apellidos: item.Apellidos,
        Lote: item.lote,
        Fecha: item.fecha
    }));

    const worksheet = XLSX.utils.json_to_sheet(datosParaExcel);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Operaciones");

    XLSX.writeFile(workbook, "operaciones_completadas.xlsx");
});

function aplicarFiltrosPorColumna() {
  const filtros = {
    id: document.getElementById("filtro-id").value.toLowerCase(),
    producto: document.getElementById("filtro-producto").value.toLowerCase(),
    subparte: document.getElementById("filtro-subparte").value.toLowerCase(),
    operaciones: document.getElementById("filtro-operaciones").value.toLowerCase(),
    nombre: document.getElementById("filtro-nombre").value.toLowerCase(),
    apellidos: document.getElementById("filtro-apellidos").value.toLowerCase(),
    lote: document.getElementById("filtro-lote").value.toLowerCase(),
    fecha: document.getElementById("filtro-fecha").value.toLowerCase(),
  };

  datosFiltrados = datosCompletos.filter(item =>
    (!filtros.id || (item.id_lotes_operaciones + '').toLowerCase().includes(filtros.id)) &&
    (!filtros.producto || item.producto.toLowerCase().includes(filtros.producto)) &&
    (!filtros.subparte || item.subparte.toLowerCase().includes(filtros.subparte)) &&
    (!filtros.operaciones || item.operaciones.toLowerCase().includes(filtros.operaciones)) &&
    (!filtros.nombre || item.nombre.toLowerCase().includes(filtros.nombre)) &&
    (!filtros.apellidos || item.Apellidos.toLowerCase().includes(filtros.apellidos)) &&
    (!filtros.lote || item.lote.toLowerCase().includes(filtros.lote)) &&
    (!filtros.fecha || item.fecha.toLowerCase().includes(filtros.fecha))
  );

  paginaActual = 1;
  cargarPagina(paginaActual);
}

