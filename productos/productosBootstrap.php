<?php
session_start();

if (!isset($_SESSION['logueado']) || $_SESSION['logueado'] !== true) {
    header("Location: ../index.html");
    exit();
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Productos</title>
  
  <!-- Bootstrap CSS -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />
  <!-- Bootstrap Icons -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css" rel="stylesheet" />
  <link rel="stylesheet" href="style.css">
</head>
<body>

  <nav class="navbar navbar-dark bg-dark sticky-top d-md-none">
    <div class="container-fluid">
      <button class="btn btn-outline-light" type="button" data-bs-toggle="offcanvas" data-bs-target="#mobileMenu" aria-controls="mobileMenu">
        <i class="bi bi-list"></i>
      </button>
      <span class="navbar-brand ms-2">Khushi confecciones</span>
    </div>
  </nav>

  <!-- Sidebar para móviles (offcanvas) -->
  <div class="offcanvas offcanvas-start d-md-none" tabindex="-1" id="mobileMenu" aria-labelledby="mobileMenuLabel">
    <div class="offcanvas-header">
      <h5 class="offcanvas-title" id="mobileMenuLabel">Menú</h5>
      <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Cerrar"></button>
    </div>
    <div class="offcanvas-body">
      <ul class="nav flex-column">
        <li class="nav-item"><a class="nav-link active" href="#"><i class="bi bi-house-fill"></i> Dashboard</a></li>
        <li class="nav-item"><a class="nav-link" href="#"><i class="bi bi-file-earmark"></i> Orders</a></li>
        <li class="nav-item"><a class="nav-link" href="#"><i class="bi bi-cart"></i> Products</a></li>
        <li class="nav-item"><a class="nav-link" href="#"><i class="bi bi-people"></i> Customers</a></li>
        <li class="nav-item"><a class="nav-link" href="#"><i class="bi bi-graph-up"></i> Reports</a></li>
        <li class="nav-item"><a class="nav-link" href="#"><i class="bi bi-puzzle"></i> Integrations</a></li>
      </ul>
      <hr>
      <h6 class="text-muted text-uppercase">Saved reports</h6>
      <ul class="nav flex-column mb-auto">
        <li class="nav-item"><a class="nav-link" href="#"><i class="bi bi-file-earmark-text"></i> Current month</a></li>
        <li class="nav-item"><a class="nav-link" href="#"><i class="bi bi-file-earmark-text"></i> Last quarter</a></li>
        <li class="nav-item"><a class="nav-link" href="#"><i class="bi bi-file-earmark-text"></i> Social engagement</a></li>
        <li class="nav-item"><a class="nav-link" href="#"><i class="bi bi-file-earmark-text"></i> Year-end sale</a></li>
      </ul>
      <hr>
      <ul class="nav flex-column mb-auto">
        <li class="nav-item"><a class="nav-link" href="#"><i class="bi bi-gear-wide-connected"></i> Settings</a></li>
        <li class="nav-item"><a class="nav-link" href="../logout.php"><i class="bi bi-door-closed"></i> Cerrar sesión</a></li>
      </ul>
    </div>
  </div>

  <div class="container-fluid">
    <div class="row">
      <!-- Sidebar fijo para pantallas grandes -->
      <nav class="col-md-3 col-lg-2 d-none d-md-block bg-light sidebar p-3">
        <div class="sidebar">
          <ul class="nav flex-column">
            <li class="nav-item"><a class="nav-link active" href="#"><i class="bi bi-house-fill"></i> Inicio</a></li>
            <li class="nav-item"><a class="nav-link" href="productos/productos.html"><i class="bi bi-file-earmark"></i> Productos</a></li>
            <li class="nav-item"><a class="nav-link" href="#"><i class="bi bi-cart"></i> Orden de compra</a></li>
            <li class="nav-item"><a class="nav-link" href="#"><i class="bi bi-people"></i> Operaciones asignadas</a></li>
            <li class="nav-item"><a class="nav-link" href="#"><i class="bi bi-people"></i> Operaciones completadas</a></li>
            <li class="nav-item"><a class="nav-link" href="#"><i class="bi bi-graph-up"></i> Seguimiento</a></li>
            <li class="nav-item"><a class="nav-link" href="#"><i class="bi bi-puzzle"></i> Perfil</a></li>
            <li class="nav-item"><a class="nav-link" href="#"><i class="bi bi-puzzle"></i> Tiempos</a></li>
            <li class="nav-item"><a class="nav-link" href="#"><i class="bi bi-puzzle"></i> Insumos</a></li>
            <li class="nav-item"><a class="nav-link" href="#"><i class="bi bi-puzzle"></i> Distribución de insumos</a></li>
          </ul>
          <hr>
          <h6 class="text-muted text-uppercase">Saved reports</h6>
          <ul class="nav flex-column mb-auto">
            <li class="nav-item"><a class="nav-link" href="#"><i class="bi bi-file-earmark-text"></i> Current month</a></li>
            <li class="nav-item"><a class="nav-link" href="#"><i class="bi bi-file-earmark-text"></i> Last quarter</a></li>
            <li class="nav-item"><a class="nav-link" href="#"><i class="bi bi-file-earmark-text"></i> Social engagement</a></li>
            <li class="nav-item"><a class="nav-link" href="#"><i class="bi bi-file-earmark-text"></i> Year-end sale</a></li>
          </ul>
          <hr>
          <ul class="nav flex-column mb-auto">
            <li class="nav-item"><a class="nav-link" href="#"><i class="bi bi-gear-wide-connected"></i> Ajustes</a></li>
            <li class="nav-item"><a class="nav-link" href="../logout.php"><i class="bi bi-door-closed"></i> Cerrar sesión</a></li>
          </ul>
        </div>
      </nav>

      <!-- Formulario y contenido principal -->
      <main class="col-md-9 ms-sm-auto col-lg-10 px-md-4 py-4">
        <div class="card p-4">
          <h2 class="mb-4">Agregar Producto</h2>
          <form id="productoForm">
            <div class="mb-3">
              <label for="producto" class="form-label">Producto</label>
              <input type="text" class="form-control" id="producto" name="producto" required>
            </div>
            <div class="mb-3">
              <label for="precio" class="form-label">Precio</label>
              <input type="number" step="0.01" class="form-control" id="precio" name="precio" required>
            </div>
            <div class="mb-3 d-none">
              <label for="id_empresa" class="form-label">ID Empresa</label>
              <input type="number" class="form-control" id="id_empresa" name="id_empresa" value="1" required>
            </div>
            <button type="submit" class="btn btn-primary">Enviar</button>
          </form>

          <!-- Mensajes -->
          <p id="mensaje" class="mt-3"></p>
          <p id="loading-message" class="text-warning mt-2" style="display:none;">Cargando...</p>
          <p id="response-message" class="text-success mt-2" style="display:none;"></p>
        </div>

        <div class="mb-4">
          <input type="text" id="buscador-productos" class="form-control" placeholder="Buscar producto...">
        </div>

        <div class="row mt-5" id="productos-grid"></div>
      </main>
    </div>
  </div>

  <!-- Footer -->
  <footer class="bg-dark text-white text-center py-3">
    <p class="mb-0">&copy; 2025 ERP Confección Textil</p>
  </footer>

  <!-- Scripts -->
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
  <script src="../productos/script_productos.js"></script>
</body>
</html>
