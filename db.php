<?php
// ============================================
//  FILE: db.php
//  PURPOSE: Database Connection
//  Place this file in your project root
//  Include it in every PHP file with:
//  require_once 'db.php';
// ============================================

$host     = "localhost";
$dbname   = "iiui_gym";
$username = "root";
$password = "";          // XAMPP default is empty

$conn = new mysqli($host, $username, $password, $dbname);

if ($conn->connect_error) {
    die("<h3 style='color:red;font-family:sans-serif;'>
        ❌ Database connection failed: " . $conn->connect_error . "
        <br>Make sure XAMPP MySQL is running.
    </h3>");
}

$conn->set_charset("utf8");
?>