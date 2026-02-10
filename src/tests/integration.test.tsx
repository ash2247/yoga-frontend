import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';

import Index from '@/pages/Index';
import AdminLogin from '@/pages/Admin/Login';
import Dashboard from '@/pages/Admin/Dashboard';
import SEO from '@/pages/Admin/SEO';

// Test wrapper with providers
const TestWrapper = ({ children }: { children: React.ReactNode }) => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: { retry: false },
            mutations: { retry: false },
        },
    });

    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                {children}
            </BrowserRouter>
        </QueryClientProvider>
    );
};

// Mock axios
const mockAxios = {
    get: vi.fn(),
    post: vi.fn(),
    create: vi.fn(() => mockAxios),
};

vi.mock('axios', () => mockAxios);

describe('Integration Tests', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        localStorage.clear();
    });

    describe('Full Application Flow', () => {
        it('should render main application', () => {
            render(
                <TestWrapper>
                    <Index />
                </TestWrapper>
            );
            
            expect(document.body).toBeTruthy();
        });
    });

    describe('Admin Authentication Flow', () => {
        it('should complete full login flow', async () => {
            // Mock successful login
            mockAxios.post.mockResolvedValue({
                data: { token: 'test-admin-token' }
            });

            render(
                <TestWrapper>
                    <AdminLogin />
                </TestWrapper>
            );
            
            const usernameInput = screen.getByLabelText(/username/i);
            const passwordInput = screen.getByLabelText(/password/i);
            const loginButton = screen.getByRole('button', { name: /login/i });

            fireEvent.change(usernameInput, { target: { value: 'admin' } });
            fireEvent.change(passwordInput, { target: { value: 'password123' } });
            fireEvent.click(loginButton);

            await waitFor(() => {
                expect(mockAxios.post).toHaveBeenCalledWith(
                    'http://localhost:8000/backend/index.php/login',
                    { username: 'admin', password: 'password123' }
                );
            });
        });

        it('should handle login failure', async () => {
            // Mock failed login
            mockAxios.post.mockRejectedValue({
                response: {
                    status: 401,
                    data: { error: 'Invalid credentials' }
                }
            });

            render(
                <TestWrapper>
                    <AdminLogin />
                </TestWrapper>
            );
            
            const usernameInput = screen.getByLabelText(/username/i);
            const passwordInput = screen.getByLabelText(/password/i);
            const loginButton = screen.getByRole('button', { name: /login/i });

            fireEvent.change(usernameInput, { target: { value: 'wrong' } });
            fireEvent.change(passwordInput, { target: { value: 'wrong' } });
            fireEvent.click(loginButton);

            await waitFor(() => {
                expect(mockAxios.post).toHaveBeenCalled();
            });
        });
    });

    describe('Content Management Integration', () => {
        beforeEach(() => {
            localStorage.setItem('adminToken', 'test-token');
        });

        it('should load and update hero content', async () => {
            // Mock API responses
            mockAxios.get.mockResolvedValue({
                data: {
                    success: true,
                    hero: { slides: ['/images/slide1.jpg', '/images/slide2.jpg'] }
                }
            });

            mockAxios.post.mockResolvedValue({
                data: {
                    success: true,
                    message: 'Hero updated successfully'
                }
            });

            render(
                <TestWrapper>
                    <Dashboard />
                </TestWrapper>
            );
            
            // Click on hero tab
            const heroTab = screen.getByText(/hero/i);
            fireEvent.click(heroTab);

            await waitFor(() => {
                expect(mockAxios.get).toHaveBeenCalledWith('http://localhost:8000/backend/index.php/get-hero');
            });
        });

        it('should load and update SEO settings', async () => {
            // Mock API responses
            mockAxios.get.mockResolvedValue({
                data: {
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
                }
            });

            mockAxios.post.mockResolvedValue({
                data: {
                    success: true,
                    message: 'SEO settings updated successfully'
                }
            });

            render(
                <TestWrapper>
                    <SEO />
                </TestWrapper>
            );
            
            await waitFor(() => {
                expect(mockAxios.get).toHaveBeenCalledWith('http://localhost:8000/backend/index.php/get-seo');
            });

            // Update title
            const titleInput = screen.getByLabelText(/page title/i);
            fireEvent.change(titleInput, { target: { value: 'Updated Yoga Studio Title' } });

            // Save changes
            const saveButton = screen.getByRole('button', { name: /save changes/i });
            fireEvent.click(saveButton);

            await waitFor(() => {
                expect(mockAxios.post).toHaveBeenCalledWith(
                    'http://localhost:8000/backend/index.php/update-seo',
                    expect.objectContaining({
                        title: 'Updated Yoga Studio Title'
                    })
                );
            });
        });
    });

    describe('Navigation Integration', () => {
        it('should navigate between admin pages', async () => {
            localStorage.setItem('adminToken', 'test-token');

            // Mock API responses
            mockAxios.get.mockResolvedValue({
                data: {
                    success: true,
                    hero: { slides: [] },
                    classes: [],
                    reviews: [],
                    blogs: [],
                    about: {},
                    pricing: []
                }
            });

            render(
                <TestWrapper>
                    <Dashboard />
                </TestWrapper>
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
            mockAxios.get.mockRejectedValue({
                response: {
                    status: 500,
                    data: { error: 'Database connection failed' }
                }
            });

            render(
                <TestWrapper>
                    <Dashboard />
                </TestWrapper>
            );
            
            // Click on hero tab
            const heroTab = screen.getByText(/hero/i);
            fireEvent.click(heroTab);

            await waitFor(() => {
                expect(mockAxios.get).toHaveBeenCalled();
            });
        });

        it('should handle network errors', async () => {
            // Mock network error
            mockAxios.get.mockRejectedValue(new Error('Network Error'));

            render(
                <TestWrapper>
                    <Dashboard />
                </TestWrapper>
            );
            
            // Click on hero tab
            const heroTab = screen.getByText(/hero/i);
            fireEvent.click(heroTab);

            await waitFor(() => {
                expect(mockAxios.get).toHaveBeenCalled();
            });
        });
    });

    describe('Data Persistence Integration', () => {
        it('should persist admin session', async () => {
            // Mock successful login
            mockAxios.post.mockResolvedValue({
                data: { token: 'test-admin-token' }
            });

            render(
                <TestWrapper>
                    <AdminLogin />
                </TestWrapper>
            );
            
            const usernameInput = screen.getByLabelText(/username/i);
            const passwordInput = screen.getByLabelText(/password/i);
            const loginButton = screen.getByRole('button', { name: /login/i });

            fireEvent.change(usernameInput, { target: { value: 'admin' } });
            fireEvent.change(passwordInput, { target: { value: 'password123' } });
            fireEvent.click(loginButton);

            await waitFor(() => {
                expect(mockAxios.post).toHaveBeenCalledWith(
                    'http://localhost:8000/backend/index.php/login',
                    { username: 'admin', password: 'password123' }
                );
            });
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

            mockAxios.get.mockResolvedValue({
                data: {
                    success: true,
                    hero: { slides: [] }
                }
            });

            render(
                <TestWrapper>
                    <Dashboard />
                </TestWrapper>
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
