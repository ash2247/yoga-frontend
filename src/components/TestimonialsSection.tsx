import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const testimonials = [
  {
    text: "I've been going to Light of Yoga for over a year. With such a welcoming vibe you can relax as soon as you walk in & leave your worries at the door. SukhRaj is a great friend and a great teacher, i am grateful for his guidance during my yoga journey. With an outdoor setting we feel the breeze, the plants and see the stars, i love each session and highly recommend it to people of all levels.",
    name: "LIZZY",
    role: "Student",
  },
  {
    text: "The Light of Yoga has transformed my life completely. Raj's teaching style is unique and deeply spiritual. The outdoor garden setting creates a magical atmosphere that helps you connect with nature and yourself.",
    name: "SARAH",
    role: "Member",
  },
  {
    text: "Best yoga studio in Sydney! The combination of traditional yoga practices with modern wellness approaches makes every session special. I highly recommend trying their morning classes.",
    name: "MICHAEL",
    role: "Regular",
  },
];

const YogaSymbol = () => (
  <svg
    viewBox="0 0 100 100"
    className="w-16 h-16 text-white mx-auto mb-6"
    fill="currentColor"
  >
    <path d="M50 10 L55 25 L70 25 L58 35 L63 50 L50 40 L37 50 L42 35 L30 25 L45 25 Z" />
    <circle cx="50" cy="55" r="8" fill="none" stroke="currentColor" strokeWidth="2" />
    <path d="M50 65 Q35 80 35 90 M50 65 Q65 80 65 90" fill="none" stroke="currentColor" strokeWidth="2" />
    <circle cx="30" cy="50" r="3" />
    <circle cx="70" cy="50" r="3" />
    <circle cx="35" cy="35" r="2" />
    <circle cx="65" cy="35" r="2" />
  </svg>
);

import { useContent } from "@/context/ContentContext";

const TestimonialsSection = () => {
  const contentContext = useContent();
  const content = contentContext?.content;
  const testimonialData = content?.reviews || testimonials;
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () =>
    setCurrentIndex((prev) => (prev + 1) % testimonialData.length);
  const prevTestimonial = () =>
    setCurrentIndex((prev) => (prev - 1 + testimonialData.length) % testimonialData.length);

  useEffect(() => {
    const interval = setInterval(nextTestimonial, 8000);
    return () => clearInterval(interval);
  }, []);

  const current = testimonialData[currentIndex];

  return (
    <section className="yoga-gradient-pink py-20 relative">
      {/* Background overlay with yoga practitioners */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSJub25lIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] bg-repeat" />
      </div>

      <div className="container mx-auto px-8 relative z-10">
        {/* Yoga Symbol */}
        <YogaSymbol />

        {/* Dots */}
        <div className="flex justify-center gap-2 mb-8">
          {testimonialData.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${currentIndex === index ? "bg-white" : "bg-white/40"
                }`}
            />
          ))}
        </div>

        {/* Testimonial */}
        <div className="max-w-4xl mx-auto text-center relative">
          <button
            onClick={prevTestimonial}
            className="absolute left-0 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>

          <p className="text-white font-body text-lg md:text-xl leading-relaxed italic mb-8 px-12">
            {current.text}
          </p>

          <h4 className="text-white font-heading text-xl tracking-widest mb-1">
            {current.name}
          </h4>
          <span className="text-yoga-gold font-body text-sm">{current.role}</span>

          <button
            onClick={nextTestimonial}
            className="absolute right-0 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
