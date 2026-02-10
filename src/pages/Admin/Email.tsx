import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { logout } from '@/services/api';

interface Email {
    id: number;
    to_email: string;
    from_email: string;
    subject: string;
    message: string;
    status: 'sent' | 'draft' | 'failed';
    created_at: string;
    sent_at: string;
    error_message: string;
}

interface EmailSettings {
    smtp_host: string;
    smtp_port: string;
    smtp_username: string;
    smtp_password: string;
    smtp_from_email: string;
    smtp_from_name: string;
    smtp_encryption: string;
}

const Email = () => {
    const [activeTab, setActiveTab] = useState<string>("compose");
    const [emails, setEmails] = useState<Email[]>([]);
    const [emailSettings, setEmailSettings] = useState<EmailSettings>({
        smtp_host: '',
        smtp_port: '',
        smtp_username: '',
        smtp_password: '',
        smtp_from_email: '',
        smtp_from_name: '',
        smtp_encryption: ''
    });
    const [composeData, setComposeData] = useState({
        to: '',
        subject: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 20,
        total: 0,
        pages: 0
    });
    const { toast } = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("adminToken");
        if (!token) {
            navigate("/admin/login");
            return;
        }
        fetchEmails();
        fetchEmailSettings();
    }, [navigate]);

    const fetchEmails = async (page = 1, status = null) => {
        try {
            const statusParam = status ? `&status=${status}` : '';
            const response = await fetch(`http://localhost:8000/backend/email-system.php/emails?page=${page}&limit=${pagination.limit}${statusParam}`);
            const data = await response.json();
            
            if (data.success) {
                setEmails(data.emails);
                setPagination(data.pagination);
            }
        } catch (error) {
            toast({ title: "Error fetching emails", variant: "destructive" });
        }
    };

    const fetchEmailSettings = async () => {
        try {
            const response = await fetch('http://localhost:8000/backend/email-system.php/settings');
            const data = await response.json();
            
            if (data.success) {
                setEmailSettings(data.settings);
            }
        } catch (error) {
            toast({ title: "Error fetching email settings", variant: "destructive" });
        }
    };

    const handleSendEmail = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!composeData.to || !composeData.subject || !composeData.message) {
            toast({ title: "Please fill in all required fields", variant: "destructive" });
            return;
        }

        setLoading(true);
        try {
            const response = await fetch('http://localhost:8000/backend/email-system.php/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    to: composeData.to,
                    subject: composeData.subject,
                    message: composeData.message,
                    from_email: emailSettings.smtp_from_email,
                    from_name: emailSettings.smtp_from_name
                })
            });

            const result = await response.json();
            
            if (result.success) {
                toast({ title: "Email sent successfully", variant: "default" });
                setComposeData({ to: '', subject: '', message: '' });
                fetchEmails();
            } else {
                toast({ title: result.message || "Failed to send email", variant: "destructive" });
            }
        } catch (error) {
            toast({ title: "Error sending email", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const handleSettingsSave = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:8000/backend/email-system.php/settings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ settings: emailSettings })
            });

            const result = await response.json();
            
            if (result.success) {
                toast({ title: "Email settings updated successfully", variant: "default" });
            } else {
                toast({ title: result.message || "Failed to update settings", variant: "destructive" });
            }
        } catch (error) {
            toast({ title: "Error updating settings", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteEmail = async (emailId: number) => {
        if (!confirm('Are you sure you want to delete this email?')) {
            return;
        }

        try {
            const response = await fetch('http://localhost:8000/backend/email-system.php/emails', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: emailId })
            });

            const result = await response.json();
            
            if (result.success) {
                toast({ title: "Email deleted successfully", variant: "default" });
                fetchEmails();
            } else {
                toast({ title: result.message || "Failed to delete email", variant: "destructive" });
            }
        } catch (error) {
            toast({ title: "Error deleting email", variant: "destructive" });
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'sent': return 'text-green-600 bg-green-50';
            case 'failed': return 'text-red-600 bg-red-50';
            case 'draft': return 'text-yellow-600 bg-yellow-50';
            default: return 'text-gray-600 bg-gray-50';
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString();
    };

    const handleLogout = () => {
        logout();
        navigate("/admin/login");
    };

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <div className="w-64 bg-white shadow-md flex flex-col">
                <div className="p-6 border-b">
                    <h1 className="text-xl font-bold text-gray-800">Email System</h1>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    {["compose", "inbox", "settings"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`w-full text-left px-4 py-2 rounded-md capitalize ${activeTab === tab ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-600 hover:bg-gray-50"
                                }`}
                        >
                            {tab === "compose" ? "Compose" : tab === "inbox" ? "Inbox" : tab === "settings" ? "Settings" : tab}
                        </button>
                    ))}
                </nav>
                <div className="p-4 border-t space-y-2">
                    <a 
                        href="/admin/dashboard" 
                        className="w-full px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-md text-left block"
                    >
                        Dashboard
                    </a>
                    <button onClick={handleLogout} className="w-full px-4 py-2 text-red-600 hover:bg-red-50 rounded-md text-left">
                        Logout
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto p-8">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold capitalize">
                        {activeTab === "compose" ? "Compose Email" : activeTab === "inbox" ? "Email Inbox" : activeTab === "settings" ? "Email Settings" : `${activeTab}`}
                    </h2>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm">
                    {/* Compose Email */}
                    {activeTab === "compose" && (
                        <div className="space-y-6">
                            <form onSubmit={handleSendEmail} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">To Email</label>
                                    <input
                                        type="email"
                                        className="w-full border p-2 rounded"
                                        value={composeData.to}
                                        onChange={(e) => setComposeData({ ...composeData, to: e.target.value })}
                                        placeholder="recipient@example.com"
                                        required
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium mb-1">Subject</label>
                                    <input
                                        type="text"
                                        className="w-full border p-2 rounded"
                                        value={composeData.subject}
                                        onChange={(e) => setComposeData({ ...composeData, subject: e.target.value })}
                                        placeholder="Email subject"
                                        required
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium mb-1">Message</label>
                                    <textarea
                                        className="w-full border p-2 rounded"
                                        rows={10}
                                        value={composeData.message}
                                        onChange={(e) => setComposeData({ ...composeData, message: e.target.value })}
                                        placeholder="Type your message here..."
                                        required
                                    />
                                </div>

                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <h4 className="font-medium text-blue-800 mb-2">Email Tips:</h4>
                                    <ul className="text-sm text-blue-700 space-y-1">
                                        <li>• Use clear and descriptive subject lines</li>
                                        <li>• Personalize your messages for better engagement</li>
                                        <li>• Include proper formatting for readability</li>
                                        <li>• Double-check recipient email addresses</li>
                                        <li>• Test email functionality before bulk sending</li>
                                    </ul>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {loading ? "Sending..." : "Send Email"}
                                </button>
                            </form>
                        </div>
                    )}

                    {/* Email Inbox */}
                    {activeTab === "inbox" && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <h3 className="font-medium text-lg">Email Messages</h3>
                                <div className="flex space-x-2">
                                    <select
                                        className="border p-2 rounded"
                                        onChange={(e) => fetchEmails(1, e.target.value)}
                                    >
                                        <option value="">All Status</option>
                                        <option value="sent">Sent</option>
                                        <option value="draft">Draft</option>
                                        <option value="failed">Failed</option>
                                    </select>
                                </div>
                            </div>
                            
                            {emails.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="text-gray-400 mb-4">
                                        <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No emails found</h3>
                                    <p className="text-gray-600">Start composing emails to see them here</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {emails.map((email) => (
                                        <div key={email.id} className="border rounded-lg p-4 hover:bg-gray-50">
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="flex-1">
                                                    <div className="flex items-center space-x-2 mb-1">
                                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(email.status)}`}>
                                                            {email.status.toUpperCase()}
                                                        </span>
                                                        <span className="text-sm text-gray-500">
                                                            {formatDate(email.created_at)}
                                                        </span>
                                                    </div>
                                                    <h4 className="font-medium text-gray-900">{email.subject}</h4>
                                                    <div className="text-sm text-gray-600">
                                                        <span className="font-medium">To:</span> {email.to_email}
                                                    </div>
                                                </div>
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => handleDeleteEmail(email.id)}
                                                        className="text-red-600 hover:text-red-800 text-sm"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                            {email.message && (
                                                <div className="mt-3 p-3 bg-gray-50 rounded text-sm text-gray-700">
                                                    {email.message.length > 200 ? `${email.message.substring(0, 200)}...` : email.message}
                                                </div>
                                            )}
                                            {email.error_message && (
                                                <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                                                    <strong>Error:</strong> {email.error_message}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                            
                            {/* Pagination */}
                            {pagination.pages > 1 && (
                                <div className="flex justify-center space-x-2 mt-6">
                                    <button
                                        onClick={() => fetchEmails(pagination.page - 1)}
                                        disabled={pagination.page <= 1}
                                        className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50"
                                    >
                                        Previous
                                    </button>
                                    <span className="px-3 py-1">
                                        Page {pagination.page} of {pagination.pages}
                                    </span>
                                    <button
                                        onClick={() => fetchEmails(pagination.page + 1)}
                                        disabled={pagination.page >= pagination.pages}
                                        className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50"
                                    >
                                        Next
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Email Settings */}
                    {activeTab === "settings" && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <h3 className="font-medium text-lg">SMTP Configuration</h3>
                                <button
                                    onClick={handleSettingsSave}
                                    disabled={loading}
                                    className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {loading ? "Saving..." : "Save Settings"}
                                </button>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium mb-1">SMTP Host</label>
                                    <input
                                        type="text"
                                        className="w-full border p-2 rounded"
                                        value={emailSettings.smtp_host}
                                        onChange={(e) => setEmailSettings({ ...emailSettings, smtp_host: e.target.value })}
                                        placeholder="smtp.gmail.com"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium mb-1">SMTP Port</label>
                                    <input
                                        type="number"
                                        className="w-full border p-2 rounded"
                                        value={emailSettings.smtp_port}
                                        onChange={(e) => setEmailSettings({ ...emailSettings, smtp_port: e.target.value })}
                                        placeholder="587"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium mb-1">SMTP Username</label>
                                    <input
                                        type="text"
                                        className="w-full border p-2 rounded"
                                        value={emailSettings.smtp_username}
                                        onChange={(e) => setEmailSettings({ ...emailSettings, smtp_username: e.target.value })}
                                        placeholder="your-email@gmail.com"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium mb-1">SMTP Password</label>
                                    <input
                                        type="password"
                                        className="w-full border p-2 rounded"
                                        value={emailSettings.smtp_password}
                                        onChange={(e) => setEmailSettings({ ...emailSettings, smtp_password: e.target.value })}
                                        placeholder="Your app password"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium mb-1">From Email</label>
                                    <input
                                        type="email"
                                        className="w-full border p-2 rounded"
                                        value={emailSettings.smtp_from_email}
                                        onChange={(e) => setEmailSettings({ ...emailSettings, smtp_from_email: e.target.value })}
                                        placeholder="noreply@yourstudio.com"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium mb-1">From Name</label>
                                    <input
                                        type="text"
                                        className="w-full border p-2 rounded"
                                        value={emailSettings.smtp_from_name}
                                        onChange={(e) => setEmailSettings({ ...emailSettings, smtp_from_name: e.target.value })}
                                        placeholder="Yoga Studio"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium mb-1">Encryption</label>
                                    <select
                                        className="w-full border p-2 rounded"
                                        value={emailSettings.smtp_encryption}
                                        onChange={(e) => setEmailSettings({ ...emailSettings, smtp_encryption: e.target.value })}
                                    >
                                        <option value="tls">TLS</option>
                                        <option value="ssl">SSL</option>
                                        <option value="none">None</option>
                                    </select>
                                </div>
                            </div>

                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <h4 className="font-medium text-blue-800 mb-2">SMTP Configuration Tips:</h4>
                                <ul className="text-sm text-blue-700 space-y-1">
                                    <li>• For Gmail, use smtp.gmail.com with port 587</li>
                                    <li>• Use app-specific passwords for Gmail (not regular password)</li>
                                    <li>• Enable "Less secure app access" in Gmail settings</li>
                                    <li>• Test configuration before sending bulk emails</li>
                                    <li>• Keep credentials secure and update regularly</li>
                                    <li>• Use TLS encryption for better security</li>
                                </ul>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Email;
