<?php
// ============================================
//  FILE: register_process.php
//  PURPOSE: Handles member registration form
//  submission and saves data to MySQL
// ============================================

require_once 'db.php';

// Only accept POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header("Location: register.php");
    exit();
}

// ===== 1. Collect & Sanitize Input =====
$full_name        = trim($_POST['full_name']        ?? '');
$email            = trim($_POST['email']            ?? '');
$phone            = trim($_POST['phone']            ?? '');
$plan             = trim($_POST['plan']             ?? 'basic');
$joined_date      = trim($_POST['joined_date']      ?? '');
$password         = trim($_POST['password']         ?? '');
$confirm_password = trim($_POST['confirm_password'] ?? '');

// ===== 2. Server-side Validation =====
if (strlen($full_name) < 3) {
    header("Location: register.php?error=Name+must+be+at+least+3+characters");
    exit();
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    header("Location: register.php?error=Invalid+email+address");
    exit();
}

if (!preg_match('/^(03\d{2}[-\s]?\d{7}|0\d{10})$/', $phone)) {
    header("Location: register.php?error=Invalid+phone+number+format");
    exit();
}

$allowed_plans = ['basic', 'standard', 'premium'];
if (!in_array($plan, $allowed_plans)) {
    $plan = 'basic';
}

if (empty($joined_date)) {
    $joined_date = date('Y-m-d');
}

// Auto calculate expiry = joined_date + 1 month
$expiry_date = date('Y-m-d', strtotime($joined_date . ' +1 month'));

// ===== Password Validation =====
if (strlen($password) < 6) {
    header("Location: register.php?error=Password+must+be+at+least+6+characters");
    exit();
}

if ($password !== $confirm_password) {
    header("Location: register.php?error=Passwords+do+not+match");
    exit();
}

$hashed_password = md5($password);

// ===== 3. Check if email already exists =====
$check = $conn->prepare("SELECT id FROM members WHERE email = ?");
$check->bind_param("s", $email);
$check->execute();
$check->store_result();

if ($check->num_rows > 0) {
    $check->close();
    header("Location: register.php?error=This+email+is+already+registered");
    exit();
}
$check->close();

// ===== 4. Insert into Database =====
$stmt = $conn->prepare(
    "INSERT INTO members (full_name, email, phone, plan, joined_date, expiry_date, status, password)
     VALUES (?, ?, ?, ?, ?, ?, 'active', ?)"
);
$stmt->bind_param("sssssss", $full_name, $email, $phone, $plan, $joined_date, $expiry_date, $hashed_password);

if ($stmt->execute()) {
    $stmt->close();
    $conn->close();
    header("Location: register.php?success=1");
    exit();
} else {
    $stmt->close();
    $conn->close();
    header("Location: register.php?error=Something+went+wrong.+Please+try+again.");
    exit();
}
?>