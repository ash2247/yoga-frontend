<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Enable error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Database configuration (for storing emails)
$dbConfig = [
    'host' => 'localhost',
    'dbname' => 'yoga_studio_emails',
    'username' => 'root',
    'password' => ''
];

// SMTP Configuration
$smtpConfig = [
    'host' => 'smtp.gmail.com',
    'port' => 587,
    'username' => '', // Will be set from settings
    'password' => '', // Will be set from settings
    'from_email' => '', // Will be set from settings
    'from_name' => 'Yoga Studio',
    'encryption' => 'tls'
];

// Create database connection
function getDbConnection() {
    global $dbConfig;
    try {
        $conn = new PDO(
            "mysql:host={$dbConfig['host']};dbname={$dbConfig['dbname']};charset=utf8mb4",
            $dbConfig['username'],
            $dbConfig['password'],
            [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
            ]
        );
        return $conn;
    } catch (PDOException $e) {
        error_log("Database connection failed: " . $e->getMessage());
        return null;
    }
}

// Initialize database
function initializeDatabase() {
    $conn = getDbConnection();
    if (!$conn) return false;
    
    try {
        // Create emails table
        $conn->exec("
            CREATE TABLE IF NOT EXISTS emails (
                id INT AUTO_INCREMENT PRIMARY KEY,
                to_email VARCHAR(255) NOT NULL,
                from_email VARCHAR(255),
                subject VARCHAR(500) NOT NULL,
                message TEXT NOT NULL,
                status ENUM('sent', 'draft', 'failed') DEFAULT 'draft',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                sent_at TIMESTAMP NULL,
                error_message TEXT NULL,
                INDEX idx_status (status),
                INDEX idx_created_at (created_at)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        ");
        
        // Create email_settings table
        $conn->exec("
            CREATE TABLE IF NOT EXISTS email_settings (
                id INT AUTO_INCREMENT PRIMARY KEY,
                setting_key VARCHAR(100) UNIQUE NOT NULL,
                setting_value TEXT NOT NULL,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        ");
        
        // Insert default settings if they don't exist
        $defaultSettings = [
            'smtp_host' => 'smtp.gmail.com',
            'smtp_port' => '587',
            'smtp_username' => '',
            'smtp_password' => '',
            'smtp_from_email' => '',
            'smtp_from_name' => 'Yoga Studio',
            'smtp_encryption' => 'tls'
        ];
        
        foreach ($defaultSettings as $key => $value) {
            $stmt = $conn->prepare("INSERT IGNORE INTO email_settings (setting_key, setting_value) VALUES (?, ?)");
            $stmt->execute([$key, $value]);
        }
        
        return true;
    } catch (Exception $e) {
        error_log("Database initialization failed: " . $e->getMessage());
        return false;
    }
}

// Send email using PHPMailer
function sendEmail($to, $subject, $message, $fromEmail = null, $fromName = null) {
    // Load SMTP settings
    $conn = getDbConnection();
    if (!$conn) return ['success' => false, 'message' => 'Database connection failed'];
    
    $stmt = $conn->prepare("SELECT setting_value FROM email_settings WHERE setting_key = ?");
    $settings = [];
    
    foreach (['smtp_host', 'smtp_port', 'smtp_username', 'smtp_password', 'smtp_from_email', 'smtp_from_name', 'smtp_encryption'] as $key) {
        $stmt->execute([$key]);
        $result = $stmt->fetch();
        $settings[$key] = $result ? $result['setting_value'] : '';
    }
    
    // Override with provided parameters
    $fromEmail = $fromEmail ?: $settings['smtp_from_email'];
    $fromName = $fromName ?: $settings['smtp_from_name'];
    
    try {
        // Import PHPMailer
        require_once 'PHPMailer/src/PHPMailer.php';
        require_once 'PHPMailer/src/SMTP.php';
        require_once 'PHPMailer/src/Exception.php';
        
        $mail = new PHPMailer\PHPMailer\PHPMailer(true);
        
        // Server settings
        $mail->isSMTP();
        $mail->Host = $settings['smtp_host'];
        $mail->SMTPAuth = true;
        $mail->Username = $settings['smtp_username'];
        $mail->Password = $settings['smtp_password'];
        $mail->SMTPSecure = $settings['smtp_encryption'];
        $mail->Port = $settings['smtp_port'];
        
        // Recipients
        $mail->setFrom($fromEmail, $fromName);
        $mail->addAddress($to);
        
        // Content
        $mail->isHTML(true);
        $mail->Subject = $subject;
        $mail->Body = $message;
        
        $mail->send();
        
        return ['success' => true, 'message' => 'Email sent successfully'];
        
    } catch (Exception $e) {
        error_log("Email sending failed: " . $e->getMessage());
        return ['success' => false, 'message' => 'Email sending failed: ' . $e->getMessage()];
    }
}

// Get request method and URI
$method = $_SERVER['REQUEST_METHOD'];
$uri = str_replace('/backend/email-system.php', '', $_SERVER['REQUEST_URI']);
$uri = trim($uri, '/');

// Initialize database on first run
initializeDatabase();

// --- GET EMAILS ---
if ($uri === 'emails' && $method === 'GET') {
    $conn = getDbConnection();
    if (!$conn) {
        echo json_encode(['success' => false, 'message' => 'Database connection failed']);
        exit();
    }
    
    $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
    $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 20;
    $offset = ($page - 1) * $limit;
    $status = isset($_GET['status']) ? $_GET['status'] : null;
    
    $query = "SELECT * FROM emails";
    $params = [];
    
    if ($status) {
        $query .= " WHERE status = ?";
        $params[] = $status;
    }
    
    $query .= " ORDER BY created_at DESC LIMIT ? OFFSET ?";
    $params[] = $limit;
    $params[] = $offset;
    
    $stmt = $conn->prepare($query);
    $stmt->execute($params);
    $emails = $stmt->fetchAll();
    
    // Get total count
    $countQuery = "SELECT COUNT(*) as total FROM emails";
    $countParams = [];
    
    if ($status) {
        $countQuery .= " WHERE status = ?";
        $countParams[] = $status;
    }
    
    $countStmt = $conn->prepare($countQuery);
    $countStmt->execute($countParams);
    $total = $countStmt->fetch()['total'];
    
    echo json_encode([
        'success' => true,
        'emails' => $emails,
        'pagination' => [
            'page' => $page,
            'limit' => $limit,
            'total' => $total,
            'pages' => ceil($total / $limit)
        ]
    ]);
    exit();
}

// --- SEND EMAIL ---
if ($uri === 'send' && $method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    $to = $input['to'] ?? '';
    $subject = $input['subject'] ?? '';
    $message = $input['message'] ?? '';
    $fromEmail = $input['from_email'] ?? null;
    $fromName = $input['from_name'] ?? null;
    
    if (empty($to) || empty($subject) || empty($message)) {
        echo json_encode(['success' => false, 'message' => 'To email, subject, and message are required']);
        exit();
    }
    
    // Validate email
    if (!filter_var($to, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(['success' => false, 'message' => 'Invalid email address']);
        exit();
    }
    
    // Store email in database
    $conn = getDbConnection();
    if (!$conn) {
        echo json_encode(['success' => false, 'message' => 'Database connection failed']);
        exit();
    }
    
    $stmt = $conn->prepare("INSERT INTO emails (to_email, from_email, subject, message, status) VALUES (?, ?, ?, ?, 'draft')");
    $stmt->execute([$to, $fromEmail, $subject, $message]);
    $emailId = $conn->lastInsertId();
    
    // Send email
    $result = sendEmail($to, $subject, $message, $fromEmail, $fromName);
    
    if ($result['success']) {
        // Update status to sent
        $updateStmt = $conn->prepare("UPDATE emails SET status = 'sent', sent_at = NOW() WHERE id = ?");
        $updateStmt->execute([$emailId]);
        
        echo json_encode(['success' => true, 'message' => 'Email sent successfully', 'email_id' => $emailId]);
    } else {
        // Update status to failed
        $updateStmt = $conn->prepare("UPDATE emails SET status = 'failed', error_message = ? WHERE id = ?");
        $updateStmt->execute([$result['message'], $emailId]);
        
        echo json_encode(['success' => false, 'message' => $result['message'], 'email_id' => $emailId]);
    }
    exit();
}

// --- GET EMAIL SETTINGS ---
if ($uri === 'settings' && $method === 'GET') {
    $conn = getDbConnection();
    if (!$conn) {
        echo json_encode(['success' => false, 'message' => 'Database connection failed']);
        exit();
    }
    
    $stmt = $conn->prepare("SELECT setting_key, setting_value FROM email_settings");
    $stmt->execute();
    $settings = $stmt->fetchAll();
    
    $settingsArray = [];
    foreach ($settings as $setting) {
        $settingsArray[$setting['setting_key']] = $setting['setting_value'];
    }
    
    echo json_encode(['success' => true, 'settings' => $settingsArray]);
    exit();
}

// --- UPDATE EMAIL SETTINGS ---
if ($uri === 'settings' && $method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($input['settings']) || !is_array($input['settings'])) {
        echo json_encode(['success' => false, 'message' => 'Settings data is required']);
        exit();
    }
    
    $conn = getDbConnection();
    if (!$conn) {
        echo json_encode(['success' => false, 'message' => 'Database connection failed']);
        exit();
    }
    
    try {
        foreach ($input['settings'] as $key => $value) {
            $stmt = $conn->prepare("UPDATE email_settings SET setting_value = ? WHERE setting_key = ?");
            $stmt->execute([$value, $key]);
        }
        
        echo json_encode(['success' => true, 'message' => 'Email settings updated successfully']);
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'message' => 'Failed to update settings: ' . $e->getMessage()]);
    }
    exit();
}

// --- DELETE EMAIL ---
if ($uri === 'emails' && $method === 'DELETE') {
    $input = json_decode(file_get_contents('php://input'), true);
    $emailId = $input['id'] ?? null;
    
    if (!$emailId) {
        echo json_encode(['success' => false, 'message' => 'Email ID is required']);
        exit();
    }
    
    $conn = getDbConnection();
    if (!$conn) {
        echo json_encode(['success' => false, 'message' => 'Database connection failed']);
        exit();
    }
    
    $stmt = $conn->prepare("DELETE FROM emails WHERE id = ?");
    $result = $stmt->execute([$emailId]);
    
    if ($result) {
        echo json_encode(['success' => true, 'message' => 'Email deleted successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to delete email']);
    }
    exit();
}

http_response_code(404);
echo json_encode(['error' => 'Not found', 'uri' => $uri]);
?>
