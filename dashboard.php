<?php
// ============================================
//  FILE: dashboard.php
//  PURPOSE: Admin Dashboard — shows member
//  stats, members table and contact messages
//  Only accessible after admin login
// ============================================

session_start();

// Guard: redirect to login if not authenticated
if (!isset($_SESSION['logged_in']) || $_SESSION['logged_in'] !== true) {
    header("Location: login.php?error=Please+login+to+access+the+dashboard");
    exit();
}

require_once 'db.php';

// ===== Fetch Stats =====
$total_result   = $conn->query("SELECT COUNT(*) AS total FROM members");
$total          = $total_result->fetch_assoc()['total'];

$basic_result   = $conn->query("SELECT COUNT(*) AS cnt FROM members WHERE plan='basic'");
$basic_count    = $basic_result->fetch_assoc()['cnt'];

$std_result     = $conn->query("SELECT COUNT(*) AS cnt FROM members WHERE plan='standard'");
$std_count      = $std_result->fetch_assoc()['cnt'];

$prem_result    = $conn->query("SELECT COUNT(*) AS cnt FROM members WHERE plan='premium'");
$prem_count     = $prem_result->fetch_assoc()['cnt'];

$msg_result     = $conn->query("SELECT COUNT(*) AS cnt FROM contacts");
$msg_count      = $msg_result->fetch_assoc()['cnt'];

// ===== Fetch All Members =====
$members = $conn->query(
    "SELECT id, full_name, email, phone, plan, joined_date, expiry_date, status
     FROM members ORDER BY created_at DESC"
);
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Dashboard — IIUI Gym Admin</title>
  <link rel="stylesheet" href="style.css"/>
</head>
<body>

  <!-- NAVBAR -->
  <nav class="navbar">
    <div class="nav-brand">⚡ IIUI Gym</div>
    <ul class="nav-links">
      <li><a href="index.html">Home</a></li>
      <li><a href="register.php">Join Now</a></li>
      <li><a href="contact.php">Contact</a></li>
      <li><a href="dashboard.php" class="active">Dashboard</a></li>
    </ul>
    <div class="hamburger" onclick="toggleMenu()">&#9776;</div>
  </nav>

  <!-- DASHBOARD BODY -->
  <div class="dashboard">

    <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:1rem; margin-bottom:1.5rem;">
      <h2>Admin <span>Dashboard</span></h2>
      <a href="logout.php" class="logout-btn">🚪 Logout</a>
    </div>

    <p style="color:var(--muted); margin-bottom:1.5rem; font-size:0.9rem;">
      Welcome back, <strong style="color:var(--orange)"><?= htmlspecialchars($_SESSION['admin_name']) ?></strong>!
      &nbsp;|&nbsp; IIUI Gym, Islamabad &nbsp;|&nbsp; Mon–Fri: 9AM – 7PM
    </p>

    <?php if(isset($_GET['deleted'])): ?>
      <div class="alert success">✅ Member deleted successfully.</div>
    <?php elseif(isset($_GET['error'])): ?>
      <div class="alert error">❌ <?= htmlspecialchars($_GET['error']) ?></div>
    <?php endif; ?>

    <!-- ===== STATS ROW ===== -->
    <div class="stats-row">
      <div class="stat-card">
        <div class="num"><?= $total ?></div>
        <div class="label">Total Members</div>
      </div>
      <div class="stat-card">
        <div class="num"><?= $basic_count ?></div>
        <div class="label">Basic Plan</div>
      </div>
      <div class="stat-card">
        <div class="num"><?= $std_count ?></div>
        <div class="label">Standard Plan</div>
      </div>
      <div class="stat-card">
        <div class="num"><?= $prem_count ?></div>
        <div class="label">Premium Plan</div>
      </div>
      <div class="stat-card">
        <div class="num"><?= $msg_count ?></div>
        <div class="label">Messages</div>
      </div>
    </div>

    <!-- ===== MEMBERS TABLE ===== -->
    <h3 style="font-family:var(--font-head); font-size:1.4rem; letter-spacing:1px; margin-bottom:1rem;">
      All <span style="color:var(--orange)">Members</span>
    </h3>

    <?php if ($members->num_rows === 0): ?>
      <p style="color:var(--muted); padding:1rem 0;">No members registered yet.</p>
    <?php else: ?>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Plan</th>
              <th>Joined</th>
              <th>Expiry</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <?php $i = 1; while ($row = $members->fetch_assoc()): ?>
            <tr>
              <td><?= $i++ ?></td>
              <td><?= htmlspecialchars($row['full_name']) ?></td>
              <td><?= htmlspecialchars($row['email']) ?></td>
              <td><?= htmlspecialchars($row['phone']) ?></td>
              <td>
                <span class="badge-plan <?= $row['plan'] ?>">
                  <?= ucfirst($row['plan']) ?>
                </span>
              </td>
              <td><?= htmlspecialchars($row['joined_date']) ?></td>
              <td style="color:<?= strtotime($row['expiry_date']) < time() ? '#ff4d4d' : 'var(--orange)' ?>">
                <?= htmlspecialchars($row['expiry_date']) ?>
              </td>
              <td>
                <span class="badge-plan <?= $row['status'] === 'active' ? 'basic' : 'premium' ?>"
                      style="<?= $row['status'] === 'expired' ? 'background:#2e0f0f; color:#ff4d4d;' : '' ?>">
                  <?= ucfirst($row['status']) ?>
                </span>
              </td>
              <td>
                <a href="delete_member.php?id=<?= $row['id'] ?>"
                   class="delete-btn"
                   onclick="return confirmDelete('<?= htmlspecialchars($row['full_name']) ?>')">
                  🗑 Delete
                </a>
              </td>
            </tr>
            <?php endwhile; ?>
          </tbody>
        </table>
      </div>
    <?php endif; ?>

    <!-- ===== MESSAGES TABLE ===== -->
    <?php
      $msgs = $conn->query("SELECT name, email, message, sent_at FROM contacts ORDER BY sent_at DESC");
    ?>
    <h3 style="font-family:var(--font-head); font-size:1.4rem; letter-spacing:1px; margin:2rem 0 1rem;">
      Contact <span style="color:var(--orange)">Messages</span>
    </h3>

    <?php if ($msgs->num_rows === 0): ?>
      <p style="color:var(--muted); padding:1rem 0;">No messages received yet.</p>
    <?php else: ?>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Message</th>
              <th>Sent At</th>
            </tr>
          </thead>
          <tbody>
            <?php $j = 1; while ($msg = $msgs->fetch_assoc()): ?>
            <tr>
              <td><?= $j++ ?></td>
              <td><?= htmlspecialchars($msg['name']) ?></td>
              <td><?= htmlspecialchars($msg['email']) ?></td>
              <td style="max-width:280px; color:var(--muted);">
                <?= htmlspecialchars(substr($msg['message'], 0, 80)) ?>
                <?= strlen($msg['message']) > 80 ? '...' : '' ?>
              </td>
              <td style="color:var(--muted); font-size:0.85rem;">
                <?= htmlspecialchars($msg['sent_at']) ?>
              </td>
            </tr>
            <?php endwhile; ?>
          </tbody>
        </table>
      </div>
    <?php endif; ?>

  </div><!-- /dashboard -->

  <footer class="footer">
    <p>© 2026 IIUI Gym — Islamabad, Pakistan</p>
  </footer>

  <script src="main.js"></script>
</body>
</html>
<?php $conn->close(); ?>