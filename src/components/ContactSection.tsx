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
            <a
              href="https://www.google.com/maps/place/The+Light+of+Yoga/@-33.9614583,151.2460414,17z/data=!3m1!4b1!4m6!3m5!1s0x6b12b3e86dbe1187:0xafdcc16682acdda!8m2!3d-33.9614583!4d151.2460414!16s%2Fg%2F1thq9_zm?entry=ttu&g_ep=EgoyMDI2MDQxNS4wIKXMDSoASAFQAw%3D%3D"
              target="_blank"
              rel="noopener noreferrer"
              className="yoga-btn-outline text-xs"
            >OPEN MAP</a>
          </div>

          {/* Classes */}
          <div className="text-center">
            <h3 className="font-heading text-2xl font-light mb-6">Classes</h3>
            <p className="font-body text-sm mb-1">Monday – Saturday</p>
            <p className="font-body text-sm mb-6">see timetable above</p>
            <a
              href="#timetable"
              className="yoga-btn-outline text-xs"
            >BOOK NOW</a>
          </div>

          {/* Appointments */}
          <div className="text-right">
            <h3 className="font-heading text-2xl font-light mb-6">For Appointments</h3>
            <p className="font-body text-sm mb-1">Prior Booking Essential.</p>
            <p className="font-body text-sm mb-1">Please Call Raj</p>
            <p className="font-body text-sm mb-1 opacity-80">to book for group / family sessions, Private / One-on-</p>
            <p className="font-body text-sm mb-6 opacity-80">One sessions at mutually convenient time.</p>
            <a
              href="tel:0418409140"
              className="yoga-btn-outline text-xs"
            >CALL NOW</a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
