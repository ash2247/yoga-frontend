<?php
header("Access-Control-Allow-Origin: http://localhost:8080");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Set JSON content type only for non-upload requests
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uri = str_replace('/backend/index.php', '', $uri); 
$uri = trim($uri, '/');

if ($uri !== 'upload') {
    header("Content-Type: application/json");
}

require_once __DIR__ . '/db_connect.php';

$method = $_SERVER['REQUEST_METHOD'];

// Routes

// --- LOGIN ---
if ($uri === 'login' && $method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $username = $input['username'] ?? '';
    $password = $input['password'] ?? '';

    // Try database authentication if available
    if ($pdo) {
        $stmt = $pdo->prepare("SELECT * FROM users WHERE username = ?");
        $stmt->execute([$username]);
        $user = $stmt->fetch();

        if ($user && password_verify($password, $user['password'])) {
            echo json_encode(['token' => base64_encode($username . ':' . time())]);
            exit();
        }
    }
    
    // Fallback hardcoded credentials for demo/testing
    if ($username === 'admin' && $password === 'password123') {
         echo json_encode(['token' => base64_encode('admin:' . time())]);
    } else {
        http_response_code(401);
        echo json_encode(['error' => 'Invalid credentials']);
    }
    exit();
}

// --- GET CONTENT ---
if ($uri === 'content') {
    if ($method === 'GET') {
        $data = [];
        
        // Try database first if available
        if ($pdo) {
            try {
                $stmt = $pdo->query("SELECT section_key, content FROM site_content");
                $rows = $stmt->fetchAll();
                foreach ($rows as $row) {
                    // Decode JSON string from DB back to array/object
                    $data[$row['section_key']] = json_decode($row['content']);
                }
            } catch (Exception $e) {
                error_log("Database query failed: " . $e->getMessage());
            }
        }
        
        // Fallback to JSON file if no data from DB
        if (empty($data) && file_exists(__DIR__ . '/data/content.json')) {
             $data = json_decode(file_get_contents(__DIR__ . '/data/content.json'), true);
        }
        
        // If still empty, return empty object
        if (empty($data)) {
            $data = new stdClass();
        }
        
        echo json_encode($data);
    } 
    // --- UPDATE CONTENT ---
    elseif ($method === 'POST') {
        $input = json_decode(file_get_contents('php://input'), true);
        if ($input) {
            try {
                // Try database first if available
                if ($pdo) {
                    $pdo->beginTransaction();
                    
                    // Prepare statement for upsert
                    // We use INSERT ... ON DUPLICATE KEY UPDATE for MySQL
                    $stmt = $pdo->prepare("INSERT INTO site_content (section_key, content) VALUES (:key, :content) ON DUPLICATE KEY UPDATE content = :content_update");
                    
                    foreach ($input as $key => $value) {
                        $jsonStr = json_encode($value);
                        $stmt->execute([
                            ':key' => $key, 
                            ':content' => $jsonStr,
                            ':content_update' => $jsonStr
                        ]);
                    }
                    
                    $pdo->commit();
                } else {
                    // Fallback to JSON file storage
                    $dataFile = __DIR__ . '/data/content.json';
                    
                    // Read existing data
                    $existingData = [];
                    if (file_exists($dataFile)) {
                        $existingData = json_decode(file_get_contents($dataFile), true);
                    }
                    
                    // Merge with new data
                    $updatedData = array_merge($existingData, $input);
                    
                    // Write back to file with proper formatting
                    $jsonStr = json_encode($updatedData, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
                    if (file_put_contents($dataFile, $jsonStr) === false) {
                        throw new Exception('Failed to write to content file');
                    }
                }
                
                echo json_encode([
                    'success' => true, 
                    'message' => 'Content updated successfully',
                    'data' => $input
                ]);
            } catch (Exception $e) {
                if ($pdo) {
                    $pdo->rollBack();
                }
                http_response_code(500);
                echo json_encode([
                    'error' => 'Failed to update content: ' . $e->getMessage(),
                    'user_message' => 'Sorry, we couldn\'t save your changes. Please try again.'
                ]);
            }
        } else {
            http_response_code(400);
            echo json_encode([
                'error' => 'Invalid JSON data received',
                'user_message' => 'The data you sent is not valid. Please check your changes and try again.'
            ]);
        }
    }
    exit();
}

// --- UPLOAD FILE ---
if ($uri === 'upload' && $method === 'POST') {
    // Set proper content type for response
    header('Content-Type: application/json');
    
    if (isset($_FILES['file'])) {
        $file = $_FILES['file'];
        
        // Check for upload errors
        if ($file['error'] !== UPLOAD_ERR_OK) {
            $errorMsg = 'Upload error code: ' . $file['error'];
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'error' => $errorMsg,
                'message' => 'Upload failed'
            ]);
            exit();
        }
        
        $targetDir = __DIR__ . '/uploads/';
        if (!is_dir($targetDir)) {
            if (!mkdir($targetDir, 0755, true)) {
                http_response_code(500);
                echo json_encode([
                    'success' => false,
                    'error' => 'Failed to create upload directory',
                    'message' => 'Server configuration error'
                ]);
                exit();
            }
        }
        
        $fileName = basename($file['name']);
        // Sanitize filename
        $fileName = preg_replace("/[^a-zA-Z0-9\._-]/", "", $fileName);
        $targetFilePath = $targetDir . $fileName;
        
        // Handle duplicates
        if (file_exists($targetFilePath)) {
             $fileName = time() . '_' . $fileName;
             $targetFilePath = $targetDir . $fileName;
        }

        if (move_uploaded_file($file['tmp_name'], $targetFilePath)) {
            // Return relative path for frontend
            $relativePath = '/backend/uploads/' . $fileName;
            echo json_encode([
                'success' => true,
                'url' => $relativePath,
                'message' => 'File uploaded successfully',
                'filename' => $fileName
            ]);
        } else {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'error' => 'Failed to move uploaded file',
                'message' => 'Upload failed - could not save file'
            ]);
        }
    } else {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'error' => 'No file uploaded',
            'message' => 'Please select a file to upload'
        ]);
    }
    exit();
}

// --- SIMPLE EDIT ENDPOINTS FOR NON-TECHNICAL USERS ---

// --- UPDATE CLASSES ---
if ($uri === 'update-classes' && $method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    try {
        $dataFile = __DIR__ . '/data/content.json';
        $existingData = [];
        
        if (file_exists($dataFile)) {
            $existingData = json_decode(file_get_contents($dataFile), true);
        }
        
        // Update classes array with new data
        if (isset($input['classes']) && is_array($input['classes'])) {
            $existingData['classes'] = $input['classes'];
        }
        
        // Save updated data
        $jsonStr = json_encode($existingData, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
        if (file_put_contents($dataFile, $jsonStr) === false) {
            throw new Exception('Failed to save classes');
        }
        
        echo json_encode([
            'success' => true,
            'message' => 'Yoga classes updated successfully!',
            'classes' => $existingData['classes']
        ]);
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            'error' => 'Failed to update classes: ' . $e->getMessage(),
            'user_message' => 'Sorry, we couldn\'t save your class changes. Please try again.'
        ]);
    }
    exit();
}

// --- UPDATE REVIEWS ---
if ($uri === 'update-reviews' && $method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    try {
        $dataFile = __DIR__ . '/data/content.json';
        $existingData = [];
        
        if (file_exists($dataFile)) {
            $existingData = json_decode(file_get_contents($dataFile), true);
        }
        
        // Update reviews array
        if (isset($input['reviews']) && is_array($input['reviews'])) {
            $existingData['reviews'] = $input['reviews'];
        }
        
        // Save updated data
        $jsonStr = json_encode($existingData, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
        if (file_put_contents($dataFile, $jsonStr) === false) {
            throw new Exception('Failed to save reviews');
        }
        
        echo json_encode([
            'success' => true,
            'message' => 'Customer reviews updated successfully!',
            'reviews' => $existingData['reviews']
        ]);
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            'error' => 'Failed to update reviews: ' . $e->getMessage(),
            'user_message' => 'Sorry, we couldn\'t save your review changes. Please try again.'
        ]);
    }
    exit();
}

// --- UPDATE ABOUT INFO ---
if ($uri === 'update-about' && $method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    try {
        $dataFile = __DIR__ . '/data/content.json';
        $existingData = [];
        
        if (file_exists($dataFile)) {
            $existingData = json_decode(file_get_contents($dataFile), true);
        }
        
        // Update about section with simple fields
        if (isset($input['name'])) $existingData['about']['name'] = $input['name'];
        if (isset($input['title'])) $existingData['about']['title'] = $input['title'];
        if (isset($input['bio'])) $existingData['about']['bio'] = $input['bio'];
        if (isset($input['image'])) $existingData['about']['image'] = $input['image'];
        
        // Save updated data
        $jsonStr = json_encode($existingData, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
        if (file_put_contents($dataFile, $jsonStr) === false) {
            throw new Exception('Failed to save about info');
        }
        
        echo json_encode([
            'success' => true,
            'message' => 'About page updated successfully!',
            'about' => $existingData['about']
        ]);
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            'error' => 'Failed to update about info: ' . $e->getMessage(),
            'user_message' => 'Sorry, we couldn\'t save your changes. Please try again.'
        ]);
    }
    exit();
}

// --- GET SPECIFIC SECTION ---
if ($uri === 'get-classes' && $method === 'GET') {
    $dataFile = __DIR__ . '/data/content.json';
    $data = [];
    
    if (file_exists($dataFile)) {
        $allData = json_decode(file_get_contents($dataFile), true);
        $data = $allData['classes'] ?? [];
    }
    
    echo json_encode([
        'success' => true,
        'classes' => $data
    ]);
    exit();
}

if ($uri === 'get-reviews' && $method === 'GET') {
    $dataFile = __DIR__ . '/data/content.json';
    $data = [];
    
    if (file_exists($dataFile)) {
        $allData = json_decode(file_get_contents($dataFile), true);
        $data = $allData['reviews'] ?? [];
    }
    
    echo json_encode([
        'success' => true,
        'reviews' => $data
    ]);
    exit();
}

if ($uri === 'get-about' && $method === 'GET') {
    $dataFile = __DIR__ . '/data/content.json';
    $data = [];
    
    if (file_exists($dataFile)) {
        $allData = json_decode(file_get_contents($dataFile), true);
        $data = $allData['about'] ?? [];
    }
    
    echo json_encode([
        'success' => true,
        'about' => $data
    ]);
    exit();
}

// --- UPDATE HERO ---
if ($uri === 'update-hero' && $method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    try {
        $dataFile = __DIR__ . '/data/content.json';
        $existingData = [];
        
        if (file_exists($dataFile)) {
            $existingData = json_decode(file_get_contents($dataFile), true);
        }
        
        // Update hero slides array
        if (isset($input['slides']) && is_array($input['slides'])) {
            $existingData['hero']['slides'] = $input['slides'];
        }
        
        // Save updated data
        $jsonStr = json_encode($existingData, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
        if (file_put_contents($dataFile, $jsonStr) === false) {
            throw new Exception('Failed to save hero slides');
        }
        
        echo json_encode([
            'success' => true,
            'message' => 'Hero slides updated successfully!',
            'slides' => $existingData['hero']['slides']
        ]);
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            'error' => 'Failed to update hero slides: ' . $e->getMessage(),
            'user_message' => 'Sorry, we couldn\'t save your hero slides. Please try again.'
        ]);
    }
    exit();
}

// --- GET HERO ---
if ($uri === 'get-hero' && $method === 'GET') {
    $dataFile = __DIR__ . '/data/content.json';
    $data = [];
    
    if (file_exists($dataFile)) {
        $allData = json_decode(file_get_contents($dataFile), true);
        $data = $allData['hero'] ?? [];
    }
    
    echo json_encode([
        'success' => true,
        'hero' => $data
    ]);
    exit();
}

// --- UPDATE BLOGS ---
if ($uri === 'update-blogs' && $method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    try {
        $dataFile = __DIR__ . '/data/content.json';
        $existingData = [];
        
        if (file_exists($dataFile)) {
            $existingData = json_decode(file_get_contents($dataFile), true);
        }
        
        // Update blogs array
        if (isset($input['blogs']) && is_array($input['blogs'])) {
            $existingData['blogs'] = $input['blogs'];
        }
        
        // Save updated data
        $jsonStr = json_encode($existingData, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
        if (file_put_contents($dataFile, $jsonStr) === false) {
            throw new Exception('Failed to save blogs');
        }
        
        echo json_encode([
            'success' => true,
            'message' => 'Blogs updated successfully!',
            'blogs' => $existingData['blogs']
        ]);
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            'error' => 'Failed to update blogs: ' . $e->getMessage(),
            'user_message' => 'Sorry, we couldn\'t save your blog changes. Please try again.'
        ]);
    }
    exit();
}

// --- GET BLOGS ---
if ($uri === 'get-blogs' && $method === 'GET') {
    $dataFile = __DIR__ . '/data/content.json';
    $data = [];
    
    if (file_exists($dataFile)) {
        $allData = json_decode(file_get_contents($dataFile), true);
        $data = $allData['blogs'] ?? [];
    }
    
    echo json_encode([
        'success' => true,
        'blogs' => $data
    ]);
    exit();
}

// --- UPDATE TIMETABLE ---
if ($uri === 'update-timetable' && $method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    try {
        $dataFile = __DIR__ . '/data/content.json';
        $existingData = [];
        
        if (file_exists($dataFile)) {
            $existingData = json_decode(file_get_contents($dataFile), true);
        }
        
        // Update timetable array
        if (isset($input['timetable']) && is_array($input['timetable'])) {
            $existingData['timetable'] = $input['timetable'];
        }
        
        // Save updated data
        $jsonStr = json_encode($existingData, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
        if (file_put_contents($dataFile, $jsonStr) === false) {
            throw new Exception('Failed to save timetable');
        }
        
        echo json_encode([
            'success' => true,
            'message' => 'Timetable updated successfully!',
            'timetable' => $existingData['timetable']
        ]);
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            'error' => 'Failed to update timetable: ' . $e->getMessage(),
            'user_message' => 'Sorry, we couldn\'t save your timetable changes. Please try again.'
        ]);
    }
    exit();
}

// --- GET TIMETABLE ---
if ($uri === 'get-timetable' && $method === 'GET') {
    $dataFile = __DIR__ . '/data/content.json';
    $data = [];
    
    if (file_exists($dataFile)) {
        $allData = json_decode(file_get_contents($dataFile), true);
        $data = $allData['timetable'] ?? [];
    }
    
    echo json_encode([
        'success' => true,
        'timetable' => $data
    ]);
    exit();
}

// --- UPDATE PRICING ---
if ($uri === 'update-pricing' && $method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    try {
        $dataFile = __DIR__ . '/data/content.json';
        $existingData = [];
        
        if (file_exists($dataFile)) {
            $existingData = json_decode(file_get_contents($dataFile), true);
        }
        
        // Update pricing array
        if (isset($input['pricing']) && is_array($input['pricing'])) {
            $existingData['pricing'] = $input['pricing'];
        }
        
        // Save updated data
        $jsonStr = json_encode($existingData, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
        if (file_put_contents($dataFile, $jsonStr) === false) {
            throw new Exception('Failed to save pricing plans');
        }
        
        echo json_encode([
            'success' => true,
            'message' => 'Pricing plans updated successfully!',
            'pricing' => $existingData['pricing']
        ]);
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            'error' => 'Failed to update pricing plans: ' . $e->getMessage(),
            'user_message' => 'Sorry, we couldn\'t save your pricing changes. Please try again.'
        ]);
    }
    exit();
}

// --- GET PRICING ---
if ($uri === 'get-pricing' && $method === 'GET') {
    $dataFile = __DIR__ . '/data/content.json';
    $data = [];
    
    if (file_exists($dataFile)) {
        $allData = json_decode(file_get_contents($dataFile), true);
        $data = $allData['pricing'] ?? [];
    }
    
    echo json_encode([
        'success' => true,
        'pricing' => $data
    ]);
    exit();
}

// --- CHANGE PASSWORD ---
if ($uri === 'change-password' && $method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    try {
        // In a real application, you would verify the current password against a database
        // For this demo, we'll just validate and return success
        
        $currentPassword = $input['currentPassword'] ?? '';
        $newPassword = $input['newPassword'] ?? '';
        
        if (empty($currentPassword) || empty($newPassword)) {
            throw new Exception('Current password and new password are required');
        }
        
        if (strlen($newPassword) < 6) {
            throw new Exception('New password must be at least 6 characters long');
        }
        
        // In production, you would hash the password and update database
        // password_hash($newPassword, PASSWORD_DEFAULT);
        
        echo json_encode([
            'success' => true,
            'message' => 'Password changed successfully!'
        ]);
        
    } catch (Exception $e) {
        http_response_code(400);
        echo json_encode([
            'error' => 'Failed to change password: ' . $e->getMessage(),
            'user_message' => $e->getMessage()
        ]);
    }
    exit();
}

// --- UPDATE SOCIAL LINKS ---
if ($uri === 'update-social-links' && $method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    try {
        $dataFile = __DIR__ . '/data/social-links.json';
        $existingData = [];
        
        if (file_exists($dataFile)) {
            $existingData = json_decode(file_get_contents($dataFile), true);
        }
        
        // Update social links
        if (isset($input['socialLinks']) && is_array($input['socialLinks'])) {
            $existingData['socialLinks'] = $input['socialLinks'];
        }
        
        // Save updated data
        $jsonStr = json_encode($existingData, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
        if (file_put_contents($dataFile, $jsonStr) === false) {
            throw new Exception('Failed to save social links');
        }
        
        echo json_encode([
            'success' => true,
            'message' => 'Social links updated successfully!',
            'socialLinks' => $existingData['socialLinks']
        ]);
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            'error' => 'Failed to update social links: ' . $e->getMessage(),
            'user_message' => 'Sorry, we couldn\'t save your social links. Please try again.'
        ]);
    }
    exit();
}

// --- GET SOCIAL LINKS ---
if ($uri === 'get-social-links' && $method === 'GET') {
    $dataFile = __DIR__ . '/data/social-links.json';
    $data = [];
    
    if (file_exists($dataFile)) {
        $allData = json_decode(file_get_contents($dataFile), true);
        $data = $allData['socialLinks'] ?? [];
    }
    
    echo json_encode([
        'success' => true,
        'socialLinks' => $data
    ]);
    exit();
}

// --- GET SEO ---
if ($uri === 'get-seo' && $method === 'GET') {
    if ($pdo) {
        try {
            $stmt = $pdo->query("SELECT * FROM seo_settings ORDER BY id DESC LIMIT 1");
            $seo = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if ($seo) {
                echo json_encode([
                    'success' => true,
                    'seo' => [
                        'title' => $seo['title'],
                        'description' => $seo['description'],
                        'ogImage' => $seo['og_image'],
                        'twitterCard' => $seo['twitter_card'],
                        'keywords' => $seo['keywords'],
                        'author' => $seo['author'],
                        'canonicalUrl' => $seo['canonical_url'],
                        'robots' => $seo['robots']
                    ]
                ]);
            } else {
                // Default values if no record exists
                echo json_encode([
                    'success' => true,
                    'seo' => [
                        'title' => 'Yoga Studio - Find Your Inner Peace',
                        'description' => 'Transform your mind, body, and soul at our premier yoga studio. Join us for classes, meditation, and wellness programs.',
                        'ogImage' => '/images/hero-slide-1.jpg',
                        'twitterCard' => 'summary_large_image',
                        'keywords' => 'yoga, meditation, wellness, fitness, health, mind-body, classes, studio',
                        'author' => 'Yoga Studio',
                        'canonicalUrl' => '',
                        'robots' => 'index, follow'
                    ]
                ]);
            }
        } catch (PDOException $e) {
            echo json_encode(['success' => false, 'error' => $e->getMessage()]);
        }
    } else {
        echo json_encode(['success' => false, 'error' => 'Database not available']);
    }
    exit();
}

// --- UPDATE SEO ---
if ($uri === 'update-seo' && $method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if ($pdo) {
        try {
            // Check if SEO record exists
            $stmt = $pdo->query("SELECT COUNT(*) as count FROM seo_settings");
            $count = $stmt->fetch(PDO::FETCH_ASSOC)['count'];
            
            if ($count > 0) {
                // Update existing record
                $stmt = $pdo->prepare("UPDATE seo_settings SET title = ?, description = ?, og_image = ?, twitter_card = ?, keywords = ?, author = ?, canonical_url = ?, robots = ? WHERE id = (SELECT id FROM (SELECT id FROM seo_settings ORDER BY id DESC LIMIT 1) AS temp)");
                $stmt->execute([
                    $input['title'] ?? 'Yoga Studio - Find Your Inner Peace',
                    $input['description'] ?? 'Transform your mind, body, and soul at our premier yoga studio.',
                    $input['ogImage'] ?? '/images/hero-slide-1.jpg',
                    $input['twitterCard'] ?? 'summary_large_image',
                    $input['keywords'] ?? 'yoga, meditation, wellness, fitness, health, mind-body, classes, studio',
                    $input['author'] ?? 'Yoga Studio',
                    $input['canonicalUrl'] ?? '',
                    $input['robots'] ?? 'index, follow'
                ]);
            } else {
                // Insert new record
                $stmt = $pdo->prepare("INSERT INTO seo_settings (title, description, og_image, twitter_card, keywords, author, canonical_url, robots) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
                $stmt->execute([
                    $input['title'] ?? 'Yoga Studio - Find Your Inner Peace',
                    $input['description'] ?? 'Transform your mind, body, and soul at our premier yoga studio.',
                    $input['ogImage'] ?? '/images/hero-slide-1.jpg',
                    $input['twitterCard'] ?? 'summary_large_image',
                    $input['keywords'] ?? 'yoga, meditation, wellness, fitness, health, mind-body, classes, studio',
                    $input['author'] ?? 'Yoga Studio',
                    $input['canonicalUrl'] ?? '',
                    $input['robots'] ?? 'index, follow'
                ]);
            }
            
            echo json_encode(['success' => true, 'message' => 'SEO settings updated successfully']);
        } catch (PDOException $e) {
            echo json_encode(['success' => false, 'error' => $e->getMessage()]);
        }
    } else {
        echo json_encode(['success' => false, 'error' => 'Database not available']);
    }
    exit();
}

http_response_code(404);
echo json_encode(['error' => 'Not found', 'uri' => $uri]);
