// ============================================
//  FILE: firebase-config.js
//  PURPOSE: Firebase Initialization & Config
//  TECH: Firebase v9 (modular SDK via CDN compat)
//
//  HOW IT WORKS:
//  - Firebase Auth: handles user registration,
//    login, logout, email verification (OTP)
//  - Firestore: NoSQL cloud database stores
//    members, admins, contacts, OTP logs
//  - Passwords are NEVER stored in Firestore;
//    Firebase Auth uses bcrypt/scrypt hashing
//    internally — far superior to MD5
//
//  SETUP:
//  1. Go to https://console.firebase.google.com
//  2. Create a new project (e.g. "iiui-gym")
//  3. Enable Authentication > Email/Password
//  4. Enable Cloud Firestore
//  5. Copy your config and paste below
// ============================================

// ===== FIREBASE CONFIGURATION =====
// REPLACE these values with your actual Firebase project config
const firebaseConfig = {
  apiKey: "AIzaSyCk7IsXp2nv5oKRdqchiFZnSxEA6tmi7ys",
  authDomain: "iiui-gyum.firebaseapp.com",
  projectId: "iiui-gyum",
  storageBucket: "iiui-gyum.firebasestorage.app",
  messagingSenderId: "154605846176",
  appId: "1:154605846176:web:8050215e5d5b80215b93c5"
};

// ===== INITIALIZE FIREBASE =====
firebase.initializeApp(firebaseConfig);

// ===== SERVICE REFERENCES =====
const auth = firebase.auth();
const db   = firebase.firestore();

// ===== EMAILJS CONFIG =====
// Sign up free at https://www.emailjs.com
// 200 emails/month on free tier
const EMAILJS_SERVICE_ID  = 'service_6ycf326';
const EMAILJS_TEMPLATE_ID = 'template_6wd69pn';
const EMAILJS_PUBLIC_KEY   = 'EefxSXj2FHFCi4IUr';

// FIX: EmailJS v4 requires init() to be called before send() — without this,
// every sendEmailNotification() call silently fails with "Public Key is required"
if (typeof emailjs !== 'undefined' && EMAILJS_PUBLIC_KEY !== 'YOUR_EMAILJS_PUBLIC_KEY') {
  emailjs.init(EMAILJS_PUBLIC_KEY);
}

// ===== IIUI EMAIL VALIDATION =====
// Only allows IIUI student/faculty emails
const ALLOWED_EMAIL_DOMAIN = '@gmail.com';

// FIX: normalize to lowercase before checking domain (consistent with main.js validateIIUIEmail)
function isValidIIUIEmail(email) {
  if (!email) return false;
  const normalized = email.trim().toLowerCase();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(normalized) && normalized.endsWith(ALLOWED_EMAIL_DOMAIN);
}

// ===== UTILITY: Generate 6-digit OTP =====
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// ===== UTILITY: Toast Notification =====
function showToast(message, type = 'info') {
  // Remove any existing toast
  const existing = document.querySelector('.toast-notification');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = `toast-notification toast-${type}`;
  toast.innerHTML = `
    <span class="toast-icon">${type === 'success' ? '✅' : type === 'error' ? '❌' : type === 'warning' ? '⚠️' : 'ℹ️'}</span>
    <span class="toast-message">${message}</span>
  `;
  document.body.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => toast.classList.add('show'));

  // Auto-dismiss
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, 4000);
}

// ===== UTILITY: Loading Spinner =====
function showLoading(button) {
  if (!button) return;
  button.dataset.originalText = button.textContent;
  button.disabled = true;
  button.innerHTML = '<span class="spinner"></span> Processing...';
}

function hideLoading(button) {
  if (!button) return;
  button.disabled = false;
  button.textContent = button.dataset.originalText || 'Submit';
}

// ===== AUTH STATE LISTENER =====
// Redirects users based on login state
// FIX: Hide page body immediately to prevent flash of protected content
// before the async Firestore verification check completes.
function setupAuthGuard(requiredRole) {
  // Hide the entire page until auth check is done
  document.body.style.visibility = 'hidden';
  document.body.style.opacity = '0';

  auth.onAuthStateChanged(async (user) => {
    if (requiredRole === 'member') {
      if (!user) {
        window.location.href = 'login.html';
        return;
      }
      // Check Firestore 'verified' flag (set by OTP verification)
      const memberDoc = await db.collection('members').doc(user.uid).get();
      if (!memberDoc.exists || !memberDoc.data().verified) {
        window.location.href = 'verify-otp.html';
        return;
      }
      // Check if member is banned/deactivated
      if (memberDoc.data().status === 'banned') {
        await auth.signOut();
        window.location.href = 'login.html';
        return;
      }
      // All checks passed — show the page
      document.body.style.visibility = 'visible';
      document.body.style.opacity = '1';
    } else if (requiredRole === 'admin') {
      if (!user) {
        window.location.href = 'admin-login.html';
        return;
      }
      // Check admin role in Firestore
      const adminDoc = await db.collection('admins').doc(user.uid).get();
      if (!adminDoc.exists) {
        await auth.signOut();
        window.location.href = 'admin-login.html';
        return;
      }
      // All checks passed — show the page
      document.body.style.visibility = 'visible';
      document.body.style.opacity = '1';
    } else {
      // No role required — just show the page
      document.body.style.visibility = 'visible';
      document.body.style.opacity = '1';
    }
  });
}

// ===== SEND EMAIL NOTIFICATION via EmailJS =====
async function sendEmailNotification(toEmail, toName, subject, body) {
  try {
    if (typeof emailjs === 'undefined') {
      console.warn('EmailJS not loaded — skipping email notification');
      return;
    }
    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
      to_email: toEmail,
      to_name: toName,
      subject: subject,
      message: body
    }, EMAILJS_PUBLIC_KEY);
    console.log('Email notification sent to', toEmail);
  } catch (err) {
    console.warn('Email notification failed:', err);
  }
}

// ===== SEND 6-DIGIT OTP EMAIL via EmailJS =====
// Uses the "One-Time Password" template, which expects {{passcode}}, {{email}}, {{time}}
async function sendOTPEmail(toEmail, otpCode) {
  try {
    if (typeof emailjs === 'undefined') {
      console.warn('EmailJS not loaded — cannot send OTP email');
      return false;
    }
    const expiryTime = new Date(Date.now() + 15 * 60 * 1000).toLocaleString('en-PK', {
      dateStyle: 'medium',
      timeStyle: 'short'
    });
    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
      passcode: otpCode,
      email: toEmail,
      time: expiryTime
    }, EMAILJS_PUBLIC_KEY);
    console.log('OTP email sent to', toEmail);
    return true;
  } catch (err) {
    console.error('OTP email failed:', err);
    return false;
  }
}

// ===== HASH DISPLAY UTILITY =====
// Shows that password is hashed (for OWN/demo purposes)
function demonstrateHashing(password) {
  // Firebase Auth uses bcrypt/scrypt internally
  // This is just a visual demo using SHA-256
  return crypto.subtle.digest('SHA-256', new TextEncoder().encode(password))
    .then(buffer => {
      return Array.from(new Uint8Array(buffer))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
    });
}

console.log('🔥 Firebase initialized for IIUI Gym');
console.log('📧 Email domain restriction:', ALLOWED_EMAIL_DOMAIN);