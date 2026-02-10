# Yoga Studio Website - cPanel Deployment Guide

## 📦 What You Have Received

1. **yoga-studio-production.zip** - Complete production build
2. **database.sql** - MySQL database file (also included in zip)

## 🚀 Step-by-Step Deployment Instructions

### Step 1: Upload Files to cPanel

1. Log in to your cPanel account
2. Navigate to **File Manager**
3. Go to your **public_html** directory (or your desired domain folder)
4. Extract the `yoga-studio-production.zip` file in this directory
5. Ensure all files are properly placed:
   - Frontend files (index.html, assets/, etc.) should be in the root
   - Backend PHP files should be in the `backend/` folder
   - The `database.sql` file should be in the `backend/` folder

### Step 2: Database Setup

1. In cPanel, go to **MySQL Databases**
2. Create a new database:
   - Database name: `yoga_studio` (or your preferred name)
3. Create a database user:
   - Username: your preferred username
   - Password: strong password
4. Add the user to the database with **ALL PRIVILEGES**

### Step 3: Import Database

1. In cPanel, go to **phpMyAdmin**
2. Select your newly created database
3. Click on **Import** tab
4. Choose the `database.sql` file from your `backend/` folder
5. Click **Go** to import

### Step 4: Configure Database Connection

Edit the `backend/db_connect.php` file with your database credentials:

```php
<?php
$host = 'localhost'; // Usually localhost on cPanel
$dbname = 'your_database_name'; // The database you created
$username = 'your_database_username'; // The user you created
$password = 'your_database_password'; // The password you set

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    echo "Connection failed: " . $e->getMessage();
}
?>
```

### Step 5: Set File Permissions

In cPanel File Manager, set the following permissions:
- All PHP files: **644**
- The `backend/uploads/` directory: **755**
- All other directories: **755**

### Step 6: Test Your Website

1. Visit your domain in a browser
2. The website should load with all functionality
3. Test the admin panel (usually at `/admin`):
   - Default username: `admin`
   - Default password: `password123`
   - **IMPORTANT**: Change this password immediately after first login!

### Step 7: Configure SEO Settings

1. Log in to the admin panel
2. Navigate to **SEO** section
3. Update your SEO settings:
   - **Page Title**: Your website title (max 60 characters)
   - **Meta Description**: Website description (max 160 characters)
   - **Keywords**: Comma-separated keywords
   - **OG Image**: Upload an image for social media sharing
   - **Twitter Card**: Choose card type for Twitter sharing
   - **Author**: Website author name
   - **Canonical URL**: Your main domain URL
   - **Robots**: Search engine crawling instructions

4. Click **Save Changes** to update SEO settings
5. The SEO data will be automatically applied to your website's meta tags

## 🔧 Important Notes

### Security Recommendations
1. **Change the default admin password** immediately
2. Ensure your database user has only necessary permissions
3. Keep regular backups of your database
4. Consider implementing SSL certificate (usually available in cPanel)

### File Structure After Extraction
```
public_html/
├── index.html
├── assets/
│   ├── index-[hash].css
│   ├── index-[hash].js
│   └── images/
│       ├── hero-slide-1.jpg
│       ├── hero-slide-2.jpg
│       └── ... (all other images)
├── backend/
│   ├── index.php
│   ├── db_connect.php
│   ├── setup.php
│   ├── email-system.php
│   ├── database.sql
│   ├── data/
│   │   ├── content.json
│   │   ├── social-links.json
│   │   └── users.json
│   └── uploads/
└── ... (other frontend files)
```

## 🌟 Features

- Responsive yoga studio website
- Admin panel for content management
- **SEO management** with meta tags, Open Graph, and Twitter Cards
- Class scheduling
- Blog management
- Contact forms
- Image uploads
- Analytics dashboard
- Email system

### Troubleshooting

**If you get a database connection error:**
- Double-check your database credentials in `db_connect.php`
- Ensure the database user has proper permissions
- Verify the database name is correct

**If images don't load:**
- Check that the `assets/images/` directory exists
- Verify file permissions are set correctly
- Ensure the paths in the database match the actual file locations

**If admin panel doesn't work:**
- Check PHP error logs in cPanel
- Ensure all PHP files have correct permissions
- Verify the database connection is working

## 📞 Support

If you encounter any issues:
1. Check cPanel error logs
2. Verify all file permissions
3. Ensure database connection details are correct
4. Test with the default admin credentials first

The website is now ready for production use! 🧘‍♀️
