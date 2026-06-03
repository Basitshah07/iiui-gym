<?php
// ============================================
//  FILE: db.php
//  PURPOSE: Database Connection
//  Place this file in your project root
//  Include it in every PHP file with:
//  require_once 'db.php';
// ============================================

// Load environment variables from .env file if it exists
if (file_exists(__DIR__ . '/.env')) {
    $env_file = file_get_contents(__DIR__ . '/.env');
    foreach (explode("\n", $env_file) as $line) {
        if (trim($line) && strpos($line, '=') !== false && strpos($line, '#') !== 0) {
            list($key, $value) = explode('=', $line, 2);
            $_ENV[trim($key)] = trim($value);
        }
    }
}

// Get database credentials from environment variables or defaults
$host     = $_ENV['DB_HOST'] ?? "localhost";
$dbname   = $_ENV['DB_NAME'] ?? "iiui_gym";
$username = $_ENV['DB_USER'] ?? "root";
$password = $_ENV['DB_PASS'] ?? "";

$conn = new mysqli($host, $username, $password, $dbname);

if ($conn->connect_error) {
    die("<h3 style='color:red;font-family:sans-serif;'>
        ❌ Database connection failed: " . $conn->connect_error . "
        <br>Make sure XAMPP MySQL is running.
    </h3>");
}

$conn->set_charset("utf8");
?>