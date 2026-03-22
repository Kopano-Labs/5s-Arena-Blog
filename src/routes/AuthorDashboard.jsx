import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

// ── Author tiers ──────────────────────────────────────────────
const TIERS = [
  { name: "Contributor",    minPosts: 0,  color: "#CD7F32", gradient: "linear-gradient(135deg,#78350f,#b45309)", label: "Bronze" },
  { name: "Writer",         minPosts: 5,  color: "#9ca3af", gradient: "linear-gradient(135deg,#374151,#9ca3af)", label: "Silver" },
  { name: "Senior Writer",  minPosts: 15, color: "#f59e0b", gradient: "linear-gradient(135deg,#78350f,#fbbf24)", label: "Gold"   },
  { name: "Editor",         minPosts: 30, color: "#22d3ee", gradient: "linear-gradient(135deg,#0e7490,#22d3ee)", label: "Diamond"},
];

function getTier(postCount) {
  return [...TIERS].reverse().find(t => postCount >= t.minPosts) || TIERS[0];
}

// ── Rarity achievement cards ──────────────────────────────────
const ACHIEVEMENTS = [
  { id: "first_post",    name: "First Post",    desc: "Published your first article",           icon: "✍️",  rarity: "common",    condition: (p) => p >= 1 },
  { id: "five_posts",    name: "On a Roll",     desc: "Published 5 articles",                   icon: "🔥",  rarity: "uncommon",  condition: (p) => p >= 5 },
  { id: "ten_posts",     name: "Veteran",       desc: "Published 10 articles",                  icon: "⭐",  rarity: "rare",      condition: (p) => p >= 10 },
  { id: "twenty_posts",  name: "Elite Writer",  desc: "Published 20 articles",                  icon: "💎",  rarity: "epic",      condition: (p) => p >= 20 },
  { id: "viral",         name: "Viral Hit",     desc: "A post with 1000+ views",               icon: "🚀",  rarity: "legendary", condition: (_, v) => v >= 1000 },
];

const RARITY_COLORS = {
  common:    { border: "#9ca3af", glow: "rgba(156,163,175,0.3)", label: "COMMON" },
  uncommon:  { border: "#22c55e", glow: "rgba(34,197,94,0.3)",   label: "UNCOMMON" },
  rare:      { border: "#3b82f6", glow: "rgba(59,130,246,0.3)",  label: "RARE" },
  epic:      { border: "#a855f7", glow: "rgba(168,85,247,0.3)",  label: "EPIC" },
  legendary: { border: "#f59e0b", glow: "rgba(245,158,11,0.3)",  label: "LEGENDARY" },
};

// ── useCounter hook ───────────────────────────────────────────
function useCounter(target, duration = 1200) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target, duration]);
  return [count, ref];
}

// ── Stat card ─────────────────────────────────────────────────
function StatCard({ icon, label, value, color, delay = 0 }) {
  const [count, ref] = useCounter(value);
  return (
    <motion.div ref={ref}
      className="glass-card rounded-2xl p-5 text-center"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ type: "spring", stiffness: 200, damping: 22, delay }}
      whileHover={{ y: -4, boxShadow: `0 12px 32px ${color}30` }}>
      <div className="text-3xl mb-2">{icon}</div>
      <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "2.2rem", color, lineHeight: 1 }}>{count}</div>
      <div style={{ fontFamily: "'Montserrat',sans-serif", fontSize: "0.7rem", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.1em", marginTop: "0.25rem" }}>{label}</div>
    </motion.div>
  );
}

// ── Delete confirmation modal ─────────────────────────────────
function DeleteModal({ post, onConfirm, onCancel }) {
  return (
    <motion.div className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: "rgba(0,0,0,0.8)" }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div className="glass-card rounded-2xl p-8 max-w-md w-full text-center"
        initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 24 }}>
        <div className="text-4xl mb-4">⚠️</div>
        <h3 style={{ fontFamily: "'Oswald',sans-serif", fontSize: "1.4rem", color: "#f87171", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.75rem" }}>
          Permanent Delete
        </h3>
        <p style={{ fontFamily: "'Inter',sans-serif", color: "#9ca3af", fontSize: "0.9rem", lineHeight: 1.6, marginBottom: "0.5rem" }}>
          This action <strong style={{ color: "#f87171" }}>cannot be undone</strong>. The post &ldquo;{post.title}&rdquo; will be removed from the system forever.
        </p>
        <div className="flex gap-3 mt-6">
          <motion.button onClick={onCancel}
            className="flex-1 py-3 rounded-xl font-semibold"
            style={{ fontFamily: "'Montserrat',sans-serif", background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.4)", color: "#22c55e" }}
            whileHover={{ background: "rgba(34,197,94,0.25)" }}>
            Cancel
          </motion.button>
          <motion.button onClick={onConfirm}
            className="flex-1 py-3 rounded-xl font-semibold"
            style={{ fontFamily: "'Montserrat',sans-serif", background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.4)", color: "#f87171" }}
            whileHover={{ background: "rgba(239,68,68,0.25)" }}>
            Delete Forever
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Achievement card ──────────────────────────────────────────
function AchievementCard({ achievement, unlocked, delay = 0 }) {
  const rarity = RARITY_COLORS[achievement.rarity];
  return (
    <motion.div
      className="rounded-2xl p-5 text-center relative overflow-hidden"
      style={{
        background: unlocked ? `rgba(0,0,0,0.6)` : "rgba(255,255,255,0.03)",
        border: `1px solid ${unlocked ? rarity.border : "#374151"}`,
        boxShadow: unlocked ? `0 0 20px ${rarity.glow}` : "none",
        opacity: unlocked ? 1 : 0.5,
        filter: unlocked ? "none" : "grayscale(100%)",
      }}
      initial={{ opacity: 0, rotateX: -80 }}
      whileInView={{ opacity: unlocked ? 1 : 0.5, rotateX: 0 }}
      viewport={{ once: true }}
      transition={{ type: "spring", stiffness: 180, damping: 20, delay }}>
      <div className="text-3xl mb-2">{unlocked ? achievement.icon : "🔒"}</div>
      <div style={{ fontFamily: "'Montserrat',sans-serif", fontSize: "0.6rem", color: unlocked ? rarity.border : "#4b5563", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: "0.25rem" }}>
        {rarity.label}
      </div>
      <div style={{ fontFamily: "'Oswald',sans-serif", fontSize: "0.95rem", color: unlocked ? "#f9fafb" : "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.25rem" }}>
        {achievement.name}
      </div>
      <div style={{ fontFamily: "'Inter',sans-serif", fontSize: "0.75rem", color: "#9ca3af", lineHeight: 1.4 }}>
        {achievement.desc}
      </div>
    </motion.div>
  );
}

// ── Main component ────────────────────────────────────────────
export default function AuthorDashboard() {
  const { user, isAuthor } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("posts");
  const [posts, setPosts] = useState([]);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    document.title = "Author Dashboard — 5s Arena Blog";
    window.scrollTo(0, 0);
    if (!isAuthor) { navigate("/profile"); return; }

    // Load author's posts from localStorage
    const all = JSON.parse(localStorage.getItem("5s_managed_posts") || "[]");
    const mine = all.filter(p => p.authorId === user?.id || p.authorEmail === user?.email);
    setPosts(mine);
  }, [isAuthor, navigate, user]);

  if (!isAuthor) return null;

  const postCount = posts.length;
  const totalViews = posts.reduce((sum, p) => sum + (p.views || 0), 0);
  const totalComments = posts.reduce((sum, p) => sum + (p.commentCount || 0), 0);
  const tier = getTier(postCount);

  const handleDelete = (post) => setDeleteTarget(post);
  const confirmDelete = () => {
    if (!deleteTarget) return;
    const all = JSON.parse(localStorage.getItem("5s_managed_posts") || "[]");
    const filtered = all.filter(p => p.id !== deleteTarget.id);
    localStorage.setItem("5s_managed_posts", JSON.stringify(filtered));
    const userPosts = JSON.parse(localStorage.getItem("5s_user_posts") || "[]");
    localStorage.setItem("5s_user_posts", JSON.stringify(userPosts.filter(p => p.id !== deleteTarget.id)));
    setPosts(prev => prev.filter(p => p.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  const TABS = [
    { id: "posts",   label: "My Posts",       icon: "📄" },
    { id: "write",   label: "Write",           icon: "✍️" },
    { id: "rewards", label: "Author Rewards",  icon: "🏅" },
  ];

  return (
    <div style={{ background: "var(--color-bg)", minHeight: "100vh" }}>
      {/* Delete modal */}
      <AnimatePresence>
        {deleteTarget && (
          <DeleteModal post={deleteTarget} onConfirm={confirmDelete} onCancel={() => setDeleteTarget(null)} />
        )}
      </AnimatePresence>

      {/* ── Header ── */}
      <div className="relative overflow-hidden py-12"
        style={{ background: "linear-gradient(135deg,#052e16 0%,#0d1117 60%,#111827 100%)", borderBottom: "1px solid rgba(34,197,94,0.15)" }}>
        <div className="absolute inset-0 pointer-events-none opacity-10"
          style={{ backgroundImage: `repeating-linear-gradient(0deg,transparent,transparent 40px,rgba(34,197,94,0.3) 40px,rgba(34,197,94,0.3) 41px)` }} />
        <div className="max-w-5xl mx-auto px-6 relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6">
          {/* Avatar */}
          <motion.div
            className="w-20 h-20 rounded-full overflow-hidden flex-shrink-0"
            style={{ border: `3px solid ${tier.color}`, boxShadow: `0 0 24px ${tier.color}60` }}
            initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200 }}>
            <img src={user?.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "Author")}&background=16a34a&color=fff`}
              alt={user?.name}
              className="w-full h-full object-cover"
              onError={e => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "Author")}&background=16a34a&color=fff`; }} />
          </motion.div>

          {/* Info */}
          <div className="flex-1">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
              <div className="flex items-center gap-3 flex-wrap mb-1">
                <h1 style={{ fontFamily: "'Oswald',sans-serif", fontSize: "1.8rem", color: "#f9fafb", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  {user?.name}
                </h1>
                <span className="text-xs font-bold px-3 py-1 rounded-full"
                  style={{ fontFamily: "'Montserrat',sans-serif", background: tier.gradient, color: "#fff", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                  {tier.name}
                </span>
              </div>
              <p style={{ fontFamily: "'Inter',sans-serif", color: "#9ca3af", fontSize: "0.875rem" }}>
                Author Dashboard · {postCount} {postCount === 1 ? "Post" : "Posts"} Published
              </p>

              {/* Tier progress bar */}
              <div className="mt-3 max-w-xs">
                <div className="flex justify-between mb-1">
                  <span style={{ fontFamily: "'Montserrat',sans-serif", fontSize: "0.65rem", color: "#9ca3af", textTransform: "uppercase" }}>
                    {tier.name} → {TIERS[Math.min(TIERS.indexOf(tier) + 1, TIERS.length - 1)].name}
                  </span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.1)" }}>
                  <motion.div className="h-full rounded-full"
                    style={{ background: tier.gradient }}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((postCount / (TIERS[Math.min(TIERS.indexOf(tier) + 1, TIERS.length - 1)].minPosts || 1)) * 100, 100)}%` }}
                    transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }} />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="grid grid-cols-3 gap-4 mb-8">
          <StatCard icon="📝" label="Articles Published" value={postCount}   color="#22c55e" delay={0} />
          <StatCard icon="👁️"  label="Total Views"        value={totalViews}  color="#06b6d4" delay={0.07} />
          <StatCard icon="💬" label="Comments Received"  value={totalComments} color="#a855f7" delay={0.14} />
        </div>

        {/* ── Tabs ── */}
        <div className="flex gap-2 mb-8 border-b" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className="px-5 py-3 text-sm font-semibold transition-all relative"
              style={{
                fontFamily: "'Montserrat',sans-serif",
                color: activeTab === tab.id ? "#22c55e" : "#9ca3af",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}>
              <span className="mr-1.5">{tab.icon}</span>{tab.label}
              {activeTab === tab.id && (
                <motion.div layoutId="tabUnderline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                  style={{ background: "#22c55e" }} />
              )}
            </button>
          ))}
        </div>

        {/* ── Tab content ── */}
        <AnimatePresence mode="wait">

          {/* MY POSTS TAB */}
          {activeTab === "posts" && (
            <motion.div key="posts"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              transition={{ type: "spring", stiffness: 200, damping: 22 }}>
              {posts.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-5xl mb-4">📭</div>
                  <h3 style={{ fontFamily: "'Oswald',sans-serif", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.5rem" }}>
                    No Posts Yet
                  </h3>
                  <p style={{ fontFamily: "'Inter',sans-serif", color: "#4b5563", fontSize: "0.9rem" }}>
                    You haven&apos;t published any posts yet.
                  </p>
                  <Link to="/write">
                    <motion.button className="btn-primary mt-6 px-6 py-3 rounded-xl font-semibold"
                      style={{ fontFamily: "'Montserrat',sans-serif" }}
                      whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}>
                      Write Your First Post →
                    </motion.button>
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {posts.map((post, i) => (
                    <motion.div key={post.id}
                      className="glass-card rounded-xl p-5 flex items-center gap-4"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ type: "spring", stiffness: 200, damping: 22, delay: i * 0.07 }}
                      whileHover={{ x: 4 }}>
                      {post.image && (
                        <img src={post.image} alt={post.title}
                          className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                          onError={e => { e.target.style.display = "none"; }} />
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 style={{ fontFamily: "'Oswald',sans-serif", color: "#f9fafb", fontSize: "1rem", textTransform: "uppercase", letterSpacing: "0.04em" }}
                          className="line-clamp-1">
                          {post.title}
                        </h4>
                        <p style={{ fontFamily: "'Inter',sans-serif", color: "#6b7280", fontSize: "0.8rem", marginTop: "0.25rem" }}>
                          {post.category} · {post.views || 0} views · {post.commentCount || 0} comments
                        </p>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <Link to={`/write?edit=${post.slug}`}>
                          <motion.button className="px-4 py-2 rounded-lg text-xs font-semibold"
                            style={{ fontFamily: "'Montserrat',sans-serif", background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.3)", color: "#22c55e" }}
                            whileHover={{ background: "rgba(34,197,94,0.25)" }}>
                            Edit
                          </motion.button>
                        </Link>
                        <motion.button onClick={() => handleDelete(post)}
                          className="px-4 py-2 rounded-lg text-xs font-semibold"
                          style={{ fontFamily: "'Montserrat',sans-serif", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", color: "#f87171" }}
                          whileHover={{ background: "rgba(239,68,68,0.2)" }}>
                          Delete
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* WRITE TAB */}
          {activeTab === "write" && (
            <motion.div key="write"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              transition={{ type: "spring", stiffness: 200, damping: 22 }}
              className="text-center py-16">
              <motion.div className="text-6xl mb-6 inline-block"
                animate={{ rotate: [-5, 5, -3, 3, 0] }}
                transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }}>
                ✍️
              </motion.div>
              <h3 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "3rem", color: "#f9fafb", letterSpacing: "0.05em", marginBottom: "0.5rem" }}>
                Create New Post
              </h3>
              <p className="mb-8 max-w-md mx-auto"
                style={{ fontFamily: "'Inter',sans-serif", color: "#9ca3af", lineHeight: 1.6 }}>
                Share your football insights, tactics, stories, and opinions with the 5s Arena community.
              </p>
              <Link to="/write">
                <motion.button className="btn-primary px-10 py-4 rounded-2xl font-bold text-lg"
                  style={{ fontFamily: "'Montserrat',sans-serif" }}
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}>
                  Open Writer →
                </motion.button>
              </Link>
              <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto text-left">
                {[
                  { icon: "🎯", title: "Pick a Category", desc: "Culture, Tactics, Legends, Skills, Fitness, Community" },
                  { icon: "📸", title: "Add Media", desc: "Upload images or embed video links to your post" },
                  { icon: "🌍", title: "Publish & Share", desc: "Your article goes live immediately for all readers" },
                ].map(({ icon, title, desc }) => (
                  <div key={title} className="glass-card rounded-xl p-4">
                    <div className="text-2xl mb-2">{icon}</div>
                    <div style={{ fontFamily: "'Oswald',sans-serif", color: "#22c55e", fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.25rem" }}>
                      {title}
                    </div>
                    <div style={{ fontFamily: "'Inter',sans-serif", color: "#9ca3af", fontSize: "0.8rem" }}>{desc}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* AUTHOR REWARDS TAB */}
          {activeTab === "rewards" && (
            <motion.div key="rewards"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              transition={{ type: "spring", stiffness: 200, damping: 22 }}>

              {/* Tier display */}
              <motion.div className="rounded-2xl p-8 mb-8 text-center relative overflow-hidden"
                style={{ background: tier.gradient, boxShadow: `0 0 40px ${tier.color}40` }}>
                <div className="absolute inset-0 pointer-events-none opacity-20"
                  style={{ backgroundImage: "radial-gradient(circle at 30% 50%,rgba(255,255,255,0.15) 0%,transparent 60%),radial-gradient(circle at 70% 50%,rgba(255,255,255,0.08) 0%,transparent 60%)" }} />
                <div className="relative z-10">
                  <div className="text-4xl mb-2">🏅</div>
                  <h3 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "2.5rem", color: "#fff", letterSpacing: "0.05em" }}>
                    {tier.name}
                  </h3>
                  <p style={{ fontFamily: "'Inter',sans-serif", color: "rgba(255,255,255,0.75)", fontSize: "0.9rem" }}>
                    {tier.label} Tier · {postCount} articles published
                  </p>
                  <div className="mt-4 flex justify-center gap-6">
                    {TIERS.map((t) => (
                      <div key={t.name} className="text-center opacity-80">
                        <div className="w-8 h-8 rounded-full mx-auto mb-1 flex items-center justify-center text-xs"
                          style={{ background: postCount >= t.minPosts ? t.color : "rgba(255,255,255,0.15)", color: "#fff", fontWeight: "bold" }}>
                          {postCount >= t.minPosts ? "✓" : t.minPosts}
                        </div>
                        <div style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.6)", fontFamily: "'Montserrat',sans-serif" }}>
                          {t.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Achievements */}
              <h3 style={{ fontFamily: "'Oswald',sans-serif", color: "#f9fafb", fontSize: "1.2rem", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "1.5rem" }}>
                Achievements
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
                {ACHIEVEMENTS.map((ach, i) => (
                  <AchievementCard
                    key={ach.id}
                    achievement={ach}
                    unlocked={ach.condition(postCount, totalViews)}
                    delay={i * 0.1}
                  />
                ))}
              </div>

              {/* Refer a Reader */}
              <div className="glass-card rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-2xl">🔗</div>
                  <div>
                    <h4 style={{ fontFamily: "'Oswald',sans-serif", color: "#22c55e", textTransform: "uppercase", letterSpacing: "0.05em", fontSize: "1rem" }}>
                      Refer a Reader
                    </h4>
                    <p style={{ fontFamily: "'Inter',sans-serif", color: "#9ca3af", fontSize: "0.8rem" }}>
                      Earn points when readers you referred sign up
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 flex-wrap">
                  <input
                    readOnly
                    value={`https://5sarena.blog/ref=${user?.id || "author"}`}
                    className="flex-1 px-3 py-2 rounded-lg text-sm min-w-0"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#9ca3af", fontFamily: "'Inter',sans-serif" }}
                  />
                  <motion.button
                    onClick={() => navigator.clipboard?.writeText(`https://5sarena.blog/ref=${user?.id || "author"}`)}
                    className="px-4 py-2 rounded-lg text-sm font-semibold flex-shrink-0"
                    style={{ fontFamily: "'Montserrat',sans-serif", background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.3)", color: "#22c55e" }}
                    whileHover={{ background: "rgba(34,197,94,0.25)" }}>
                    Copy Link
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
