import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "@/services/api";

const authorBios = {
  "Jackson Wayne": "Former semi-pro midfielder turned football journalist. Jackson brings tactical insight and raw passion to every piece he writes.",
  "Dent Prov": "A coaching veteran with 15 years on the touchline. Dent breaks down the game from a manager's perspective.",
  "Halley Watikise": "Youth development specialist and grassroots football advocate. Halley covers the next generation of talent.",
  "Johannes Cobelt": "Sports psychologist and culture writer. Johannes explores the mind behind the game.",
  "Hell Mandat": "Women's football champion and equality advocate. Hell covers the rapid growth of women's football worldwide.",
  "John Stu": "Community football organizer and mental health advocate. John writes about football's power to transform lives.",
};

const authorImages = {
  "Jackson Wayne": "/authors/Jackson Wayne.png",
  "Dent Prov": "/authors/Dent Prov.png",
  "Halley Watikise": "/authors/Halley Watikise.png",
  "Johannes Cobelt": "/authors/Johannes-Cobelt.png",
  "Hell Mandat": "/authors/Hell Mandat.png",
  "John Stu": "/authors/John-Stu.png",
};

const categories = ["Culture", "Legends", "Skills", "Tactics", "5-a-Side", "Women's Game", "Development", "Community", "Fitness", "Wellness"];

export default function Sidebar() {
  const [popularPosts, setPopularPosts] = useState([]);
  const [sidebarBg] = useState(() => {
    const num = Math.floor(Math.random() * 5) + 1;
    return `/sidebar-backgrounds/sidebar-background-${num}.jpg`;
  });
  const [spotlightAuthor] = useState(() => {
    const names = Object.keys(authorBios);
    return names[Math.floor(Math.random() * names.length)];
  });

  useEffect(() => {
    const fetchPopular = async () => {
      try {
        const res = await api.get("/posts?sort=popular&limit=5");
        setPopularPosts(res.data.posts || res.data || []);
      } catch {
        setPopularPosts([]);
      }
    };
    fetchPopular();
  }, []);

  return (
    <aside className="space-y-8">
      {/* Sidebar Header Image */}
      <div
        className="h-40 rounded-xl bg-cover bg-center relative overflow-hidden"
        style={{ backgroundImage: `url('${sidebarBg}')` }}
      >
        <div className="absolute inset-0 bg-green-900/60 flex items-center justify-center">
          <h3 className="text-white text-xl font-bold">5s Arena</h3>
        </div>
      </div>

      {/* Popular Posts */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow">
        <h4 className="text-lg font-bold text-green-900 dark:text-green-400 mb-4">Popular Posts</h4>
        {popularPosts.length > 0 ? (
          <ul className="space-y-3">
            {popularPosts.slice(0, 5).map((post) => (
              <li key={post._id || post.id}>
                <Link
                  to={`/${post.slug || post.title?.toLowerCase().replace(/\s+/g, "-")}`}
                  className="text-sm text-gray-700 dark:text-gray-300 hover:text-green-700 dark:hover:text-green-400 transition-colors font-medium"
                >
                  {post.title}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-400 dark:text-gray-500">No popular posts yet.</p>
        )}
      </div>

      {/* Categories */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow">
        <h4 className="text-lg font-bold text-green-900 dark:text-green-400 mb-4">Categories</h4>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <Link
              key={cat}
              to={`/posts?category=${encodeURIComponent(cat)}`}
              className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-300 dark:hover:bg-green-800 transition-colors"
            >
              {cat}
            </Link>
          ))}
        </div>
      </div>

      {/* Author Spotlight */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow text-center">
        <h4 className="text-lg font-bold text-green-900 dark:text-green-400 mb-4">Author Spotlight</h4>
        <img
          src={authorImages[spotlightAuthor]}
          alt={spotlightAuthor}
          className="w-20 h-20 rounded-full mx-auto mb-3 object-cover shadow-md"
        />
        <h5 className="font-semibold text-gray-900 dark:text-white">{spotlightAuthor}</h5>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          {authorBios[spotlightAuthor]}
        </p>
      </div>
    </aside>
  );
}
