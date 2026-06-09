<?php
require "config.php";

function handleUsers($method) {
    global $conn;

    if ($method === "GET") {
        $stmt = $conn->query("SELECT * FROM users");
        $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($users);
    }

    elseif ($method === "POST") {
        $data = json_decode(file_get_contents("php://input"), true);

        $stmt = $conn->prepare("INSERT INTO users (name, email) VALUES (?, ?)");
        $stmt->execute([$data['name'], $data['email']]);

        echo json_encode(["message" => "User created"]);
    }

    else {
        http_response_code(405);
        echo json_encode(["error" => "Method not allowed"]);
    }
}
