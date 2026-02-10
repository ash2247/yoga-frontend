import { useContent } from "@/context/ContentContext";

const VideoSection = () => {
  const content = useContent();
  const videoSrc = content?.video?.src || "https://www.youtube.com/embed/qNBgzB6plTs?start=15";
  const videoTitle = content?.video?.title || "The Light of Yoga featured on Morning Sunrise on Channel 7 with Kochie";

  return (
    <section id="videos" className="py-20 bg-yoga-light-gray">
      <div className="container mx-auto px-8">
        <h2 className="font-heading text-2xl md:text-3xl text-yoga-pink text-center font-medium mb-12">
          {videoTitle}
        </h2>

        <div className="max-w-4xl mx-auto">
          <div className="relative aspect-video bg-black rounded-lg overflow-hidden shadow-lg">
            {/* YouTube Embed Placeholder */}
            <iframe
              className="absolute inset-0 w-full h-full"
              src={videoSrc}
              title={videoTitle}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoSection;
