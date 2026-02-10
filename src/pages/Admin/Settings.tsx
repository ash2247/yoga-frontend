import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { logout } from '@/services/api';

interface SocialLinks {
    facebook: string;
    twitter: string;
    instagram: string;
    youtube: string;
    linkedin: string;
    pinterest: string;
}

const Settings = () => {
    const [activeTab, setActiveTab] = useState<string>("password");
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [socialLinks, setSocialLinks] = useState<SocialLinks>({
        facebook: '',
        twitter: '',
        instagram: '',
        youtube: '',
        linkedin: '',
        pinterest: ''
    });
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("adminToken");
        if (!token) {
            navigate("/admin/login");
            return;
        }
        fetchSocialLinks();
    }, [navigate]);

    const fetchSocialLinks = async () => {
        try {
            const response = await fetch('http://localhost:8000/backend/index.php/get-social-links');
            const data = await response.json();
            if (data.success) {
                setSocialLinks(data.socialLinks || {
                    facebook: '',
                    twitter: '',
                    instagram: '',
                    youtube: '',
                    linkedin: '',
                    pinterest: ''
                });
            }
        } catch (error) {
            console.error('Error fetching social links:', error);
        }
    };

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast({ title: "Passwords don't match", variant: "destructive" });
            return;
        }

        if (passwordData.newPassword.length < 6) {
            toast({ title: "Password must be at least 6 characters", variant: "destructive" });
            return;
        }

        setLoading(true);
        try {
            const response = await fetch('http://localhost:8000/backend/index.php/change-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword
                })
            });

            const result = await response.json();
            
            if (result.success) {
                toast({ title: "Password changed successfully", variant: "default" });
                setPasswordData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                });
            } else {
                toast({ title: result.message || "Failed to change password", variant: "destructive" });
            }
        } catch (error) {
            toast({ title: "Error changing password", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const handleSocialLinksSave = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:8000/backend/index.php/update-social-links', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ socialLinks })
            });

            const result = await response.json();
            
            if (result.success) {
                toast({ title: "Social links updated successfully", variant: "default" });
            } else {
                toast({ title: result.message || "Failed to update social links", variant: "destructive" });
            }
        } catch (error) {
            toast({ title: "Error updating social links", variant: "destructive" });
        } finally {
            setLoading(false);
        }
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
                    <h1 className="text-xl font-bold text-gray-800">Admin Settings</h1>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    {["password", "social"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`w-full text-left px-4 py-2 rounded-md capitalize ${activeTab === tab ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-600 hover:bg-gray-50"
                                }`}
                        >
                            {tab === "password" ? "Change Password" : tab === "social" ? "Social Links" : tab}
                        </button>
                    ))}
                </nav>
                <div className="p-4 border-t">
                    <button onClick={handleLogout} className="w-full px-4 py-2 text-red-600 hover:bg-red-50 rounded-md text-left">
                        Logout
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto p-8">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold capitalize">
                        {activeTab === "password" ? "Change Password" : activeTab === "social" ? "Social Links" : `${activeTab} Settings`}
                    </h2>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm">
                    {/* Password Change Section */}
                    {activeTab === "password" && (
                        <div className="space-y-6">
                            <div className="max-w-md">
                                <h3 className="font-medium text-lg mb-4">Change Your Password</h3>
                                <form onSubmit={handlePasswordChange} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Current Password</label>
                                        <input
                                            type="password"
                                            className="w-full border p-2 rounded"
                                            value={passwordData.currentPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                            placeholder="Enter current password"
                                            required
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium mb-1">New Password</label>
                                        <input
                                            type="password"
                                            className="w-full border p-2 rounded"
                                            value={passwordData.newPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                            placeholder="Enter new password"
                                            required
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Confirm New Password</label>
                                        <input
                                            type="password"
                                            className="w-full border p-2 rounded"
                                            value={passwordData.confirmPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                            placeholder="Confirm new password"
                                            required
                                        />
                                    </div>

                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                        <h4 className="font-medium text-blue-800 mb-2">Password Requirements:</h4>
                                        <ul className="text-sm text-blue-700 space-y-1">
                                            <li>• At least 6 characters long</li>
                                            <li>• Include both letters and numbers</li>
                                            <li>• Use special characters for better security</li>
                                            <li>• Avoid common passwords</li>
                                        </ul>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                                    >
                                        {loading ? "Changing..." : "Change Password"}
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* Social Links Section */}
                    {activeTab === "social" && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <h3 className="font-medium text-lg">Social Media Links</h3>
                                <button
                                    onClick={handleSocialLinksSave}
                                    disabled={loading}
                                    className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {loading ? "Saving..." : "Save Changes"}
                                </button>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Facebook</label>
                                    <div className="flex items-center space-x-2">
                                        <span className="text-blue-600">f</span>
                                        <input
                                            type="url"
                                            className="flex-1 border p-2 rounded"
                                            value={socialLinks.facebook}
                                            onChange={(e) => setSocialLinks({ ...socialLinks, facebook: e.target.value })}
                                            placeholder="https://facebook.com/yourpage"
                                        />
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium mb-1">Twitter</label>
                                    <div className="flex items-center space-x-2">
                                        <span className="text-sky-500">𝕏</span>
                                        <input
                                            type="url"
                                            className="flex-1 border p-2 rounded"
                                            value={socialLinks.twitter}
                                            onChange={(e) => setSocialLinks({ ...socialLinks, twitter: e.target.value })}
                                            placeholder="https://twitter.com/yourhandle"
                                        />
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium mb-1">Instagram</label>
                                    <div className="flex items-center space-x-2">
                                        <span className="text-pink-600">📷</span>
                                        <input
                                            type="url"
                                            className="flex-1 border p-2 rounded"
                                            value={socialLinks.instagram}
                                            onChange={(e) => setSocialLinks({ ...socialLinks, instagram: e.target.value })}
                                            placeholder="https://instagram.com/yourhandle"
                                        />
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium mb-1">YouTube</label>
                                    <div className="flex items-center space-x-2">
                                        <span className="text-red-600">▶</span>
                                        <input
                                            type="url"
                                            className="flex-1 border p-2 rounded"
                                            value={socialLinks.youtube}
                                            onChange={(e) => setSocialLinks({ ...socialLinks, youtube: e.target.value })}
                                            placeholder="https://youtube.com/yourchannel"
                                        />
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium mb-1">LinkedIn</label>
                                    <div className="flex items-center space-x-2">
                                        <span className="text-blue-700">in</span>
                                        <input
                                            type="url"
                                            className="flex-1 border p-2 rounded"
                                            value={socialLinks.linkedin}
                                            onChange={(e) => setSocialLinks({ ...socialLinks, linkedin: e.target.value })}
                                            placeholder="https://linkedin.com/in/yourprofile"
                                        />
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium mb-1">Pinterest</label>
                                    <div className="flex items-center space-x-2">
                                        <span className="text-red-500">P</span>
                                        <input
                                            type="url"
                                            className="flex-1 border p-2 rounded"
                                            value={socialLinks.pinterest}
                                            onChange={(e) => setSocialLinks({ ...socialLinks, pinterest: e.target.value })}
                                            placeholder="https://pinterest.com/yourprofile"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Social Links Tips */}
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <h4 className="font-medium text-blue-800 mb-2">Social Media Tips:</h4>
                                <ul className="text-sm text-blue-700 space-y-1">
                                    <li>• Use complete URLs including https://</li>
                                    <li>• Double-check links before saving</li>
                                    <li>• Keep social media profiles active and updated</li>
                                    <li>• Use consistent branding across platforms</li>
                                    <li>• Test links to ensure they work properly</li>
                                </ul>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Settings;
