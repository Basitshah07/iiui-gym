# IIUI Gym Management System

A modern, static web application for the **International Islamic University Islamabad (IIUI)** gym management. Built with HTML, CSS, and JavaScript with Firebase as the backend. Deployable on **GitHub Pages** and **Render**.

---

## 🔥 Live Features

| # | Feature | Status | Description |
|---|---------|--------|-------------|
| 1 | **UI** | ✅ | Premium Crimson Eclipse dark theme with micro-animations, glassmorphism, responsive design |
| 2 | **Live** | ✅ | Static HTML/CSS/JS — deployable to GitHub Pages, Render, Netlify, Vercel |
| 3 | **FUNC** | ✅ | Full functionality: registration, login, dashboard, member management, contact form |
| 4 | **DYNAMIC** | ✅ | Firebase Firestore (database) + Firebase Auth (authentication) — real-time backend |
| 5 | **Auth** | ✅ | IIUI email restriction (`@iiu.edu.pk`), Email/Password auth, OTP email verification |
| 6 | **PSWRD** | ✅ | Firebase Auth uses **bcrypt/scrypt** hashing internally (passwords never stored as plain text) |
| 7 | **SMS Alert** | ✅ | EmailJS integration for membership expiry alerts, welcome emails, contact confirmations |
| 8 | **OWN** | ✅ | Clean, documented code with inline comments explaining every module |

---

## 📁 Project Structure

```
gym/
├── index.html              # Home page — hero, features, plans, about
├── register.html           # Member registration (IIUI email + OTP)
├── login.html              # Member login
├── admin-login.html        # Admin login
├── dashboard.html          # Member profile dashboard
├── admin-dashboard.html    # Admin dashboard (stats, members, messages)
├── contact.html            # Contact form + gym info
├── verify-otp.html         # Email OTP verification page
├── style.css               # Crimson Eclipse dark theme stylesheet
├── main.js                 # Application logic (auth, CRUD, validation)
├── firebase-config.js      # Firebase initialization & utilities
├── .gitignore              # Git ignore rules
└── README.md               # This file
```

---

## 🛠️ Tech Stack

| Technology | Purpose |
|-----------|---------|
| **HTML5** | Semantic page structure |
| **CSS3** | Crimson Eclipse dark theme, animations, responsive grid |
| **JavaScript (ES6+)** | Application logic, DOM manipulation, Firebase SDK |
| **Firebase Auth** | User authentication with email/password + OTP verification |
| **Firebase Firestore** | NoSQL cloud database (members, admins, contacts) |
| **EmailJS** | Email notifications (expiry alerts, welcome emails) |
| **Google Fonts** | Inter + Outfit typography |

---

## 🚀 Setup Instructions

### 1. Firebase Setup (Required)

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project (e.g., `iiui-gym`)
3. Enable **Authentication** → Sign-in method → **Email/Password**
4. Enable **Cloud Firestore** → Start in test mode
5. Go to **Project Settings** → scroll to **Your apps** → click **Web** (`</>`)
6. Copy the config object
7. Paste into `firebase-config.js` replacing the placeholder values

### 2. EmailJS Setup (Optional — for SMS/Email Alerts)

1. Sign up at [EmailJS](https://www.emailjs.com) (free: 200 emails/month)
2. Create a service (Gmail, Outlook, etc.)
3. Create an email template with variables: `to_email`, `to_name`, `subject`, `message`
4. Copy Service ID, Template ID, and Public Key
5. Paste into `firebase-config.js`

### 3. Create Admin Account

In Firebase Console → Authentication → Add user manually:
- Email: `admin@iiu.edu.pk`
- Password: `admin123` (or your preferred password)

Then in Firestore → Create collection `admins` → Add document:
- Document ID: (copy the UID from Auth)
- Fields: `username: "admin"`, `role: "admin"`

### 4. Run Locally

Simply open `index.html` in your browser. No server needed!

Or use a local server:
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve .

# Using VS Code
# Install "Live Server" extension → right-click index.html → Open with Live Server
```

---

## 🌐 Deployment

### GitHub Pages
1. Push to GitHub repository
2. Go to **Settings** → **Pages** → Source: `main` branch
3. Site will be live at `https://username.github.io/gym/`

### Render
1. Push to GitHub
2. Go to [Render](https://render.com) → New → Static Site
3. Connect your GitHub repo
4. Build command: (leave empty)
5. Publish directory: `.`
6. Deploy!

---

## 🔐 Security Features

- **IIUI Email Restriction**: Only `@iiu.edu.pk` emails can register
- **Email Verification (OTP)**: Firebase sends verification emails automatically
- **Password Hashing**: Firebase Auth uses bcrypt/scrypt (industry standard)
- **Auth Guards**: Dashboard pages redirect to login if not authenticated
- **Admin Role Verification**: Admin dashboard checks Firestore for admin role
- **Input Validation**: Client-side validation on all forms
- **XSS Protection**: HTML escaping on all dynamic content

---

## 📱 IIUI-Specific Features

1. **🕌 Prayer-Friendly Schedule** — Gym timings aligned with prayer schedules
2. **📧 IIUI Email Auth** — Exclusive access for @iiu.edu.pk email holders
3. **👥 Separate Sessions** — Male/female student sessions per IIUI policy
4. **📍 Campus Location** — H-10 sector, Islamabad
5. **🏋️ Modern Equipment** — Pakistan Sports Board certified trainers
6. **📱 SMS/Email Alerts** — Membership expiry notifications

---

## 📊 Database Schema (Firestore)

### Collection: `members`
| Field | Type | Description |
|-------|------|-------------|
| full_name | string | Member's full name |
| email | string | IIUI email (@iiu.edu.pk) |
| phone | string | Pakistani phone number |
| plan | string | basic / standard / premium |
| joined_date | string | YYYY-MM-DD |
| expiry_date | string | YYYY-MM-DD (joined + 1 month) |
| status | string | active / expired |
| created_at | timestamp | Server timestamp |

### Collection: `admins`
| Field | Type | Description |
|-------|------|-------------|
| username | string | Admin username |
| role | string | "admin" |

### Collection: `contacts`
| Field | Type | Description |
|-------|------|-------------|
| name | string | Sender name |
| email | string | Sender email |
| message | string | Message content |
| sent_at | timestamp | Server timestamp |

---

## 👨‍💻 Code Ownership (OWN)

This project demonstrates understanding of:

- **Frontend**: HTML5 semantics, CSS3 animations/grid/flexbox, vanilla JavaScript ES6+
- **Backend**: Firebase Authentication, Cloud Firestore NoSQL database
- **Security**: Password hashing (bcrypt via Firebase), email verification, auth guards
- **Architecture**: Modular JavaScript (UI, Auth, Member, Admin, Contact, Validation modules)
- **Design**: Dark theme design system with CSS custom properties, responsive breakpoints
- **Deployment**: Static site deployment to GitHub Pages and Render

---

## 📄 License

This project is open source and available under the MIT License.

---

**Created**: 2026  
**University**: International Islamic University Islamabad (IIUI)  
**Module**: Web Development Project
