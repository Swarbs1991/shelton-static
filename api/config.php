<?php
$host = "localhost";
$db   = "recipes";
$user = "recipes";
$pass = "R3c1p35";

$conn = new PDO("mysql:host=$host;dbname=$db", $user, $pass);
$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
