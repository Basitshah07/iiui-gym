<?php
// ============================================
//  FILE: logout.php
//  PURPOSE: Destroys admin session and
//  redirects back to login page
// ============================================

session_start();
session_unset();
session_destroy();

header("Location: login.php");
exit();
?>