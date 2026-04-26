import { useState } from "react";
import emailjs from "@emailjs/browser";
import { useToast } from "@/components/ui/use-toast";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

// ─── EmailJS Config ───────────────────────────────────────────
// Sign up free at https://www.emailjs.com
const EMAILJS_SERVICE_ID = "service_ays9mad";            // ✅ Set
const EMAILJS_TEMPLATE_ID = "template_hdiioo6";         // ✅ Yoga template ID
const EMAILJS_AUTOREPLY_ID = "template_ys6b8em";         // ✅ User auto-reply confirmation template
const EMAILJS_PUBLIC_KEY = "uXqmCzko--gZF-8PH";         // ✅ Set
// ──────────────────────────────────────────────────────────────


const Contact = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
    });
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
            toast({
                title: "Validation Error",
                description: "Please fill in all required fields.",
                variant: "destructive",
            });
            return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            toast({
                title: "Invalid Email",
                description: "Please enter a valid email address.",
                variant: "destructive",
            });
            return;
        }
        setLoading(true);
        try {
            // 1️⃣ Notify studio owners (sukhrajd + ash)
            await emailjs.send(
                EMAILJS_SERVICE_ID,
                EMAILJS_TEMPLATE_ID,
                {
                    from_name: formData.name,
                    from_email: formData.email,
                    phone: formData.phone || "Not provided",
                    subject: formData.subject || "General Enquiry",
                    message: formData.message,
                    to_email_1: "sukhrajd@gmail.com",
                    to_email_2: "sendthistoash1@gmail.com",
                },
                EMAILJS_PUBLIC_KEY
            );

            // 2️⃣ Auto-reply confirmation to the user
            await emailjs.send(
                EMAILJS_SERVICE_ID,
                EMAILJS_AUTOREPLY_ID,
                {
                    to_name: formData.name,
                    to_email: formData.email,
                    from_name: "The Light Of Yoga",
                    subject: "Thank you for your enquiry",
                    message: "We have received your message and will get back to you within 24 hours."
                },
                EMAILJS_PUBLIC_KEY
            );

            toast({
                title: "Message Sent! 🙏",
                description: "Thank you for reaching out. We'll get back to you within 24 hours.",
            });
            setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
        } catch (error) {
            console.error("EmailJS error:", error);
            toast({
                title: "Failed to Send",
                description: "Something went wrong. Please try again or email us directly.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };



    return (
        <div className="min-h-screen bg-background">

            {/* ── Hero Banner with same Navbar as homepage ── */}
            <section
                className="relative h-64 flex items-center justify-center overflow-hidden"
                style={{
                    background:
                        "linear-gradient(135deg, hsl(210 25% 18%) 0%, hsl(270 30% 25%) 50%, hsl(210 25% 18%) 100%)",
                }}
            >
                {/* Same Navbar as homepage */}
                <Navbar />

                {/* decorative circles */}
                <div className="absolute top-0 left-1/4 w-72 h-72 rounded-full opacity-10"
                    style={{ background: "hsl(var(--yoga-gold))", filter: "blur(80px)", transform: "translate(-50%,-50%)" }} />
                <div className="absolute bottom-0 right-1/4 w-72 h-72 rounded-full opacity-10"
                    style={{ background: "hsl(var(--yoga-purple))", filter: "blur(80px)", transform: "translate(50%,50%)" }} />

                <div className="relative z-10 text-center mt-16">
                    <p className="font-body text-yoga-gold text-xs tracking-[0.3em] uppercase mb-3">
                        Reach Out To Us
                    </p>
                    <h1 className="font-heading text-5xl md:text-6xl italic font-light text-white tracking-wide">
                        Contact Us
                    </h1>
                    <div className="w-16 h-px bg-yoga-gold mx-auto mt-4" />
                </div>
            </section>



            {/* ── Form ── */}
            <section className="py-16 bg-background">
                <div className="container mx-auto px-6">
                    <div className="max-w-2xl mx-auto">

                        {/* Contact Form */}
                        <div className="bg-white rounded-2xl shadow-md p-8 md:p-10">
                            <h2 className="font-heading text-3xl italic font-light text-foreground mb-2">
                                Send a Message
                            </h2>
                            <p className="font-body text-sm text-muted-foreground mb-8">
                                Have questions about our yoga classes? Fill out the form and we'll get back to you within 24 hours.
                            </p>

                            <form onSubmit={handleSubmit} className="space-y-5">

                                {/* Name + Phone */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block font-body text-sm font-medium text-foreground mb-2">
                                            Full Name <span className="text-yoga-pink">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            placeholder="Your name"
                                            className="w-full px-4 py-3 border border-border rounded-xl font-body text-sm bg-background focus:outline-none focus:ring-2 focus:ring-yoga-purple/40 focus:border-yoga-purple transition"
                                        />
                                    </div>
                                    <div>
                                        <label className="block font-body text-sm font-medium text-foreground mb-2">
                                            Phone Number
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="+61 4xx xxx xxx"
                                            className="w-full px-4 py-3 border border-border rounded-xl font-body text-sm bg-background focus:outline-none focus:ring-2 focus:ring-yoga-purple/40 focus:border-yoga-purple transition"
                                        />
                                    </div>
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="block font-body text-sm font-medium text-foreground mb-2">
                                        Email Address <span className="text-yoga-pink">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        placeholder="you@example.com"
                                        className="w-full px-4 py-3 border border-border rounded-xl font-body text-sm bg-background focus:outline-none focus:ring-2 focus:ring-yoga-purple/40 focus:border-yoga-purple transition"
                                    />
                                </div>

                                {/* Subject */}
                                <div>
                                    <label className="block font-body text-sm font-medium text-foreground mb-2">
                                        Subject
                                    </label>
                                    <select
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-border rounded-xl font-body text-sm bg-background focus:outline-none focus:ring-2 focus:ring-yoga-purple/40 focus:border-yoga-purple transition"
                                    >
                                        <option value="">Select a topic…</option>
                                        <option>Class Enquiry</option>
                                        <option>Private Session</option>
                                        <option>Group Booking</option>
                                        <option>General Question</option>
                                        <option>Other</option>
                                    </select>
                                </div>

                                {/* Message */}
                                <div>
                                    <label className="block font-body text-sm font-medium text-foreground mb-2">
                                        Message <span className="text-yoga-pink">*</span>
                                    </label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        rows={5}
                                        placeholder="Tell us how we can help…"
                                        className="w-full px-4 py-3 border border-border rounded-xl font-body text-sm bg-background focus:outline-none focus:ring-2 focus:ring-yoga-purple/40 focus:border-yoga-purple transition resize-none"
                                    />
                                </div>

                                {/* Submit */}
                                <button
                                    type="submit"
                                    id="contact-submit-btn"
                                    disabled={loading}
                                    className="w-full py-3 px-6 rounded-xl font-body text-sm tracking-wider uppercase text-white transition-all duration-300 disabled:opacity-60"
                                    style={{
                                        background: loading
                                            ? "hsl(var(--yoga-purple))"
                                            : "linear-gradient(135deg, hsl(var(--yoga-purple)) 0%, hsl(var(--yoga-pink)) 100%)",
                                    }}
                                >
                                    {loading ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                            Sending…
                                        </span>
                                    ) : (
                                        "Send Message 🙏"
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Footer ── */}
            <Footer />
        </div>
    );
};

export default Contact;
