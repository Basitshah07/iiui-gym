// ============================================
//  FILE: main.js
//  PURPOSE: JavaScript for IIUI Gym
//  Handles: form validation, navbar toggle,
//           date auto-fill, UI interactions
// ============================================

// ===== NAVBAR TOGGLE (mobile) =====
function toggleMenu() {
  const links = document.querySelector('.nav-links');
  links.classList.toggle('open');
}

// Close menu when a link is clicked
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    document.querySelector('.nav-links').classList.remove('open');
  });
});

// ===== AUTO-FILL TODAY'S DATE on register =====
window.addEventListener('DOMContentLoaded', () => {
  const dateInput = document.getElementById('joined_date');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.value = today;
  }
});

// ===== REGISTER FORM VALIDATION =====
function validateForm() {
  let valid = true;

  // Full Name
  const name  = document.getElementById('full_name');
  const nameErr = document.getElementById('nameErr');
  if (name && name.value.trim().length < 3) {
    nameErr.textContent = 'Name must be at least 3 characters.';
    valid = false;
  } else if (nameErr) {
    nameErr.textContent = '';
  }

  // Email
  const email    = document.getElementById('email');
  const emailErr = document.getElementById('emailErr');
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (email && !emailPattern.test(email.value.trim())) {
    emailErr.textContent = 'Please enter a valid email address.';
    valid = false;
  } else if (emailErr) {
    emailErr.textContent = '';
  }

  // Phone (Pakistani format: 03XX-XXXXXXX or 11 digits)
  const phone    = document.getElementById('phone');
  const phoneErr = document.getElementById('phoneErr');
  const phonePattern = /^(03\d{2}[-\s]?\d{7}|0\d{10})$/;
  if (phone && !phonePattern.test(phone.value.trim())) {
    phoneErr.textContent = 'Enter a valid Pakistani phone number (e.g. 0300-1234567).';
    valid = false;
  } else if (phoneErr) {
    phoneErr.textContent = '';
  }

  // Password
  const pass    = document.getElementById('password');
  const passErr = document.getElementById('passErr');
  if (pass && pass.value.trim().length < 6) {
    passErr.textContent = 'Password must be at least 6 characters.';
    valid = false;
  } else if (passErr) {
    passErr.textContent = '';
  }

  // Confirm Password
  const confirm    = document.getElementById('confirm_password');
  const confirmErr = document.getElementById('confirmErr');
  if (pass && confirm && pass.value !== confirm.value) {
    confirmErr.textContent = 'Passwords do not match.';
    valid = false;
  } else if (confirmErr) {
    confirmErr.textContent = '';
  }

  return valid;
}

// ===== CONTACT FORM VALIDATION =====
function validateContact() {
  let valid = true;

  const name   = document.getElementById('cname');
  const nameErr= document.getElementById('cnameErr');
  if (name && name.value.trim().length < 2) {
    nameErr.textContent = 'Please enter your name.';
    valid = false;
  } else if (nameErr) {
    nameErr.textContent = '';
  }

  const msg    = document.getElementById('cmessage');
  const msgErr = document.getElementById('cmsgErr');
  if (msg && msg.value.trim().length < 10) {
    msgErr.textContent = 'Message must be at least 10 characters.';
    valid = false;
  } else if (msgErr) {
    msgErr.textContent = '';
  }

  return valid;
}

// ===== LOGIN FORM VALIDATION =====
function validateLogin() {
  const user = document.getElementById('username');
  const pass = document.getElementById('password');
  const err  = document.getElementById('loginErr');

  if (!user || !pass) return true;

  if (user.value.trim() === '' || pass.value.trim() === '') {
    if (err) err.textContent = 'Both fields are required.';
    return false;
  }

  if (err) err.textContent = '';
  return true;
}

// ===== MEMBER LOGIN VALIDATION =====
function validateMemberLogin() {
  const email = document.getElementById('memail');
  const pass  = document.getElementById('mpassword');
  const err   = document.getElementById('mloginErr');

  if (!email || !pass) return true;

  if (email.value.trim() === '' || pass.value.trim() === '') {
    if (err) err.textContent = 'Both fields are required.';
    return false;
  }

  if (err) err.textContent = '';
  return true;
}

// ===== DELETE MEMBER CONFIRMATION =====
function confirmDelete(name) {
  return confirm('Are you sure you want to delete member: ' + name + '?\nThis cannot be undone.');
}

// ===== SMOOTH SCROLL for anchor links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
});

// ===== AUTO-HIDE ALERTS after 4 seconds =====
window.addEventListener('DOMContentLoaded', () => {
  const alert = document.querySelector('.alert');
  if (alert) {
    setTimeout(() => {
      alert.style.transition = 'opacity 0.5s';
      alert.style.opacity    = '0';
      setTimeout(() => alert.remove(), 500);
    }, 4000);
  }
});