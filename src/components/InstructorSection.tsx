import { Facebook, Twitter, Linkedin } from "lucide-react";
import instructorImage from "@/assets/instructor-raj.jpg";

import { useContent } from "@/context/ContentContext";

const InstructorSection = () => {
  const content = useContent();
  const about = content?.about || {
    name: "Raj",
    title: "Yoga Director",
    image: instructorImage,
    bio: "Raj is an Honours Graduate in Psychology..."
  };
  const bio = about.bio || "Raj is an Honours Graduate in Psychology...";
  // Use image from content URL if available, else fallback to import
  const imageSrc = about.image && about.image.startsWith("/") ? about.image : instructorImage;

  return (
    <section id="about" className="yoga-gradient-teal py-16">
      <div className="container mx-auto px-8">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-8 bg-white/10 backdrop-blur-sm rounded-lg p-8">
          {/* Instructor Image */}
          <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-white/30 flex-shrink-0">
            <img
              src={imageSrc}
              alt={`${about.name} - ${about.title}`}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Info */}
          <div className="text-center md:text-left">
            <h3 className="font-heading text-3xl text-white font-light mb-1">{about.name}</h3>
            <p className="text-white/80 font-body text-sm mb-4">{about.title}</p>

            {/* Social Icons */}
            <div className="flex justify-center md:justify-start gap-3 mb-4">
              <a href="#" className="text-yoga-dark hover:text-white transition-colors">
                <Facebook className="w-6 h-6" />
              </a>
              <a href="#" className="text-yoga-dark hover:text-white transition-colors">
                <Twitter className="w-6 h-6" />
              </a>
              <a href="#" className="text-yoga-dark hover:text-white transition-colors">
                <Linkedin className="w-6 h-6" />
              </a>
            </div>
          </div>

          {/* Bio */}
          <div className="flex-1">
            <p className="text-white font-body text-sm leading-relaxed">
              {bio}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InstructorSection;
