import { Twitter, Facebook } from "lucide-react";

const footerLinks = [
  { label: "HOME", href: "#home" },
  { label: "ABOUT", href: "#about" },
  { label: "BLOG", href: "#blog" },
  { label: "CONTACTS", href: "#contacts" },
];

const Footer = () => {
  return (
    <footer className="bg-yoga-dark py-16">
      <div className="container mx-auto px-8">
        {/* Navigation Links */}
        <div className="flex justify-center items-center gap-4 mb-8">
          {footerLinks.map((link, index) => (
            <div key={link.label} className="flex items-center">
              <a
                href={link.href}
                className="text-white/70 font-body text-xs tracking-widest hover:text-white transition-colors"
              >
                {link.label}
              </a>
              {index < footerLinks.length - 1 && (
                <span className="text-white/50 mx-3">•</span>
              )}
            </div>
          ))}
        </div>

        {/* Social Icons */}
        <div className="flex justify-center items-center gap-4 mb-8">
          <a
            href="#"
            className="w-12 h-12 rounded-full bg-yoga-gold flex items-center justify-center hover:bg-yoga-gold/80 transition-colors"
          >
            <Twitter className="w-5 h-5 text-white" />
          </a>
          <a
            href="#"
            className="w-12 h-12 rounded-full bg-yoga-gold flex items-center justify-center hover:bg-yoga-gold/80 transition-colors"
          >
            <Facebook className="w-5 h-5 text-white" />
          </a>
          <a
            href="#"
            className="w-12 h-12 rounded-full bg-yoga-gold flex items-center justify-center hover:bg-yoga-gold/80 transition-colors"
          >
            <span className="text-white font-bold text-sm">G+</span>
          </a>
          <a
            href="#"
            className="w-12 h-12 rounded-full bg-yoga-gold flex items-center justify-center hover:bg-yoga-gold/80 transition-colors"
          >
            <span className="text-white font-bold text-sm">V</span>
          </a>
          <a
            href="#"
            className="w-12 h-12 rounded-full bg-yoga-gold flex items-center justify-center hover:bg-yoga-gold/80 transition-colors"
          >
            <span className="text-white font-bold text-sm">S</span>
          </a>
        </div>

        {/* Copyright */}
        <p className="text-center text-white/50 font-body text-sm">
          © 2025 The Light Of Yoga All right reserved.
        </p>
      </div>

      {/* Scroll to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-8 right-8 w-10 h-10 bg-white/20 rounded-sm flex items-center justify-center hover:bg-white/30 transition-colors"
      >
        <svg
          className="w-5 h-5 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      </button>
    </footer>
  );
};

export default Footer;
