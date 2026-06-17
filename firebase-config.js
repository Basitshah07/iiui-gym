const firebaseConfig = {
  apiKey: "AIzaSyCk7IsXp2nv5oKRdqchiFZnSxEA6tmi7ys",
  authDomain: "iiui-gyum.firebaseapp.com",
  projectId: "iiui-gyum",
  storageBucket: "iiui-gyum.firebasestorage.app",
  messagingSenderId: "154605846176",
  appId: "1:154605846176:web:8050215e5d5b80215b93c5"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db   = firebase.firestore();

const EMAILJS_SERVICE_ID  = 'service_6ycf326';
const EMAILJS_TEMPLATE_ID = 'template_6wd69pn';
const EMAILJS_PUBLIC_KEY   = 'EefxSXj2FHFCi4IUr';

if (typeof emailjs !== 'undefined' && EMAILJS_PUBLIC_KEY !== 'YOUR_EMAILJS_PUBLIC_KEY') {
  emailjs.init(EMAILJS_PUBLIC_KEY);
}

const ALLOWED_EMAIL_DOMAIN = '@gmail.com';

function isValidIIUIEmail(email) {
  if (!email) return false;
  const normalized = email.trim().toLowerCase();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(normalized) && normalized.endsWith(ALLOWED_EMAIL_DOMAIN);
}

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function showToast(message, type = 'info') {
  const existing = document.querySelector('.toast-notification');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = `toast-notification toast-${type}`;
  toast.innerHTML = `
    <span class="toast-icon">${type === 'success' ? '✅' : type === 'error' ? '❌' : type === 'warning' ? '⚠️' : 'ℹ️'}</span>
    <span class="toast-message">${message}</span>
  `;
  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('show'));
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, 4000);
}

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

// ===== AUTH GUARD =====
// FIX: After all checks pass, call loadMemberDashboard() or loadAdminDashboard()
// so the page actually populates with data — previously the body was shown
// but no data-loading function was ever called, resulting in a blank dashboard.
function setupAuthGuard(requiredRole) {
  document.body.style.visibility = 'hidden';
  document.body.style.opacity = '0';

  auth.onAuthStateChanged(async (user) => {
    if (requiredRole === 'member') {
      if (!user) {
        window.location.href = 'login.html';
        return;
      }
      try {
        const memberDoc = await db.collection('members').doc(user.uid).get();
        if (!memberDoc.exists || !memberDoc.data().verified) {
          window.location.href = 'verify-otp.html';
          return;
        }
        if (memberDoc.data().status === 'banned') {
          await auth.signOut();
          window.location.href = 'login.html';
          return;
        }
      } catch (err) {
        console.error('Auth guard error:', err);
        document.body.style.visibility = 'visible';
        document.body.style.opacity = '1';
        window.location.href = 'login.html';
        return;
      }
      // All checks passed — show page then load data
      document.body.style.visibility = 'visible';
      document.body.style.opacity = '1';
      // FIX: Actually call the dashboard loader
      if (typeof loadMemberDashboard === 'function') {
        loadMemberDashboard();
      }

    } else if (requiredRole === 'admin') {
      if (!user) {
        window.location.href = 'admin-login.html';
        return;
      }
      try {
        const adminDoc = await db.collection('admins').doc(user.uid).get();
        if (!adminDoc.exists) {
          await auth.signOut();
          window.location.href = 'admin-login.html';
          return;
        }
      } catch (err) {
        console.error('Admin auth guard error:', err);
        window.location.href = 'admin-login.html';
        return;
      }
      // All checks passed — show page then load data
      document.body.style.visibility = 'visible';
      document.body.style.opacity = '1';
      // FIX: Actually call the admin dashboard loader
      if (typeof loadAdminDashboard === 'function') {
        loadAdminDashboard();
      }

    } else {
      document.body.style.visibility = 'visible';
      document.body.style.opacity = '1';
    }
  });
}

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

function demonstrateHashing(password) {
  return crypto.subtle.digest('SHA-256', new TextEncoder().encode(password))
    .then(buffer => {
      return Array.from(new Uint8Array(buffer))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
    });
}

console.log('🔥 Firebase initialized for IIUI Gym');
console.log('📧 Email domain restriction:', ALLOWED_EMAIL_DOMAIN);