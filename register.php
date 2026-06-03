<!DOCTYPE html>
<!-- ============================================
     FILE: register.php
     PURPOSE: Member Registration Form
     Accepts plan via URL ?plan=basic/standard/premium
     ============================================ -->
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Join IIUI Gym</title>
  <link rel="stylesheet" href="style.css"/>
</head>
<body>

  <nav class="navbar">
    <div class="nav-brand">⚡ IIUI Gym</div>
    <ul class="nav-links">
      <li><a href="index.html">Home</a></li>
      <li><a href="register.php" class="active">Join Now</a></li>
      <li><a href="member_login.php">Member Login</a></li>
      <li><a href="contact.php">Contact</a></li>
      <li><a href="login.php">Admin</a></li>
    </ul>
    <div class="hamburger" onclick="toggleMenu()">&#9776;</div>
  </nav>

  <section class="form-section">
    <div class="form-card">
      <h2>Register as a <span>Member</span></h2>
      <p class="form-subtitle">Fill in your details to get started</p>

      <!-- SUCCESS / ERROR message shown by PHP -->
      <?php if(isset($_GET['success'])): ?>
        <div class="alert success">✅ Registration successful! Welcome to IIUI Gym!</div>
      <?php elseif(isset($_GET['error'])): ?>
        <div class="alert error">❌ <?= htmlspecialchars($_GET['error']) ?></div>
      <?php endif; ?>

      <form id="registerForm" action="register_process.php" method="POST">

        <div class="form-group">
          <label>Full Name</label>
          <input type="text" name="full_name" id="full_name"
                 placeholder="e.g. Ali Hassan" required/>
          <span class="error-msg" id="nameErr"></span>
        </div>

        <div class="form-group">
          <label>Email Address</label>
          <input type="email" name="email" id="email"
                 placeholder="you@example.com" required/>
          <span class="error-msg" id="emailErr"></span>
        </div>

        <div class="form-group">
          <label>Phone Number</label>
          <input type="text" name="phone" id="phone"
                 placeholder="03XX-XXXXXXX" required/>
          <span class="error-msg" id="phoneErr"></span>
        </div>

        <div class="form-group">
          <label>Membership Plan</label>
          <?php $selected = in_array($_GET['plan'] ?? '', ['basic','standard','premium']) ? $_GET['plan'] : 'standard'; ?>
          <select name="plan" id="plan">
            <option value="basic"    <?= $selected === 'basic'    ? 'selected' : '' ?>>Basic — Rs. 2,000/month</option>
            <option value="standard" <?= $selected === 'standard' ? 'selected' : '' ?>>Standard — Rs. 4,000/month</option>
            <option value="premium"  <?= $selected === 'premium'  ? 'selected' : '' ?>>Premium — Rs. 7,000/month</option>
          </select>
        </div>

        <div class="form-group">
          <label>Join Date</label>
          <input type="date" name="joined_date" id="joined_date" required/>
        </div>

        <div class="form-group">
          <label>Password</label>
          <input type="password" name="password" id="password"
                 placeholder="Minimum 6 characters" required/>
          <span class="error-msg" id="passErr"></span>
        </div>

        <div class="form-group">
          <label>Confirm Password</label>
          <input type="password" name="confirm_password" id="confirm_password"
                 placeholder="Re-enter your password" required/>
          <span class="error-msg" id="confirmErr"></span>
        </div>

        <button type="submit" class="btn-primary full-width" onclick="return validateForm()">
          Register Now
        </button>

      </form>
      <p style="text-align:center; margin-top:1.2rem; color:var(--muted); font-size:0.9rem;">
        Already a member? <a href="member_login.php" style="color:var(--orange);">Login here</a>
      </p>
    </div>
  </section>

  <footer class="footer">
    <p>© 2026 IIUI Gym — Islamabad, Pakistan</p>
  </footer>

  <script src="main.js"></script>
</body>
</html>