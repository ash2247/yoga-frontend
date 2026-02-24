import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { staticContent } from "@/data/staticContent";



interface BlogPost {
    title: string;
    excerpt: string;
    content?: string;
    hasImage: boolean;
    isVideo?: boolean;
    image?: string;
    videoUrl?: string;
}

const BlogPost = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [blog, setBlog] = useState<BlogPost | null>(null);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        fetchBlogPost();
    }, [slug]);

    const fetchBlogPost = async () => {
        try {
            setLoading(true);
            const blogs = staticContent.blogs;
            // Find the blog post by slug (title converted to slug format)
            const foundBlog = blogs.find((b: BlogPost) =>
                b.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') === slug
            );

            if (foundBlog) {
                setBlog(foundBlog);
            } else {
                // If not found by slug, try to find by index
                const index = parseInt(slug || '0');
                if (!isNaN(index) && index >= 0 && index < blogs.length) {
                    setBlog(blogs[index]);
                } else {
                    throw new Error('Blog post not found');
                }
            }
        } catch (error) {

            toast({
                title: "Error",
                description: "Blog post not found.",
                variant: "destructive"
            });
            navigate('/');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600">Loading blog post...</span>
            </div>
        );
    }

    if (!blog) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Blog Post Not Found</h1>
                    <button
                        onClick={() => navigate('/')}
                        className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                        ← Back to Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <div className="flex items-center">
                            <button
                                onClick={() => navigate('/')}
                                className="text-gray-600 hover:text-blue-600 transition-colors flex items-center"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                Back to Home
                            </button>
                        </div>
                        <nav className="hidden md:flex space-x-8">
                            <a href="/" className="text-gray-600 hover:text-blue-600 transition-colors">Home</a>
                            <a href="/contact" className="text-gray-600 hover:text-blue-600 transition-colors">Contact</a>
                        </nav>

                    </div>
                </div>
            </div>

            {/* Blog Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Blog Header */}
                <article className="bg-white rounded-lg shadow-md overflow-hidden">
                    {/* Featured Image/Video */}
                    {blog.hasImage && (
                        <div className="h-64 md:h-96 bg-gray-200 relative overflow-hidden">
                            {blog.isVideo && blog.videoUrl ? (
                                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                                    <div className="text-white text-center">
                                        <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M10 16.5l6-4.5-6-6.5-6.5a1.5 1.5 0 0 0 1.5 1.5v9a1.5 1.5 0 0 0 1.5 1.5m-6 0L4 12l6 4.5" />
                                        </svg>
                                        <p className="text-sm mt-2">Video Blog</p>
                                    </div>
                                </div>
                            ) : blog.image ? (
                                <img
                                    src={blog.image}
                                    alt={blog.title}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.currentTarget.src = "/placeholder.svg";
                                    }}
                                />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                                    <span className="text-6xl text-purple-600">🧘‍♀️</span>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Blog Content */}
                    <div className="p-8 md:p-12">
                        {/* Title */}
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                            {blog.title}
                        </h1>

                        {/* Meta Information */}
                        <div className="flex items-center text-gray-600 mb-8">
                            <div className="flex items-center mr-6">
                                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                                </svg>
                                <span className="text-sm">Yoga Studio</span>
                            </div>
                            <div className="flex items-center">
                                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" />
                                </svg>
                                <span className="text-sm">Blog Post</span>
                            </div>
                        </div>

                        {/* Excerpt */}
                        <div className="text-lg text-gray-600 mb-8 leading-relaxed italic border-l-4 border-purple-300 pl-4">
                            {blog.excerpt}
                        </div>

                        {/* Content */}
                        <div className="prose prose-lg max-w-none">
                            {blog.content ? (
                                <div dangerouslySetInnerHTML={{ __html: blog.content }} />
                            ) : (
                                <div className="text-gray-600 leading-relaxed">
                                    <p className="mb-4">
                                        Welcome to this insightful blog post about yoga and wellness.
                                        This content explores the transformative power of yoga practice
                                        and its benefits for both mind and body.
                                    </p>
                                    <p className="mb-4">
                                        Yoga is more than just physical exercise; it's a holistic approach
                                        to well-being that encompasses physical, mental, and spiritual aspects
                                        of our lives. Through regular practice, we can achieve balance,
                                        flexibility, and inner peace.
                                    </p>
                                    <p className="mb-4">
                                        Whether you're a beginner or an experienced practitioner,
                                        there's always something new to discover in your yoga journey.
                                        Join us as we explore the depths of this ancient practice
                                        and its modern applications.
                                    </p>
                                    <h3 className="text-xl font-semibold mt-6 mb-3">Key Benefits</h3>
                                    <ul className="list-disc pl-6 mb-4">
                                        <li>Improved flexibility and strength</li>
                                        <li>Enhanced mental clarity and focus</li>
                                        <li>Stress reduction and relaxation</li>
                                        <li>Better posture and body awareness</li>
                                        <li>Increased energy and vitality</li>
                                    </ul>
                                    <p>
                                        We invite you to explore these benefits and discover how yoga
                                        can transform your life. Join our community and start your
                                        journey to wellness today.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Call to Action */}
                        <div className="mt-12 p-6 bg-purple-50 rounded-lg border border-purple-200">
                            <h3 className="text-xl font-semibold text-purple-900 mb-3">Ready to Start Your Yoga Journey?</h3>
                            <p className="text-purple-700 mb-4">
                                Join our yoga classes and experience the transformative power of yoga.
                            </p>
                            <div className="flex space-x-4">
                                <a
                                    href="/contact"
                                    className="bg-purple-600 text-white px-6 py-3 rounded-md hover:bg-purple-700 transition-colors font-medium"
                                >
                                    Contact Us
                                </a>
                                <a
                                    href="/"
                                    className="border border-purple-600 text-purple-600 px-6 py-3 rounded-md hover:bg-purple-50 transition-colors font-medium"
                                >
                                    View Classes
                                </a>
                            </div>
                        </div>

                        {/* Share Section */}
                        <div className="mt-8 pt-8 border-t border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Share this post</h3>
                            <div className="flex space-x-4">
                                <button className="text-blue-600 hover:text-blue-700 font-medium">
                                    Share on Facebook
                                </button>
                                <button className="text-blue-400 hover:text-blue-500 font-medium">
                                    Share on Twitter
                                </button>
                                <button className="text-green-600 hover:text-green-700 font-medium">
                                    Share on WhatsApp
                                </button>
                            </div>
                        </div>
                    </div>
                </article>
            </div>
        </div>
    );
};

export default BlogPost;
