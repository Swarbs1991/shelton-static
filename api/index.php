<?php
header("Content-Type: application/json");

$method = $_SERVER['REQUEST_METHOD'];
$path   = trim($_SERVER['REQUEST_URI'], "/");

if ($path === "api/users") {
    require "users.php";
    handleUsers($method);
} else {
    http_response_code(404);
    echo json_encode(["error" => "Endpoint not found"]);
}
