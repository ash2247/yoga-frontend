import { useState, useEffect } from "react";
import { ChevronRight } from "lucide-react";
import heroSlide1 from "@/assets/hero-slide-1.jpg";
import heroSlide2 from "@/assets/hero-slide-2.jpg";
import heroSlide3 from "@/assets/hero-slide-3.jpg";

import { useContent } from "@/context/ContentContext";

const navItems = [
  { label: "HOME", href: "#home" },
  { label: "ABOUT", href: "#about" },
  { label: "THE LIGHT OF YOGA STUDIO", href: "#studio" },
  { label: "PRICING", href: "#pricing" },
  { label: "VIDEOS", href: "#videos" },
  { label: "BLOG", href: "#blog" },
  { label: "CONTACTS", href: "/contact" },
];

const HeroSection = () => {
  const contentContext = useContent();
  const content = contentContext?.content;
  const heroImages = content?.hero?.slides || [heroSlide1, heroSlide2, heroSlide3];

  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % heroImages.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length);

  useEffect(() => {
    const interval = setInterval(nextSlide, 6000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  return (
    <section id="home" className="relative h-screen w-full overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-700"
        style={{ backgroundImage: `url(${heroImages[currentSlide]})` }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/20" />

      {/* Navigation */}
      <nav className="absolute top-0 left-0 right-0 z-20 flex justify-center pt-6">
        <ul className="flex items-center gap-2 md:gap-6">
          {navItems.map((item, index) => (
            <li key={item.label} className="flex items-center">
              <a
                href={item.href}
                className="yoga-nav-link hidden md:inline text-[10px] md:text-xs"
              >
                {item.label}
              </a>
              {index < navItems.length - 1 && (
                <span className="hidden md:inline text-white mx-2 opacity-60">•</span>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* Hero Content */}
      <div className="absolute inset-0 flex flex-col justify-center items-start z-10 px-8 md:px-20 lg:px-32">
        <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl text-yoga-pink italic font-light mb-2 tracking-wide">
          Inspiration
        </h1>
        <h2 className="font-heading text-3xl md:text-5xl lg:text-6xl text-yoga-blue italic font-light mb-8 ml-12 md:ml-24">
          for joyful living
        </h2>
        <p className="text-white font-heading text-xl md:text-2xl font-light mb-2 ml-4 md:ml-8">
          Treatments to Relax Your
        </p>
        <p className="text-white font-heading text-xl md:text-2xl font-light mb-8 ml-4 md:ml-8">
          Body & Soul
        </p>
        <button className="ml-4 md:ml-8 bg-yoga-pink text-white px-8 py-3 rounded-md hover:bg-yoga-pink/90 transition-all duration-300 font-body text-sm tracking-wider">
          Contact Us
        </button>
      </div>

      {/* Slider Controls */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-4">
        <button
          onClick={prevSlide}
          className="text-white hover:text-yoga-pink transition-colors"
        >
          <ChevronRight className="w-5 h-5 scale-x-[-1]" />
        </button>
        <div className="flex items-center gap-2">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${currentSlide === index ? "bg-white" : "border border-white"
                }`}
            />
          ))}
        </div>
        <button
          onClick={nextSlide}
          className="text-white hover:text-yoga-pink transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </section>
  );
};

export default HeroSection;
