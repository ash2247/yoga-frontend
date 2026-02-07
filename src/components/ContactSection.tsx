import contactBg from "@/assets/contact-bg.jpg";

const ContactSection = () => {
  return (
    <section
      id="contacts"
      className="relative py-20"
      style={{ backgroundImage: `url(${contactBg})`, backgroundSize: "cover", backgroundPosition: "center" }}
    >
      {/* Blue Overlay */}
      <div className="absolute inset-0 yoga-overlay-blue" />

      <div className="container mx-auto px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto text-white">
          {/* Contact Info */}
          <div>
            <h3 className="font-heading text-2xl font-light mb-6">Contact Info</h3>
            <p className="font-body text-sm mb-1">2/1191 Anzac Parade, Malabar</p>
            <p className="font-body text-sm mb-6">Sydney, NSW 2036</p>
            <button className="yoga-btn-outline text-xs">OPEN MAP</button>
          </div>

          {/* Classes */}
          <div className="text-center">
            <h3 className="font-heading text-2xl font-light mb-6">Classes</h3>
            <p className="font-body text-sm mb-1">Monday – Saturday</p>
            <p className="font-body text-sm mb-6">see timetable above</p>
            <button className="yoga-btn-outline text-xs">BOOK NOW</button>
          </div>

          {/* Appointments */}
          <div className="text-right">
            <h3 className="font-heading text-2xl font-light mb-6">For Appointments</h3>
            <p className="font-body text-sm mb-1">Prior Booking Essential.</p>
            <p className="font-body text-sm mb-1">Please Call Raj</p>
            <p className="font-body text-sm mb-1 opacity-80">to book for group / family sessions, Private / One-on-</p>
            <p className="font-body text-sm mb-6 opacity-80">One sessions at mutually convenient time.</p>
            <button className="yoga-btn-outline text-xs">CALL NOW</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
