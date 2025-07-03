document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const id_producto = urlParams.get("id");
  const nombre = urlParams.get("producto");
  const precio = urlParams.get("precio");
  const imagen = urlParams.get("imagen");
  const listaConsumos = []; // Arreglo para guardar los consumos

  // Mostrar datos del producto
  document.getElementById("producto-id").textContent = id_producto;
  document.getElementById("producto-nombre").textContent = nombre;
  document.getElementById("producto-precio").textContent = `$${precio}`;
  if (imagen) {
    document.getElementById("producto-imagen").src = imagen;
  } else {
    document.getElementById("producto-imagen").style.display = "none";
  }

  // Llenar el spinner de subpartes
  Spinnersubparte("https://khushiconfecciones.com/app_khushi/spinner_subparte.php");

  // Cargar subpartes asociadas
  if (id_producto) {
    fetch(`https://khushiconfecciones.com/app_khushi/buscar_subparte.php?id_producto=${id_producto}`)
      .then((response) => response.json())
      .then((data) => {
        const subpartesContainer = document.getElementById("subpartes-container");
        subpartesContainer.innerHTML = "";

        if (data.length > 0) {
          data.forEach((subparte) => {
            const col = document.createElement("div");
            col.classList.add("col-12", "col-md-6", "col-lg-4", "mb-3");

            const card = document.createElement("div");
            card.classList.add("card", "h-100", "shadow");

            const cardBody = document.createElement("div");
            cardBody.classList.add("card-body");

            const title = document.createElement("h5");
            title.classList.add("card-title");
            title.textContent = `#${subparte.id_subparte}`;

            const text = document.createElement("p");
            text.classList.add("card-text");
            text.textContent = subparte.subparte;

            const btn = document.createElement("a");
            btn.classList.add("btn", "btn-primary", "mt-2");
            btn.href = `detalle_subparte/detalle_subparte.html?id_subparte=${subparte.id_subparte}&subparte=${subparte.subparte}&id_producto=${id_producto}`;
            btn.textContent = "Ver Detalles";

            cardBody.appendChild(title);
            cardBody.appendChild(text);
            cardBody.appendChild(btn);
            card.appendChild(cardBody);
            col.appendChild(card);
            subpartesContainer.appendChild(col);
          });
        } else {
          subpartesContainer.innerHTML = "<p>No hay subpartes registradas.</p>";
        }
      })
      .catch((error) => {
        console.error("Error al obtener las subpartes:", error);
        document.getElementById("subpartes-container").innerHTML = "<p>Error al cargar las subpartes.</p>";
      });
  }

  // Asociar subparte al producto
  document.getElementById("btn-asociar").addEventListener("click", () => {
    const select = document.getElementById("spinnersubparte");
    const id_subparte = select.value;
    const subparte = select.options[select.selectedIndex]?.text;

    if (!id_producto || !id_subparte) {
      alert("Debes seleccionar una subparte válida.");
      return;
    }

    const formData = new URLSearchParams();
    formData.append("subparte", subparte);
    formData.append("id_producto", id_producto);
    formData.append("id_subparte", id_subparte);

    fetch("https://khushiconfecciones.com/app_khushi/asociar_producto_subparte.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: formData.toString()
    })
      .then(response => response.text())
      .then(data => {
        console.log("Respuesta del servidor:", data);
        alert("✅ Subparte asociada correctamente");
        window.location.reload();
      })
      .catch(error => {
        console.error("Error en la solicitud:", error);
        alert("❌ Hubo un error al asociar la subparte.");
      });
  });

  // ✅ Finalmente: cargar los consumos
  if (id_producto) {
    cargarConsumos(id_producto);
  }
});

// ======================== FUNCIONES ============================= //

function Spinnersubparte(URL) {
  const select = document.getElementById("spinnersubparte");
  select.innerHTML = '<option value="">Selecciona una subparte</option>';

  fetch(URL)
    .then(response => response.json())
    .then(data => {
      if (!Array.isArray(data)) throw new Error("Respuesta inválida del servidor");

      data.forEach(item => {
        const option = document.createElement("option");
        option.value = item.id;
        option.textContent = item.subparte;
        select.appendChild(option);
      });
    })
    .catch(error => {
      console.error("Error al cargar subpartes:", error);
      alert("No se pudo cargar la lista de subpartes.");
    });
}

function cargarConsumos(id_producto) {
  const url = 'https://khushiconfecciones.com/app_khushi/producto/mostrar_consumos.php';
  const listaDiv = document.getElementById('consumos-container'); // 👈 usa el nuevo contenedor
  listaDiv.innerHTML = '';

  const formData = new FormData();
  formData.append('id_producto', id_producto);

  fetch(url, {
    method: 'POST',
    body: formData,
  })
    .then(res => res.json())
    .then(jsonArray => {
      jsonArray.forEach(obj => {
        const nombre = obj.nombre || '';
        const cantidad = obj.cantidad || '';

        const col = document.createElement('div');
        col.className = 'col-12 col-md-6 col-lg-4 mb-3';

        const card = document.createElement('div');
        card.className = 'card h-100 shadow consumo-item';
        card.style.cursor = 'pointer';

        const cardBody = document.createElement('div');
        cardBody.className = 'card-body';

        const title = document.createElement('h5');
        title.className = 'card-title text-primary';
        title.textContent = nombre;

        const cantidadText = document.createElement('p');
        cantidadText.className = 'card-text mb-2';
        cantidadText.textContent = `Cantidad: ${cantidad}`;

        cardBody.appendChild(title);
        cardBody.appendChild(cantidadText);
        card.appendChild(cardBody);
        col.appendChild(card);
        listaDiv.appendChild(col);
      });
    })
    .catch(error => {
      console.error("Error cargando consumos", error);
      alert("Error al cargar consumos");
    });
}

