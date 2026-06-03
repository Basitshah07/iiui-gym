<?php
// ============================================
//  FILE: member_dashboard.php
//  PURPOSE: Member Profile Page — shows member
//  info, plan details, expiry date and gym info
//  Only accessible after member login
// ============================================

session_start();

if (!isset($_SESSION['member_logged_in']) || $_SESSION['member_logged_in'] !== true) {
    header("Location: member_login.php?error=Please+login+to+view+your+profile");
    exit();
}

// Plan prices
$plan_prices = [
    'basic'    => 'Rs. 2,000/month',
    'standard' => 'Rs. 4,000/month',
    'premium'  => 'Rs. 7,000/month',
];

// Plan features
$plan_features = [
    'basic'    => ['✅ Gym Access (9AM–7PM)', '✅ Cardio Equipment', '❌ Personal Trainer', '❌ Supplements'],
    'standard' => ['✅ Gym Access (9AM–7PM)', '✅ All Equipment', '✅ 2x Trainer Sessions', '❌ Supplements'],
    'premium'  => ['✅ Gym Access (9AM–7PM)', '✅ All Equipment', '✅ Unlimited Trainer', '✅ Free Supplements'],
];

$plan  = $_SESSION['member_plan'];
$price = $plan_prices[$plan];
$features = $plan_features[$plan];
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>My Profile — IIUI Gym</title>
  <link rel="stylesheet" href="style.css"/>
</head>
<body>

  <nav class="navbar">
    <div class="nav-brand">⚡ IIUI Gym</div>
    <ul class="nav-links">
      <li><a href="index.html">Home</a></li>
      <li><a href="register.php">Join Now</a></li>
      <li><a href="member_dashboard.php" class="active">My Profile</a></li>
      <li><a href="contact.php">Contact</a></li>
    </ul>
    <div class="hamburger" onclick="toggleMenu()">&#9776;</div>
  </nav>

  <div class="dashboard">

    <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:1rem; margin-bottom:1.5rem;">
      <h2>My <span>Profile</span></h2>
      <a href="member_logout.php" class="logout-btn">🚪 Logout</a>
    </div>

    <p style="color:var(--muted); margin-bottom:2rem; font-size:0.9rem;">
      Welcome, <strong style="color:var(--orange)"><?= htmlspecialchars($_SESSION['member_name']) ?></strong>!
      &nbsp;|&nbsp; IIUI Gym, Islamabad &nbsp;|&nbsp; Mon–Fri: 9AM – 7PM
    </p>

    <!-- ===== EXPIRY WARNING POPUP ===== -->
    <?php if($_SESSION['member_days_left'] <= 7 && $_SESSION['member_days_left'] >= 0): ?>
    <div id="expiryPopup" class="expiry-popup">
      <div class="expiry-popup-box">
        <div class="expiry-icon">⚠️</div>
        <h3>Membership Expiring Soon!</h3>
        <p>Your membership expires in <strong style="color:var(--orange)"><?= $_SESSION['member_days_left'] ?> day(s)</strong> on <strong><?= $_SESSION['member_expiry'] ?></strong>.</p>
        <p>Please renew your membership to avoid interruption.</p>
        <a href="contact.php" class="btn-primary" style="margin-top:1rem; display:inline-block;">
          Contact Us to Renew
        </a>
        <button onclick="document.getElementById('expiryPopup').style.display='none'"
                class="close-popup">Remind me later</button>
      </div>
    </div>
    <?php endif; ?>

    <!-- ===== MEMBER INFO CARDS ===== -->
    <div class="stats-row" style="margin-bottom:2rem;">
      <div class="stat-card">
        <div class="num" style="font-size:1.3rem; word-break:break-all;">
          <?= htmlspecialchars($_SESSION['member_name']) ?>
        </div>
        <div class="label">Full Name</div>
      </div>
      <div class="stat-card">
        <div class="num" style="font-size:1rem; word-break:break-all;">
          <?= htmlspecialchars($_SESSION['member_email']) ?>
        </div>
        <div class="label">Email</div>
      </div>
      <div class="stat-card">
        <div class="num" style="font-size:1.3rem;">
          <?= htmlspecialchars($_SESSION['member_phone']) ?>
        </div>
        <div class="label">Phone</div>
      </div>
      <div class="stat-card">
        <div class="num" style="font-size:1.3rem;">
          <?= htmlspecialchars($_SESSION['member_joined']) ?>
        </div>
        <div class="label">Joined Date</div>
      </div>
      <div class="stat-card">
        <div class="num" style="font-size:1.3rem; color:<?= $_SESSION['member_days_left'] <= 7 ? '#ff4d4d' : 'var(--orange)' ?>">
          <?= htmlspecialchars($_SESSION['member_expiry']) ?>
        </div>
        <div class="label">Expiry Date</div>
      </div>
      <div class="stat-card">
        <div class="num" style="font-size:1.3rem; color:<?= $_SESSION['member_days_left'] <= 7 ? '#ff4d4d' : '#4caf7d' ?>">
          <?= $_SESSION['member_days_left'] ?> days
        </div>
        <div class="label">Days Remaining</div>
      </div>
    </div>

    <!-- ===== MEMBERSHIP PLAN CARD ===== -->
    <h3 style="font-family:var(--font-head); font-size:1.4rem; letter-spacing:1px; margin-bottom:1rem;">
      Your <span style="color:var(--orange)">Membership Plan</span>
    </h3>

    <div style="max-width:360px;">
      <div class="plan-card <?= $plan === 'standard' ? 'featured' : '' ?>">
        <?php if($plan === 'standard'): ?>
          <div class="badge">Most Popular</div>
        <?php endif; ?>
        <h3><?= ucfirst($plan) ?></h3>
        <div class="price"><?= $price ?></div>
        <ul>
          <?php foreach($features as $feature): ?>
            <li><?= $feature ?></li>
          <?php endforeach; ?>
        </ul>
        <span class="badge-plan <?= $plan ?>" style="display:inline-block; margin-top:0.5rem;">
          Active ✅
        </span>
      </div>
    </div>

    <!-- ===== GYM INFO ===== -->
    <h3 style="font-family:var(--font-head); font-size:1.4rem; letter-spacing:1px; margin:2rem 0 1rem;">
      Gym <span style="color:var(--orange)">Information</span>
    </h3>

    <div class="contact-info" style="border:1px solid var(--border); border-radius:var(--radius); padding:1.5rem; max-width:400px;">
      <div class="info-item">🏫 IIUI Gym — International Islamic University</div>
      <div class="info-item">📍 Sector H-10, Islamabad, Pakistan</div>
      <div class="info-item">🕐 Mon–Fri: 9AM – 7PM</div>
      <div class="info-item">📞 051-9257948</div>
    </div>

  </div>

  <footer class="footer">
    <p>© 2026 IIUI Gym — Islamabad, Pakistan</p>
  </footer>

  <script src="main.js"></script>
</body>
</html>