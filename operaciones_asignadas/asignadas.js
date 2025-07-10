let habilitados = [];

    document.addEventListener("DOMContentLoaded", () => {
      cargarTareas(1);
    });

    function cargarTareas(idEmpresa) {
      const url = `https://khushiconfecciones.com/app_khushi/consultas_lotes/buscar_todas_tareas_asignadas.php?id_empresa=${idEmpresa}`;

      document.getElementById("mensaje-error").textContent = "Cargando...";

      fetch(url)
        .then(res => res.json())
        .then(data => {
          const tbody = document.getElementById("tabla-tareas");
          tbody.innerHTML = "";
          document.getElementById("mensaje-error").textContent = "";

          habilitados = [];

          data.forEach(item => {
            let empleado = item.empleado?.trim() || "no asignado";

            if (item.habilitado === "si" && item.completado === "no") {
              habilitados.push(empleado);
            }

            const fila = document.createElement("tr");
            fila.innerHTML = `
              <td>${item.producto}</td>
              <td>${item.subparte}</td>
              <td>${item.operaciones}</td>
              <td>${item.id_lotes_operaciones}</td>
              <td>${item.cantidad}</td>
              <td>${empleado}</td>
              <td>${item.nombre}</td>
              <td>${item.Apellidos}</td>
              <td>${item.lote}</td>
              <td>${item.completado}</td>
              <td>${item.habilitado}</td>
              <td>${item.fecha}</td>
            `;

            fila.addEventListener("contextmenu", (e) => {
              e.preventDefault();
              mostrarDetalle(item);
            });

            tbody.appendChild(fila);
          });
        })
        .catch(error => {
          console.error("Error:", error);
          document.getElementById("mensaje-error").textContent = "Error de conexión.";
        });
    }

    function mostrarDetalle(item) {
      document.getElementById("detalleProducto").textContent = item.producto;
      document.getElementById("detalleSubparte").textContent = item.subparte;
      document.getElementById("detalleOperaciones").textContent = item.operaciones;
      document.getElementById("detalleCantidad").textContent = item.cantidad;
      document.getElementById("detalleNombre").textContent = item.nombre;
      document.getElementById("detalleApellidos").textContent = item.Apellidos;
      document.getElementById("detalleHabilitado").textContent = item.habilitado;

      document.getElementById("tarjetaDetalle").style.display = "block";
    }

    function cerrarDetalle() {
      document.getElementById("tarjetaDetalle").style.display = "none";
    }