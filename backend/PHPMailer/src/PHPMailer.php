<?php
namespace PHPMailer\PHPMailer;

class PHPMailer {
    public function isSMTP() {
        // Stub for SMTP configuration
        return true;
    }
    
    public function setFrom($email, $name = '') {
        // Stub for setting sender
        return $this;
    }
    
    public function addAddress($email, $name = '') {
        // Stub for adding recipient
        return $this;
    }
    
    public function isHTML($isHtml = true) {
        // Stub for HTML content
        return $this;
    }
    
    public function Subject($subject) {
        // Stub for setting subject
        $this->subject = $subject;
        return $this;
    }
    
    public function Body($body) {
        // Stub for setting body
        $this->body = $body;
        return $this;
    }
    
    public function send() {
        // Simple mail function for demo
        // In production, this would use proper SMTP
        return true;
    }
}

class SMTP {
    // Stub for SMTP class
}

class Exception extends \Exception {
    // Stub for Exception class
}
