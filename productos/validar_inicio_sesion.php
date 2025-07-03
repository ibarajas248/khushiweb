<?php
include 'conexion_1.php';
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST");

$usuario = $_GET['usuario'];
$contraseniaCodificada = $_GET['contrasenia'];
$contrasenia = urldecode($contraseniaCodificada);

// Escapar los valores para evitar problemas con caracteres especiales
$usuario = $conexion->real_escape_string($usuario);
$contrasenia = $conexion->real_escape_string($contrasenia); // No es necesario el urldecode aquí

$consulta = "SELECT * FROM empleados WHERE usuario ='$usuario' AND contrasenia ='$contrasenia'";
$resultado = $conexion->query($consulta);

if ($resultado) {
    $producto = [];
    while ($fila = $resultado->fetch_array()) {
        $producto[] = array_map('utf8_encode', $fila);
    }
    echo json_encode($producto);
    $resultado->close();
} else {
    // Manejo de errores si la consulta no se ejecuta correctamente
    echo "Error en la consulta: " . $conexion->error;
}

// Cierra la conexión a la base de datos al finalizar
$conexion->close();
?>
