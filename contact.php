<!DOCTYPE html>
<!-- ============================================
     FILE: contact.php
     PURPOSE: Contact Us Page — displays contact
     form and gym location/timing info
     ============================================ -->
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Contact — IIUI Gym</title>
  <link rel="stylesheet" href="style.css"/>
</head>
<body>

  <nav class="navbar">
    <div class="nav-brand">⚡ IIUI Gym</div>
    <ul class="nav-links">
      <li><a href="index.html">Home</a></li>
      <li><a href="register.php">Join Now</a></li>
      <li><a href="contact.php" class="active">Contact</a></li>
      <li><a href="login.php">Admin</a></li>
    </ul>
    <div class="hamburger" onclick="toggleMenu()">&#9776;</div>
  </nav>

  <section class="form-section">
    <div class="form-card">
      <h2>Get In <span>Touch</span></h2>
      <p class="form-subtitle">We'll get back to you within 24 hours</p>

      <?php if(isset($_GET['success'])): ?>
        <div class="alert success">✅ Message sent! We'll contact you soon.</div>
      <?php elseif(isset($_GET['error'])): ?>
        <div class="alert error">❌ <?= htmlspecialchars($_GET['error']) ?></div>
      <?php endif; ?>

      <form id="contactForm" action="contact_process.php" method="POST">

        <div class="form-group">
          <label>Your Name</label>
          <input type="text" name="name" id="cname"
                 placeholder="Full Name" required/>
          <span class="error-msg" id="cnameErr"></span>
        </div>

        <div class="form-group">
          <label>Email Address</label>
          <input type="email" name="email" id="cemail"
                 placeholder="you@example.com" required/>
        </div>

        <div class="form-group">
          <label>Message</label>
          <textarea name="message" id="cmessage" rows="5"
                    placeholder="Write your message here..." required></textarea>
          <span class="error-msg" id="cmsgErr"></span>
        </div>

        <button type="submit" class="btn-primary full-width"
                onclick="return validateContact()">
          Send Message
        </button>

      </form>

      <!-- Gym Info -->
      <div class="contact-info">
        <div class="info-item">📍 IIUI Campus, Sector H-10, Islamabad</div>
        <div class="info-item">📞 051-9019752</div>
        <div class="info-item">🕐 Mon–Fri: 9AM – 7PM</div>
      </div>
    </div>
  </section>

  <footer class="footer">
    <p>© 2026 IIUI Gym — Islamabad, Pakistan</p>
  </footer>

  <script src="main.js"></script>
</body>
</html>