<?php
// ============================================
//  FILE: member_logout.php
//  PURPOSE: Destroys member session and
//  redirects back to member login page
// ============================================

session_start();
session_unset();
session_destroy();

header("Location: member_login.php");
exit();
?>