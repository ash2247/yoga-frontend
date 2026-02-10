-- Database schema
CREATE DATABASE IF NOT EXISTS yoga_studio CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE yoga_studio;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Site content table
-- We'll store JSON data for each section here for easy retrieval/update
CREATE TABLE IF NOT EXISTS site_content (
    section_key VARCHAR(50) PRIMARY KEY,
    content LONGTEXT NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Initial User (Delete after importing if needed, or change password ASAP)
-- Password is 'password123'
INSERT INTO users (username, password) VALUES 
('admin', '$2y$10$n/pQzUbsgQJmz.h8jLhOPO7s.hNlHqZ2IpH/j.jHqZ2IpH/j.jHqZ');

-- Initial Content (Based on static JSON structure)
INSERT INTO site_content (section_key, content) VALUES
('hero', '{"slides":["/images/hero-slide-1.jpg","/images/hero-slide-2.jpg","/images/hero-slide-3.jpg"]}'),
('video', '{"title":"The Light of Yoga featured on Morning Sunrise on Channel 7 with Kochie","src":"https://www.youtube.com/embed/qNBgzB6plTs?start=15"}'),
('classes', '[{"title":"Yoga Classes","image":"/images/yoga-classes.jpg"},{"title":"Hatha Yoga","image":"/images/hatha-yoga.jpg"},{"title":"Ashtanga Yoga","image":"/images/ashtanga-yoga.jpg"},{"title":"Flexibility","image":"/images/yoga-stretch.jpg"},{"title":"Meditation","image":"/images/meditation-class.jpg"},{"title":"Sunrise Yoga","image":"/images/sunrise-meditation.jpg"}]'),
('reviews', '[{"text":"With such a welcoming vibe you can relax as soon as you walk in...","name":"LIZZY","role":"Student"},{"text":"Rajs teaching style is unique...","name":"SARAH","role":"Member"},{"text":"Best yoga studio in Sydney...","name":"MICHAEL","role":"Regular"}]'),
('timetable', '[{"time":"7:00 am","classes":[{"day":"Monday","has":false},{"day":"Tuesday","has":true,"name":"Yoga Class","time":"7:00 am - 8:00 am"},{"day":"Wednesday","has":false},{"day":"Thursday","has":true,"name":"Yoga Class","time":"7:00 am - 8:00 am"},{"day":"Friday","has":false},{"day":"Saturday","has":true,"name":"Yoga Class","time":"7:00 am - 8:00 am"}]},{"time":"6:00 pm","classes":[{"day":"Monday","has":true,"name":"Yoga Class","time":"6:00 pm - 7:00 pm"},{"day":"Tuesday","has":false},{"day":"Wednesday","has":true,"name":"Yoga Class","time":"6:00 pm - 7:00 pm"},{"day":"Thursday","has":false},{"day":"Friday","has":true,"name":"Yoga Class","time":"6:00 pm - 7:00 pm"},{"day":"Saturday","has":false}]}]'),
('blogs', '[{"title":"SHEERSASANA – the king of all yoga postures","excerpt":"SHEERSASANA – HEADSTAND...","hasImage":false},{"title":"The Light of Yoga on Channel 7","excerpt":"This is the video of Raj...","hasImage":true,"isVideo":true},{"title":"Your Quest for Self-Discovery Yoga","excerpt":"Five steps towards your journey...","hasImage":true,"image":"/images/yoga-blog.jpg"}]'),
('about', '{"name":"Raj","title":"Yoga Director","image":"/images/instructor-raj.jpg","bio":"Raj is an Honours Graduate in Psychology..."}');

-- SEO Settings table
CREATE TABLE IF NOT EXISTS seo_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL DEFAULT 'Yoga Studio - Find Your Inner Peace',
    description TEXT NOT NULL DEFAULT 'Transform your mind, body, and soul at our premier yoga studio. Join us for classes, meditation, and wellness programs.',
    og_image VARCHAR(500) DEFAULT '/images/hero-slide-1.jpg',
    twitter_card VARCHAR(50) DEFAULT 'summary_large_image',
    keywords TEXT DEFAULT 'yoga, meditation, wellness, fitness, health, mind-body, classes, studio',
    author VARCHAR(100) DEFAULT 'Yoga Studio',
    canonical_url VARCHAR(500) DEFAULT '',
    robots VARCHAR(50) DEFAULT 'index, follow',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default SEO settings
INSERT INTO seo_settings (title, description, og_image, twitter_card, keywords, author, canonical_url, robots) VALUES
('Yoga Studio - Find Your Inner Peace', 
 'Transform your mind, body, and soul at our premier yoga studio. Join us for classes, meditation, and wellness programs.',
 '/images/hero-slide-1.jpg',
 'summary_large_image',
 'yoga, meditation, wellness, fitness, health, mind-body, classes, studio',
 'Yoga Studio',
 '',
 'index, follow');
