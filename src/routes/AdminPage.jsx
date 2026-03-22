import { useState, useMemo, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { posts as allPostsData } from "@/data/posts";
import { useToast } from "@/components/Toast";

/* ── Local post management via localStorage ── */
function loadManagedPosts() {
  const stored = localStorage.getItem("5s_managed_posts");
  if (stored) return JSON.parse(stored);
  const initial = allPostsData.map((p) => ({ id: p.id, slug: p.slug, title: p.title, category: p.category, author: p.author?.name || "Unknown", createdAt: p.createdAt, status: "published" }));
  localStorage.setItem("5s_managed_posts", JSON.stringify(initial));
  return initial;
}

function saveManagedPosts(posts) {
  localStorage.setItem("5s_managed_posts", JSON.stringify(posts));
}

/* ── Shared input style ── */
const inputStyle = { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#f9fafb", fontFamily: "'Inter',sans-serif" };

/* ── Post Manager ── */
function PostManager() {
  const [posts, setPosts] = useState(loadManagedPosts);
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("Culture");
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");

  const handleDelete = (id) => { const u = posts.filter(p => p.id !== id); saveManagedPosts(u); setPosts(u); };
  const handleAdd = (e) => {
    e.preventDefault();
    const np = { id: Date.now(), slug: newTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-"), title: newTitle, category: newCategory, author: "Admin", createdAt: new Date().toISOString(), status: "draft" };
    const u = [np, ...posts]; saveManagedPosts(u); setPosts(u); setNewTitle(""); setShowAdd(false);
  };
  const handleEditSave = (id) => { const u = posts.map(p => p.id === id ? { ...p, title: editTitle } : p); saveManagedPosts(u); setPosts(u); setEditId(null); };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 style={{ fontFamily: "'Oswald',sans-serif", fontSize: "1.2rem", color: "#f9fafb", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          Posts ({posts.length})
        </h2>
        <motion.button onClick={() => setShowAdd(!showAdd)}
          className="btn-primary px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2"
          style={{ fontFamily: "'Montserrat',sans-serif" }}
          whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
          + Add Post
        </motion.button>
      </div>

      <AnimatePresence>
        {showAdd && (
          <motion.form initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
            onSubmit={handleAdd} className="mb-6 p-5 rounded-2xl space-y-3 overflow-hidden"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <input type="text" value={newTitle} onChange={e => setNewTitle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl outline-none text-sm" style={inputStyle} placeholder="Post title..." required />
            <select value={newCategory} onChange={e => setNewCategory(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl outline-none text-sm" style={inputStyle}>
              {["Culture","Legends","Skills","Tactics","Fitness","Community","News","Women's Game"].map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <div className="flex gap-2">
              <motion.button type="submit" className="btn-primary px-4 py-2 rounded-lg text-sm font-semibold" style={{ fontFamily: "'Montserrat',sans-serif" }}>Create Draft</motion.button>
              <button type="button" onClick={() => setShowAdd(false)} className="px-4 py-2 rounded-lg text-sm" style={{ background: "rgba(255,255,255,0.05)", color: "#9ca3af" }}>Cancel</button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="space-y-2">
        {posts.map((post, i) => (
          <motion.div key={post.id}
            className="flex items-center justify-between p-4 rounded-xl group transition-colors"
            style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}
            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: Math.min(i * 0.02, 0.5) }}
            whileHover={{ background: "rgba(255,255,255,0.04)" }}>
            <div className="flex-1 min-w-0 mr-4">
              {editId === post.id ? (
                <div className="flex items-center gap-2">
                  <input type="text" value={editTitle} onChange={e => setEditTitle(e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-lg text-sm outline-none" style={inputStyle} />
                  <button onClick={() => handleEditSave(post.id)} className="text-green-500 hover:text-green-400 text-sm font-bold">✓</button>
                  <button onClick={() => setEditId(null)} className="text-gray-500 hover:text-gray-400 text-sm">✕</button>
                </div>
              ) : (
                <>
                  <p className="text-sm font-medium truncate" style={{ color: "#f9fafb", fontFamily: "'Inter',sans-serif" }}>{post.title}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="label-tag text-xs px-2 py-0.5 rounded-full text-white" style={{ background: "rgba(34,197,94,0.2)", fontSize: "0.65rem" }}>{post.category}</span>
                    <span style={{ color: "#6b7280", fontSize: "0.7rem" }}>{post.author}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: post.status === "published" ? "rgba(34,197,94,0.15)" : "rgba(245,158,11,0.15)", color: post.status === "published" ? "#22c55e" : "#f59e0b", fontSize: "0.65rem" }}>{post.status}</span>
                  </div>
                </>
              )}
            </div>
            {editId !== post.id && (
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => { setEditId(post.id); setEditTitle(post.title); }} className="p-2 rounded-lg transition-colors" style={{ color: "#6b7280" }} onMouseEnter={e => e.target.style.color = "#22c55e"} onMouseLeave={e => e.target.style.color = "#6b7280"} title="Edit">✏️</button>
                <button onClick={() => handleDelete(post.id)} className="p-2 rounded-lg transition-colors" style={{ color: "#6b7280" }} onMouseEnter={e => e.target.style.color = "#ef4444"} onMouseLeave={e => e.target.style.color = "#6b7280"} title="Delete">🗑️</button>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ── Author Review ── */
function AuthorReview() {
  const { authorApps, approveAuthor, rejectAuthor } = useAuth();
  const pending = authorApps.filter(a => a.status === "pending");
  const reviewed = authorApps.filter(a => a.status !== "pending");

  return (
    <div>
      <h2 style={{ fontFamily: "'Oswald',sans-serif", fontSize: "1.2rem", color: "#f9fafb", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "1.5rem" }}>
        Author Applications
      </h2>

      {pending.length === 0 && reviewed.length === 0 && (
        <div className="text-center py-16">
          <div className="text-4xl mb-4 opacity-30">👥</div>
          <p style={{ color: "#6b7280", fontFamily: "'Inter',sans-serif" }}>No author applications yet.</p>
        </div>
      )}

      {pending.length > 0 && (
        <div className="mb-8">
          <span className="text-xs font-bold mb-3 block" style={{ fontFamily: "'Montserrat',sans-serif", color: "#f59e0b", textTransform: "uppercase", letterSpacing: "0.1em" }}>Pending ({pending.length})</span>
          <div className="space-y-3">
            {pending.map(app => (
              <motion.div key={app.id} className="p-5 rounded-2xl"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(245,158,11,0.2)" }}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p style={{ fontFamily: "'Oswald',sans-serif", color: "#f9fafb", textTransform: "uppercase" }}>{app.userName}</p>
                    <p style={{ color: "#6b7280", fontSize: "0.75rem" }}>{app.userEmail}</p>
                  </div>
                  <span style={{ color: "#6b7280", fontSize: "0.7rem" }}>{new Date(app.createdAt).toLocaleDateString()}</span>
                </div>
                <p style={{ color: "#d1d5db", fontSize: "0.85rem", fontFamily: "'Inter',sans-serif", marginBottom: "0.25rem" }}><strong style={{ color: "#9ca3af" }}>Reason:</strong> {app.reason}</p>
                <p style={{ color: "#d1d5db", fontSize: "0.85rem", fontFamily: "'Inter',sans-serif", marginBottom: "1rem" }}><strong style={{ color: "#9ca3af" }}>Sample:</strong> {app.sampleTopic}</p>
                <div className="flex gap-2">
                  <motion.button onClick={() => approveAuthor(app.id)}
                    className="btn-primary px-4 py-2 rounded-lg text-sm font-semibold" style={{ fontFamily: "'Montserrat',sans-serif" }}
                    whileHover={{ scale: 1.03 }}>✓ Approve</motion.button>
                  <motion.button onClick={() => rejectAuthor(app.id)}
                    className="px-4 py-2 rounded-lg text-sm font-semibold"
                    style={{ fontFamily: "'Montserrat',sans-serif", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", color: "#f87171" }}
                    whileHover={{ background: "rgba(239,68,68,0.2)" }}>✕ Reject</motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {reviewed.length > 0 && (
        <div>
          <span className="text-xs font-bold mb-3 block" style={{ fontFamily: "'Montserrat',sans-serif", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.1em" }}>Reviewed ({reviewed.length})</span>
          <div className="space-y-2">
            {reviewed.map(app => (
              <div key={app.id} className="flex items-center justify-between p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}>
                <div>
                  <p style={{ color: "#d1d5db", fontSize: "0.85rem", fontFamily: "'Inter',sans-serif" }}>{app.userName}</p>
                  <p style={{ color: "#6b7280", fontSize: "0.7rem" }}>{app.sampleTopic}</p>
                </div>
                <span className="text-xs px-3 py-1 rounded-full font-semibold" style={{ background: app.status === "approved" ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)", color: app.status === "approved" ? "#22c55e" : "#f87171" }}>{app.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── User Manager with status dots ── */
function UserManager() {
  const { users } = useAuth();

  const getUserStatus = (userId) => {
    // In a real app this would be per-user; here we show the current user's status demo
    const stored = localStorage.getItem("5s_user_status");
    if (stored) return JSON.parse(stored);
    return { type: "online", color: "#22c55e" };
  };

  return (
    <div>
      <h2 style={{ fontFamily: "'Oswald',sans-serif", fontSize: "1.2rem", color: "#f9fafb", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "1.5rem" }}>
        Users ({users.length})
      </h2>
      <div className="space-y-2">
        {users.map((u, i) => {
          const status = getUserStatus(u.id);
          return (
            <motion.div key={u.id}
              className="flex items-center justify-between p-4 rounded-xl transition-colors"
              style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}
              initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: Math.min(i * 0.03, 0.5) }}
              whileHover={{ background: "rgba(255,255,255,0.04)" }}>
              <div className="flex items-center gap-3">
                <div className="relative flex-shrink-0">
                  <div className="w-9 h-9 rounded-full overflow-hidden flex items-center justify-center"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
                    {u.image ? (
                      <img src={u.image} alt="" className="w-full h-full object-cover" onError={e => { e.target.style.display = "none"; }} />
                    ) : (
                      <span style={{ color: "#6b7280", fontSize: "0.7rem", fontWeight: 700 }}>{u.name?.charAt(0)}</span>
                    )}
                  </div>
                  {/* Status dot */}
                  <motion.div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2"
                    style={{ background: status.color, borderColor: "#030712", boxShadow: `0 0 6px ${status.color}` }}
                    animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }} />
                </div>
                <div>
                  <p style={{ color: "#f9fafb", fontSize: "0.85rem", fontFamily: "'Inter',sans-serif", fontWeight: 500 }}>{u.name}</p>
                  <p style={{ color: "#6b7280", fontSize: "0.7rem" }}>{u.email}</p>
                </div>
              </div>
              <span className="text-xs px-3 py-1 rounded-full font-bold"
                style={{
                  fontFamily: "'Montserrat',sans-serif",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  background: u.role === "admin" ? "rgba(239,68,68,0.15)" : u.role === "author" ? "rgba(34,197,94,0.15)" : "rgba(255,255,255,0.05)",
                  color: u.role === "admin" ? "#f87171" : u.role === "author" ? "#22c55e" : "#9ca3af",
                }}>
                {u.role}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   CMS PANEL (mock headless CMS dashboard)
   ═══════════════════════════════════════════════════════════════ */
const CMS_CONTENT_TYPES = [
  { name: "Blog Post",    count: 46, icon: "📝", color: "#22c55e",  lastSync: "2 min ago"  },
  { name: "Category",    count: 8,  icon: "🏷️", color: "#06b6d4",  lastSync: "5 min ago"  },
  { name: "Author",      count: 6,  icon: "✍️", color: "#a855f7",  lastSync: "10 min ago" },
  { name: "Media Asset", count: 34, icon: "🖼️", color: "#f59e0b",  lastSync: "1 min ago"  },
  { name: "Poll",        count: 4,  icon: "📊", color: "#ec4899",  lastSync: "30 min ago" },
  { name: "Comment",     count: 12, icon: "💬", color: "#3b82f6",  lastSync: "Just now"   },
];
const CMS_ENTRIES = [
  { id: "post-46", type: "Blog Post", title: "Inter Milan's Greatest Ever Teams",      status: "published", modified: "Mar 22, 2026", author: "Johannes Cobelt" },
  { id: "post-45", type: "Blog Post", title: "Serie A's Most Expensive Flops",         status: "published", modified: "Mar 20, 2026", author: "John Stu"          },
  { id: "post-44", type: "Blog Post", title: "The Fiercest Derby Atmospheres in Serie A", status: "published", modified: "Mar 18, 2026", author: "Jackson Wayne"  },
  { id: "post-43", type: "Blog Post", title: "The Old Grounds That Built Italian Football", status: "draft",   modified: "Mar 15, 2026", author: "Hell Mandat"    },
  { id: "post-42", type: "Blog Post", title: "From Sacchi to Spalletti: Changing Philosophies", status: "published", modified: "Mar 10, 2026", author: "Dent Prov" },
  { id: "cat-1",   type: "Category",  title: "Culture",                                status: "published", modified: "Jan 1, 2026",  author: "Admin"            },
  { id: "cat-2",   type: "Category",  title: "Tactics",                                status: "published", modified: "Jan 1, 2026",  author: "Admin"            },
  { id: "auth-1",  type: "Author",    title: "Jackson Wayne",                          status: "published", modified: "Feb 5, 2026",  author: "Admin"            },
];
const STATUS_COLORS = { published: "#22c55e", draft: "#f59e0b", archived: "#6b7280" };

function CmsPanel() {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [syncing, setSyncing] = useState(false);

  const allTypes = ["All", ...CMS_CONTENT_TYPES.map(c => c.name)];
  const filtered = CMS_ENTRIES.filter(e =>
    (filter === "All" || e.type === filter) &&
    (search === "" || e.title.toLowerCase().includes(search.toLowerCase()))
  );

  const handleSync = () => {
    setSyncing(true);
    setTimeout(() => setSyncing(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 style={{ fontFamily: "'Oswald',sans-serif", fontSize: "1.2rem", color: "#f9fafb", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Content Management System
          </h2>
          <p style={{ fontFamily: "'Inter',sans-serif", color: "#6b7280", fontSize: "0.8rem", marginTop: "0.25rem" }}>
            Mock headless CMS — all data stored locally
          </p>
        </div>
        <motion.button
          onClick={handleSync}
          className="px-4 py-1.5 rounded-lg text-sm font-semibold flex items-center gap-2"
          style={{ fontFamily: "'Montserrat',sans-serif", background: "rgba(6,182,212,0.15)", color: "#06b6d4", border: "1px solid rgba(6,182,212,0.3)" }}
          whileHover={{ background: "rgba(6,182,212,0.25)" }}
          whileTap={{ scale: 0.97 }}
        >
          <motion.span
            animate={{ rotate: syncing ? 360 : 0 }}
            transition={{ duration: 0.8, repeat: syncing ? Infinity : 0, ease: "linear" }}
          >🔄</motion.span>
          {syncing ? "Syncing…" : "Sync All"}
        </motion.button>
      </div>

      {/* Content type cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {CMS_CONTENT_TYPES.map((ct, i) => (
          <motion.div
            key={ct.name}
            className="rounded-xl p-4 cursor-pointer"
            style={{ background: `${ct.color}10`, border: `1px solid ${ct.color}25` }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ y: -2, boxShadow: `0 8px 24px ${ct.color}15` }}
            onClick={() => setFilter(ct.name)}
          >
            <div className="text-2xl mb-2">{ct.icon}</div>
            <div style={{ fontFamily: "'Bebas Neue',sans-serif", color: ct.color, fontSize: "1.8rem", lineHeight: 1 }}>{ct.count}</div>
            <div style={{ fontFamily: "'Montserrat',sans-serif", color: "#9ca3af", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.08em", marginTop: "0.25rem" }}>{ct.name}</div>
            <div style={{ fontFamily: "'Inter',sans-serif", color: "#4b5563", fontSize: "0.65rem", marginTop: "0.25rem" }}>Synced {ct.lastSync}</div>
          </motion.div>
        ))}
      </div>

      {/* Filter + Search bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex gap-1.5 flex-wrap">
          {allTypes.map(t => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className="px-3 py-1 rounded-full text-xs"
              style={{
                fontFamily: "'Montserrat',sans-serif",
                background: filter === t ? "rgba(34,197,94,0.2)" : "rgba(255,255,255,0.05)",
                border: filter === t ? "1px solid rgba(34,197,94,0.4)" : "1px solid rgba(255,255,255,0.08)",
                color: filter === t ? "#22c55e" : "#9ca3af",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >{t}</button>
          ))}
        </div>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search entries…"
          className="flex-1 px-4 py-1.5 rounded-lg text-sm outline-none"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#f9fafb", fontFamily: "'Inter',sans-serif" }}
        />
      </div>

      {/* Entries table */}
      <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
        {/* Table header */}
        <div className="grid grid-cols-12 px-4 py-2.5"
          style={{ background: "rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          {["Title", "Type", "Status", "Modified", "Author"].map((h, i) => (
            <div key={h}
              className={i === 0 ? "col-span-4" : i === 1 ? "col-span-2" : i === 2 ? "col-span-2" : i === 3 ? "col-span-2" : "col-span-2"}
              style={{ fontFamily: "'Montserrat',sans-serif", color: "#6b7280", fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              {h}
            </div>
          ))}
        </div>
        {filtered.length === 0 ? (
          <div className="py-8 text-center" style={{ fontFamily: "'Inter',sans-serif", color: "#6b7280" }}>No entries match your filters.</div>
        ) : (
          filtered.map((entry, i) => (
            <motion.div
              key={entry.id}
              className="grid grid-cols-12 px-4 py-3 items-center"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", background: "transparent" }}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03 }}
              whileHover={{ background: "rgba(255,255,255,0.03)" }}
            >
              <div className="col-span-4 min-w-0">
                <p className="truncate" style={{ fontFamily: "'Inter',sans-serif", color: "#d1d5db", fontSize: "0.85rem" }}>{entry.title}</p>
              </div>
              <div className="col-span-2">
                <span className="text-xs px-2 py-0.5 rounded-full"
                  style={{ fontFamily: "'Montserrat',sans-serif", background: "rgba(255,255,255,0.06)", color: "#9ca3af", letterSpacing: "0.04em" }}>
                  {entry.type}
                </span>
              </div>
              <div className="col-span-2">
                <span className="flex items-center gap-1.5 text-xs"
                  style={{ fontFamily: "'Montserrat',sans-serif", color: STATUS_COLORS[entry.status] || "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  <span className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ background: STATUS_COLORS[entry.status] || "#9ca3af", boxShadow: `0 0 4px ${STATUS_COLORS[entry.status] || "#9ca3af"}` }} />
                  {entry.status}
                </span>
              </div>
              <div className="col-span-2" style={{ fontFamily: "'Inter',sans-serif", color: "#6b7280", fontSize: "0.75rem" }}>{entry.modified}</div>
              <div className="col-span-2 truncate" style={{ fontFamily: "'Inter',sans-serif", color: "#6b7280", fontSize: "0.75rem" }}>{entry.author}</div>
            </motion.div>
          ))
        )}
      </div>

      {/* Footer note */}
      <p style={{ fontFamily: "'Inter',sans-serif", color: "#374151", fontSize: "0.75rem", textAlign: "center" }}>
        Demo data only — in production this connects to a headless CMS API (Contentful, Sanity, or Strapi)
      </p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SYSTEM PANEL
   ═══════════════════════════════════════════════════════════════ */
const MOCK_BACKUPS = [
  { id: 1, label: "Auto backup", time: "2 minutes ago",  size: "4.2 KB", status: "success" },
  { id: 2, label: "Auto backup", time: "1 hour ago",     size: "4.1 KB", status: "success" },
  { id: 3, label: "Manual",      time: "3 hours ago",    size: "4.0 KB", status: "success" },
  { id: 4, label: "Auto backup", time: "6 hours ago",    size: "3.9 KB", status: "success" },
  { id: 5, label: "Auto backup", time: "12 hours ago",   size: "3.8 KB", status: "success" },
];
const SECURITY_CHECKS = [
  { label: "HTTPS Enabled",         status: true  },
  { label: "CSP Headers",           status: true  },
  { label: "X-Frame-Options",       status: true  },
  { label: "HSTS",                  status: true  },
  { label: "Rate Limiting",         status: false },
  { label: "2FA for Admins",        status: false },
];

function SystemPanel({ showToast }) {
  const [backups, setBackups] = useState(MOCK_BACKUPS);
  const handleBackup = () => {
    const newBackup = { id: Date.now(), label: "Manual", time: "Just now", size: "4.3 KB", status: "success" };
    setBackups(prev => [newBackup, ...prev.slice(0, 4)]);
    showToast("Backup created successfully! 💾", "success");
  };
  const handleRestore = (b) => showToast(`Restore from "${b.label} (${b.time})" — this is a demo.`, "info");

  return (
    <div className="space-y-6">
      {/* Quick links */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Analytics", to: "/analytics", icon: "📊", color: "#06b6d4" },
          { label: "Roadmap",   to: "/roadmap",   icon: "🗺️", color: "#22c55e" },
          { label: "Shop",      to: "/shop",       icon: "🛍️", color: "#f59e0b" },
          { label: "Tools",     to: "/tools",      icon: "🧮", color: "#a855f7" },
        ].map(({ label, to, icon, color }) => (
          <Link key={label} to={to}>
            <motion.div className="rounded-xl p-4 text-center cursor-pointer"
              style={{ background: `${color}10`, border: `1px solid ${color}30` }}
              whileHover={{ y: -2, boxShadow: `0 8px 24px ${color}20` }}>
              <div className="text-2xl mb-1">{icon}</div>
              <div style={{ fontFamily: "'Montserrat',sans-serif", fontSize: "0.7rem", color, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}>{label}</div>
            </motion.div>
          </Link>
        ))}
      </div>

      {/* Backup history */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 style={{ fontFamily: "'Oswald',sans-serif", color: "#f9fafb", fontSize: "1rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>💾 Backup History</h3>
          <motion.button onClick={handleBackup}
            className="px-4 py-1.5 rounded-lg text-sm font-semibold"
            style={{ fontFamily: "'Montserrat',sans-serif", background: "rgba(34,197,94,0.15)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.3)" }}
            whileHover={{ background: "rgba(34,197,94,0.25)" }} whileTap={{ scale: 0.97 }}>
            + Create Backup
          </motion.button>
        </div>
        <div className="space-y-2">
          {backups.map((b, i) => (
            <motion.div key={b.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
              className="flex items-center gap-4 p-3 rounded-xl"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: "#22c55e", boxShadow: "0 0 6px #22c55e" }} />
              <div className="flex-1 min-w-0">
                <span style={{ fontFamily: "'Oswald',sans-serif", color: "#f9fafb", fontSize: "0.85rem" }}>{b.label}</span>
                <span style={{ fontFamily: "'Inter',sans-serif", color: "#6b7280", fontSize: "0.75rem", marginLeft: "0.75rem" }}>{b.time}</span>
              </div>
              <span style={{ fontFamily: "'Montserrat',sans-serif", color: "#6b7280", fontSize: "0.7rem" }}>{b.size}</span>
              <motion.button onClick={() => handleRestore(b)}
                className="text-xs px-2.5 py-1 rounded-lg"
                style={{ fontFamily: "'Montserrat',sans-serif", background: "rgba(6,182,212,0.1)", color: "#06b6d4", border: "1px solid rgba(6,182,212,0.2)" }}
                whileHover={{ background: "rgba(6,182,212,0.2)" }}>
                Restore
              </motion.button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Security checks */}
      <div>
        <h3 className="mb-4" style={{ fontFamily: "'Oswald',sans-serif", color: "#f9fafb", fontSize: "1rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>🔒 Security Status</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {SECURITY_CHECKS.map(({ label, status }) => (
            <div key={label} className="flex items-center gap-3 p-3 rounded-xl"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <span style={{ color: status ? "#22c55e" : "#f59e0b", fontSize: "1rem" }}>{status ? "✅" : "⚠️"}</span>
              <span style={{ fontFamily: "'Inter',sans-serif", color: status ? "#d1d5db" : "#9ca3af", fontSize: "0.875rem" }}>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN ADMIN PAGE
   ═══════════════════════════════════════════════════════════════ */
export default function AdminPage() {
  const { isAdmin, user } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState("posts");

  useEffect(() => {
    document.title = "Admin Dashboard — 5s Arena Blog";
  }, []);

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--color-bg)" }}>
        <div className="text-center">
          <div className="text-4xl mb-4">🔒</div>
          <p style={{ fontFamily: "'Oswald',sans-serif", color: "#f87171", fontSize: "1.2rem", textTransform: "uppercase" }}>Access Denied</p>
          <p style={{ fontFamily: "'Inter',sans-serif", color: "#6b7280", marginTop: "0.5rem", marginBottom: "1.5rem" }}>You need admin privileges to view this page.</p>
          <motion.button onClick={() => navigate("/login")}
            className="btn-primary px-6 py-2.5 rounded-xl font-semibold" style={{ fontFamily: "'Montserrat',sans-serif" }}
            whileHover={{ scale: 1.03 }}>
            Sign In
          </motion.button>
        </div>
      </div>
    );
  }

  const { showToast } = useToast();

  const tabs = [
    { id: "posts",    label: "Posts",    icon: "📄" },
    { id: "authors",  label: "Authors",  icon: "✍️" },
    { id: "users",    label: "Users",    icon: "👥" },
    { id: "cms",      label: "CMS",      icon: "🗂️" },
    { id: "system",   label: "System",   icon: "⚙️" },
  ];

  return (
    <div style={{ background: "var(--color-bg)", minHeight: "100vh" }}>
      {/* Gradient header */}
      <div className="relative overflow-hidden py-8"
        style={{ background: "linear-gradient(135deg,#052e16 0%,#0d1117 60%,#111827 100%)", borderBottom: "1px solid rgba(34,197,94,0.15)" }}>
        <div className="absolute inset-0 pointer-events-none opacity-10"
          style={{ backgroundImage: `repeating-linear-gradient(0deg,transparent,transparent 40px,rgba(34,197,94,0.3) 40px,rgba(34,197,94,0.3) 41px)` }} />
        <div className="max-w-4xl mx-auto px-4 relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/profile")} className="p-2 transition-colors" style={{ color: "#6b7280" }}
              onMouseEnter={e => e.target.style.color = "#f9fafb"} onMouseLeave={e => e.target.style.color = "#6b7280"}>←</button>
            <div>
              <h1 style={{ fontFamily: "'Oswald',sans-serif", fontSize: "1.5rem", color: "#f9fafb", textTransform: "uppercase", letterSpacing: "0.05em" }}>Admin Dashboard</h1>
              <p style={{ fontFamily: "'Inter',sans-serif", color: "#6b7280", fontSize: "0.8rem" }}>Manage posts, authors, and users</p>
            </div>
          </div>
          <img src="/logo.png" alt="" className="w-10 h-10 rounded-full opacity-30" />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className="px-5 py-3 text-sm font-semibold relative"
              style={{
                fontFamily: "'Montserrat',sans-serif",
                color: tab === t.id ? "#22c55e" : "#9ca3af",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}>
              <span className="mr-1.5">{t.icon}</span>{t.label}
              {tab === t.id && (
                <motion.div layoutId="adminTabUnderline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                  style={{ background: "#22c55e" }} />
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div key={tab}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}>
            {tab === "posts" && <PostManager />}
            {tab === "authors" && <AuthorReview />}
            {tab === "users" && <UserManager />}
            {tab === "cms" && <CmsPanel />}
            {tab === "system" && <SystemPanel showToast={showToast} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
