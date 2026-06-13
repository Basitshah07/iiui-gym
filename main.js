// ============================================
//  FILE: main.js
//  PURPOSE: Complete Application Logic for IIUI Gym
//
//  MODULES:
//  1. UI Module — Navbar, animations, toasts
//  2. Auth Module — Register, login, logout, OTP
//  3. Member Module — Dashboard, profile, expiry
//  4. Admin Module — Stats, member mgmt, messages
//  5. Contact Module — Form submission + EmailJS
//  6. Validation Module — Form validation helpers
//
//  TECH: Vanilla JavaScript + Firebase SDK
//  All passwords handled by Firebase Auth
//  (bcrypt/scrypt hashing — never stored in
//  plain text or MD5)
// ============================================

// ===== UI MODULE =====

// --- Navbar Toggle (mobile) ---
function toggleMenu() {
  const links = document.querySelector('.nav-links');
  if (links) links.classList.toggle('open');
}

// Close menu when a link is clicked
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    const navLinks = document.querySelector('.nav-links');
    if (navLinks) navLinks.classList.remove('open');
  });
});

// --- Navbar scroll effect ---
window.addEventListener('scroll', () => {
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  }
});

// --- Scroll Animations ---
function initScrollAnimations() {
  const elements = document.querySelectorAll('.animate-on-scroll');
  if (elements.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  elements.forEach(el => observer.observe(el));
}

// --- Auto-fill date ---
function autoFillDate() {
  const dateInput = document.getElementById('joined_date');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.value = today;
  }
}

// --- Smooth Scroll for anchor links ---
// BUG FIX: Only preventDefault if the target element actually exists on this page
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// --- Number Counter Animation ---
function animateCounters() {
  const counters = document.querySelectorAll('[data-count]');
  counters.forEach(counter => {
    const target = parseInt(counter.dataset.count);
    const duration = 1500;
    const step = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      counter.textContent = Math.floor(current).toLocaleString();
    }, 16);
  });
}


// ===== VALIDATION MODULE =====

// --- Validate IIUI Email ---
// FIX: Check general format first, THEN check domain.
// Previously the domain check ran on the raw email while the regex ran on
// a different (non-lowercased) copy — and the order meant whitespace could
// sneak past the endsWith check but fail the regex with a misleading message.
// Now: trim & lowercase once at the top, validate format, then validate domain.
function validateIIUIEmail(email) {
  const domain = '@gmail.com';
  if (!email) {
    return { valid: false, message: 'Email is required.' };
  }
  const normalized = email.trim().toLowerCase();
  // Check general email format first
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(normalized)) {
    return { valid: false, message: 'Please enter a valid email address.' };
  }
  // Then check IIUI domain
  if (!normalized.endsWith(domain)) {
    return { valid: false, message: `Only IIUI emails (${domain}) are allowed.` };
  }
  return { valid: true };
}

// --- Password Strength Checker ---
function checkPasswordStrength(password) {
  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 10) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 2) return 'weak';
  if (score <= 3) return 'medium';
  return 'strong';
}

// --- Update Password Strength UI ---
// BUG FIX: Properly reset by removing all strength classes before adding new one
function updatePasswordStrength(password) {
  const indicator = document.querySelector('.password-strength');
  if (!indicator) return;

  // Remove all previous strength classes
  indicator.classList.remove('strength-weak', 'strength-medium', 'strength-strong');
  if (password.length === 0) return;

  const strength = checkPasswordStrength(password);
  indicator.classList.add(`strength-${strength}`);
}

// --- Validate Registration Form ---
function validateRegisterForm() {
  let valid = true;

  // Full Name
  const name = document.getElementById('full_name');
  const nameErr = document.getElementById('nameErr');
  if (name && name.value.trim().length < 3) {
    if (nameErr) nameErr.textContent = 'Name must be at least 3 characters.';
    valid = false;
  } else if (nameErr) {
    nameErr.textContent = '';
  }

  // Email
  const email = document.getElementById('email');
  const emailErr = document.getElementById('emailErr');
  if (email) {
    const emailCheck = validateIIUIEmail(email.value.trim());
    if (!emailCheck.valid) {
      if (emailErr) emailErr.textContent = emailCheck.message;
      valid = false;
    } else if (emailErr) {
      emailErr.textContent = '';
    }
  }

  // Phone
  // BUG FIX: Accept +92 international format, spaces, dashes
  const phone = document.getElementById('phone');
  const phoneErr = document.getElementById('phoneErr');
  const phonePattern = /^(\+92[\s-]?3\d{2}[\s-]?\d{7}|03\d{2}[\s-]?\d{7}|0\d{10})$/;
  if (phone && !phonePattern.test(phone.value.trim())) {
    if (phoneErr) phoneErr.textContent = 'Enter a valid Pakistani phone number (e.g. 0300-1234567 or +92-300-1234567).';
    valid = false;
  } else if (phoneErr) {
    phoneErr.textContent = '';
  }

  // Password — do NOT trim passwords; spaces are valid and trimming causes
  // a mismatch between the validation length check and the actual value sent
  // to Firebase Auth.
  const pass = document.getElementById('password');
  const passErr = document.getElementById('passErr');
  if (pass && pass.value.length < 6) {
    if (passErr) passErr.textContent = 'Password must be at least 6 characters.';
    valid = false;
  } else if (passErr) {
    passErr.textContent = '';
  }

  // Confirm Password
  const confirm = document.getElementById('confirm_password');
  const confirmErr = document.getElementById('confirmErr');
  if (pass && confirm && pass.value !== confirm.value) {
    if (confirmErr) confirmErr.textContent = 'Passwords do not match.';
    valid = false;
  } else if (confirmErr) {
    confirmErr.textContent = '';
  }

  return valid;
}

// --- Validate Contact Form ---
function validateContactForm() {
  let valid = true;

  const name = document.getElementById('cname');
  const nameErr = document.getElementById('cnameErr');
  if (name && name.value.trim().length < 2) {
    if (nameErr) nameErr.textContent = 'Please enter your name.';
    valid = false;
  } else if (nameErr) {
    nameErr.textContent = '';
  }

  const email = document.getElementById('cemail');
  const emailErr = document.getElementById('cemailErr');
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (email && !emailPattern.test(email.value.trim())) {
    if (emailErr) emailErr.textContent = 'Please enter a valid email.';
    valid = false;
  } else if (emailErr) {
    emailErr.textContent = '';
  }

  const msg = document.getElementById('cmessage');
  const msgErr = document.getElementById('cmsgErr');
  if (msg && msg.value.trim().length < 10) {
    if (msgErr) msgErr.textContent = 'Message must be at least 10 characters.';
    valid = false;
  } else if (msgErr) {
    msgErr.textContent = '';
  }

  return valid;
}

// --- Validate Login Form ---
// BUG FIX: Also validate IIUI email domain on login, not just registration
function validateLoginForm() {
  const email = document.getElementById('login_email');
  const pass = document.getElementById('login_password');
  const err = document.getElementById('loginErr');

  if (!email || !pass) return true;

  if (email.value.trim() === '' || pass.value.trim() === '') {
    if (err) err.textContent = 'Both fields are required.';
    return false;
  }

  // Check IIUI email domain (normalize to lowercase for comparison)
  if (!email.value.trim().toLowerCase().endsWith('@gmail.com')) {
    if (err) err.textContent = 'Only Gmail accounts can login.';
    return false;
  }

  if (err) err.textContent = '';
  return true;
}


// ===== AUTH MODULE =====

// --- Member Registration ---
async function handleRegister(e) {
  e.preventDefault();

  if (!validateRegisterForm()) return;

  const btn = e.target.querySelector('button[type="submit"]');
  showLoading(btn);

  const fullName = document.getElementById('full_name').value.trim();
  // FIX: Normalize email to lowercase to prevent case-variant duplicate accounts
  const email = document.getElementById('email').value.trim().toLowerCase();
  const phone = document.getElementById('phone').value.trim();
  const plan = document.getElementById('plan').value;
  const joinedDate = document.getElementById('joined_date').value;
  const password = document.getElementById('password').value;

  try {
    // 1. Create Firebase Auth user
    const userCredential = await auth.createUserWithEmailAndPassword(email, password);
    const user = userCredential.user;

    // 2. Update profile with display name
    await user.updateProfile({ displayName: fullName });

    // 3. Generate a 6-digit OTP, store it in Firestore, and email it via EmailJS
    const otpCode = String(Math.floor(100000 + Math.random() * 900000));
    const expiresAt = Date.now() + 15 * 60 * 1000; // valid for 15 minutes
    await db.collection('otps').doc(user.uid).set({
      code: otpCode,
      email: email,
      expiresAt: expiresAt
    });
    await sendOTPEmail(email, otpCode);

    // 4. Calculate expiry (joined + 1 month), safely handling month-end overflow
    // e.g. Jan 31 + 1 month should be Feb 28, not Mar 3
    const expiry = new Date(joinedDate);
    const targetMonth = expiry.getMonth() + 1;
    expiry.setMonth(targetMonth);
    // If month overflowed (e.g. Mar 3 when we wanted Feb 28), go back to last day of target month
    if (expiry.getMonth() !== (targetMonth % 12)) {
      expiry.setDate(0); // setDate(0) = last day of previous month
    }
    const expiryDate = expiry.toISOString().split('T')[0];

    // 5. Save member data to Firestore
    // NOTE: Password is NOT saved here — Firebase Auth handles it
    // with bcrypt/scrypt hashing internally
    await db.collection('members').doc(user.uid).set({
      full_name: fullName,
      email: email,
      phone: phone,
      plan: plan,
      joined_date: joinedDate,
      expiry_date: expiryDate,
      status: 'active',
      verified: false,
      created_at: firebase.firestore.FieldValue.serverTimestamp()
    });

    // 6. Send welcome email notification via EmailJS
    sendEmailNotification(
      email, fullName,
      'Welcome to IIUI Gym! 🏋️',
      `Dear ${fullName},\n\nYou have successfully registered for the ${plan.toUpperCase()} plan at IIUI Gym.\n\nYour membership is valid until ${expiryDate}.\n\nPlease verify your email to activate your account.\n\nRegards,\nIIUI Gym Team`
    );

    hideLoading(btn);
    showToast('Registration successful! Check your email for the 6-digit OTP code.', 'success');

    // Redirect to verification page
    setTimeout(() => {
      window.location.href = 'verify-otp.html';
    }, 1500);

  } catch (error) {
    hideLoading(btn);
    console.error('Registration error:', error);

    let message = 'Registration failed. Please try again.';
    if (error.code === 'auth/email-already-in-use') {
      message = 'This email is already registered. Please login instead.';
    } else if (error.code === 'auth/weak-password') {
      message = 'Password is too weak. Use at least 6 characters.';
    } else if (error.code === 'auth/invalid-email') {
      message = 'Invalid email address format.';
    }
    showToast(message, 'error');
  }
}

// --- Member Login ---
async function handleMemberLogin(e) {
  e.preventDefault();

  if (!validateLoginForm()) return;

  const btn = e.target.querySelector('button[type="submit"]');
  showLoading(btn);

  // FIX: normalize email to lowercase to match how it was stored at registration
  const email = document.getElementById('login_email').value.trim().toLowerCase();
  const password = document.getElementById('login_password').value;

  try {
    const userCredential = await auth.signInWithEmailAndPassword(email, password);
    const user = userCredential.user;

    // Check membership status in Firestore
    const memberDoc = await db.collection('members').doc(user.uid).get();
    if (!memberDoc.exists) {
      hideLoading(btn);
      // FIX: sign out the Firebase Auth user so they aren't left in a logged-in ghost state
      await auth.signOut();
      showToast('Account data not found. Please contact admin.', 'error');
      return;
    }

    // Check OTP verification status (stored in Firestore, set by verify-otp.html)
    const memberData = memberDoc.data();
    if (!memberData.verified) {
      hideLoading(btn);
      showToast('Please verify your email with the OTP first.', 'warning');
      setTimeout(() => {
        window.location.href = 'verify-otp.html';
      }, 1500);
      return;
    }

    const data = memberData;

    // Check expiry
    const today = new Date();
    const expiry = new Date(data.expiry_date);
    if (today > expiry && data.status === 'active') {
      // Auto-update to expired
      await db.collection('members').doc(user.uid).update({ status: 'expired' });
      hideLoading(btn);
      showToast('Your membership has expired. Please renew.', 'error');
      auth.signOut();
      return;
    }

    if (data.status === 'expired') {
      hideLoading(btn);
      showToast('Your membership has expired. Please contact admin to renew.', 'error');
      auth.signOut();
      return;
    }

    hideLoading(btn);
    showToast('Login successful! Welcome back.', 'success');
    setTimeout(() => {
      window.location.href = 'dashboard.html';
    }, 1000);

  } catch (error) {
    hideLoading(btn);
    console.error('Login error:', error);

    let message = 'Login failed. Please try again.';
    if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
      message = 'Invalid email or password.';
    } else if (error.code === 'auth/invalid-credential') {
      message = 'Invalid email or password.';
    } else if (error.code === 'auth/too-many-requests') {
      message = 'Too many attempts. Please try again later.';
    }
    showToast(message, 'error');
  }
}

// --- Admin Login ---
async function handleAdminLogin(e) {
  e.preventDefault();

  const btn = e.target.querySelector('button[type="submit"]');
  showLoading(btn);

  // FIX: normalize email to lowercase
  const email = document.getElementById('admin_email').value.trim().toLowerCase();
  const password = document.getElementById('admin_password').value;

  if (!email || !password) {
    hideLoading(btn);
    showToast('Both fields are required.', 'error');
    return;
  }

  try {
    const userCredential = await auth.signInWithEmailAndPassword(email, password);
    const user = userCredential.user;

    // Verify admin role in Firestore
    const adminDoc = await db.collection('admins').doc(user.uid).get();
    if (!adminDoc.exists) {
      hideLoading(btn);
      showToast('Access denied. You are not an admin.', 'error');
      auth.signOut();
      return;
    }

    hideLoading(btn);
    showToast('Admin login successful!', 'success');
    setTimeout(() => {
      window.location.href = 'admin-dashboard.html';
    }, 1000);

  } catch (error) {
    hideLoading(btn);
    let message = 'Login failed. Invalid credentials.';
    if (error.code === 'auth/too-many-requests') {
      message = 'Too many attempts. Please wait and try again.';
    }
    showToast(message, 'error');
  }
}

// --- Logout ---
async function handleLogout() {
  try {
    await auth.signOut();
    showToast('Logged out successfully.', 'success');
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 800);
  } catch (error) {
    console.error('Logout error:', error);
    showToast('Logout failed. Please try again.', 'error');
  }
}

// --- Resend OTP Email ---
async function resendVerification() {
  const user = auth.currentUser;
  if (!user) {
    showToast('No user logged in.', 'error');
    return;
  }

  try {
    const otpCode = String(Math.floor(100000 + Math.random() * 900000));
    const expiresAt = Date.now() + 15 * 60 * 1000;
    await db.collection('otps').doc(user.uid).set({
      code: otpCode,
      email: user.email,
      expiresAt: expiresAt
    });
    const sent = await sendOTPEmail(user.email, otpCode);
    if (sent) {
      showToast('A new OTP has been sent to your email.', 'success');
    } else {
      showToast('Failed to send OTP. Try again later.', 'error');
    }
  } catch (error) {
    console.error('Resend OTP error:', error);
    showToast('Failed to send OTP. Try again later.', 'error');
  }
}

// --- Verify the 6-digit OTP entered by the user ---
async function verifyOTP(enteredCode) {
  const user = auth.currentUser;
  if (!user) {
    showToast('No user logged in.', 'error');
    return;
  }

  if (!enteredCode || enteredCode.length !== 6) {
    showToast('Please enter the 6-digit code.', 'warning');
    return;
  }

  try {
    const otpDoc = await db.collection('otps').doc(user.uid).get();
    if (!otpDoc.exists) {
      showToast('No OTP found. Please click Resend to get a new code.', 'error');
      return;
    }

    const otpData = otpDoc.data();

    if (Date.now() > otpData.expiresAt) {
      showToast('This OTP has expired. Please request a new one.', 'error');
      return;
    }

    if (enteredCode !== otpData.code) {
      showToast('Incorrect OTP. Please try again.', 'error');
      return;
    }

    // Mark member as verified
    await db.collection('members').doc(user.uid).update({ verified: true });
    // Clean up the used OTP
    await db.collection('otps').doc(user.uid).delete();

    showToast('Email verified successfully! Redirecting...', 'success');
    setTimeout(() => {
      window.location.href = 'dashboard.html';
    }, 1500);
  } catch (error) {
    console.error('OTP verification error:', error);
    showToast('Verification failed. Please try again.', 'error');
  }
}


// ===== MEMBER DASHBOARD MODULE =====

// Plan details
const PLAN_DATA = {
  basic: {
    price: 'Rs. 2,000/month',
    features: [
      { text: 'Gym Access (9AM–7PM)', included: true },
      { text: 'Cardio Equipment', included: true },
      { text: 'Personal Trainer', included: false },
      { text: 'Supplements', included: false }
    ]
  },
  standard: {
    price: 'Rs. 4,000/month',
    features: [
      { text: 'Gym Access (9AM–7PM)', included: true },
      { text: 'All Equipment', included: true },
      { text: '2x Trainer Sessions', included: true },
      { text: 'Supplements', included: false }
    ]
  },
  premium: {
    price: 'Rs. 7,000/month',
    features: [
      { text: 'Gym Access (9AM–7PM)', included: true },
      { text: 'All Equipment', included: true },
      { text: 'Unlimited Trainer', included: true },
      { text: 'Free Supplements', included: true }
    ]
  }
};

// --- Load Member Dashboard ---
async function loadMemberDashboard() {
  const user = auth.currentUser;
  if (!user) return;

  try {
    const doc = await db.collection('members').doc(user.uid).get();
    if (!doc.exists) {
      showToast('Profile data not found.', 'error');
      return;
    }

    const data = doc.data();
    const plan = PLAN_DATA[data.plan] || PLAN_DATA.basic;

    // Calculate days remaining
    const today = new Date();
    const expiry = new Date(data.expiry_date);
    const diffTime = expiry - today;
    const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Update UI elements
    setTextContent('member-name', data.full_name);
    setTextContent('member-email', data.email);
    setTextContent('member-phone', data.phone);
    setTextContent('member-joined', data.joined_date);
    setTextContent('member-expiry', data.expiry_date);
    setTextContent('member-days', `${Math.max(0, daysLeft)} days`);
    setTextContent('welcome-name', data.full_name);

    // Style days remaining
    const daysEl = document.getElementById('member-days');
    if (daysEl) {
      daysEl.style.color = daysLeft <= 7 ? 'var(--error)' : 'var(--success)';
    }

    const expiryEl = document.getElementById('member-expiry');
    if (expiryEl) {
      expiryEl.style.color = daysLeft <= 7 ? 'var(--error)' : 'var(--primary)';
    }

    // Render plan card
    renderPlanCard(data.plan, plan);

    // Show expiry warning if 7 days or less
    if (daysLeft <= 7 && daysLeft >= 0) {
      showExpiryWarning(daysLeft, data.expiry_date, data.email, data.full_name);
    }

    // Auto-update to expired if past expiry
    if (daysLeft < 0 && data.status === 'active') {
      await db.collection('members').doc(user.uid).update({ status: 'expired' });
      // Send expiry SMS alert
      sendEmailNotification(
        data.email, data.full_name,
        '⚠️ IIUI Gym — Membership Expired',
        `Dear ${data.full_name},\n\nYour IIUI Gym membership has expired as of ${data.expiry_date}.\n\nPlease renew your membership to continue accessing gym facilities.\n\nContact: 051-9257948\n\nRegards,\nIIUI Gym Team`
      );
    }

  } catch (error) {
    console.error('Dashboard load error:', error);
    showToast('Failed to load profile data.', 'error');
  }
}

// --- Render Plan Card ---
function renderPlanCard(planName, planData) {
  const container = document.getElementById('plan-card-container');
  if (!container) return;

  const isFeatured = planName === 'standard';
  container.innerHTML = `
    <div class="plan-card ${isFeatured ? 'featured' : ''}">
      ${isFeatured ? '<div class="plan-badge">Most Popular</div>' : ''}
      <h3>${planName.charAt(0).toUpperCase() + planName.slice(1)}</h3>
      <div class="plan-price">${planData.price}</div>
      <ul>
        ${planData.features.map(f => `
          <li>
            <span class="${f.included ? 'check' : 'cross'}">${f.included ? '✅' : '❌'}</span>
            ${f.text}
          </li>
        `).join('')}
      </ul>
      <span class="badge-plan ${planName}" style="display:inline-block; margin-top:0.5rem;">
        Active ✅
      </span>
    </div>
  `;
}

// --- Show Expiry Warning Modal ---
// BUG FIX: Dedup expiry email using sessionStorage so it only fires once per session
function showExpiryWarning(daysLeft, expiryDate, email, name) {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.id = 'expiryModal';
  overlay.innerHTML = `
    <div class="modal-box">
      <div class="modal-icon">⚠️</div>
      <h3>Membership Expiring Soon!</h3>
      <p>Your membership expires in <strong>${daysLeft} day(s)</strong> on <strong>${expiryDate}</strong>.</p>
      <p>Please renew your membership to avoid interruption.</p>
      <a href="contact.html" class="btn-primary" style="margin-top:1rem; display:inline-flex;">
        Contact Us to Renew
      </a>
      <button onclick="document.getElementById('expiryModal').remove()"
              class="btn-close-modal">Remind me later</button>
    </div>
  `;
  document.body.appendChild(overlay);

  // Send expiry warning email — only once per session to prevent spam
  const expiryEmailKey = `expiry_email_sent_${email}`;
  if (!sessionStorage.getItem(expiryEmailKey)) {
    sendEmailNotification(
      email, name,
      '⏰ IIUI Gym — Membership Expiring Soon!',
      `Dear ${name},\n\nYour IIUI Gym membership will expire in ${daysLeft} day(s) on ${expiryDate}.\n\nPlease renew to continue enjoying gym services.\n\nContact: 051-9257948\n\nRegards,\nIIUI Gym Team`
    );
    sessionStorage.setItem(expiryEmailKey, 'true');
  }
}


// ===== ADMIN DASHBOARD MODULE =====

// --- Load Admin Dashboard ---
async function loadAdminDashboard() {
  try {
    // Fetch all members
    const membersSnap = await db.collection('members').orderBy('created_at', 'desc').get();
    const members = [];
    let basicCount = 0, stdCount = 0, premCount = 0;

    membersSnap.forEach(doc => {
      const data = { id: doc.id, ...doc.data() };
      members.push(data);
      if (data.plan === 'basic') basicCount++;
      if (data.plan === 'standard') stdCount++;
      if (data.plan === 'premium') premCount++;
    });

    // Fetch message count
    const msgsSnap = await db.collection('contacts').get();
    const msgCount = msgsSnap.size;

    // Update stats
    setTextContent('stat-total', members.length);
    setTextContent('stat-basic', basicCount);
    setTextContent('stat-standard', stdCount);
    setTextContent('stat-premium', premCount);
    setTextContent('stat-messages', msgCount);

    // Render members table
    renderMembersTable(members);

    // Fetch and render messages
    const msgsOrdered = await db.collection('contacts').orderBy('sent_at', 'desc').get();
    const messages = [];
    msgsOrdered.forEach(doc => messages.push({ id: doc.id, ...doc.data() }));
    renderMessagesTable(messages);

    // Update admin name
    const user = auth.currentUser;
    if (user) {
      setTextContent('admin-name', user.displayName || user.email);
    }

  } catch (error) {
    console.error('Admin dashboard error:', error);
    showToast('Failed to load dashboard data.', 'error');
  }
}

// --- Render Members Table ---
// BUG FIX: Use data attributes instead of inline onclick to prevent XSS with member names
function renderMembersTable(members) {
  const tbody = document.getElementById('members-tbody');
  if (!tbody) return;

  if (members.length === 0) {
    tbody.innerHTML = '<tr><td colspan="9" style="text-align:center; color:var(--muted); padding:2rem;">No members registered yet.</td></tr>';
    return;
  }

  tbody.innerHTML = members.map((m, i) => {
    const today = new Date();
    const expiry = new Date(m.expiry_date);
    const isExpired = today > expiry;
    const status = isExpired ? 'expired' : (m.status || 'active');

    return `
      <tr>
        <td>${i + 1}</td>
        <td>${escapeHtml(m.full_name)}</td>
        <td>${escapeHtml(m.email)}</td>
        <td>${escapeHtml(m.phone || '')}</td>
        <td><span class="badge-plan ${escapeHtml(m.plan)}">${capitalize(m.plan)}</span></td>
        <td>${escapeHtml(m.joined_date || '')}</td>
        <td style="color:${isExpired ? 'var(--error)' : 'var(--primary)'}">${escapeHtml(m.expiry_date || '')}</td>
        <td><span class="badge-plan ${status}">${capitalize(status)}</span></td>
        <td>
          <button class="btn-danger btn-delete-member" data-member-id="${escapeHtml(m.id)}" data-member-name="${escapeHtml(m.full_name)}">
            🗑 Delete
          </button>
        </td>
      </tr>
    `;
  }).join('');

  // Bind delete buttons via event delegation (XSS-safe)
  tbody.querySelectorAll('.btn-delete-member').forEach(btn => {
    btn.addEventListener('click', () => {
      deleteMember(btn.dataset.memberId, btn.dataset.memberName);
    });
  });
}

// --- Render Messages Table ---
function renderMessagesTable(messages) {
  const tbody = document.getElementById('messages-tbody');
  if (!tbody) return;

  if (messages.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; color:var(--muted); padding:2rem;">No messages received yet.</td></tr>';
    return;
  }

  tbody.innerHTML = messages.map((msg, i) => {
    const sentAt = msg.sent_at ? (msg.sent_at.toDate ? msg.sent_at.toDate().toLocaleString() : msg.sent_at) : 'N/A';
    // BUG FIX: Guard against undefined message field
    const rawMsg = msg.message || '';
    const msgPreview = rawMsg.length > 80 ? rawMsg.substring(0, 80) + '...' : rawMsg;

    return `
      <tr>
        <td>${i + 1}</td>
        <td>${escapeHtml(msg.name)}</td>
        <td>${escapeHtml(msg.email)}</td>
        <td style="max-width:280px; color:var(--muted);">${escapeHtml(msgPreview)}</td>
        <td style="color:var(--muted); font-size:0.85rem; white-space:nowrap;">${sentAt}</td>
      </tr>
    `;
  }).join('');
}

// --- Delete Member ---
// NOTE: This only deletes from Firestore, not Firebase Auth.
// To fully delete a user (Auth + Firestore), you need a Firebase
// Cloud Function with Admin SDK. The Auth user will remain active.
async function deleteMember(memberId, memberName) {
  if (!confirm(`Are you sure you want to delete member: ${memberName}?\nThis cannot be undone.`)) {
    return;
  }

  try {
    // Delete from Firestore (Auth user remains — requires Admin SDK to delete)
    await db.collection('members').doc(memberId).delete();
    showToast(`Member "${memberName}" deleted successfully.`, 'success');

    // Reload dashboard
    loadAdminDashboard();
  } catch (error) {
    console.error('Delete error:', error);
    showToast('Failed to delete member.', 'error');
  }
}


// ===== CONTACT MODULE =====

// --- Handle Contact Form ---
async function handleContactSubmit(e) {
  e.preventDefault();

  if (!validateContactForm()) return;

  const btn = e.target.querySelector('button[type="submit"]');
  showLoading(btn);

  const name = document.getElementById('cname').value.trim();
  const email = document.getElementById('cemail').value.trim();
  const message = document.getElementById('cmessage').value.trim();

  try {
    // Save to Firestore
    await db.collection('contacts').add({
      name: name,
      email: email,
      message: message,
      sent_at: firebase.firestore.FieldValue.serverTimestamp()
    });

    // Send notification via EmailJS
    sendEmailNotification(
      email, name,
      'IIUI Gym — Message Received',
      `Dear ${name},\n\nThank you for contacting IIUI Gym. We have received your message and will get back to you within 24 hours.\n\nYour message:\n"${message}"\n\nRegards,\nIIUI Gym Team`
    );

    hideLoading(btn);
    showToast('Message sent successfully! We\'ll get back to you soon.', 'success');
    e.target.reset();

  } catch (error) {
    hideLoading(btn);
    console.error('Contact error:', error);
    showToast('Failed to send message. Please try again.', 'error');
  }
}


// ===== UTILITY HELPERS =====

function setTextContent(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(text));
  return div.innerHTML;
}

function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}


// ===== INITIALIZATION =====
window.addEventListener('DOMContentLoaded', () => {
  // Scroll animations
  initScrollAnimations();

  // Auto-fill date on register page
  autoFillDate();

  // Counter animation for stats
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounters();
          observer.disconnect();
        }
      });
    });
    observer.observe(counters[0]);
  }

  // Bind form handlers
  const registerForm = document.getElementById('registerForm');
  if (registerForm) registerForm.addEventListener('submit', handleRegister);

  const memberLoginForm = document.getElementById('memberLoginForm');
  if (memberLoginForm) memberLoginForm.addEventListener('submit', handleMemberLogin);

  const adminLoginForm = document.getElementById('adminLoginForm');
  if (adminLoginForm) adminLoginForm.addEventListener('submit', handleAdminLogin);

  const contactForm = document.getElementById('contactForm');
  if (contactForm) contactForm.addEventListener('submit', handleContactSubmit);

  // Password strength indicator
  const passwordInput = document.getElementById('password');
  if (passwordInput) {
    passwordInput.addEventListener('input', (e) => {
      updatePasswordStrength(e.target.value);
    });
  }

  // Auto-hide alerts after 4 seconds
  const alert = document.querySelector('.alert');
  if (alert) {
    setTimeout(() => {
      alert.style.transition = 'opacity 0.5s';
      alert.style.opacity = '0';
      setTimeout(() => alert.remove(), 500);
    }, 4000);
  }
});