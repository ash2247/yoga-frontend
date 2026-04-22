import { MapPin, Maximize2, ExternalLink } from "lucide-react";
import { useState } from "react";

const GoogleMapsSection = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Studio coordinates from the provided URL
  const studioLocation = {
    lat: -33.9614583,
    lng: 151.2460414,
    name: "The Light of Yoga",
    fullMapUrl: "https://www.google.com/maps/place/The+Light+of+Yoga/@-33.9614583,151.2460414,17z/data=!3m1!4b1!4m6!3m5!1s0x6b12b3e86dbe1187:0xafdcc16682acdda!8m2!3d-33.9614583!4d151.2460414!16s%2Fg%2F1thq9_zm?entry=ttu&g_ep=EgoyMDI2MDQxNS4wIKXMDSoASAFQAw%3D%3D"
  };

  const embedMapUrl = `https://www.google.com/maps/embed/v1/place?key=&q=${encodeURIComponent(studioLocation.name)}&center=${studioLocation.lat},${studioLocation.lng}&zoom=16&maptype=roadmap`;

  return (
    <>
      <section className="yoga-gradient-teal py-6 px-8">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <h2 className="font-heading text-2xl md:text-3xl text-white font-light italic">
            Find Our Studio Location
          </h2>
          <div className="flex gap-3">
            <button
              onClick={() => setIsExpanded(true)}
              className="yoga-btn-outline flex items-center gap-2"
            >
              <Maximize2 className="w-4 h-4" />
              VIEW MAP
            </button>
            <a
              href={studioLocation.fullMapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="yoga-btn-outline flex items-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              GOOGLE MAPS
            </a>
          </div>
        </div>
      </section>

      {/* Embedded Map Preview */}
      <section className="py-8 px-8 bg-gray-50">
        <div className="container mx-auto">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-4 border-b">
              <h3 className="font-heading text-xl text-gray-800 font-light italic">
                Studio Location
              </h3>
              <p className="text-gray-600 mt-1">
                <MapPin className="inline w-4 h-4 mr-1" />
                The Light of Yoga, Sydney, Australia
              </p>
            </div>
            <div className="relative h-64 md:h-96">
              <iframe
                src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3305.733!2d151.2460414!3d-33.9614583!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b12b3e86dbe1187:0xafdcc16682acdda!2sThe+Light+of+Yoga!5e0!3m2!1sen!2sau!4v1`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0"
              />
            </div>
            <div className="p-4 bg-gray-50 flex justify-center">
              <button
                onClick={() => setIsExpanded(true)}
                className="yoga-btn-outline flex items-center gap-2"
              >
                <Maximize2 className="w-4 h-4" />
                VIEW FULL MAP
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Full Screen Map Modal */}
      {isExpanded && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-6xl h-full max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-heading text-xl text-gray-800 font-light italic">
                Studio Location Map
              </h3>
              <button
                onClick={() => setIsExpanded(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
              >
                ×
              </button>
            </div>
            <div className="flex-1 p-4">
              <iframe
                src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3305.733!2d151.2460414!3d-33.9614583!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b12b3e86dbe1187:0xafdcc16682acdda!2sThe+Light+of+Yoga!5e0!3m2!1sen!2sau!4v1`}
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: '500px' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="rounded"
              />
            </div>
            <div className="p-4 border-t flex justify-between">
              <button
                onClick={() => setIsExpanded(false)}
                className="yoga-btn-outline"
              >
                CLOSE
              </button>
              <a
                href={studioLocation.fullMapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="yoga-btn-outline flex items-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                OPEN IN GOOGLE MAPS
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GoogleMapsSection;
