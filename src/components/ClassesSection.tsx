import yogaClasses from "@/assets/yoga-classes.jpg";
import hathaYoga from "@/assets/hatha-yoga.jpg";
import ashtangaYoga from "@/assets/ashtanga-yoga.jpg";
import yogaStretch from "@/assets/yoga-stretch.jpg";
import meditationClass from "@/assets/meditation-class.jpg";
import sunriseMeditation from "@/assets/sunrise-meditation.jpg";

const classes = [
  { title: "Yoga Classes", image: yogaClasses },
  { title: "Hatha Yoga", image: hathaYoga },
  { title: "Ashtanga Yoga", image: ashtangaYoga },
  { title: "Flexibility", image: yogaStretch },
  { title: "Meditation", image: meditationClass },
  { title: "Sunrise Yoga", image: sunriseMeditation },
];

const ClassesSection = () => {
  return (
    <section id="studio" className="py-20 bg-yoga-light-gray">
      <div className="container mx-auto px-8">
        <h2 className="yoga-section-title text-center mb-16 text-foreground">
          Our Classes
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {classes.map((cls, index) => (
            <div key={index} className="group cursor-pointer">
              <div className="overflow-hidden rounded-sm mb-4">
                <img
                  src={cls.image}
                  alt={cls.title}
                  className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <h3 className="font-heading text-xl text-center text-foreground font-light">
                {cls.title}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ClassesSection;
