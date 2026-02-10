import yogaBlog from "@/assets/yoga-blog.jpg";

const blogs = [
  {
    title: "SHEERSASANA – the king of all yoga postures",
    excerpt: "SHEERSASANA – HEADSTAND THE KING OF ALL YOGA POSTURES Harmonising with the force of gravity – upside down. Excellent posture...",
    hasImage: false,
  },
  {
    title: "The Light of Yoga on Channel 7",
    excerpt: "This is the video of Raj demonstrating yoga on Morning Show",
    hasImage: true,
    isVideo: true,
  },
  {
    title: "Your Quest for Self-Discovery Yoga",
    excerpt: "Five steps towards your journey to self-discovery are:",
    hasImage: true,
    image: yogaBlog,
  },
];

import { useContent } from "@/context/ContentContext";

const BlogsSection = () => {
  const content = useContent();
  const blogsData = content?.blogs || blogs;

  return (
    <section id="blog" className="py-20 bg-yoga-light-gray">
      <div className="container mx-auto px-8">
        <h2 className="yoga-section-title text-center mb-16 text-foreground">
          Blogs
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {blogsData.map((blog, index) => (
            <div
              key={index}
              className={`bg-white rounded-sm overflow-hidden shadow-sm hover:shadow-md transition-shadow ${!blog.hasImage ? "border-l-4 border-yoga-teal p-6" : ""
                }`}
            >
              {blog.hasImage && blog.image && (
                <div className="aspect-video overflow-hidden">
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              {blog.hasImage && blog.isVideo && (
                <div className="aspect-video bg-yoga-dark relative flex items-center justify-center">
                  <div className="w-16 h-12 bg-destructive rounded-lg flex items-center justify-center">
                    <div className="w-0 h-0 border-l-8 border-l-white border-y-4 border-y-transparent ml-1" />
                  </div>
                </div>
              )}
              <div className={blog.hasImage ? "p-6" : ""}>
                <h3 className="font-heading text-lg text-yoga-teal mb-3 leading-tight">
                  {blog.title}
                </h3>
                <p className="text-muted-foreground font-body text-sm mb-4 leading-relaxed">
                  {blog.excerpt}
                </p>
                <a
                  href={`/blog/${blog.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                  className="text-foreground font-body text-sm font-semibold tracking-wider hover:text-yoga-pink transition-colors"
                >
                  READ MORE
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogsSection;
