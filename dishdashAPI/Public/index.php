<?php
require '../vendor/autoload.php';

use Ryneh\DishdashApi\Controllers\PuntuacionesController;

header("Content-Type: application/json");
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$path = str_replace('/Public', '', $path);
error_log("Ruta solicitada: " . $path);
$requestMethod = $_SERVER['REQUEST_METHOD'];
$data = json_decode(file_get_contents("php://input"), true);

$controller = new PuntuacionesController();

switch ($path) {

    case '/api/puntuaciones/registro':
        if ($requestMethod === 'POST') {
            $controller->registrarPuntuacion($data);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Método no permitido']);
        }
    break;

    case '/api/puntuaciones':
        if ($requestMethod === 'GET') {
            $controller->mostrarPuntuaciones();
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Método no permitido']);
        }
    break;

    
    default:
        echo json_encode(['status' => 'error', 'message' => 'Endpoint no encontrado']);
    break;
}
?>