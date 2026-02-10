# Deployment Guide (cPanel + MySQL)

This project uses a generic PHP backend with a MySQL database.

## 1. Database Setup
1.  Log in to your cPanel.
2.  Go to **MySQL Database Wizard**.
3.  Create a new valid database (e.g., `youruser_yoga`).
4.  Create a new database user (e.g., `youruser_admin`) and set a password.
5.  **Important:** Add the user to the database and tick **ALL PRIVILEGES**.
6.  Go to **phpMyAdmin**.
7.  Select your new database.
8.  Click **Import** and upload the `backend/database.sql` file from this project.
    *   This will create the `users` and `site_content` tables and insert default data.

## 2. Configuration
1.  Open `backend/db_connect.php`.
2.  Update the credentials to match your cPanel database details:
    ```php
    $host = 'localhost';
    $dbname = 'youruser_yoga';   // Change this
    $username = 'youruser_admin'; // Change this
    $password = 'your_password';  // Change this
    ```

## 3. Uploading Files
1.  Build the React frontend:
    ```bash
    npm run build
    ```
    This creates a `dist` folder.
2.  Upload the contents of `dist` to your `public_html` folder (or subdomain folder).
3.  Create a `backend` folder in `public_html`.
4.  Upload the `backend/index.php`, `backend/db_connect.php`, and `backend/uploads` folder to `public_html/backend`.

## 4. Testing
1.  Visit `yourdomain.com`. It should load the site.
2.  Visit `yourdomain.com/admin/login`.
    *   Default Admin: `admin` / `password123`
    *   (You should change this password in the database `users` table or via a script soon).

## Troubleshooting
*   If you see "Database connection failed", check `db_connect.php`.
*   If images don't load, ensure the `uploads` folder has write permissions (755 or 777).
