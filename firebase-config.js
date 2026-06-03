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
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// ===== INITIALIZE FIREBASE =====
firebase.initializeApp(firebaseConfig);

// ===== SERVICE REFERENCES =====
const auth = firebase.auth();
const db   = firebase.firestore();

// ===== EMAILJS CONFIG =====
// Sign up free at https://www.emailjs.com
// 200 emails/month on free tier
const EMAILJS_SERVICE_ID  = 'YOUR_EMAILJS_SERVICE_ID';
const EMAILJS_TEMPLATE_ID = 'YOUR_EMAILJS_TEMPLATE_ID';
const EMAILJS_PUBLIC_KEY   = 'YOUR_EMAILJS_PUBLIC_KEY';

// ===== IIUI EMAIL VALIDATION =====
// Only allows IIUI student/faculty emails
const ALLOWED_EMAIL_DOMAIN = '@iiu.edu.pk';

function isValidIIUIEmail(email) {
  return email.toLowerCase().endsWith(ALLOWED_EMAIL_DOMAIN);
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
function setupAuthGuard(requiredRole) {
  auth.onAuthStateChanged(async (user) => {
    if (requiredRole === 'member') {
      if (!user) {
        window.location.href = 'login.html';
        return;
      }
      if (!user.emailVerified) {
        window.location.href = 'verify-otp.html';
        return;
      }
    } else if (requiredRole === 'admin') {
      if (!user) {
        window.location.href = 'admin-login.html';
        return;
      }
      // Check admin role in Firestore
      const adminDoc = await db.collection('admins').doc(user.uid).get();
      if (!adminDoc.exists) {
        auth.signOut();
        window.location.href = 'admin-login.html';
        return;
      }
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
