document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");
    const nombre = urlParams.get("producto");
    const precio = urlParams.get("precio");
    const imagen = urlParams.get("imagen");

    document.getElementById("producto-id").textContent = id;
    document.getElementById("producto-nombre").textContent = nombre;
    document.getElementById("producto-precio").textContent = `$${precio}`;

    if (imagen) {
        document.getElementById("producto-imagen").src = imagen;
    } else {
        document.getElementById("producto-imagen").style.display = "none";
    }

    if (id) {
        fetch(`https://khushiconfecciones.com/app_khushi/buscar_subparte.php?id_producto=${id}`)
            .then((response) => response.json())
            .then((data) => {
                const subpartesContainer = document.getElementById("subpartes-container");
                subpartesContainer.innerHTML = ""; // limpiar contenido anterior

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
                        btn.href = `detalle_subparte/detalle_subparte.html?id_subparte=${subparte.id_subparte}&subparte=${subparte.subparte}&id_producto=${id}`;
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
                document.getElementById("subpartes-container").innerHTML =
                    "<p>Error al cargar las subpartes.</p>";
            });
    }
});
