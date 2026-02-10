import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/backend/index.php';

describe('API Endpoints Tests', () => {
    let authToken: string;

    beforeEach(async () => {
        // Login before each test
        try {
            const response = await axios.post(`${API_BASE_URL}/login`, {
                username: 'admin',
                password: 'password123'
            });
            authToken = response.data.token;
        } catch (error) {
            console.warn('Login failed, using fallback token');
            authToken = 'admin:test';
        }
    });

    describe('Authentication', () => {
        it('should login with valid credentials', async () => {
            const response = await axios.post(`${API_BASE_URL}/login`, {
                username: 'admin',
                password: 'password123'
            });

            expect(response.status).toBe(200);
            expect(response.data).toHaveProperty('token');
            expect(typeof response.data.token).toBe('string');
        });

        it('should reject invalid credentials', async () => {
            try {
                await axios.post(`${API_BASE_URL}/login`, {
                    username: 'invalid',
                    password: 'invalid'
                });
                expect.fail('Should have thrown an error');
            } catch (error: any) {
                expect(error.response.status).toBe(401);
                expect(error.response.data).toHaveProperty('error');
            }
        });
    });

    describe('Content Management', () => {
        it('should fetch hero content', async () => {
            const response = await axios.get(`${API_BASE_URL}/get-hero`);
            
            expect(response.status).toBe(200);
            expect(response.data).toHaveProperty('success');
            expect(response.data).toHaveProperty('hero');
            expect(Array.isArray(response.data.hero.slides)).toBe(true);
        });

        it('should fetch classes content', async () => {
            const response = await axios.get(`${API_BASE_URL}/get-classes`);
            
            expect(response.status).toBe(200);
            expect(response.data).toHaveProperty('success');
            expect(response.data).toHaveProperty('classes');
            expect(Array.isArray(response.data.classes)).toBe(true);
        });

        it('should fetch reviews content', async () => {
            const response = await axios.get(`${API_BASE_URL}/get-reviews`);
            
            expect(response.status).toBe(200);
            expect(response.data).toHaveProperty('success');
            expect(response.data).toHaveProperty('reviews');
            expect(Array.isArray(response.data.reviews)).toBe(true);
        });

        it('should fetch blogs content', async () => {
            const response = await axios.get(`${API_BASE_URL}/get-blogs`);
            
            expect(response.status).toBe(200);
            expect(response.data).toHaveProperty('success');
            expect(response.data).toHaveProperty('blogs');
            expect(Array.isArray(response.data.blogs)).toBe(true);
        });

        it('should fetch timetable content', async () => {
            const response = await axios.get(`${API_BASE_URL}/get-timetable`);
            
            expect(response.status).toBe(200);
            expect(response.data).toHaveProperty('success');
            expect(response.data).toHaveProperty('timetable');
            expect(Array.isArray(response.data.timetable)).toBe(true);
        });

        it('should fetch about content', async () => {
            const response = await axios.get(`${API_BASE_URL}/get-about`);
            
            expect(response.status).toBe(200);
            expect(response.data).toHaveProperty('success');
            expect(response.data).toHaveProperty('about');
            expect(typeof response.data.about).toBe('object');
        });

        it('should fetch pricing content', async () => {
            const response = await axios.get(`${API_BASE_URL}/get-pricing`);
            
            expect(response.status).toBe(200);
            expect(response.data).toHaveProperty('success');
            expect(response.data).toHaveProperty('pricing');
            expect(Array.isArray(response.data.pricing)).toBe(true);
        });
    });

    describe('SEO Management', () => {
        it('should fetch SEO settings', async () => {
            const response = await axios.get(`${API_BASE_URL}/get-seo`);
            
            expect(response.status).toBe(200);
            expect(response.data).toHaveProperty('success');
            expect(response.data).toHaveProperty('seo');
            expect(typeof response.data.seo).toBe('object');
            
            const seo = response.data.seo;
            expect(seo).toHaveProperty('title');
            expect(seo).toHaveProperty('description');
            expect(seo).toHaveProperty('ogImage');
            expect(seo).toHaveProperty('twitterCard');
            expect(seo).toHaveProperty('keywords');
            expect(seo).toHaveProperty('author');
            expect(seo).toHaveProperty('canonicalUrl');
            expect(seo).toHaveProperty('robots');
        });

        it('should update SEO settings', async () => {
            const seoData = {
                title: 'Test Yoga Studio',
                description: 'Test description for yoga studio',
                ogImage: '/images/test-image.jpg',
                twitterCard: 'summary_large_image',
                keywords: 'yoga, test, meditation',
                author: 'Test Author',
                canonicalUrl: 'https://testyogastudio.com',
                robots: 'index, follow'
            };

            const response = await axios.post(`${API_BASE_URL}/update-seo`, seoData);
            
            expect(response.status).toBe(200);
            expect(response.data).toHaveProperty('success');
            expect(response.data.success).toBe(true);
            expect(response.data).toHaveProperty('message');
        });
    });

    describe('Content Updates', () => {
        it('should update hero content', async () => {
            const heroData = {
                slides: ['/images/slide1.jpg', '/images/slide2.jpg']
            };

            const response = await axios.post(`${API_BASE_URL}/update-hero`, heroData);
            
            expect(response.status).toBe(200);
            expect(response.data).toHaveProperty('success');
        });

        it('should update classes content', async () => {
            const classesData = {
                classes: [
                    { title: 'Test Class', image: '/images/class.jpg' }
                ]
            };

            const response = await axios.post(`${API_BASE_URL}/update-classes`, classesData);
            
            expect(response.status).toBe(200);
            expect(response.data).toHaveProperty('success');
        });

        it('should update reviews content', async () => {
            const reviewsData = {
                reviews: [
                    { text: 'Great studio!', name: 'Test User', role: 'Student' }
                ]
            };

            const response = await axios.post(`${API_BASE_URL}/update-reviews`, reviewsData);
            
            expect(response.status).toBe(200);
            expect(response.data).toHaveProperty('success');
        });

        it('should update blogs content', async () => {
            const blogsData = {
                blogs: [
                    { title: 'Test Blog', excerpt: 'Test excerpt', hasImage: false }
                ]
            };

            const response = await axios.post(`${API_BASE_URL}/update-blogs`, blogsData);
            
            expect(response.status).toBe(200);
            expect(response.data).toHaveProperty('success');
        });

        it('should update timetable content', async () => {
            const timetableData = {
                timetable: [
                    {
                        time: '7:00 am',
                        classes: [
                            { day: 'Monday', has: true, name: 'Yoga Class', time: '7:00 am - 8:00 am' }
                        ]
                    }
                ]
            };

            const response = await axios.post(`${API_BASE_URL}/update-timetable`, timetableData);
            
            expect(response.status).toBe(200);
            expect(response.data).toHaveProperty('success');
        });

        it('should update about content', async () => {
            const aboutData = {
                name: 'Test Instructor',
                title: 'Yoga Director',
                bio: 'Test bio for instructor',
                image: '/images/instructor.jpg'
            };

            const response = await axios.post(`${API_BASE_URL}/update-about`, aboutData);
            
            expect(response.status).toBe(200);
            expect(response.data).toHaveProperty('success');
        });

        it('should update pricing content', async () => {
            const pricingData = {
                pricing: [
                    { title: 'Basic Plan', price: '$50', features: ['Feature 1', 'Feature 2'] }
                ]
            };

            const response = await axios.post(`${API_BASE_URL}/update-pricing`, pricingData);
            
            expect(response.status).toBe(200);
            expect(response.data).toHaveProperty('success');
        });
    });

    describe('Social Links', () => {
        it('should fetch social links', async () => {
            const response = await axios.get(`${API_BASE_URL}/get-social-links`);
            
            expect(response.status).toBe(200);
            expect(response.data).toHaveProperty('success');
            expect(response.data).toHaveProperty('socialLinks');
            expect(Array.isArray(response.data.socialLinks)).toBe(true);
        });
    });

    describe('Error Handling', () => {
        it('should handle 404 for non-existent endpoints', async () => {
            try {
                await axios.get(`${API_BASE_URL}/non-existent-endpoint`);
                expect.fail('Should have thrown an error');
            } catch (error: any) {
                expect(error.response.status).toBe(404);
                expect(error.response.data).toHaveProperty('error');
            }
        });

        it('should handle invalid JSON in POST requests', async () => {
            try {
                await axios.post(`${API_BASE_URL}/update-hero`, 'invalid json', {
                    headers: { 'Content-Type': 'application/json' }
                });
                expect.fail('Should have thrown an error');
            } catch (error: any) {
                expect(error.response.status).toBeGreaterThanOrEqual(400);
            }
        });
    });
});
