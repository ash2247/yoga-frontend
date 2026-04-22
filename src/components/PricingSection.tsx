import { Star } from "lucide-react";

const PricingSection = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-8">
        <h2 className="yoga-section-title text-center mb-16 italic text-foreground">
          Pricing
        </h2>

        <div className="max-w-4xl mx-auto">
          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* Regular Classes */}
            <div className="bg-gray-50 rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105">
              <div className="p-8 text-center">
                <h3 className="font-heading text-2xl text-gray-900 font-light italic mb-4">
                  Class
                </h3>
                <div className="text-6xl font-bold text-yoga-blue mb-2">
                  $15
                </div>
                <p className="text-gray-600 text-lg">/ hour</p>
              </div>
            </div>

            {/* Private/Group/Family Sessions */}
            <div className="bg-gray-50 rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 ring-4 ring-yoga-pink ring-opacity-40">
              <div className="p-8 text-center">
                <h3 className="font-heading text-2xl text-gray-900 font-light italic mb-4">
                  Private / Group / Family
                </h3>
                <div className="text-6xl font-bold text-yoga-pink mb-2">
                  $65
                </div>
                <p className="text-gray-600 text-lg">/ hour</p>
              </div>
            </div>
          </div>

          {/* First Class Free & Prior Booking */}
          <div className="bg-gradient-to-r from-yoga-pink to-yoga-blue rounded-2xl shadow-lg p-10 text-white text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
              <Star className="w-8 h-8 text-yellow-300" />
            </div>
            <h2 className="font-heading text-4xl font-light italic mb-4">
              FIRST CLASS FREE!
            </h2>
            <p className="text-xl font-semibold tracking-wide">
              Prior Booking Essential
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
