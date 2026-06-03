<?php
// ============================================
//  FILE: login_process.php
//  PURPOSE: Authenticates admin credentials
//  against MySQL and starts admin session
// ============================================

session_start();
require_once 'db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header("Location: login.php");
    exit();
}

// ===== 1. Collect Input =====
$username = trim($_POST['username'] ?? '');
$password = trim($_POST['password'] ?? '');

// ===== 2. Basic check =====
if (empty($username) || empty($password)) {
    header("Location: login.php?error=Both+fields+are+required");
    exit();
}

// ===== 3. Query admins table (password stored as MD5) =====
$hashed = md5($password);

$stmt = $conn->prepare(
    "SELECT id, username FROM admins WHERE username = ? AND password = ?"
);
$stmt->bind_param("ss", $username, $hashed);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows === 1) {
    // ✅ Login success — set session
    $stmt->bind_result($id, $uname);
    $stmt->fetch();

    $_SESSION['admin_id']   = $id;
    $_SESSION['admin_name'] = $uname;
    $_SESSION['logged_in']  = true;

    $stmt->close();
    $conn->close();
    header("Location: dashboard.php");
    exit();
} else {
    // ❌ Wrong credentials
    $stmt->close();
    $conn->close();
    header("Location: login.php?error=Invalid+username+or+password");
    exit();
}
?>