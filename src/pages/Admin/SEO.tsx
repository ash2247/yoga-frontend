import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";

interface SEOData {
    title: string;
    description: string;
    ogImage: string;
    twitterCard: string;
    keywords: string;
    author: string;
    canonicalUrl: string;
    robots: string;
}

const SEO = () => {
    const [seoData, setSeoData] = useState<SEOData>({
        title: "Yoga Studio - Find Your Inner Peace",
        description: "Transform your mind, body, and soul at our premier yoga studio. Join us for classes, meditation, and wellness programs.",
        ogImage: "/images/hero-slide-1.jpg",
        twitterCard: "summary_large_image",
        keywords: "yoga, meditation, wellness, fitness, health, mind-body, classes, studio",
        author: "Yoga Studio",
        canonicalUrl: "",
        robots: "index, follow"
    });
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();
    const navigate = useNavigate();

    const API_URL = "/api";

    useEffect(() => {
        const token = localStorage.getItem("adminToken");
        if (!token) {
            navigate("/admin/login");
            return;
        }
        fetchSEOData();
    }, [navigate]);

    const fetchSEOData = async () => {
        try {
            const response = await axios.get(`${API_URL}/get-seo`);
            if (response.data.success) {
                setSeoData(response.data.seo);
            }
        } catch (err) {
            console.error('Error fetching SEO data:', err);
        }
    };

    const handleUpdate = async () => {
        setLoading(true);
        try {
            const response = await axios.post(`${API_URL}/update-seo`, seoData);
            if (response.data.success) {
                toast({ title: "SEO data updated successfully" });
            } else {
                toast({ title: "Failed to update SEO data", variant: "destructive" });
            }
        } catch (err) {
            toast({ title: "Error updating SEO data", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const formData = new FormData();
            formData.append('file', e.target.files[0]);

            try {
                const response = await axios.post(`${API_URL}/upload`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                if (response.data.success) {
                    setSeoData({ ...seoData, ogImage: response.data.url });
                    toast({ title: "Image uploaded successfully" });
                } else {
                    toast({ title: "Image upload failed", variant: "destructive" });
                }
            } catch (err) {
                toast({ title: "Error uploading image", variant: "destructive" });
            }
        }
    };

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <div className="w-64 bg-white shadow-md flex flex-col">
                <div className="p-6 border-b">
                    <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    {["dashboard", "hero", "video", "classes", "reviews", "timetable", "blogs", "pricing", "about"].map((tab) => (
                        <a
                            key={tab}
                            href={`/admin#${tab}`}
                            className="w-full text-left px-4 py-2 rounded-md capitalize text-gray-600 hover:bg-gray-50"
                        >
                            {tab}
                        </a>
                    ))}
                </nav>
                <div className="p-4 border-t space-y-2">
                    <a
                        href="/admin/settings"
                        className="w-full px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-md text-left block"
                    >
                        Settings
                    </a>
                    <a
                        href="/admin/email"
                        className="w-full px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-md text-left block"
                    >
                        Email
                    </a>
                    <a
                        href="/admin/seo"
                        className="w-full px-4 py-2 bg-blue-50 text-blue-600 font-medium rounded-md text-left block"
                    >
                        SEO
                    </a>
                    <a
                        href="/admin"
                        className="w-full px-4 py-2 text-red-600 hover:bg-red-50 rounded-md text-left block"
                    >
                        Back to Dashboard
                    </a>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto p-8">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold">SEO Management</h2>
                    <button
                        onClick={handleUpdate}
                        disabled={loading}
                        className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                        {loading ? "Saving..." : "Save Changes"}
                    </button>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm space-y-6">
                    {/* Basic SEO Settings */}
                    <div className="space-y-4">
                        <h3 className="font-medium text-lg">Basic SEO Settings</h3>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Page Title
                            </label>
                            <input
                                type="text"
                                value={seoData.title}
                                onChange={(e) => setSeoData({ ...seoData, title: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter page title"
                                maxLength={60}
                            />
                            <p className="text-sm text-gray-500 mt-1">
                                {seoData.title.length}/60 characters (recommended for Google)
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Meta Description
                            </label>
                            <textarea
                                value={seoData.description}
                                onChange={(e) => setSeoData({ ...seoData, description: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                rows={3}
                                placeholder="Enter meta description"
                                maxLength={160}
                            />
                            <p className="text-sm text-gray-500 mt-1">
                                {seoData.description.length}/160 characters (recommended for Google)
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Keywords
                            </label>
                            <input
                                type="text"
                                value={seoData.keywords}
                                onChange={(e) => setSeoData({ ...seoData, keywords: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter keywords separated by commas"
                            />
                            <p className="text-sm text-gray-500 mt-1">
                                Separate keywords with commas
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Author
                            </label>
                            <input
                                type="text"
                                value={seoData.author}
                                onChange={(e) => setSeoData({ ...seoData, author: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter author name"
                            />
                        </div>
                    </div>

                    {/* Open Graph Settings */}
                    <div className="space-y-4 border-t pt-6">
                        <h3 className="font-medium text-lg">Open Graph Settings</h3>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                OG Image
                            </label>
                            <div className="space-y-2">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {seoData.ogImage && (
                                    <div className="flex items-center space-x-4">
                                        <img
                                            src={seoData.ogImage}
                                            alt="OG Preview"
                                            className="w-32 h-20 object-cover rounded border"
                                        />
                                        <div>
                                            <p className="text-sm text-gray-600">Current OG Image:</p>
                                            <p className="text-sm font-mono">{seoData.ogImage}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                OG Title (Optional - will use page title if empty)
                            </label>
                            <input
                                type="text"
                                value={seoData.title}
                                onChange={(e) => setSeoData({ ...seoData, title: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter OG title"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                OG Description (Optional - will use meta description if empty)
                            </label>
                            <textarea
                                value={seoData.description}
                                onChange={(e) => setSeoData({ ...seoData, description: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                rows={2}
                                placeholder="Enter OG description"
                            />
                        </div>
                    </div>

                    {/* Twitter Card Settings */}
                    <div className="space-y-4 border-t pt-6">
                        <h3 className="font-medium text-lg">Twitter Card Settings</h3>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Twitter Card Type
                            </label>
                            <select
                                value={seoData.twitterCard}
                                onChange={(e) => setSeoData({ ...seoData, twitterCard: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="summary_large_image">Summary Large Image</option>
                                <option value="summary">Summary</option>
                                <option value="app">App</option>
                                <option value="player">Player</option>
                            </select>
                        </div>
                    </div>

                    {/* Advanced Settings */}
                    <div className="space-y-4 border-t pt-6">
                        <h3 className="font-medium text-lg">Advanced Settings</h3>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Canonical URL
                            </label>
                            <input
                                type="url"
                                value={seoData.canonicalUrl}
                                onChange={(e) => setSeoData({ ...seoData, canonicalUrl: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="https://yourwebsite.com"
                            />
                            <p className="text-sm text-gray-500 mt-1">
                                Leave empty to use current page URL
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Robots Meta Tag
                            </label>
                            <select
                                value={seoData.robots}
                                onChange={(e) => setSeoData({ ...seoData, robots: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="index, follow">Index, Follow</option>
                                <option value="noindex, follow">No Index, Follow</option>
                                <option value="index, nofollow">Index, No Follow</option>
                                <option value="noindex, nofollow">No Index, No Follow</option>
                            </select>
                        </div>
                    </div>

                    {/* Preview Section */}
                    <div className="space-y-4 border-t pt-6">
                        <h3 className="font-medium text-lg">Search Engine Preview</h3>

                        <div className="border rounded-lg p-4 bg-gray-50">
                            <div className="space-y-2">
                                <div className="text-blue-600 text-lg hover:underline cursor-pointer">
                                    {seoData.title || "Your page title will appear here"}
                                </div>
                                <div className="text-green-600 text-sm">
                                    https://yourwebsite.com
                                </div>
                                <div className="text-gray-600 text-sm">
                                    {seoData.description || "Your meta description will appear here. This is what users will see in search results."}
                                </div>
                            </div>
                        </div>

                        <div className="border rounded-lg p-4 bg-gray-50">
                            <div className="text-sm font-medium text-gray-700 mb-2">Social Media Preview (Facebook/LinkedIn):</div>
                            <div className="border rounded bg-white p-3 max-w-md">
                                <div className="flex space-x-3">
                                    {seoData.ogImage && (
                                        <img
                                            src={seoData.ogImage}
                                            alt="Social preview"
                                            className="w-24 h-24 object-cover rounded"
                                        />
                                    )}
                                    <div className="flex-1">
                                        <div className="font-medium text-sm">
                                            {seoData.title || "Your page title"}
                                        </div>
                                        <div className="text-gray-600 text-xs mt-1">
                                            https://yourwebsite.com
                                        </div>
                                        <div className="text-gray-700 text-xs mt-1">
                                            {seoData.description || "Your meta description"}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SEO;
