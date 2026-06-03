<?php
// ============================================
//  FILE: member_login_process.php
//  PURPOSE: Authenticates member via email
//  and password, checks membership expiry
// ============================================

session_start();
require_once 'db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header("Location: member_login.php");
    exit();
}

$email    = trim($_POST['email']    ?? '');
$password = trim($_POST['password'] ?? '');

if (empty($email) || empty($password)) {
    header("Location: member_login.php?error=Both+fields+are+required");
    exit();
}

$hashed = md5($password);

$stmt = $conn->prepare(
    "SELECT id, full_name, email, phone, plan, joined_date, expiry_date, status
     FROM members WHERE email = ? AND password = ?"
);
$stmt->bind_param("ss", $email, $hashed);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 1) {
    $member = $result->fetch_assoc();

    // ===== Check if account is expired =====
    $today      = new DateTime();
    $expiry     = new DateTime($member['expiry_date']);
    $diff_days  = (int)$today->diff($expiry)->format('%r%a'); // negative = past expiry

    // Auto-update status to expired if past expiry date
    if ($diff_days < 0 && $member['status'] === 'active') {
        $conn->query("UPDATE members SET status='expired' WHERE id=" . $member['id']);
        $member['status'] = 'expired';
    }

    // Block login if expired
    if ($member['status'] === 'expired') {
        $stmt->close();
        $conn->close();
        header("Location: member_login.php?error=Your+membership+has+expired.+Please+renew+to+continue.");
        exit();
    }

    // Set member session
    $_SESSION['member_id']        = $member['id'];
    $_SESSION['member_name']      = $member['full_name'];
    $_SESSION['member_email']     = $member['email'];
    $_SESSION['member_phone']     = $member['phone'];
    $_SESSION['member_plan']      = $member['plan'];
    $_SESSION['member_joined']    = $member['joined_date'];
    $_SESSION['member_expiry']    = $member['expiry_date'];
    $_SESSION['member_days_left'] = $diff_days;
    $_SESSION['member_logged_in'] = true;

    $stmt->close();
    $conn->close();
    header("Location: member_dashboard.php");
    exit();
} else {
    $stmt->close();
    $conn->close();
    header("Location: member_login.php?error=Invalid+email+or+password");
    exit();
}
?>