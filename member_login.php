<!DOCTYPE html>
<!-- ============================================
     FILE: member_login.php
     PURPOSE: Member Login Page — registered
     members login here to view their profile
     ============================================ -->
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Member Login — IIUI Gym</title>
  <link rel="stylesheet" href="style.css"/>
</head>
<body>

  <nav class="navbar">
    <div class="nav-brand">⚡ IIUI Gym</div>
    <ul class="nav-links">
      <li><a href="index.html">Home</a></li>
      <li><a href="register.php">Join Now</a></li>
      <li><a href="member_login.php" class="active">Member Login</a></li>
      <li><a href="contact.php">Contact</a></li>
      <li><a href="login.php">Admin</a></li>
    </ul>
    <div class="hamburger" onclick="toggleMenu()">&#9776;</div>
  </nav>

  <section class="form-section">
    <div class="form-card login-card">
      <div class="lock-icon">🏋️</div>
      <h2>Member <span>Login</span></h2>
      <p class="form-subtitle">Welcome back! Login to view your profile</p>

      <?php if(isset($_GET['error'])): ?>
        <div class="alert error">❌ <?= htmlspecialchars($_GET['error']) ?></div>
      <?php endif; ?>

      <form id="memberLoginForm" action="member_login_process.php" method="POST">

        <div class="form-group">
          <label>Email Address</label>
          <input type="email" name="email" id="memail"
                 placeholder="you@example.com" required/>
        </div>

        <div class="form-group">
          <label>Password</label>
          <input type="password" name="password" id="mpassword"
                 placeholder="••••••••" required/>
          <span class="error-msg" id="mloginErr"></span>
        </div>

        <button type="submit" class="btn-primary full-width"
                onclick="return validateMemberLogin()">
          Login
        </button>

      </form>

      <p style="text-align:center; margin-top:1.2rem; color:var(--muted); font-size:0.9rem;">
        Not a member yet? <a href="register.php" style="color:var(--orange);">Register here</a>
      </p>
    </div>
  </section>

  <footer class="footer">
    <p>© 2026 IIUI Gym — Islamabad, Pakistan</p>
  </footer>

  <script src="main.js"></script>
</body>
</html>