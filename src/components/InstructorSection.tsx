import { Facebook, Twitter, Linkedin } from "lucide-react";
import instructorImage from "@/assets/instructor-raj.jpg";

const InstructorSection = () => {
  return (
    <section id="about" className="yoga-gradient-teal py-16">
      <div className="container mx-auto px-8">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-8 bg-white/10 backdrop-blur-sm rounded-lg p-8">
          {/* Instructor Image */}
          <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-white/30 flex-shrink-0">
            <img
              src={instructorImage}
              alt="Raj - Yoga Director"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Info */}
          <div className="text-center md:text-left">
            <h3 className="font-heading text-3xl text-white font-light mb-1">Raj</h3>
            <p className="text-white/80 font-body text-sm mb-4">Yoga Director</p>
            
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
              Raj is an Honours Graduate in Psychology. He stood first in the entire University of
              Delhi, India and won a GOLD MEDAL for securing the first position in the University. He
              then did his Master's in Business Management (M.B.A.) from The Faculty of
              Management Studies, University of Delhi, Delhi, India. Thereafter, SukhRaj has had a
              very successful high fly career of an Export Manager in Several Multi-National
              Companies of India, Indonesia and Australia. Life changed after being diagnosed with
              Diabetes and he put his life in the slows lane – health became his major passion.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InstructorSection;
