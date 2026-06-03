# Gym Management System

A simple PHP-based gym management system with member registration, login, and dashboard functionality.

## Features

- ✅ Member registration and authentication
- ✅ Member dashboard
- ✅ Admin dashboard  
- ✅ Member management (add, delete)
- ✅ Contact form

## Project Structure

```
gym/
├── index.html              # Landing page
├── register.php            # Member registration
├── member_login.php        # Member login page
├── member_dashboard.php    # Member dashboard
├── dashboard.php           # Admin dashboard
├── contact.php             # Contact form
├── db.php                  # Database configuration
├── style.css               # Styles
├── main.js                 # JavaScript functionality
└── gym_database.sql        # Database schema
```

## Prerequisites

- PHP 7.4 or higher
- MySQL/MariaDB
- Web server (Apache recommended)
- XAMPP or similar local development environment

## Installation

### Local Setup (XAMPP)

1. Clone this repository into your `htdocs` folder:
   ```bash
   git clone https://github.com/YOUR_USERNAME/gym.git
   cd gym
   ```

2. Start XAMPP (Apache and MySQL)

3. Create a database:
   - Open phpMyAdmin at `http://localhost/phpmyadmin`
   - Create a new database named `iiui_gym`
   - Import `gym_database.sql` into this database

4. Access the application:
   ```
   http://localhost/gym
   ```

### Environment Configuration

For production/hosting, create a `.env` file in the project root:

```env
DB_HOST=your_host
DB_NAME=your_database
DB_USER=your_username
DB_PASS=your_password
```

Then update `db.php` to read from `.env` file (see Deployment section).

## Database

The application uses MySQL with the following main tables:
- `members` - User account information
- `admin` - Admin credentials

Run `gym_database.sql` to set up the database.

## Files Overview

| File | Purpose |
|------|---------|
| `db.php` | Database connection |
| `register.php` | New member registration |
| `member_login.php` | Member login form |
| `member_login_process.php` | Login validation |
| `member_dashboard.php` | Member panel |
| `delete_member.php` | Member deletion |
| `contact_process.php` | Contact form handler |
| `logout.php` | Session termination |

## Security Notes

⚠️ **Before deploying to production:**

1. Never commit `.env` files to version control
2. Use environment variables for database credentials
3. Implement input validation and sanitization
4. Use prepared statements (already in use)
5. Add CSRF tokens to forms
6. Use HTTPS in production
7. Hash passwords with `password_hash()` and `password_verify()`

## Deployment Options

### Free Hosting Services

1. **Railway** (Recommended for PHP)
   - Easy deployment from GitHub
   - Free tier available
   - [Railway.app](https://railway.app)

2. **Render**
   - Free tier for web services
   - Deploy from GitHub
   - [Render.com](https://render.com)

3. **000webhost**
   - Free PHP hosting
   - Easy setup

4. **Heroku** (requires buildpack for PHP)
   - Traditional option
   - Free tier removed but still affordable

## License

This project is open source and available under the MIT License.

## Support

For questions or issues, please open a GitHub issue.

---

**Created**: 2024  
**Last Updated**: 2024
