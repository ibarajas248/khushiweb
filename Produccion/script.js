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

document.addEventListener("DOMContentLoaded", function () {
    fetch("http://khushiconfecciones.com/app_khushi/consultas_lotes/buscar_asignadas_completadas.php")
        .then(response => response.json())
        .then(data => {
            datosCompletos = data;
            cargarPagina(paginaActual);
        })
        .catch(error => {
            console.error("Error al cargar los datos:", error);
            document.getElementById("mensaje-error").textContent = "Error al cargar los datos.";
        });
});

function cargarPagina(pagina) {
    const tbody = document.getElementById("productos-tbody");
    tbody.innerHTML = "";

    const inicio = (pagina - 1) * registrosPorPagina;
    const fin = inicio + registrosPorPagina;
    const datosPaginados = datosCompletos.slice(inicio, fin);

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