import { MapPin } from "lucide-react";

const GoogleMapsSection = () => {
  return (
    <section className="yoga-gradient-teal py-6 px-8">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <h2 className="font-heading text-2xl md:text-3xl text-white font-light italic">
          See our Studio on Google Maps
        </h2>
        <a
          href="https://www.google.com.pk/search?q=The+Light+of+Yoga&ludocid=792013506096057818&lsig=AB86z5VILqtoosvSNthEYPR9VohH#lkt=LocalPoiPhotos"
          target="_blank"
          rel="noopener noreferrer"
          className="yoga-btn-outline flex items-center gap-2"
        >
          <MapPin className="w-4 h-4" />
          VIEW IN GOOGLE MAPS
        </a>
      </div>
    </section>
  );
};

export default GoogleMapsSection;
