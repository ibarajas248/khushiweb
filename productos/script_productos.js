
let productosOriginales = []; // Aquí se guarda la lista completa

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
                productosOriginales = data;
                mostrarProductos(productosOriginales);

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
    const inputBusqueda = document.getElementById("buscador-productos");
if (inputBusqueda) {
  inputBusqueda.addEventListener("input", filtrarProductos);
}
}

function mostrarProductos(data) {
  const grid = document.getElementById("productos-grid");
  if (!grid) return;
  grid.innerHTML = "";

  data.forEach(producto => {
    const tieneImagen = producto.url_foto && producto.url_foto.trim() !== "";

 const imagenHTML = tieneImagen
  ? `
    <div class="ratio ratio-4x3">
      <img src="${producto.url_foto}" class="card-img-top rounded-top object-fit-cover" alt="${producto.producto}" style="width: 100%; height: 100%; object-position: center;">
    </div>
  `
  : `
    <div class="ratio ratio-4x3 d-flex align-items-center justify-content-center bg-light rounded-top position-relative">
      <i class="bi bi-image" style="font-size: 3rem; color: #aaa;"></i>
      <button 
        class="btn btn-sm btn-primary position-absolute bottom-0 mb-2" 
        style="z-index: 1;" 
        onclick="subirImagenClick(event, ${producto.id_producto})"
      >
        <i class="bi bi-upload"></i> Subir Imagen
      </button>
      <input 
        type="file" 
        id="input-${producto.id_producto}" 
        style="display: none;" 
        accept="image/*" 
        onchange="handleImageUpload(event, ${producto.id_producto})" 
        onclick="event.stopPropagation();"
      />
    </div>
  `;

  



    const col = document.createElement("div");
    col.className = "col-md-4 col-sm-6 mb-4";

    col.innerHTML = `
      <div class="card h-100 shadow-sm">
        ${imagenHTML}
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${producto.producto}</h5>
          <p class="card-text">Precio: $${Number(producto.precio).toLocaleString()}</p>
          <div class="mt-auto d-flex justify-content-between">
            <button class="btn btn-sm btn-warning text-white"   style="background-color: rgb(89, 154, 216); border: 2px solid #2f75b5;" onclick="event.stopPropagation(); editarProducto(${producto.id_producto})">
              <i class="bi bi-pencil"></i> Editar
            </button>
            <button class="btn btn-sm btn-danger" onclick="event.stopPropagation(); eliminarProducto(${producto.id_producto})">
              <i class="bi bi-trash"></i> Eliminar
            </button>
          </div>
        </div>
      </div>
    `;

    col.onclick = () => {
      window.location.href = `detalle/detalle.html?id=${producto.id_producto}&producto=${encodeURIComponent(producto.producto)}&precio=${producto.precio}&imagen=${encodeURIComponent(producto.url_foto || '')}`;
    };

    grid.appendChild(col);
  });
}

function subirImagenClick(event, id_producto) {
  event.stopPropagation(); // ✋ detiene que se dispare el click del contenedor
  document.getElementById(`input-${id_producto}`).click();
}

async function handleImageUpload(event, id_producto) {
  const file = event.target.files[0];
  if (!file) return;

  try {
    // 1. Leer la imagen como objeto Image
    const imageBitmap = await createImageBitmap(file);
    
    // 2. Crear un canvas para redimensionar/comprimir
    const canvas = document.createElement('canvas');
    const maxWidth = 800; // máx ancho
    const maxHeight = 800; // máx alto

    let width = imageBitmap.width;
    let height = imageBitmap.height;

    // Mantener relación de aspecto
    if (width > height && width > maxWidth) {
      height = Math.round(height * (maxWidth / width));
      width = maxWidth;
    } else if (height > maxHeight) {
      width = Math.round(width * (maxHeight / height));
      height = maxHeight;
    }

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(imageBitmap, 0, 0, width, height);

    // 3. Convertir a Blob comprimido (JPEG, calidad 0.7)
    const compressedBlob = await new Promise(resolve => {
      canvas.toBlob(resolve, 'image/jpeg', 0.7);
    });

    // 4. Subir a Firebase Storage
    const nombreArchivo = `productos/${id_producto}_${Date.now()}.jpg`;
    const storageRef = window.firebaseRef(window.firebaseStorage, nombreArchivo);

    const snapshot = await window.firebaseUploadBytes(storageRef, compressedBlob);
    const url = await window.firebaseGetDownloadURL(snapshot.ref);
    console.log("Imagen comprimida subida:", url);

    // 5. Enviar URL al backend
    const formData = new FormData();
    formData.append("id_producto", id_producto);
    formData.append("url_foto", url);

    const response = await fetch("https://khushiconfecciones.com/app_khushi/editar_producto_url.php", {
      method: "POST",
      body: formData
    });

    const respuesta = await response.text();
    console.log("Respuesta del servidor:", respuesta);
    alert("Imagen comprimida y subida correctamente");
    location.reload();
  } catch (error) {
    console.error("Error al comprimir o subir imagen:", error);
    alert("Error al subir imagen");
  }
}



function editarProducto(idProducto) {
  // Puedes usar prompt() para una edición rápida, o mostrar un modal si prefieres interfaz visual
  const nuevoNombre = prompt("Nuevo nombre del producto:");
  const nuevoPrecio = prompt("Nuevo precio del producto:");
  const idEmpresa = document.getElementById("id_empresa")?.value || 1;

  // Validaciones básicas
  if (!nuevoNombre || !nuevoPrecio || isNaN(nuevoPrecio)) {
    alert("Datos inválidos. Inténtalo de nuevo.");
    return;
  }

  // Petición POST al backend
  fetch("https://khushiconfecciones.com/app_khushi/editar_producto.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams({
      producto: nuevoNombre,
      precio: nuevoPrecio,
      id_producto: idProducto,
      id_empresa: idEmpresa
    })
  })
  .then(response => response.text())
  .then(data => {
    console.log("Respuesta de edición:", data);
    alert("Producto editado satisfactoriamente");
    obtenerProductos(apiUrl); // Recargar la lista
  })
  .catch(error => {
    console.error("Error al editar el producto:", error);
    alert("Error al editar el producto");
  });
}



async function eliminarProducto(idProducto) {
  console.log("Firebase deleteObject:", window.firebaseDeleteObject);
  const confirmar = confirm("¿Estás seguro de que deseas eliminar este producto?");
  if (!confirmar) return;

  // Buscar el producto en la lista original
  const producto = productosOriginales.find(p => p.id_producto == idProducto);
  const urlImagen = producto?.url_foto || "";

  // Si la imagen está en Firebase, eliminarla también
  if (urlImagen.includes("firebasestorage.googleapis.com")) {
    try {
      // Extraer la ruta codificada
      const encodedPath = urlImagen.split("/o/")[1].split("?")[0]; // ejemplo: productos%2Ffoto.jpg
      const storagePath = decodeURIComponent(encodedPath); // → productos/foto.jpg

      // Crear referencia y eliminar
      const storageRef = window.firebaseRef(window.firebaseStorage, storagePath);
      await window.firebaseDeleteObject(storageRef);
      console.log("✅ Imagen eliminada de Firebase");
    } catch (error) {
      console.error("❌ Error al eliminar imagen de Firebase:", error);
      alert("Error eliminando imagen en Firebase. Asegúrate de que la URL esté bien.");
    }
  }

  // Eliminar del backend en MySQL
  fetch("https://khushiconfecciones.com/app_khushi/eliminar_producto.php", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `id_producto=${idProducto}`
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        alert("Producto eliminado correctamente");
        obtenerProductos(apiUrl); // Recargar productos
      } else {
        alert("No se pudo eliminar el producto: " + data.message);
      }
    })
    .catch(error => {
      console.error("❌ Error al eliminar en el servidor:", error);
      alert("Error al eliminar el producto.");
    });
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
function filtrarProductos() {
  const textoBusqueda = document.getElementById("buscador-productos").value.toLowerCase();
  
  const productosFiltrados = productosOriginales.filter(producto =>
    producto.producto.toLowerCase().includes(textoBusqueda)
  );

  mostrarProductos(productosFiltrados); // Renderiza solo los productos filtrados
}
