<!DOCTYPE html>
<!-- ============================================
     FILE: login.php
     PURPOSE: Admin Login Page
     Only for authorized gym administrators
     ============================================ -->
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Admin Login — IIUI Gym</title>
  <link rel="stylesheet" href="style.css"/>
</head>
<body>

  <nav class="navbar">
    <div class="nav-brand">⚡ IIUI Gym</div>
    <ul class="nav-links">
      <li><a href="index.html">Home</a></li>
      <li><a href="register.php">Join Now</a></li>
      <li><a href="contact.php">Contact</a></li>
      <li><a href="login.php" class="active">Admin</a></li>
    </ul>
    <div class="hamburger" onclick="toggleMenu()">&#9776;</div>
  </nav>

  <section class="form-section">
    <div class="form-card login-card">
      <div class="lock-icon">🔐</div>
      <h2>Admin <span>Login</span></h2>
      <p class="form-subtitle">Authorized personnel only</p>

      <?php if(isset($_GET['error'])): ?>
        <div class="alert error">❌ <?= htmlspecialchars($_GET['error']) ?></div>
      <?php endif; ?>

      <form id="loginForm" action="login_process.php" method="POST">

        <div class="form-group">
          <label>Username</label>
          <input type="text" name="username" id="username"
                 placeholder="admin" required/>
        </div>

        <div class="form-group">
          <label>Password</label>
          <input type="password" name="password" id="password"
                 placeholder="••••••••" required/>
          <span class="error-msg" id="loginErr"></span>
        </div>

        <button type="submit" class="btn-primary full-width"
                onclick="return validateLogin()">
          Login
        </button>

      </form>

      <p class="hint">Default: admin / admin123</p>
    </div>
  </section>

  <footer class="footer">
    <p>© 2026 IIUI Gym — Rawalpindi, Pakistan</p>
  </footer>

  <script src="main.js"></script>
</body>
</html>