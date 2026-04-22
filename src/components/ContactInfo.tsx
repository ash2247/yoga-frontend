import { Phone, Mail, User } from "lucide-react";

const ContactInfo = () => {
  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-6 max-w-sm">
      <div className="flex items-center gap-3 mb-4">
        <User className="w-5 h-5 text-yoga-pink" />
        <h3 className="font-heading text-xl text-gray-800 font-light italic">Raj</h3>
      </div>
      
      <div className="space-y-3">
        <a 
          href="tel:0418409140"
          className="flex items-center gap-3 text-gray-700 hover:text-yoga-pink transition-colors"
        >
          <Phone className="w-4 h-4 text-yoga-blue" />
          <span className="font-body">0418 409 140</span>
        </a>
        
        <a 
          href="mailto:sukhrajd@gmail.com"
          className="flex items-center gap-3 text-gray-700 hover:text-yoga-pink transition-colors"
        >
          <Mail className="w-4 h-4 text-yoga-blue" />
          <span className="font-body">sukhrajd@gmail.com</span>
        </a>
      </div>
    </div>
  );
};

export default ContactInfo;
