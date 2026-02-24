import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";


const ContactUs = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    });
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
            toast({
                title: "Validation Error",
                description: "Please fill in all required fields.",
                variant: "destructive"
            });
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            toast({
                title: "Invalid Email",
                description: "Please enter a valid email address.",
                variant: "destructive"
            });
            return;
        }

        setLoading(true);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            toast({
                title: "Message Sent Successfully!",
                description: "We'll get back to you within 24 hours."
            });
            setFormData({
                name: "",
                email: "",
                subject: "",
                message: ""
            });
        } catch (error) {

            toast({
                title: "Failed to Send Message",
                description: "Please try again later or contact us directly.",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <div className="flex items-center">
                            <h1 className="text-3xl font-bold text-gray-900">Yoga Studio</h1>
                            <p className="ml-4 text-gray-600">Get in touch with us</p>
                        </div>
                        <nav className="hidden md:flex space-x-8">
                            <a href="/" className="text-gray-600 hover:text-blue-600 transition-colors">Home</a>
                        </nav>

                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div className="bg-white rounded-lg shadow-md p-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
                        <p className="text-gray-600 mb-8">
                            Have questions about our yoga classes? Fill out the form below and we'll get back to you within 24 hours.
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Full Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="John Doe"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Address <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="john@example.com"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Subject <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Question about yoga classes"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Message <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    rows={6}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="I'm interested in your yoga classes..."
                                />
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    {loading ? "Sending..." : "Send Message"}
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="space-y-8">
                        <div className="bg-white rounded-lg shadow-md p-8">
                            <h3 className="text-xl font-bold text-gray-900 mb-6">Contact Information</h3>
                            <div className="space-y-4">
                                <div className="flex items-center space-x-3">
                                    <div>
                                        <p className="font-medium text-gray-900">Phone</p>
                                        <p className="text-gray-600">+61 2 1234 5678</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <div>
                                        <p className="font-medium text-gray-900">Email</p>
                                        <p className="text-gray-600">info@yogastudio.com</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-md p-8">
                            <h3 className="text-xl font-bold text-gray-900 mb-6">Opening Hours</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="font-medium text-gray-700">Monday - Friday:</span>
                                    <span className="text-gray-600">6:00 AM - 8:00 PM</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium text-gray-700">Saturday:</span>
                                    <span className="text-gray-600">7:00 AM - 12:00 PM</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium text-gray-700">Sunday:</span>
                                    <span className="text-gray-600">Closed</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <footer className="bg-white border-t mt-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center">
                        <p className="text-gray-500">
                            &copy; 2025 Yoga Studio. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default ContactUs;
