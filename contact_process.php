<?php
// ============================================
//  FILE: contact_process.php
//  PURPOSE: Receives contact form POST data
//  and saves message to MySQL contacts table
// ============================================

require_once 'db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header("Location: contact.php");
    exit();
}

// ===== 1. Collect & Sanitize =====
$name    = trim($_POST['name']    ?? '');
$email   = trim($_POST['email']   ?? '');
$message = trim($_POST['message'] ?? '');

// ===== 2. Validate =====
if (strlen($name) < 2) {
    header("Location: contact.php?error=Please+enter+your+name");
    exit();
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    header("Location: contact.php?error=Invalid+email+address");
    exit();
}

if (strlen($message) < 10) {
    header("Location: contact.php?error=Message+must+be+at+least+10+characters");
    exit();
}

// ===== 3. Insert into Database =====
$stmt = $conn->prepare(
    "INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)"
);
$stmt->bind_param("sss", $name, $email, $message);

if ($stmt->execute()) {
    $stmt->close();
    $conn->close();
    header("Location: contact.php?success=1");
    exit();
} else {
    $stmt->close();
    $conn->close();
    header("Location: contact.php?error=Could+not+send+message.+Please+try+again.");
    exit();
}
?>