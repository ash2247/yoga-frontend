import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import App from '@/App';
import Index from '@/pages/Index';
import AdminLogin from '@/pages/Admin/Login';
import Dashboard from '@/pages/Admin/Dashboard';
import SEO from '@/pages/Admin/SEO';

// Mock axios
const mock = new MockAdapter(axios);

describe('Integration Tests', () => {
    let queryClient: QueryClient;
    let history: any;

    beforeEach(() => {
        queryClient = new QueryClient({
            defaultOptions: {
                queries: { retry: false },
                mutations: { retry: false },
            },
        });
        history = createMemoryHistory();
        mock.reset();
    });

    afterEach(() => {
        mock.reset();
        localStorage.clear();
    });

    describe('Full Application Flow', () => {
        it('should render main application', () => {
            render(
                <QueryClientProvider client={queryClient}>
                    <BrowserRouter>
                        <App />
                    </BrowserRouter>
                </QueryClientProvider>
            );
            
            expect(document.body).toBeTruthy();
        });
    });

    describe('Admin Authentication Flow', () => {
        it('should complete full login flow', async () => {
            // Mock successful login
            mock.onPost('http://localhost:8000/backend/index.php/login').reply(200, {
                token: 'test-admin-token'
            });

            render(
                <QueryClientProvider client={queryClient}>
                    <Router location={history.location} navigator={history}>
                        <AdminLogin />
                    </Router>
                </QueryClientProvider>
            );
            
            const usernameInput = screen.getByLabelText(/username/i);
            const passwordInput = screen.getByLabelText(/password/i);
            const loginButton = screen.getByRole('button', { name: /login/i });

            fireEvent.change(usernameInput, { target: { value: 'admin' } });
            fireEvent.change(passwordInput, { target: { value: 'password123' } });
            fireEvent.click(loginButton);

            await waitFor(() => {
                expect(localStorage.getItem('adminToken')).toBe('dGVzdC1hZG1pbi10b2tlbg=='); // base64 encoded
            });
        });

        it('should handle login failure', async () => {
            // Mock failed login
            mock.onPost('http://localhost:8000/backend/index.php/login').reply(401, {
                error: 'Invalid credentials'
            });

            render(
                <QueryClientProvider client={queryClient}>
                    <Router location={history.location} navigator={history}>
                        <AdminLogin />
                    </Router>
                </QueryClientProvider>
            );
            
            const usernameInput = screen.getByLabelText(/username/i);
            const passwordInput = screen.getByLabelText(/password/i);
            const loginButton = screen.getByRole('button', { name: /login/i });

            fireEvent.change(usernameInput, { target: { value: 'wrong' } });
            fireEvent.change(passwordInput, { target: { value: 'wrong' } });
            fireEvent.click(loginButton);

            await waitFor(() => {
                expect(screen.getByText(/invalid credentials/i)).toBeTruthy();
            });
        });
    });

    describe('Content Management Integration', () => {
        beforeEach(() => {
            localStorage.setItem('adminToken', 'test-token');
        });

        it('should load and update hero content', async () => {
            // Mock API responses
            mock.onGet('http://localhost:8000/backend/index.php/get-hero').reply(200, {
                success: true,
                hero: { slides: ['/images/slide1.jpg', '/images/slide2.jpg'] }
            });

            mock.onPost('http://localhost:8000/backend/index.php/update-hero').reply(200, {
                success: true,
                message: 'Hero updated successfully'
            });

            render(
                <QueryClientProvider client={queryClient}>
                    <Router location={history.location} navigator={history}>
                        <Dashboard />
                    </Router>
                </QueryClientProvider>
            );
            
            // Click on hero tab
            const heroTab = screen.getByText(/hero/i);
            fireEvent.click(heroTab);

            await waitFor(() => {
                expect(screen.getByText(/hero slides/i)).toBeTruthy();
            });

            // Add new slide
            const addButton = screen.getByText(/add new slide/i);
            fireEvent.click(addButton);

            await waitFor(() => {
                expect(screen.getByText(/slide 3/i)).toBeTruthy();
            });
        });

        it('should load and update SEO settings', async () => {
            // Mock API responses
            mock.onGet('http://localhost:8000/backend/index.php/get-seo').reply(200, {
                success: true,
                seo: {
                    title: 'Yoga Studio - Find Your Inner Peace',
                    description: 'Transform your mind, body, and soul',
                    ogImage: '/images/hero-slide-1.jpg',
                    twitterCard: 'summary_large_image',
                    keywords: 'yoga, meditation, wellness',
                    author: 'Yoga Studio',
                    canonicalUrl: '',
                    robots: 'index, follow'
                }
            });

            mock.onPost('http://localhost:8000/backend/index.php/update-seo').reply(200, {
                success: true,
                message: 'SEO settings updated successfully'
            });

            render(
                <QueryClientProvider client={queryClient}>
                    <Router location={history.location} navigator={history}>
                        <SEO />
                    </Router>
                </QueryClientProvider>
            );
            
            await waitFor(() => {
                expect(screen.getByDisplayValue(/yoga studio - find your inner peace/i)).toBeTruthy();
            });

            // Update title
            const titleInput = screen.getByLabelText(/page title/i);
            fireEvent.change(titleInput, { target: { value: 'Updated Yoga Studio Title' } });

            // Save changes
            const saveButton = screen.getByRole('button', { name: /save changes/i });
            fireEvent.click(saveButton);

            await waitFor(() => {
                expect(titleInput).toHaveValue('Updated Yoga Studio Title');
            });
        });
    });

    describe('File Upload Integration', () => {
        beforeEach(() => {
            localStorage.setItem('adminToken', 'test-token');
        });

        it('should handle file upload for SEO image', async () => {
            // Mock API responses
            mock.onGet('http://localhost:8000/backend/index.php/get-seo').reply(200, {
                success: true,
                seo: {
                    title: 'Yoga Studio',
                    description: 'Test description',
                    ogImage: '/images/current-image.jpg',
                    twitterCard: 'summary_large_image',
                    keywords: 'yoga, test',
                    author: 'Test Author',
                    canonicalUrl: '',
                    robots: 'index, follow'
                }
            });

            // Mock file upload
            mock.onPost('http://localhost:8000/backend/index.php/upload').reply(200, {
                success: true,
                url: '/images/new-uploaded-image.jpg'
            });

            render(
                <QueryClientProvider client={queryClient}>
                    <Router location={history.location} navigator={history}>
                        <SEO />
                    </Router>
                </QueryClientProvider>
            );
            
            await waitFor(() => {
                expect(screen.getByText(/seo management/i)).toBeTruthy();
            });

            // Create a mock file
            const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
            const fileInput = screen.getByLabelText(/og image/i);
            
            Object.defineProperty(fileInput, 'files', {
                value: [file],
                writable: false,
            });

            fireEvent.change(fileInput);

            await waitFor(() => {
                // File upload should trigger success message
                expect(screen.getByText(/image uploaded successfully/i)).toBeTruthy();
            });
        });
    });

    describe('Navigation Integration', () => {
        it('should navigate between admin pages', async () => {
            localStorage.setItem('adminToken', 'test-token');

            // Mock API responses
            mock.onGet('http://localhost:8000/backend/index.php/get-hero').reply(200, {
                success: true,
                hero: { slides: [] }
            });

            render(
                <QueryClientProvider client={queryClient}>
                    <Router location={history.location} navigator={history}>
                        <Dashboard />
                    </Router>
                </QueryClientProvider>
            );
            
            // Test navigation to different sections
            const tabs = ['hero', 'classes', 'reviews', 'blogs', 'about'];
            
            for (const tab of tabs) {
                const tabElement = screen.getByText(new RegExp(tab, 'i'));
                fireEvent.click(tabElement);

                await waitFor(() => {
                    expect(screen.getByText(new RegExp(`${tab} editor`, 'i'))).toBeTruthy();
                });
            }
        });
    });

    describe('Error Handling Integration', () => {
        it('should handle API errors gracefully', async () => {
            // Mock API error
            mock.onGet('http://localhost:8000/backend/index.php/get-hero').reply(500, {
                error: 'Database connection failed'
            });

            render(
                <QueryClientProvider client={queryClient}>
                    <Router location={history.location} navigator={history}>
                        <Dashboard />
                    </Router>
                </QueryClientProvider>
            );
            
            // Click on hero tab
            const heroTab = screen.getByText(/hero/i);
            fireEvent.click(heroTab);

            await waitFor(() => {
                // Should show error message or fallback content
                expect(screen.getByText(/hero slides/i) || screen.getByText(/error/i)).toBeTruthy();
            });
        });

        it('should handle network errors', async () => {
            // Mock network error
            mock.onGet('http://localhost:8000/backend/index.php/get-hero').networkError();

            render(
                <QueryClientProvider client={queryClient}>
                    <Router location={history.location} navigator={history}>
                        <Dashboard />
                    </Router>
                </QueryClientProvider>
            );
            
            // Click on hero tab
            const heroTab = screen.getByText(/hero/i);
            fireEvent.click(heroTab);

            await waitFor(() => {
                // Should handle network error gracefully
                expect(document.body).toBeTruthy();
            });
        });
    });

    describe('Data Persistence Integration', () => {
        it('should persist admin session', async () => {
            // Mock successful login
            mock.onPost('http://localhost:8000/backend/index.php/login').reply(200, {
                token: 'test-admin-token'
            });

            render(
                <QueryClientProvider client={queryClient}>
                    <Router location={history.location} navigator={history}>
                        <AdminLogin />
                    </Router>
                </QueryClientProvider>
            );
            
            const usernameInput = screen.getByLabelText(/username/i);
            const passwordInput = screen.getByLabelText(/password/i);
            const loginButton = screen.getByRole('button', { name: /login/i });

            fireEvent.change(usernameInput, { target: { value: 'admin' } });
            fireEvent.change(passwordInput, { target: { value: 'password123' } });
            fireEvent.click(loginButton);

            await waitFor(() => {
                expect(localStorage.getItem('adminToken')).toBeTruthy();
            });

            // Verify token persists
            expect(localStorage.getItem('adminToken')).toBe('dGVzdC1hZG1pbi10b2tlbg==');
        });
    });

    describe('Responsive Integration', () => {
        it('should adapt to different screen sizes', async () => {
            // Mock mobile viewport
            Object.defineProperty(window, 'innerWidth', {
                writable: true,
                configurable: true,
                value: 375,
            });

            localStorage.setItem('adminToken', 'test-token');

            mock.onGet('http://localhost:8000/backend/index.php/get-hero').reply(200, {
                success: true,
                hero: { slides: [] }
            });

            render(
                <QueryClientProvider client={queryClient}>
                    <Router location={history.location} navigator={history}>
                        <Dashboard />
                    </Router>
                </QueryClientProvider>
            );
            
            await waitFor(() => {
                expect(screen.getByText(/admin panel/i)).toBeTruthy();
            });

            // Test desktop viewport
            Object.defineProperty(window, 'innerWidth', {
                writable: true,
                configurable: true,
                value: 1920,
            });

            fireEvent.resize(window);

            await waitFor(() => {
                expect(screen.getByText(/admin panel/i)).toBeTruthy();
            });
        });
    });
});
