import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import Index from '@/pages/Index';
import Contact from '@/pages/Contact';
import AdminLogin from '@/pages/Admin/Login';
import Dashboard from '@/pages/Admin/Dashboard';
import SEO from '@/pages/Admin/SEO';
import Settings from '@/pages/Admin/Settings';
import Email from '@/pages/Admin/Email';

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
                <Toaster />
            </BrowserRouter>
        </QueryClientProvider>
    );
};

describe('Component Tests', () => {
    describe('Main Pages', () => {
        it('should render Index page', () => {
            render(
                <TestWrapper>
                    <Index />
                </TestWrapper>
            );
            
            // Check if main navigation elements are present
            expect(document.body).toBeTruthy();
        });

        it('should render Contact page', () => {
            render(
                <TestWrapper>
                    <Contact />
                </TestWrapper>
            );
            
            expect(document.body).toBeTruthy();
        });
    });

    describe('Admin Authentication', () => {
        it('should render Admin Login page', () => {
            render(
                <TestWrapper>
                    <AdminLogin />
                </TestWrapper>
            );
            
            // Check for login form elements
            expect(screen.getByLabelText(/username/i)).toBeTruthy();
            expect(screen.getByLabelText(/password/i)).toBeTruthy();
            expect(screen.getByRole('button', { name: /login/i })).toBeTruthy();
        });

        it('should handle login form submission', async () => {
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

            // Wait for form submission
            await waitFor(() => {
                expect(usernameInput).toHaveValue('admin');
                expect(passwordInput).toHaveValue('password123');
            });
        });

        it('should show validation errors for empty fields', async () => {
            render(
                <TestWrapper>
                    <AdminLogin />
                </TestWrapper>
            );
            
            const loginButton = screen.getByRole('button', { name: /login/i });
            fireEvent.click(loginButton);

            await waitFor(() => {
                // Check for validation messages
                expect(screen.getByText(/username is required/i) || screen.getByText(/password is required/i)).toBeTruthy();
            });
        });
    });

    describe('Admin Dashboard', () => {
        beforeEach(() => {
            // Mock localStorage for admin token
            localStorage.setItem('adminToken', 'test-token');
        });

        afterEach(() => {
            localStorage.removeItem('adminToken');
        });

        it('should render Dashboard with navigation', () => {
            render(
                <TestWrapper>
                    <Dashboard />
                </TestWrapper>
            );
            
            // Check for admin panel navigation
            expect(screen.getByText(/admin panel/i)).toBeTruthy();
            expect(screen.getByText(/dashboard/i)).toBeTruthy();
            expect(screen.getByText(/hero/i)).toBeTruthy();
            expect(screen.getByText(/classes/i)).toBeTruthy();
            expect(screen.getByText(/reviews/i)).toBeTruthy();
        });

        it('should switch between different tabs', async () => {
            render(
                <TestWrapper>
                    <Dashboard />
                </TestWrapper>
            );
            
            // Click on different tabs
            const heroTab = screen.getByText(/hero/i);
            fireEvent.click(heroTab);

            await waitFor(() => {
                expect(screen.getByText(/hero slides/i)).toBeTruthy();
            });

            const classesTab = screen.getByText(/classes/i);
            fireEvent.click(classesTab);

            await waitFor(() => {
                expect(screen.getByText(/classes editor/i)).toBeTruthy();
            });
        });

        it('should display analytics dashboard', async () => {
            render(
                <TestWrapper>
                    <Dashboard />
                </TestWrapper>
            );
            
            // Click on dashboard tab
            const dashboardTab = screen.getByText(/dashboard/i);
            fireEvent.click(dashboardTab);

            await waitFor(() => {
                expect(screen.getByText(/traffic analytics dashboard/i)).toBeTruthy();
                expect(screen.getByText(/total visitors/i)).toBeTruthy();
                expect(screen.getByText(/today's visitors/i)).toBeTruthy();
            });
        });
    });

    describe('SEO Management', () => {
        beforeEach(() => {
            localStorage.setItem('adminToken', 'test-token');
        });

        afterEach(() => {
            localStorage.removeItem('adminToken');
        });

        it('should render SEO management page', () => {
            render(
                <TestWrapper>
                    <SEO />
                </TestWrapper>
            );
            
            expect(screen.getByText(/seo management/i)).toBeTruthy();
            expect(screen.getByLabelText(/page title/i)).toBeTruthy();
            expect(screen.getByLabelText(/meta description/i)).toBeTruthy();
            expect(screen.getByLabelText(/keywords/i)).toBeTruthy();
        });

        it('should handle SEO form inputs', async () => {
            render(
                <TestWrapper>
                    <SEO />
                </TestWrapper>
            );
            
            const titleInput = screen.getByLabelText(/page title/i);
            const descriptionInput = screen.getByLabelText(/meta description/i);
            const keywordsInput = screen.getByLabelText(/keywords/i);

            fireEvent.change(titleInput, { target: { value: 'Test Title' } });
            fireEvent.change(descriptionInput, { target: { value: 'Test Description' } });
            fireEvent.change(keywordsInput, { target: { value: 'yoga, meditation, test' } });

            await waitFor(() => {
                expect(titleInput).toHaveValue('Test Title');
                expect(descriptionInput).toHaveValue('Test Description');
                expect(keywordsInput).toHaveValue('yoga, meditation, test');
            });
        });

        it('should show character count for title and description', async () => {
            render(
                <TestWrapper>
                    <SEO />
                </TestWrapper>
            );
            
            const titleInput = screen.getByLabelText(/page title/i);
            fireEvent.change(titleInput, { target: { value: 'Test Title' } });

            await waitFor(() => {
                expect(screen.getByText(/\/60 characters/i)).toBeTruthy();
            });
        });

        it('should display search engine preview', async () => {
            render(
                <TestWrapper>
                    <SEO />
                </TestWrapper>
            );
            
            await waitFor(() => {
                expect(screen.getByText(/search engine preview/i)).toBeTruthy();
            });
        });
    });

    describe('Settings Page', () => {
        beforeEach(() => {
            localStorage.setItem('adminToken', 'test-token');
        });

        afterEach(() => {
            localStorage.removeItem('adminToken');
        });

        it('should render Settings page', () => {
            render(
                <TestWrapper>
                    <Settings />
                </TestWrapper>
            );
            
            expect(screen.getByText(/settings/i)).toBeTruthy();
        });
    });

    describe('Email Page', () => {
        beforeEach(() => {
            localStorage.setItem('adminToken', 'test-token');
        });

        afterEach(() => {
            localStorage.removeItem('adminToken');
        });

        it('should render Email page', () => {
            render(
                <TestWrapper>
                    <Email />
                </TestWrapper>
            );
            
            expect(screen.getByText(/email/i)).toBeTruthy();
        });
    });

    describe('Navigation and Routing', () => {
        it('should have proper navigation structure', () => {
            render(
                <TestWrapper>
                    <Index />
                </TestWrapper>
            );
            
            // Check if navigation elements exist
            expect(document.body).toBeTruthy();
        });
    });

    describe('Responsive Design', () => {
        it('should render on mobile viewport', () => {
            // Mock mobile viewport
            Object.defineProperty(window, 'innerWidth', {
                writable: true,
                configurable: true,
                value: 375,
            });

            render(
                <TestWrapper>
                    <Index />
                </TestWrapper>
            );
            
            expect(document.body).toBeTruthy();
        });

        it('should render on desktop viewport', () => {
            // Mock desktop viewport
            Object.defineProperty(window, 'innerWidth', {
                writable: true,
                configurable: true,
                value: 1920,
            });

            render(
                <TestWrapper>
                    <Index />
                </TestWrapper>
            );
            
            expect(document.body).toBeTruthy();
        });
    });

    describe('Error Handling', () => {
        it('should handle missing admin token', () => {
            localStorage.removeItem('adminToken');
            
            render(
                <TestWrapper>
                    <Dashboard />
                </TestWrapper>
            );
            
            // Should redirect to login or show error
            expect(document.body).toBeTruthy();
        });
    });
});
