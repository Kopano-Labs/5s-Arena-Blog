import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import api from "@/services/api";
import Sidebar from "@/components/Sidebar";

const fallbackPosts = [
  { id: 1, title: "The Rise of 5-a-Side Football Culture", image: "/posts/Blog1.png", category: "Culture", author: "Jackson Wayne", readingTime: 5 },
  { id: 2, title: "Top 10 Football Legends Who Changed the Game", image: "/posts/blog2.png", category: "Legends", author: "Dent Prov", readingTime: 7 },
  { id: 3, title: "Mastering the Art of the Cross-Over Dribble", image: "/posts/blog3.png", category: "Skills", author: "Halley Watikise", readingTime: 4 },
  { id: 4, title: "Goal Celebrations That Became Iconic", image: "/posts/blog4.png", category: "Culture", author: "Johannes Cobelt", readingTime: 3 },
  { id: 5, title: "Women's Football: Breaking Barriers", image: "/posts/blog5.png", category: "Women's Game", author: "Hell Mandat", readingTime: 6 },
  { id: 6, title: "The Science Behind the Perfect Free Kick", image: "/posts/blog6.png", category: "Tactics", author: "Jackson Wayne", readingTime: 5 },
  { id: 7, title: "Street Football Around the World", image: "/posts/blog7.png", category: "Culture", author: "John Stu", readingTime: 4 },
  { id: 8, title: "Building Team Chemistry on Small Pitches", image: "/posts/blog8.png", category: "5-a-Side", author: "Dent Prov", readingTime: 5 },
  { id: 9, title: "Youth Development: Nurturing Future Stars", image: "/posts/blog9.jpg", category: "Development", author: "Halley Watikise", readingTime: 6 },
  { id: 10, title: "The Psychology of Penalty Kicks", image: "/posts/blog10.jpg", category: "Tactics", author: "Johannes Cobelt", readingTime: 5 },
  { id: 11, title: "Football Fashion: From Pitch to Street", image: "/posts/blog11.jpg", category: "Culture", author: "Hell Mandat", readingTime: 4 },
  { id: 12, title: "How Small-Sided Games Improve Your Touch", image: "/posts/blog12.jpg", category: "5-a-Side", author: "Jackson Wayne", readingTime: 5 },
  { id: 13, title: "The Evolution of Football Tactics", image: "/posts/blog13.jpg", category: "Tactics", author: "Dent Prov", readingTime: 7 },
  { id: 14, title: "Community Football: Building Bonds", image: "/posts/blog14.jpg", category: "Community", author: "John Stu", readingTime: 4 },
  { id: 15, title: "Fitness Tips for Weekend Warriors", image: "/posts/blog15.jpg", category: "Fitness", author: "Halley Watikise", readingTime: 5 },
  { id: 16, title: "The Art of the Perfect Pass", image: "/posts/blog16.jpg", category: "Skills", author: "Jackson Wayne", readingTime: 4 },
  { id: 17, title: "Stadium Atmospheres That Give You Chills", image: "/posts/blog17.jpg", category: "Culture", author: "Johannes Cobelt", readingTime: 6 },
  { id: 18, title: "Coaching Youth: Lessons From the Pros", image: "/posts/blog18.jpg", category: "Development", author: "Dent Prov", readingTime: 5 },
  { id: 19, title: "5-a-Side Tournament Strategies", image: "/posts/blog19.jpg", category: "5-a-Side", author: "Hell Mandat", readingTime: 4 },
  { id: 20, title: "Football and Mental Health", image: "/posts/blog20.jpg", category: "Wellness", author: "John Stu", readingTime: 6 },
];

const categories = ["All", "Culture", "Legends", "Skills", "Tactics", "5-a-Side", "Women's Game", "Development", "Community", "Fitness", "Wellness"];
const POSTS_PER_PAGE = 9;

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function PostListPage() {
  const [searchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const sort = searchParams.get("sort");
  const search = searchParams.get("search") || "";
  const categoryParam = searchParams.get("category");
  const activeCategory = categoryParam || selectedCategory;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const params = { page, limit: POSTS_PER_PAGE };
        if (sort) params.sort = sort;
        if (search) params.search = search;
        if (activeCategory !== "All") params.category = activeCategory;

        const res = await api.get("/posts", { params });
        const data = res.data;
        const postList = data.posts || data;
        if (postList && postList.length > 0) {
          setPosts(postList);
          setTotalPages(data.totalPages || Math.ceil((data.total || postList.length) / POSTS_PER_PAGE));
          return;
        }
      } catch {
        // Fall through to fallback
      }
      // Fallback to hardcoded data
      let filtered = fallbackPosts;
      if (activeCategory !== "All") {
        filtered = filtered.filter((p) => p.category === activeCategory);
      }
      if (search) {
        const q = search.toLowerCase();
        filtered = filtered.filter((p) => p.title.toLowerCase().includes(q));
      }
      setTotalPages(Math.ceil(filtered.length / POSTS_PER_PAGE));
      const start = (page - 1) * POSTS_PER_PAGE;
      setPosts(filtered.slice(start, start + POSTS_PER_PAGE));
    };
    fetchPosts();
  }, [page, sort, search, activeCategory]);

  const getPostLink = (post) => {
    if (post.slug) return `/${post.slug}`;
    return `/${post.title.toLowerCase().replace(/\s+/g, "-")}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 dark:bg-gray-950">
      <h1 className="text-4xl font-bold text-green-900 dark:text-green-400 mb-2">
        {search ? `Search: "${search}"` : sort === "trending" ? "Trending Posts" : sort === "popular" ? "Most Popular" : "All Posts"}
      </h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">Explore stories from the world of football</p>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => { setSelectedCategory(cat); setPage(1); }}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              activeCategory === cat
                ? "bg-green-700 text-white"
                : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-green-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Post Grid */}
        <div className="lg:w-2/3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, index) => (
              <motion.div
                key={post._id || post.id}
                variants={fadeIn}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.4, delay: index * 0.06 }}
              >
                <Link
                  to={getPostLink(post)}
                  className="group bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow hover:shadow-lg transition-shadow block"
                >
                  <div className="overflow-hidden h-44 relative">
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
                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">By {post.author?.name || post.author || post.user?.username}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {posts.length === 0 && (
            <p className="text-center text-gray-400 dark:text-gray-500 py-12">No posts found.</p>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-10">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-5 py-2 rounded-lg bg-green-700 text-white font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-green-600 transition-colors"
              >
                Previous
              </button>
              <span className="text-gray-600 dark:text-gray-400 font-medium">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-5 py-2 rounded-lg bg-green-700 text-white font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-green-600 transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:w-1/3">
          <Sidebar />
        </div>
      </div>
    </div>
  );
}
