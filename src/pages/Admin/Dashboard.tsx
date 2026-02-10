import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useContent } from "@/context/ContentContext";
import axios from "axios";
import api, { getContent, uploadFile, updateContent, logout } from "@/services/api";

// Analytics interfaces
interface PageView {
    page: string;
    views: number;
    uniqueVisitors: number;
    lastVisited: string;
}

interface TrafficData {
    totalVisitors: number;
    todayVisitors: number;
    weeklyVisitors: number;
    monthlyVisitors: number;
    topPages: PageView[];
    hourlyTraffic: { hour: string; visitors: number }[];
    dailyTraffic: { date: string; visitors: number }[];
    bounceRate: number;
    avgSessionDuration: number;
}

interface Content {
    hero: { slides: string[] };
    video: { title: string; src: string };
    classes: any[];
    reviews: any[];
    timetable: any[];
    blogs: any[];
    pricing: any[];
    about: {
        content?: string;
        name?: string;
        title?: string;
        image?: string;
        bio?: string;
    };
}

const Dashboard = () => {
    const [content, setContent] = useState<Content | null>(null);
    const [activeTab, setActiveTab] = useState("hero");
    const [trafficData, setTrafficData] = useState<TrafficData | null>(null);
    const { toast } = useToast();
    const navigate = useNavigate();
    const { refreshContent } = useContent();

    // Helper function to calculate next time
    const getNextTime = (currentTime: string): string => {
        try {
            const timeMatch = currentTime.match(/(\d+):(\d+)\s*(am|pm)/i);
            if (timeMatch) {
                let hours = parseInt(timeMatch[1]);
                const minutes = parseInt(timeMatch[2]);
                const period = timeMatch[3].toLowerCase();
                
                if (period === 'am' && hours === 12) hours = 0;
                if (period === 'pm' && hours !== 12) hours += 12;
                
                hours += 1; // Add 1 hour
                
                let newPeriod = 'am';
                if (hours >= 12) {
                    newPeriod = 'pm';
                    if (hours > 12) hours -= 12;
                } else if (hours === 0) {
                    hours = 12;
                }
                
                return `${hours}:${minutes.toString().padStart(2, '0')} ${newPeriod}`;
            }
        } catch (err) {
            console.error('Error parsing time:', err);
        }
        return '8:00 am'; // fallback
    };

    // New simple API functions

    const getClasses = async () => {
        const response = await api.get("/get-classes");
        return response.data.classes;
    };

    const updateClasses = async (classes: any[]) => {
        const response = await api.post("/update-classes", { classes });
        return response.data;
    };

    const getReviews = async () => {
        const response = await api.get("/get-reviews");
        return response.data.reviews;
    };

    const updateReviews = async (reviews: any[]) => {
        const response = await api.post("/update-reviews", { reviews });
        return response.data;
    };

    const getAbout = async () => {
        const response = await api.get("/get-about");
        return response.data.about;
    };

    const updateAbout = async (about: any) => {
        const response = await api.post("/update-about", about);
        return response.data;
    };

    const getHero = async () => {
        const response = await api.get("/get-hero");
        return response.data.hero;
    };

    const updateHero = async (slides: string[]) => {
        const response = await api.post("/update-hero", { slides });
        return response.data;
    };

    const getBlogs = async () => {
        const response = await api.get("/get-blogs");
        return response.data.blogs;
    };

    const updateBlogs = async (blogs: any[]) => {
        const response = await api.post("/update-blogs", { blogs });
        return response.data;
    };

    const getTimetable = async () => {
        const response = await api.get("/get-timetable");
        return response.data.timetable;
    };

    const updateTimetable = async (timetable: any[]) => {
        const response = await api.post("/update-timetable", { timetable });
        return response.data;
    };

    const getPricing = async () => {
        const response = await api.get("/get-pricing");
        return response.data.pricing;
    };

    const updatePricing = async (pricing: any[]) => {
        const response = await api.post("/update-pricing", { pricing });
        return response.data;
    };

    const getAnalytics = async () => {
        try {
            // Generate mock analytics data (in real app, this would come from backend)
            const mockData: TrafficData = {
                totalVisitors: 15420,
                todayVisitors: 342,
                weeklyVisitors: 2156,
                monthlyVisitors: 8947,
                topPages: [
                    { page: "/home", views: 4521, uniqueVisitors: 3214, lastVisited: "2026-02-07 18:45" },
                    { page: "/classes", views: 3245, uniqueVisitors: 2891, lastVisited: "2026-02-07 18:32" },
                    { page: "/about", views: 2156, uniqueVisitors: 1876, lastVisited: "2026-02-07 17:58" },
                    { page: "/blog", views: 1876, uniqueVisitors: 1543, lastVisited: "2026-02-07 17:45" },
                    { page: "/contact", views: 1234, uniqueVisitors: 1098, lastVisited: "2026-02-07 16:23" }
                ],
                hourlyTraffic: [
                    { hour: "00:00", visitors: 12 },
                    { hour: "04:00", visitors: 8 },
                    { hour: "08:00", visitors: 45 },
                    { hour: "12:00", visitors: 89 },
                    { hour: "16:00", visitors: 156 },
                    { hour: "20:00", visitors: 98 }
                ],
                dailyTraffic: [
                    { date: "2026-02-01", visitors: 234 },
                    { date: "2026-02-02", visitors: 298 },
                    { date: "2026-02-03", visitors: 312 },
                    { date: "2026-02-04", visitors: 287 },
                    { date: "2026-02-05", visitors: 356 },
                    { date: "2026-02-06", visitors: 421 },
                    { date: "2026-02-07", visitors: 342 }
                ],
                bounceRate: 42.3,
                avgSessionDuration: 245 // seconds
            };
            return mockData;
        } catch (err) {
            console.error('Error fetching analytics:', err);
            return null;
        }
    };

    useEffect(() => {
        const token = localStorage.getItem("adminToken");
        if (!token) {
            navigate("/admin/login");
            return;
        }
        fetchContent();
        fetchAnalytics();
    }, [navigate]);

    const fetchContent = async () => {
        try {
            const data = await getContent();
            
            // Ensure all sections have proper default values including pricing
            const contentWithDefaults = {
                hero: data.hero || { slides: [] },
                video: data.video || { title: "", src: "" },
                classes: data.classes || [],
                reviews: data.reviews || [],
                timetable: data.timetable || [],
                blogs: data.blogs || [],
                pricing: data.pricing || [],
                about: data.about || {
                    name: "",
                    title: "",
                    bio: "",
                    image: ""
                }
            };
            
            setContent(contentWithDefaults);
        } catch (err) {
            toast({ title: "Error fetching data", variant: "destructive" });
            // Set default content on error
            setContent({
                hero: { slides: [] },
                video: { title: "", src: "" },
                classes: [],
                reviews: [],
                timetable: [],
                blogs: [],
                pricing: [],
                about: {
                    name: "",
                    title: "",
                    bio: "",
                    image: ""
                }
            });
        }
    };

    const fetchAnalytics = async () => {
        try {
            const data = await getAnalytics();
            setTrafficData(data);
        } catch (err) {
            toast({ title: "Error fetching analytics", variant: "destructive" });
        }
    };

    const handleUpdate = async () => {
        try {
            let success = false;
            let message = "Saved successfully";

            // Use specific endpoints for different sections
            if (activeTab === "hero") {
                const result = await updateHero(content.hero.slides);
                success = result.success;
                message = result.message;
            } else if (activeTab === "classes") {
                const result = await updateClasses(content.classes);
                success = result.success;
                message = result.message;
            } else if (activeTab === "reviews") {
                const result = await updateReviews(content.reviews);
                success = result.success;
                message = result.message;
            } else if (activeTab === "blogs") {
                const result = await updateBlogs(content.blogs);
                success = result.success;
                message = result.message;
            } else if (activeTab === "pricing") {
                const result = await updatePricing(content.pricing);
                success = result.success;
                message = result.message;
            } else if (activeTab === "about") {
                const result = await updateAbout(content.about);
                success = result.success;
                message = result.message;
            } else if (activeTab === "timetable") {
                const result = await updateTimetable(content.timetable);
                success = result.success;
                message = result.message;
            } else {
                // Use original endpoint for video
                await updateContent(content);
                success = true;
            }

            if (success) {
                toast({ title: message });
                // Refresh content to update frontend
                refreshContent();
            } else {
                toast({ title: "Save failed", variant: "destructive" });
            }
        } catch (err) {
            toast({ title: "Save failed", variant: "destructive" });
        }
    };

    const handleLogout = () => {
        logout();
        navigate("/admin/login");
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, path: string): Promise<string | null> => {
        if (e.target.files && e.target.files[0]) {
            try {
                const result = await uploadFile(e.target.files[0]);
                
                if (result.success) {
                    // Show success message
                    toast({ title: result.message || "File uploaded successfully" });
                    return result.url;
                } else {
                    // Show error message from server
                    toast({ title: result.message || "Upload failed", variant: "destructive" });
                    return null;
                }
            } catch (err) {
                toast({ title: "Upload failed", variant: "destructive" });
                return null;
            }
        }
        return null;
    };

    if (!content) return <div className="p-8">Loading...</div>;

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <div className="w-64 bg-white shadow-md flex flex-col">
                <div className="p-6 border-b">
                    <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    {["dashboard", "hero", "video", "classes", "reviews", "timetable", "blogs", "pricing", "about"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`w-full text-left px-4 py-2 rounded-md capitalize ${activeTab === tab ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-600 hover:bg-gray-50"
                                }`}
                        >
                            {tab}
                        </button>
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
                    <button onClick={handleLogout} className="w-full px-4 py-2 text-red-600 hover:bg-red-50 rounded-md text-left">
                        Logout
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto p-8">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold capitalize">{activeTab === "dashboard" ? "Analytics Dashboard" : activeTab === "pricing" ? "Pricing Plans Editor" : `${activeTab} Editor`}</h2>
                    {activeTab !== "dashboard" && (
                        <button
                            onClick={handleUpdate}
                            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
                        >
                            Save Changes
                        </button>
                    )}
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm">
                    {activeTab === "dashboard" && trafficData && (
                        <div className="space-y-6">
                            <h3 className="font-medium text-lg">Traffic Analytics Dashboard</h3>
                            
                            {/* Overview Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-blue-100 text-sm">Total Visitors</p>
                                            <p className="text-3xl font-bold">{trafficData.totalVisitors.toLocaleString()}</p>
                                        </div>
                                        <div className="text-4xl opacity-80">👥</div>
                                    </div>
                                </div>
                                
                                <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-lg">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-green-100 text-sm">Today's Visitors</p>
                                            <p className="text-3xl font-bold">{trafficData.todayVisitors.toLocaleString()}</p>
                                        </div>
                                        <div className="text-4xl opacity-80">📈</div>
                                    </div>
                                </div>
                                
                                <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-lg">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-purple-100 text-sm">Weekly Visitors</p>
                                            <p className="text-3xl font-bold">{trafficData.weeklyVisitors.toLocaleString()}</p>
                                        </div>
                                        <div className="text-4xl opacity-80">Chart</div>
                                    </div>
                                </div>
                                
                                <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-lg">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-orange-100 text-sm">Monthly Visitors</p>
                                            <p className="text-3xl font-bold">{trafficData.monthlyVisitors.toLocaleString()}</p>
                                        </div>
                                        <div className="text-4xl opacity-80">Calendar</div>
                                    </div>
                                </div>
                            </div>

                            {/* Charts Row */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Hourly Traffic Chart */}
                                <div className="bg-white border rounded-lg p-6">
                                    <h4 className="font-medium text-lg mb-4">Hourly Traffic</h4>
                                    <div className="space-y-2">
                                        {trafficData.hourlyTraffic.map((hour, index) => (
                                            <div key={index} className="flex items-center space-x-4">
                                                <span className="text-sm text-gray-600 w-16">{hour.hour}</span>
                                                <div className="flex-1 bg-gray-200 rounded-full h-6 relative">
                                                    <div 
                                                        className="bg-blue-500 h-6 rounded-full flex items-center justify-end pr-2"
                                                        style={{ width: `${(hour.visitors / Math.max(...trafficData.hourlyTraffic.map(h => h.visitors))) * 100}%` }}
                                                    >
                                                        <span className="text-xs text-white font-medium">{hour.visitors}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Daily Traffic Chart */}
                                <div className="bg-white border rounded-lg p-6">
                                    <h4 className="font-medium text-lg mb-4">Daily Traffic (Last 7 Days)</h4>
                                    <div className="space-y-2">
                                        {trafficData.dailyTraffic.map((day, index) => (
                                            <div key={index} className="flex items-center space-x-4">
                                                <span className="text-sm text-gray-600 w-20">{new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                                                <div className="flex-1 bg-gray-200 rounded-full h-6 relative">
                                                    <div 
                                                        className="bg-green-500 h-6 rounded-full flex items-center justify-end pr-2"
                                                        style={{ width: `${(day.visitors / Math.max(...trafficData.dailyTraffic.map(d => d.visitors))) * 100}%` }}
                                                    >
                                                        <span className="text-xs text-white font-medium">{day.visitors}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Top Pages Table */}
                            <div className="bg-white border rounded-lg p-6">
                                <h4 className="font-medium text-lg mb-4">Top Performing Pages</h4>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b">
                                                <th className="text-left py-3 px-4">Page</th>
                                                <th className="text-center py-3 px-4">Total Views</th>
                                                <th className="text-center py-3 px-4">Unique Visitors</th>
                                                <th className="text-center py-3 px-4">Last Visited</th>
                                                <th className="text-center py-3 px-4">Performance</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {trafficData.topPages.map((page, index) => (
                                                <tr key={index} className="border-b hover:bg-gray-50">
                                                    <td className="py-3 px-4">
                                                        <div className="flex items-center space-x-2">
                                                            <span className="text-2xl">
                                                                {page.page === "/home" && "Home"}
                                                                {page.page === "/classes" && "Classes"}
                                                                {page.page === "/about" && "About"}
                                                                {page.page === "/blog" && "Blog"}
                                                                {page.page === "/contact" && "Contact"}
                                                            </span>
                                                            <span className="font-medium">{page.page}</span>
                                                        </div>
                                                    </td>
                                                    <td className="text-center py-3 px-4">
                                                        <span className="font-semibold text-blue-600">{page.views.toLocaleString()}</span>
                                                    </td>
                                                    <td className="text-center py-3 px-4">
                                                        <span className="text-green-600">{page.uniqueVisitors.toLocaleString()}</span>
                                                    </td>
                                                    <td className="text-center py-3 px-4 text-sm text-gray-600">
                                                        {new Date(page.lastVisited).toLocaleDateString()} {new Date(page.lastVisited).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </td>
                                                    <td className="text-center py-3 px-4">
                                                        <div className="flex items-center justify-center space-x-1">
                                                            {index === 0 && <span className="text-2xl">🥇</span>}
                                                            {index === 1 && <span className="text-2xl">🥈</span>}
                                                            {index === 2 && <span className="text-2xl">🥉</span>}
                                                            {index > 2 && <span className="text-gray-400">#{index + 1}</span>}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Additional Metrics */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-lg p-6">
                                    <h4 className="font-medium text-lg mb-4 text-red-800">Bounce Rate</h4>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-3xl font-bold text-red-600">{trafficData.bounceRate}%</p>
                                            <p className="text-sm text-red-600">Users leave after one page</p>
                                        </div>
                                        <div className="text-5xl opacity-50">Graph</div>
                                    </div>
                                    <div className="mt-4">
                                        <div className="text-sm text-red-700">
                                            {trafficData.bounceRate < 40 ? "Good bounce rate" : 
                                             trafficData.bounceRate < 60 ? "Average bounce rate" : 
                                             "High bounce rate - consider improving content"}
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gradient-to-r from-teal-50 to-cyan-50 border border-teal-200 rounded-lg p-6">
                                    <h4 className="font-medium text-lg mb-4 text-teal-800">Avg Session Duration</h4>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-3xl font-bold text-teal-600">
                                                {Math.floor(trafficData.avgSessionDuration / 60)}:{(trafficData.avgSessionDuration % 60).toString().padStart(2, '0')}
                                            </p>
                                            <p className="text-sm text-teal-600">Average time on site</p>
                                        </div>
                                        <div className="text-5xl opacity-50">Clock</div>
                                    </div>
                                    <div className="mt-4">
                                        <div className="text-sm text-teal-700">
                                            {trafficData.avgSessionDuration > 180 ? "Good engagement" : 
                                             trafficData.avgSessionDuration > 60 ? "Moderate engagement" : 
                                             "Low engagement - improve content"}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Traffic Insights */}
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                                <h4 className="font-medium text-lg mb-4 text-blue-800">Traffic Insights</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <h5 className="font-medium text-blue-700">Peak Hours</h5>
                                        <p className="text-sm text-blue-600">Highest traffic between 4PM-8PM</p>
                                    </div>
                                    <div className="space-y-2">
                                        <h5 className="font-medium text-blue-700">Most Popular Page</h5>
                                        <p className="text-sm text-blue-600">Home page gets {Math.round((trafficData.topPages[0].views / trafficData.totalVisitors) * 100)}% of total traffic</p>
                                    </div>
                                    <div className="space-y-2">
                                        <h5 className="font-medium text-blue-700">Growth Trend</h5>
                                        <p className="text-sm text-blue-600">Traffic increased by {Math.round(((trafficData.dailyTraffic[6].visitors - trafficData.dailyTraffic[0].visitors) / trafficData.dailyTraffic[0].visitors) * 100)}% this week</p>
                                    </div>
                                    <div className="space-y-2">
                                        <h5 className="font-medium text-blue-700">User Engagement</h5>
                                        <p className="text-sm text-blue-600">{Math.round((1 - trafficData.bounceRate / 100) * 100)}% of users explore multiple pages</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "hero" && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <h3 className="font-medium text-lg">Hero Slides</h3>
                                <button
                                    onClick={() => {
                                        const newSlides = [...content.hero.slides, ""];
                                        setContent({ ...content, hero: { ...content.hero, slides: newSlides } });
                                    }}
                                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                                >
                                    + Add New Slide
                                </button>
                            </div>
                            
                            {content.hero.slides.map((slide, index) => (
                                <div key={index} className="border p-4 rounded-lg bg-gray-50 space-y-4">
                                    <div className="flex justify-between items-center">
                                        <h4 className="font-medium">Slide {index + 1}</h4>
                                        <button
                                            onClick={() => {
                                                const newSlides = content.hero.slides.filter((_, i) => i !== index);
                                                setContent({ ...content, hero: { ...content.hero, slides: newSlides } });
                                            }}
                                            className="text-red-600 hover:text-red-800 text-sm"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Image URL</label>
                                        <div className="space-y-2">
                                            <input
                                                type="text"
                                                value={slide}
                                                onChange={(e) => {
                                                    const newSlides = [...content.hero.slides];
                                                    newSlides[index] = e.target.value;
                                                    setContent({ ...content, hero: { ...content.hero, slides: newSlides } });
                                                }}
                                                placeholder="/images/hero-slide.jpg"
                                                className="w-full border p-2 rounded"
                                            />
                                            <div className="flex items-center space-x-2">
                                                <span className="text-sm text-gray-600">Or upload image:</span>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={async (e) => {
                                                        const uploadedUrl = await handleFileUpload(e, "hero");
                                                        if (uploadedUrl) {
                                                            const newSlides = [...content.hero.slides];
                                                            newSlides[index] = uploadedUrl;
                                                            setContent({ ...content, hero: { ...content.hero, slides: newSlides } });
                                                        }
                                                    }}
                                                    className="text-sm border p-1 rounded"
                                                />
                                            </div>
                                            {slide && (
                                                <div className="mt-2">
                                                    <img 
                                                        src={slide} 
                                                        alt={`Hero slide ${index + 1}`}
                                                        className="h-32 w-auto object-cover rounded border"
                                                        onError={(e) => {
                                                            e.currentTarget.src = "/placeholder.svg";
                                                        }}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Pricing Plans Editor */}
                    {activeTab === "pricing" && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <h3 className="font-medium text-lg">Pricing Plans</h3>
                                <button
                                    onClick={() => {
                                        const newPlan = {
                                            name: "New Plan",
                                            price: 0,
                                            duration: "monthly",
                                            currency: "USD",
                                            description: "Plan description",
                                            features: [],
                                            popular: false,
                                            highlighted: false,
                                            buttonText: "Choose Plan",
                                            buttonLink: "#contact",
                                            icon: "",
                                            badge: "",
                                            discount: 0,
                                            trialDays: 0
                                        };
                                        setContent({ ...content, pricing: [...content.pricing, newPlan] });
                                    }}
                                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                                >
                                    + Add New Plan
                                </button>
                            </div>
                            
                            {content.pricing.map((plan, index) => (
                                <div key={index} className="border rounded-lg bg-white shadow-sm">
                                    {/* Plan Header */}
                                    <div className="flex justify-between items-center p-4 border-b bg-gray-50">
                                        <div className="flex items-center space-x-3">
                                            <h4 className="font-medium text-lg">{plan.name || "Untitled Plan"}</h4>
                                            {plan.popular && (
                                                <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">Popular</span>
                                            )}
                                            {plan.highlighted && (
                                                <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">Featured</span>
                                            )}
                                        </div>
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => {
                                                    const newPricing = content.pricing.filter((_, i) => i !== index);
                                                    setContent({ ...content, pricing: newPricing });
                                                }}
                                                className="text-red-600 hover:text-red-800 text-sm"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                    
                                    {/* Plan Content */}
                                    <div className="p-4 space-y-4">
                                        {/* Basic Info */}
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium mb-1">Plan Name</label>
                                                <input
                                                    type="text"
                                                    className="w-full border p-2 rounded"
                                                    value={plan.name || ""}
                                                    onChange={(e) => {
                                                        const newPricing = [...content.pricing];
                                                        newPricing[index] = { ...plan, name: e.target.value };
                                                        setContent({ ...content, pricing: newPricing });
                                                    }}
                                                    placeholder="e.g., Basic, Premium, Pro"
                                                />
                                            </div>
                                            
                                            <div>
                                                <label className="block text-sm font-medium mb-1">Price</label>
                                                <input
                                                    type="number"
                                                    className="w-full border p-2 rounded"
                                                    value={plan.price || ""}
                                                    onChange={(e) => {
                                                        const newPricing = [...content.pricing];
                                                        newPricing[index] = { ...plan, price: parseFloat(e.target.value) || 0 };
                                                        setContent({ ...content, pricing: newPricing });
                                                    }}
                                                    placeholder="29.99"
                                                />
                                            </div>
                                            
                                            <div>
                                                <label className="block text-sm font-medium mb-1">Duration</label>
                                                <select
                                                    className="w-full border p-2 rounded"
                                                    value={plan.duration || "monthly"}
                                                    onChange={(e) => {
                                                        const newPricing = [...content.pricing];
                                                        newPricing[index] = { ...plan, duration: e.target.value };
                                                        setContent({ ...content, pricing: newPricing });
                                                    }}
                                                >
                                                    <option value="monthly">Monthly</option>
                                                    <option value="yearly">Yearly</option>
                                                    <option value="quarterly">Quarterly</option>
                                                    <option value="onetime">One Time</option>
                                                </select>
                                            </div>
                                        </div>

                                        {/* Currency and Badge */}
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium mb-1">Currency</label>
                                                <select
                                                    className="w-full border p-2 rounded"
                                                    value={plan.currency || "USD"}
                                                    onChange={(e) => {
                                                        const newPricing = [...content.pricing];
                                                        newPricing[index] = { ...plan, currency: e.target.value };
                                                        setContent({ ...content, pricing: newPricing });
                                                    }}
                                                >
                                                    <option value="USD">USD ($)</option>
                                                    <option value="EUR">EUR (€)</option>
                                                    <option value="GBP">GBP (£)</option>
                                                    <option value="INR">INR (₹)</option>
                                                </select>
                                            </div>
                                            
                                            <div>
                                                <label className="block text-sm font-medium mb-1">Badge Text</label>
                                                <input
                                                    type="text"
                                                    className="w-full border p-2 rounded"
                                                    value={plan.badge || ""}
                                                    onChange={(e) => {
                                                        const newPricing = [...content.pricing];
                                                        newPricing[index] = { ...plan, badge: e.target.value };
                                                        setContent({ ...content, pricing: newPricing });
                                                    }}
                                                    placeholder="e.g., Best Value, Limited Time"
                                                />
                                            </div>
                                            
                                            <div>
                                                <label className="block text-sm font-medium mb-1">Trial Days</label>
                                                <input
                                                    type="number"
                                                    className="w-full border p-2 rounded"
                                                    value={plan.trialDays || ""}
                                                    onChange={(e) => {
                                                        const newPricing = [...content.pricing];
                                                        newPricing[index] = { ...plan, trialDays: parseInt(e.target.value) || 0 };
                                                        setContent({ ...content, pricing: newPricing });
                                                    }}
                                                    placeholder="e.g., 7, 14, 30"
                                                />
                                            </div>
                                        </div>

                                        {/* Description */}
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Description</label>
                                            <textarea
                                                className="w-full border p-2 rounded"
                                                rows={3}
                                                value={plan.description || ""}
                                                onChange={(e) => {
                                                    const newPricing = [...content.pricing];
                                                    newPricing[index] = { ...plan, description: e.target.value };
                                                    setContent({ ...content, pricing: newPricing });
                                                }}
                                                placeholder="Describe what this plan includes..."
                                            />
                                        </div>

                                        {/* Features */}
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Features</label>
                                            <div className="space-y-2">
                                                {plan.features?.map((feature: string, featureIndex: number) => (
                                                    <div key={featureIndex} className="flex space-x-2">
                                                        <input
                                                            type="text"
                                                            className="flex-1 border p-2 rounded"
                                                            value={feature}
                                                            onChange={(e) => {
                                                                const newPricing = [...content.pricing];
                                                                const newFeatures = [...plan.features];
                                                                newFeatures[featureIndex] = e.target.value;
                                                                newPricing[index] = { ...plan, features: newFeatures };
                                                                setContent({ ...content, pricing: newPricing });
                                                            }}
                                                            placeholder="e.g., Unlimited yoga classes"
                                                        />
                                                        <button
                                                            onClick={() => {
                                                                const newPricing = [...content.pricing];
                                                                const newFeatures = plan.features.filter((_: string, i: number) => i !== featureIndex);
                                                                newPricing[index] = { ...plan, features: newFeatures };
                                                                setContent({ ...content, pricing: newPricing });
                                                            }}
                                                            className="text-red-600 hover:text-red-800 px-2"
                                                        >
                                                            Remove
                                                        </button>
                                                    </div>
                                                ))}
                                                <button
                                                    onClick={() => {
                                                        const newPricing = [...content.pricing];
                                                        const newFeatures = [...(plan.features || []), ""];
                                                        newPricing[index] = { ...plan, features: newFeatures };
                                                        setContent({ ...content, pricing: newPricing });
                                                    }}
                                                    className="text-blue-600 hover:text-blue-800 text-sm"
                                                >
                                                    + Add Feature
                                                </button>
                                            </div>
                                        </div>

                                        {/* Options */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium mb-1">Button Text</label>
                                                <input
                                                    type="text"
                                                    className="w-full border p-2 rounded"
                                                    value={plan.buttonText || ""}
                                                    onChange={(e) => {
                                                        const newPricing = [...content.pricing];
                                                        newPricing[index] = { ...plan, buttonText: e.target.value };
                                                        setContent({ ...content, pricing: newPricing });
                                                    }}
                                                    placeholder="e.g., Get Started, Choose Plan"
                                                />
                                            </div>
                                            
                                            <div>
                                                <label className="block text-sm font-medium mb-1">Button Link</label>
                                                <input
                                                    type="text"
                                                    className="w-full border p-2 rounded"
                                                    value={plan.buttonLink || ""}
                                                    onChange={(e) => {
                                                        const newPricing = [...content.pricing];
                                                        newPricing[index] = { ...plan, buttonLink: e.target.value };
                                                        setContent({ ...content, pricing: newPricing });
                                                    }}
                                                    placeholder="e.g., /contact, #signup"
                                                />
                                            </div>
                                        </div>

                                        {/* Checkboxes */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="flex items-center space-x-2">
                                                <input
                                                    type="checkbox"
                                                    checked={plan.popular || false}
                                                    onChange={(e) => {
                                                        const newPricing = [...content.pricing];
                                                        newPricing[index] = { ...plan, popular: e.target.checked };
                                                        setContent({ ...content, pricing: newPricing });
                                                    }}
                                                    className="w-4 h-4"
                                                />
                                                <label className="text-sm font-medium">Mark as Popular</label>
                                            </div>
                                            
                                            <div className="flex items-center space-x-2">
                                                <input
                                                    type="checkbox"
                                                    checked={plan.highlighted || false}
                                                    onChange={(e) => {
                                                        const newPricing = [...content.pricing];
                                                        newPricing[index] = { ...plan, highlighted: e.target.checked };
                                                        setContent({ ...content, pricing: newPricing });
                                                    }}
                                                    className="w-4 h-4"
                                                />
                                                <label className="text-sm font-medium">Highlight This Plan</label>
                                            </div>
                                        </div>

                                        {/* Discount */}
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Discount (%)</label>
                                            <input
                                                type="number"
                                                className="w-full border p-2 rounded"
                                                value={plan.discount || ""}
                                                onChange={(e) => {
                                                    const newPricing = [...content.pricing];
                                                    newPricing[index] = { ...plan, discount: parseFloat(e.target.value) || 0 };
                                                    setContent({ ...content, pricing: newPricing });
                                                }}
                                                placeholder="e.g., 10 for 10% off"
                                                min="0"
                                                max="100"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                            
                            {/* Pricing Tips */}
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <h4 className="font-medium text-blue-800 mb-2">Pricing Plan Tips:</h4>
                                <ul className="text-sm text-blue-700 space-y-1">
                                    <li>• Use clear, descriptive plan names (Basic, Pro, Enterprise)</li>
                                    <li>• Include 3-5 key features per plan for clarity</li>
                                    <li>• Set competitive prices based on market research</li>
                                    <li>• Use "Popular" badge for recommended plans</li>
                                    <li>• Offer trial periods to reduce signup friction</li>
                                    <li>• Create urgency with limited-time discounts</li>
                                    <li>• Ensure clear call-to-action buttons</li>
                                </ul>
                            </div>
                        </div>
                    )}

                    {activeTab === "blogs" && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <h3 className="font-medium text-lg">Blog Posts</h3>
                                <button
                                    onClick={() => {
                                        const newBlog = {
                                            title: "New Blog Post",
                                            excerpt: "",
                                            content: "",
                                            hasImage: false,
                                            isVideo: false,
                                            image: "",
                                            videoUrl: "",
                                            author: "Admin",
                                            publishDate: new Date().toISOString().split('T')[0],
                                            status: "draft",
                                            category: "Uncategorized",
                                            tags: []
                                        };
                                        setContent({ ...content, blogs: [...content.blogs, newBlog] });
                                    }}
                                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                                >
                                    + Add New Post
                                </button>
                            </div>
                            
                            {content.blogs.map((blog, index) => (
                                <div key={index} className="border rounded-lg bg-white shadow-sm">
                                    {/* Blog Header */}
                                    <div className="flex justify-between items-center p-4 border-b bg-gray-50">
                                        <div className="flex items-center space-x-3">
                                            <h4 className="font-medium text-lg">
                                                {blog.title || "Untitled Post"}
                                            </h4>
                                            <span className={`px-2 py-1 text-xs rounded-full ${
                                                blog.status === 'published' 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {blog.status || 'draft'}
                                            </span>
                                        </div>
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => {
                                                    const newBlogs = content.blogs.filter((_, i) => i !== index);
                                                    setContent({ ...content, blogs: newBlogs });
                                                }}
                                                className="text-red-600 hover:text-red-800 text-sm"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                    
                                    {/* Blog Content */}
                                    <div className="p-4 space-y-4">
                                        {/* Title */}
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Post Title</label>
                                            <input
                                                type="text"
                                                className="w-full border p-2 rounded"
                                                value={blog.title || ""}
                                                onChange={(e) => {
                                                    const newBlogs = [...content.blogs];
                                                    newBlogs[index] = { ...blog, title: e.target.value };
                                                    setContent({ ...content, blogs: newBlogs });
                                                }}
                                                placeholder="Enter post title..."
                                            />
                                        </div>
                                        
                                        {/* Permalink */}
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Permalink</label>
                                            <div className="flex space-x-2">
                                                <input
                                                    type="text"
                                                    className="flex-1 border p-2 rounded"
                                                    value={blog.permalink || ""}
                                                    onChange={(e) => {
                                                        const newBlogs = [...content.blogs];
                                                        newBlogs[index] = { ...blog, permalink: e.target.value };
                                                        setContent({ ...content, blogs: newBlogs });
                                                    }}
                                                    placeholder="post-url"
                                                />
                                                <span className="text-gray-500">.html</span>
                                            </div>
                                        </div>
                                        
                                        {/* Content Editor */}
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Content</label>
                                            <textarea
                                                className="w-full border p-2 rounded"
                                                rows={10}
                                                value={blog.content || ""}
                                                onChange={(e) => {
                                                    const newBlogs = [...content.blogs];
                                                    newBlogs[index] = { ...blog, content: e.target.value };
                                                    setContent({ ...content, blogs: newBlogs });
                                                }}
                                                placeholder="Write your blog post content..."
                                            />
                                        </div>
                                        
                                        {/* Excerpt */}
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Excerpt</label>
                                            <textarea
                                                className="w-full border p-2 rounded"
                                                value={blog.excerpt || ""}
                                                onChange={(e) => {
                                                    const newBlogs = [...content.blogs];
                                                    newBlogs[index] = { ...blog, excerpt: e.target.value };
                                                    setContent({ ...content, blogs: newBlogs });
                                                }}
                                                placeholder="Brief description of the post..."
                                                rows={3}
                                            />
                                        </div>
                                        
                                        {/* Video URL */}
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Video URL (Optional)</label>
                                            <input
                                                type="url"
                                                className="w-full border p-2 rounded"
                                                value={blog.videoUrl || ""}
                                                onChange={(e) => {
                                                    const newBlogs = [...content.blogs];
                                                    newBlogs[index] = { ...blog, videoUrl: e.target.value, isVideo: e.target.value ? true : false };
                                                    setContent({ ...content, blogs: newBlogs });
                                                }}
                                                placeholder="https://youtube.com/watch?v=..."
                                            />
                                        </div>
                                        
                                        {/* Blog Settings */}
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium mb-1">Author</label>
                                                <input
                                                    type="text"
                                                    className="w-full border p-2 rounded"
                                                    value={blog.author || ""}
                                                    onChange={(e) => {
                                                        const newBlogs = [...content.blogs];
                                                        newBlogs[index] = { ...blog, author: e.target.value };
                                                        setContent({ ...content, blogs: newBlogs });
                                                    }}
                                                    placeholder="Author name"
                                                />
                                            </div>
                                            
                                            <div>
                                                <label className="block text-sm font-medium mb-1">Publish Date</label>
                                                <input
                                                    type="date"
                                                    className="w-full border p-2 rounded"
                                                    value={blog.publishDate || ""}
                                                    onChange={(e) => {
                                                        const newBlogs = [...content.blogs];
                                                        newBlogs[index] = { ...blog, publishDate: e.target.value };
                                                        setContent({ ...content, blogs: newBlogs });
                                                    }}
                                                />
                                            </div>
                                            
                                            <div>
                                                <label className="block text-sm font-medium mb-1">Status</label>
                                                <select
                                                    className="w-full border p-2 rounded"
                                                    value={blog.status || "draft"}
                                                    onChange={(e) => {
                                                        const newBlogs = [...content.blogs];
                                                        newBlogs[index] = { ...blog, status: e.target.value };
                                                        setContent({ ...content, blogs: newBlogs });
                                                    }}
                                                >
                                                    <option value="draft">Draft</option>
                                                    <option value="published">Published</option>
                                                    <option value="private">Private</option>
                                                </select>
                                            </div>
                                        </div>
                                        
                                        {/* Category and Tags */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium mb-1">Category</label>
                                                <input
                                                    type="text"
                                                    className="w-full border p-2 rounded"
                                                    value={blog.category || ""}
                                                    onChange={(e) => {
                                                        const newBlogs = [...content.blogs];
                                                        newBlogs[index] = { ...blog, category: e.target.value };
                                                        setContent({ ...content, blogs: newBlogs });
                                                    }}
                                                    placeholder="e.g., Yoga, Meditation, Wellness"
                                                />
                                            </div>
                                            
                                            <div>
                                                <label className="block text-sm font-medium mb-1">Tags (comma-separated)</label>
                                                <input
                                                    type="text"
                                                    className="w-full border p-2 rounded"
                                                    value={blog.tags ? blog.tags.join(', ') : ""}
                                                    onChange={(e) => {
                                                        const newBlogs = [...content.blogs];
                                                        newBlogs[index] = { ...blog, tags: e.target.value.split(',').map(tag => tag.trim()) };
                                                        setContent({ ...content, blogs: newBlogs });
                                                    }}
                                                    placeholder="yoga, meditation, wellness"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            
                            {/* Blog Tips */}
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <h4 className="font-medium text-blue-800 mb-2">Blog Writing Tips:</h4>
                                <ul className="text-sm text-blue-700 space-y-1">
                                    <li>• Write compelling titles that grab attention</li>
                                    <li>• Use short excerpts for better SEO</li>
                                    <li>• Featured images should be 1200x630 pixels</li>
                                    <li>• Use relevant tags to improve discoverability</li>
                                    <li>• Set proper publish dates for scheduling</li>
                                    <li>• Use draft status to save work in progress</li>
                                </ul>
                            </div>
                        </div>
                    )}

                    {/* Video Editor */}
                    {activeTab === "video" && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Video Title</label>
                                <input
                                    className="w-full border p-2 rounded"
                                    value={content.video.title}
                                    onChange={(e) => setContent({ ...content, video: { ...content.video, title: e.target.value } })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">YouTube Embed URL</label>
                                <input
                                    className="w-full border p-2 rounded"
                                    value={content.video.src}
                                    onChange={(e) => setContent({ ...content, video: { ...content.video, src: e.target.value } })}
                                />
                            </div>
                        </div>
                    )}

                    {/* Timetable Editor - User Friendly */}
                    {activeTab === "timetable" && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <h3 className="font-medium text-lg">Class Timetable</h3>
                                <button
                                    onClick={() => {
                                        const newTimeSlot = {
                                            time: "9:00 am",
                                            classes: [
                                                { day: "Monday", has: false },
                                                { day: "Tuesday", has: false },
                                                { day: "Wednesday", has: false },
                                                { day: "Thursday", has: false },
                                                { day: "Friday", has: false },
                                                { day: "Saturday", has: false }
                                            ]
                                        };
                                        setContent({ ...content, timetable: [...content.timetable, newTimeSlot] });
                                    }}
                                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                                >
                                    + Add Time Slot
                                </button>
                            </div>
                            
                            {content.timetable.map((timeSlot, slotIndex) => (
                                <div key={slotIndex} className="border p-4 rounded-lg bg-gray-50">
                                    <div className="flex justify-between items-center mb-4">
                                        <h4 className="font-medium">Time Slot {slotIndex + 1}</h4>
                                        <button
                                            onClick={() => {
                                                const newTimetable = content.timetable.filter((_, i) => i !== slotIndex);
                                                setContent({ ...content, timetable: newTimetable });
                                            }}
                                            className="text-red-600 hover:text-red-800 text-sm"
                                        >
                                            Remove Time Slot
                                        </button>
                                    </div>
                                    
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium mb-1">Time</label>
                                        <input
                                            type="text"
                                            className="w-full border p-2 rounded"
                                            value={timeSlot.time}
                                            onChange={(e) => {
                                                const newTimetable = [...content.timetable];
                                                newTimetable[slotIndex] = { ...timeSlot, time: e.target.value };
                                                setContent({ ...content, timetable: newTimetable });
                                            }}
                                            placeholder="e.g., 7:00 am"
                                        />
                                    </div>
                                    
                                    <div className="overflow-x-auto">
                                        <table className="w-full border-collapse border border-gray-300">
                                            <thead>
                                                <tr className="bg-gray-100">
                                                    <th className="border border-gray-300 px-4 py-2 text-left">Day</th>
                                                    <th className="border border-gray-300 px-4 py-2 text-left">Has Class</th>
                                                    <th className="border border-gray-300 px-4 py-2 text-left">Class Name</th>
                                                    <th className="border border-gray-300 px-4 py-2 text-left">Class Time</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {timeSlot.classes.map((classInfo, dayIndex) => (
                                                    <tr key={dayIndex} className="hover:bg-gray-50">
                                                        <td className="border border-gray-300 px-4 py-2 font-medium">
                                                            {classInfo.day}
                                                        </td>
                                                        <td className="border border-gray-300 px-4 py-2">
                                                            <input
                                                                type="checkbox"
                                                                checked={classInfo.has}
                                                                onChange={(e) => {
                                                                    const newTimetable = [...content.timetable];
                                                                    newTimetable[slotIndex].classes[dayIndex] = {
                                                                        ...classInfo,
                                                                        has: e.target.checked,
                                                                        name: e.target.checked ? (classInfo.name || "Yoga Class") : "",
                                                                        time: e.target.checked ? (classInfo.time || `${timeSlot.time} - ${getNextTime(timeSlot.time)}`) : ""
                                                                    };
                                                                    setContent({ ...content, timetable: newTimetable });
                                                                }}
                                                                className="w-4 h-4"
                                                            />
                                                        </td>
                                                        <td className="border border-gray-300 px-4 py-2">
                                                            <input
                                                                type="text"
                                                                className="w-full border p-1 rounded text-sm"
                                                                value={classInfo.name || ""}
                                                                onChange={(e) => {
                                                                    const newTimetable = [...content.timetable];
                                                                    newTimetable[slotIndex].classes[dayIndex] = {
                                                                        ...classInfo,
                                                                        name: e.target.value,
                                                                        has: e.target.value ? true : classInfo.has
                                                                    };
                                                                    setContent({ ...content, timetable: newTimetable });
                                                                }}
                                                                placeholder="Class name"
                                                                disabled={!classInfo.has}
                                                            />
                                                        </td>
                                                        <td className="border border-gray-300 px-4 py-2">
                                                            <input
                                                                type="text"
                                                                className="w-full border p-1 rounded text-sm"
                                                                value={classInfo.time || ""}
                                                                onChange={(e) => {
                                                                    const newTimetable = [...content.timetable];
                                                                    newTimetable[slotIndex].classes[dayIndex] = {
                                                                        ...classInfo,
                                                                        time: e.target.value
                                                                    };
                                                                    setContent({ ...content, timetable: newTimetable });
                                                                }}
                                                                placeholder="e.g., 7:00 am - 8:00 am"
                                                                disabled={!classInfo.has}
                                                            />
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Classes Editor - User Friendly */}
                    {activeTab === "classes" && (
                        <div className="space-y-6">
                            <h3 className="font-medium text-lg">Yoga Classes</h3>
                            {content.classes.map((classItem, index) => (
                                <div key={index} className="border p-4 rounded-lg space-y-4 bg-gray-50">
                                    <div className="flex justify-between items-center">
                                        <h4 className="font-medium">Class {index + 1}</h4>
                                        <button
                                            onClick={() => {
                                                const newClasses = content.classes.filter((_, i) => i !== index);
                                                setContent({ ...content, classes: newClasses });
                                            }}
                                            className="text-red-600 hover:text-red-800 text-sm"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Class Title</label>
                                        <input
                                            type="text"
                                            className="w-full border p-2 rounded"
                                            value={classItem.title}
                                            onChange={(e) => {
                                                const newClasses = [...content.classes];
                                                newClasses[index] = { ...classItem, title: e.target.value };
                                                setContent({ ...content, classes: newClasses });
                                            }}
                                            placeholder="e.g., Morning Yoga"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Class Description</label>
                                        <textarea
                                            className="w-full border p-2 rounded"
                                            rows={3}
                                            value={classItem.description || ""}
                                            onChange={(e) => {
                                                const newClasses = [...content.classes];
                                                newClasses[index] = { ...classItem, description: e.target.value };
                                                setContent({ ...content, classes: newClasses });
                                            }}
                                            placeholder="e.g., Start your day with energizing yoga poses suitable for all levels"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Class Image</label>
                                        <div className="space-y-2">
                                            <input
                                                type="text"
                                                className="w-full border p-2 rounded"
                                                value={classItem.image || ""}
                                                onChange={(e) => {
                                                    const newClasses = [...content.classes];
                                                    newClasses[index] = { ...classItem, image: e.target.value };
                                                    setContent({ ...content, classes: newClasses });
                                                }}
                                                placeholder="e.g., /images/morning-yoga.jpg"
                                            />
                                            <div className="flex items-center space-x-2">
                                                <span className="text-sm text-gray-600">Or upload image:</span>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={async (e) => {
                                                        const uploadedUrl = await handleFileUpload(e, "classes");
                                                        if (uploadedUrl) {
                                                            const newClasses = [...content.classes];
                                                            newClasses[index] = { ...classItem, image: uploadedUrl };
                                                            setContent({ ...content, classes: newClasses });
                                                        }
                                                    }}
                                                    className="text-sm border p-1 rounded"
                                                />
                                            </div>
                                            {classItem.image && (
                                                <div className="mt-2">
                                                    <img 
                                                        src={classItem.image} 
                                                        alt={`Class ${index + 1}`}
                                                        className="h-24 w-auto object-cover rounded border"
                                                        onError={(e) => {
                                                            e.currentTarget.src = "/placeholder.svg";
                                                        }}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <button
                                onClick={() => {
                                    const newClasses = [...content.classes, { title: "", description: "", image: "" }];
                                    setContent({ ...content, classes: newClasses });
                                }}
                                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                            >
                                + Add New Class
                            </button>
                        </div>
                    )}

                    {/* Reviews Editor - User Friendly */}
                    {activeTab === "reviews" && (
                        <div className="space-y-6">
                            <h3 className="font-medium text-lg">Customer Reviews</h3>
                            {content.reviews.map((review, index) => (
                                <div key={index} className="border p-4 rounded-lg space-y-4 bg-gray-50">
                                    <div className="flex justify-between items-center">
                                        <h4 className="font-medium">Review {index + 1}</h4>
                                        <button
                                            onClick={() => {
                                                const newReviews = content.reviews.filter((_, i) => i !== index);
                                                setContent({ ...content, reviews: newReviews });
                                            }}
                                            className="text-red-600 hover:text-red-800 text-sm"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Customer Name</label>
                                        <input
                                            type="text"
                                            className="w-full border p-2 rounded"
                                            value={review.name}
                                            onChange={(e) => {
                                                const newReviews = [...content.reviews];
                                                newReviews[index] = { ...review, name: e.target.value };
                                                setContent({ ...content, reviews: newReviews });
                                            }}
                                            placeholder="Customer Name"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Role/Title</label>
                                        <input
                                            type="text"
                                            className="w-full border p-2 rounded"
                                            value={review.role}
                                            onChange={(e) => {
                                                const newReviews = [...content.reviews];
                                                newReviews[index] = { ...review, role: e.target.value };
                                                setContent({ ...content, reviews: newReviews });
                                            }}
                                            placeholder="e.g., Student, Member"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Review Text</label>
                                        <textarea
                                            className="w-full border p-2 rounded"
                                            rows={4}
                                            value={review.text}
                                            onChange={(e) => {
                                                const newReviews = [...content.reviews];
                                                newReviews[index] = { ...review, text: e.target.value };
                                                setContent({ ...content, reviews: newReviews });
                                            }}
                                            placeholder="Customer's review text..."
                                        />
                                    </div>
                                </div>
                            ))}
                            <button
                                onClick={() => {
                                    const newReviews = [...content.reviews, { name: "", role: "", text: "" }];
                                    setContent({ ...content, reviews: newReviews });
                                }}
                                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                            >
                                + Add New Review
                            </button>
                        </div>
                    )}

                    {/* About Editor - User Friendly */}
                    {activeTab === "about" && (
                        <div className="space-y-6">
                            <h3 className="font-medium text-lg">About Page Information</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Instructor Name</label>
                                    <input
                                        type="text"
                                        className="w-full border p-2 rounded"
                                        value={content.about.name}
                                        onChange={(e) => setContent({ ...content, about: { ...content.about, name: e.target.value } })}
                                        placeholder="Instructor Name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Title/Position</label>
                                    <input
                                        type="text"
                                        className="w-full border p-2 rounded"
                                        value={content.about.title}
                                        onChange={(e) => setContent({ ...content, about: { ...content.about, title: e.target.value } })}
                                        placeholder="e.g., Yoga Director, Senior Instructor"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Instructor Image</label>
                                    <div className="space-y-2">
                                        <input
                                            type="text"
                                            className="w-full border p-2 rounded"
                                            value={content.about.image || ""}
                                            onChange={(e) => setContent({ ...content, about: { ...content.about, image: e.target.value } })}
                                            placeholder="e.g., /images/instructor.jpg"
                                        />
                                        <div className="flex items-center space-x-2">
                                            <span className="text-sm text-gray-600">Or upload image:</span>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={async (e) => {
                                                    const uploadedUrl = await handleFileUpload(e, "about");
                                                    if (uploadedUrl) {
                                                        setContent({ ...content, about: { ...content.about, image: uploadedUrl } });
                                                    }
                                                }}
                                                className="text-sm border p-1 rounded"
                                            />
                                        </div>
                                        {content.about.image && (
                                            <div className="mt-2">
                                                <img 
                                                    src={content.about.image} 
                                                    alt="Instructor"
                                                    className="h-32 w-auto object-cover rounded border"
                                                    onError={(e) => {
                                                        e.currentTarget.src = "/placeholder.svg";
                                                    }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Bio</label>
                                    <textarea
                                        className="w-full border p-2 rounded"
                                        rows={8}
                                        value={content.about.bio}
                                        onChange={(e) => setContent({ ...content, about: { ...content.about, bio: e.target.value } })}
                                        placeholder="Instructor biography and background..."
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
