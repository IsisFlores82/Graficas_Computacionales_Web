<?php
namespace Ryneh\DishdashApi\Controllers;

use Ryneh\DishdashApi\Core\Database;

class PuntuacionesController {
    private $db;

    public function __construct() {
        $this->db = (new Database())->getConn();
    }
    
    public function registrarPuntuacion($data) {
        if (empty($data['name']) || empty($data['puntos'])) {
            echo json_encode([
                'status' => 'error',
                'message' => 'Los campos "name" y "puntos" son obligatorios'
            ]);
            return;
        }

        $name = $data['name'];
        $puntos = $data['puntos'];

        $stmt = $this->db->prepare("INSERT INTO puntuaciones (name, puntos) VALUES (?, ?)");
        $stmt->bind_param("si", $name, $puntos);

        if ($stmt->execute()) {
            echo json_encode([
                'status' => 'success',
                'message' => 'Puntuación registrada correctamente'
            ]);
        } else {
            echo json_encode([
                'status' => 'error',
                'message' => 'Error al registrar la puntuación'
            ]);
        }
    }

    public function mostrarPuntuaciones() {
        $result = $this->db->query("SELECT name, puntos FROM puntuaciones ORDER BY puntos DESC");

        if ($result->num_rows > 0) {
            $puntuaciones = [];
            while ($row = $result->fetch_assoc()) {
                $puntuaciones[] = $row;
            }
            echo json_encode([
                'status' => 'success',
                'data' => $puntuaciones
            ]);
        } else {
            echo json_encode([
                'status' => 'error',
                'message' => 'No se encontraron puntuaciones'
            ]);
        }
    }

}
?>
