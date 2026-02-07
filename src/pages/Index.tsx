import HeroSection from "@/components/HeroSection";
import GoogleMapsSection from "@/components/GoogleMapsSection";
import ClassesSection from "@/components/ClassesSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import VideoSection from "@/components/VideoSection";
import TimetableSection from "@/components/TimetableSection";
import InstructorSection from "@/components/InstructorSection";
import BlogsSection from "@/components/BlogsSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <GoogleMapsSection />
      <ClassesSection />
      <TestimonialsSection />
      <VideoSection />
      <TimetableSection />
      <InstructorSection />
      <BlogsSection />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Index;
