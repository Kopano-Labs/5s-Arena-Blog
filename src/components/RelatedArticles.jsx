import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const categoryColors = {
  Culture: "#10b981", Legends: "#f59e0b", Skills: "#06b6d4", Tactics: "#8b5cf6",
  Fitness: "#ef4444", Community: "#3b82f6", News: "#34d399", "Women's Game": "#ec4899",
};

export default function RelatedArticles({ posts = [] }) {
  const [startIndex, setStartIndex] = useState(0);

  if (posts.length === 0) return null;

  const visiblePost = posts[startIndex];
  const handlePrev = () => setStartIndex((prev) => (prev === 0 ? posts.length - 1 : prev - 1));
  const handleNext = () => setStartIndex((prev) => (prev === posts.length - 1 ? 0 : prev + 1));

  return (
    <div className="glass-card rounded-2xl p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h4 className="section-heading" style={{ fontSize: "1rem" }}>
          <span style={{ fontFamily: "'Oswald', sans-serif", color: "#f9fafb" }}>Related Articles</span>
        </h4>
        <div className="flex gap-1">
          <motion.button onClick={handlePrev}
            className="w-8 h-8 flex items-center justify-center rounded-lg cursor-pointer"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#9ca3af" }}
            whileHover={{ background: "rgba(34,197,94,0.15)", color: "#22c55e" }}
            whileTap={{ scale: 0.9 }}>
            ←
          </motion.button>
          <motion.button onClick={handleNext}
            className="w-8 h-8 flex items-center justify-center rounded-lg cursor-pointer"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#9ca3af" }}
            whileHover={{ background: "rgba(34,197,94,0.15)", color: "#22c55e" }}
            whileTap={{ scale: 0.9 }}>
            →
          </motion.button>
        </div>
      </div>

      {/* Featured Related Post */}
      <Link to={`/${visiblePost.slug}`} className="group block mb-4">
        <div className="overflow-hidden rounded-xl mb-3" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
          <motion.img
            src={visiblePost.image}
            alt={visiblePost.title}
            className="w-full h-44 object-cover"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.4 }}
            onError={e => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(visiblePost.title.slice(0,2))}&background=16a34a&color=fff&size=400`; }}
          />
        </div>
        {visiblePost.category && (
          <span className="label-tag text-xs px-2 py-0.5 rounded-full text-white inline-block mb-2"
            style={{ background: `${categoryColors[visiblePost.category] || "#22c55e"}44`, color: categoryColors[visiblePost.category] || "#22c55e", border: `1px solid ${categoryColors[visiblePost.category] || "#22c55e"}55` }}>
            {visiblePost.category}
          </span>
        )}
        {visiblePost.video && (
          <span className="ml-2 text-xs px-2 py-0.5 rounded-full inline-flex items-center gap-1"
            style={{ background: "rgba(239,68,68,0.2)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.3)" }}>
            ▶ Video
          </span>
        )}
        <h5 className="font-bold leading-snug transition-colors"
          style={{ fontFamily: "'Oswald', sans-serif", fontSize: "1rem", textTransform: "uppercase", color: "#f9fafb" }}
          onMouseEnter={e => e.target.style.color = "#22c55e"}
          onMouseLeave={e => e.target.style.color = "#f9fafb"}>
          {visiblePost.title}
        </h5>
        <p className="line-clamp-3 mt-2"
          style={{ fontFamily: "'Inter', sans-serif", color: "#9ca3af", fontSize: "0.8rem", lineHeight: 1.5 }}>
          {visiblePost.content?.replace(/<[^>]*>/g, "").slice(0, 140)}...
        </p>
        {visiblePost.tags && (
          <div className="flex flex-wrap gap-1 mt-3">
            {visiblePost.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="text-xs px-2 py-0.5 rounded-full"
                style={{ fontFamily: "'Inter', sans-serif", background: "rgba(255,255,255,0.06)", color: "#6b7280", border: "1px solid rgba(255,255,255,0.08)" }}>
                {tag}
              </span>
            ))}
          </div>
        )}
        {visiblePost.author && (
          <div className="flex items-center gap-2 mt-3">
            <img src={visiblePost.author.image} alt={visiblePost.author.name}
              className="w-6 h-6 rounded-full object-cover"
              style={{ border: "1px solid rgba(255,255,255,0.1)" }}
              onError={e => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(visiblePost.author.name)}&background=16a34a&color=fff`; }}
            />
            <span style={{ fontFamily: "'Inter', sans-serif", color: "#6b7280", fontSize: "0.7rem" }}>{visiblePost.author.name}</span>
          </div>
        )}
      </Link>

      {/* Other Related Posts List */}
      {posts.length > 1 && (
        <div className="space-y-3 pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          {posts.filter((_, i) => i !== startIndex).slice(0, 3).map((p) => (
            <Link key={p.id} to={`/${p.slug}`} className="flex gap-3 group">
              <img src={p.image} alt={p.title}
                className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                style={{ border: "1px solid rgba(255,255,255,0.06)" }}
                onError={e => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(p.title.slice(0,2))}&background=16a34a&color=fff&size=56`; }}
              />
              <div className="min-w-0">
                <p className="text-sm font-medium line-clamp-2 transition-colors"
                  style={{ fontFamily: "'Inter', sans-serif", color: "#d1d5db" }}
                  onMouseEnter={e => e.target.style.color = "#22c55e"}
                  onMouseLeave={e => e.target.style.color = "#d1d5db"}>
                  {p.title}
                </p>
                <p style={{ fontFamily: "'Inter', sans-serif", color: "#6b7280", fontSize: "0.65rem", marginTop: "0.25rem" }}>
                  {p.readingTime} min read
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
