import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import api from "@/services/api";
import Newsletter from "@/components/Newsletter";

const fallbackFeatured = [
  { id: 1, title: "The Rise of 5-a-Side Football Culture", image: "/posts/Blog1.png", author: "Jackson Wayne", authorImg: "/authors/Jackson Wayne.png", category: "Culture", readingTime: 5 },
  { id: 2, title: "Top 10 Football Legends Who Changed the Game", image: "/posts/blog2.png", author: "Dent Prov", authorImg: "/authors/Dent Prov.png", category: "Legends", readingTime: 7 },
  { id: 3, title: "Mastering the Art of the Cross-Over Dribble", image: "/posts/blog3.png", author: "Halley Watikise", authorImg: "/authors/Halley Watikise.png", category: "Skills", readingTime: 4 },
];

const fallbackRecent = [
  { id: 4, title: "Goal Celebrations That Became Iconic", image: "/posts/blog4.png", category: "Culture", readingTime: 3 },
  { id: 5, title: "Women's Football: Breaking Barriers", image: "/posts/blog5.png", category: "Women's Game", readingTime: 6 },
  { id: 6, title: "The Science Behind the Perfect Free Kick", image: "/posts/blog6.png", category: "Tactics", readingTime: 5 },
  { id: 7, title: "Street Football Around the World", image: "/posts/blog7.png", category: "Culture", readingTime: 4 },
  { id: 8, title: "Building Team Chemistry on Small Pitches", image: "/posts/blog8.png", category: "5-a-Side", readingTime: 5 },
  { id: 9, title: "Youth Development: Nurturing Future Stars", image: "/posts/blog9.jpg", category: "Development", readingTime: 6 },
];

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

export default function Homepage() {
  const [featuredPosts, setFeaturedPosts] = useState(fallbackFeatured);
  const [recentPosts, setRecentPosts] = useState(fallbackRecent);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [featuredRes, recentRes] = await Promise.all([
          api.get("/posts/featured"),
          api.get("/posts?sort=recent&limit=6"),
        ]);
        if (featuredRes.data && featuredRes.data.length > 0) {
          setFeaturedPosts(featuredRes.data);
        }
        const recentData = recentRes.data.posts || recentRes.data;
        if (recentData && recentData.length > 0) {
          setRecentPosts(recentData);
        }
      } catch {
        // Keep fallback data
      }
    };
    fetchData();
  }, []);

  const getPostLink = (post) => {
    if (post.slug) return `/${post.slug}`;
    return `/${post.title.toLowerCase().replace(/\s+/g, "-")}`;
  };

  return (
    <div className="dark:bg-gray-950">
      {/* HERO SECTION */}
      <section
        className="relative h-[70vh] flex items-center justify-center text-white bg-cover bg-center"
        style={{ backgroundImage: "url('/backgrounds/football-legends-background-1.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/60" />
        <motion.div
          className="relative z-10 text-center px-4 max-w-3xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-4">5s Arena Blog</h1>
          <p className="text-lg md:text-xl text-gray-200 mb-8">
            Football culture, stories, legends, and the beautiful game.
          </p>
          <Link
            to="/posts"
            className="inline-block px-8 py-3 bg-green-600 hover:bg-green-500 rounded-full font-semibold transition-colors"
          >
            Explore Posts
          </Link>
        </motion.div>
      </section>

      {/* FEATURED POSTS */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <motion.h2
          className="text-3xl font-bold text-green-900 dark:text-green-400 mb-8"
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Featured Posts
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredPosts.map((post, index) => (
            <motion.div
              key={post._id || post.id}
              variants={fadeIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link
                to={getPostLink(post)}
                className="group bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow block h-full"
              >
                <div className="overflow-hidden h-48 relative">
                  <img
                    src={post.coverImage || post.img || post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {(post.readingTime || post.readingTime === 0) && (
                    <span className="absolute top-2 right-2 bg-green-700 text-white text-xs px-2 py-1 rounded-full">
                      {post.readingTime} min read
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <span className="text-xs font-semibold text-green-600 dark:text-green-400 uppercase">{post.category}</span>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-1 group-hover:text-green-700 dark:group-hover:text-green-400 transition-colors">
                    {post.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-3">
                    <img
                      src={post.author?.image || post.authorImg || post.user?.img || "/authors/Jackson Wayne.png"}
                      alt={post.author?.name || post.author || post.user?.username || "Author"}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <span className="text-sm text-gray-500 dark:text-gray-400">{post.author?.name || post.author || post.user?.username}</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* VIDEO HIGHLIGHT */}
      <section
        className="py-16 bg-cover bg-center relative"
        style={{ backgroundImage: "url('/backgrounds/football-legends-background-3.jpg')" }}
      >
        <div className="absolute inset-0 bg-green-900/80" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Watch the Action</h2>
          <p className="text-green-200 mb-8">Highlights, skills, and the energy of the game.</p>
          <video
            controls
            className="w-full rounded-xl shadow-2xl"
            poster="/backgrounds/football-legends-background-5.jpg"
          >
            <source src="/video-posts/goooooal.mp4" type="video/mp4" />
          </video>
        </div>
      </section>

      {/* RECENT POSTS */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-8">
          <motion.h2
            className="text-3xl font-bold text-green-900 dark:text-green-400"
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Recent Posts
          </motion.h2>
          <Link to="/posts" className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 font-semibold">
            View All &rarr;
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentPosts.map((post, index) => (
            <motion.div
              key={post._id || post.id}
              variants={fadeIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
            >
              <Link
                to={getPostLink(post)}
                className="group bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow hover:shadow-lg transition-shadow block"
              >
                <div className="overflow-hidden h-40 relative">
                  <img
                    src={post.coverImage || post.img || post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {(post.readingTime || post.readingTime === 0) && (
                    <span className="absolute top-2 right-2 bg-green-700 text-white text-xs px-2 py-1 rounded-full">
                      {post.readingTime} min read
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <span className="text-xs font-semibold text-green-600 dark:text-green-400 uppercase">{post.category}</span>
                  <h3 className="text-md font-bold text-gray-900 dark:text-white mt-1 group-hover:text-green-700 dark:group-hover:text-green-400 transition-colors">
                    {post.title}
                  </h3>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* NEWSLETTER */}
      <Newsletter />
    </div>
  );
}
