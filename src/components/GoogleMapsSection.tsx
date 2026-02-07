import { MapPin } from "lucide-react";

const GoogleMapsSection = () => {
  return (
    <section className="yoga-gradient-teal py-6 px-8">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <h2 className="font-heading text-2xl md:text-3xl text-white font-light italic">
          See our Studio in 360° View on Google Maps
        </h2>
        <button className="yoga-btn-outline flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          VIEW IN GOOGLE MAPS
        </button>
      </div>
    </section>
  );
};

export default GoogleMapsSection;
