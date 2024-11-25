<?php
namespace Ryneh\DishdashApi\Core;

use mysqli;

class Database {
    private $conn;

    public function __construct() {
        $host = 'localhost'; 
        $db = 'dishdash'; 
        $user = 'root'; 
        $pass = ''; 

        $this->conn = new mysqli($host, $user, $pass, $db);

        if ($this->conn->connect_error) {
            die("Conexión fallida: " . $this->conn->connect_error);
        }
    }

    public function getConn() {
        return $this->conn;
    }
}
