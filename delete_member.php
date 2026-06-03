<?php
// ============================================
//  FILE: delete_member.php
//  PURPOSE: Deletes a member by ID from MySQL
//  Only accessible by logged-in admin
// ============================================

session_start();

// Guard: must be logged in
if (!isset($_SESSION['logged_in']) || $_SESSION['logged_in'] !== true) {
    header("Location: login.php");
    exit();
}

require_once 'db.php';

// Get and validate ID from URL
$id = isset($_GET['id']) ? intval($_GET['id']) : 0;

if ($id <= 0) {
    header("Location: dashboard.php?error=Invalid+member+ID");
    exit();
}

// Check member exists first
$check = $conn->prepare("SELECT id FROM members WHERE id = ?");
$check->bind_param("i", $id);
$check->execute();
$check->store_result();

if ($check->num_rows === 0) {
    $check->close();
    $conn->close();
    header("Location: dashboard.php?error=Member+not+found");
    exit();
}
$check->close();

// Delete the member
$stmt = $conn->prepare("DELETE FROM members WHERE id = ?");
$stmt->bind_param("i", $id);

if ($stmt->execute()) {
    $stmt->close();
    $conn->close();
    header("Location: dashboard.php?deleted=1");
    exit();
} else {
    $stmt->close();
    $conn->close();
    header("Location: dashboard.php?error=Could+not+delete+member");
    exit();
}
?>