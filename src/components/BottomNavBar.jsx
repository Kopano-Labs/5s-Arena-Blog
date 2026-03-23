import { useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

const BASE_ITEMS = [
  { to: "/",             emoji: "🏠", label: "Home",     color: "#22c55e" },
  { to: "/fixtures",     emoji: "⚽", label: "Fixtures", color: "#06b6d4" },
  { to: "/league",       emoji: "🏆", label: "League",   color: "#f59e0b" },
  { to: "/posts",        emoji: "📰", label: "Articles", color: "#10b981" },
  { to: "/most-popular", emoji: "🔥", label: "Popular",  color: "#ef4444" },
  { to: "/authors",      emoji: "✍️", label: "Authors",  color: "#ec4899" },
  { to: "/tools",        emoji: "🧮", label: "Tools",    color: "#f97316" },
  { to: "/shop",         emoji: "🛍️", label: "Shop",     color: "#a855f7" },
  { to: "/profile",      emoji: "👤", label: "Profile",  color: "#3b82f6" },
  { to: "/donate",       emoji: "💸", label: "Donate",   color: "#f59e0b" },
  { to: "/creator",      emoji: "🎨", label: "Creator",  color: "#a855f7" },
  { to: "/about",        emoji: "ℹ️", label: "About",    color: "#06b6d4" },
];

export default function BottomNavBar() {
  const { pathname } = useLocation();
  const { user } = useAuth();
  const scrollRef = useRef(null);

  const isAdmin  = user?.role === "admin";
  const isAuthor = user?.role === "author" || isAdmin;

  const items = [
    ...BASE_ITEMS,
    ...(isAuthor ? [{ to: "/write", emoji: "📝", label: "Write", color: "#a855f7" }] : []),
    ...(isAdmin  ? [{ to: "/admin", emoji: "⚙️", label: "Admin", color: "#ef4444" }] : []),
  ];

  return (
    <>
      {/* Spacer */}
      <div style={{ height: 68 }} />

      <div
        className="fixed bottom-0 left-0 right-0 z-50"
        style={{
          background: "linear-gradient(180deg, rgba(3,7,18,0.0) 0%, rgba(3,7,18,0.97) 20%)",
          backdropFilter: "blur(20px)",
          borderTop: "1px solid rgba(34,197,94,0.12)",
          boxShadow: "0 -4px 32px rgba(0,0,0,0.7)",
        }}
      >
        {/* Scrollable icon strip */}
        <div
          ref={scrollRef}
          className="flex items-center gap-1 px-3 py-2 overflow-x-auto"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            WebkitOverflowScrolling: "touch",
          }}
        >
          <style>{`.bottom-nav-scroll::-webkit-scrollbar { display: none; }`}</style>

          {items.map(({ to, emoji, label, color }) => {
            const active = pathname === to || (to !== "/" && pathname.startsWith(to));
            return (
              <Link key={to} to={to} className="no-underline flex-shrink-0">
                <motion.div
                  className="flex flex-col items-center justify-center relative"
                  style={{ width: 52, height: 52 }}
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.85 }}
                >
                  {/* Icon bubble */}
                  <motion.div
                    className="flex items-center justify-center rounded-2xl"
                    style={{
                      width: 44,
                      height: 44,
                      background: active ? `${color}22` : "rgba(255,255,255,0.04)",
                      border: active ? `1.5px solid ${color}70` : "1.5px solid rgba(255,255,255,0.07)",
                      boxShadow: active ? `0 0 18px ${color}50, 0 0 6px ${color}30` : "none",
                      transition: "all 0.2s ease",
                      position: "relative",
                    }}
                    animate={active ? { scale: [1, 1.07, 1] } : { scale: 1 }}
                    transition={{ duration: 1.8, repeat: active ? Infinity : 0 }}
                  >
                    <span style={{ fontSize: "1.3rem", lineHeight: 1 }}>{emoji}</span>

                    {/* Active dot */}
                    {active && (
                      <motion.div
                        className="absolute -top-1 -right-1 w-2 h-2 rounded-full"
                        style={{ background: color, boxShadow: `0 0 6px ${color}` }}
                        animate={{ scale: [1, 1.4, 1], opacity: [1, 0.7, 1] }}
                        transition={{ duration: 1.2, repeat: Infinity }}
                      />
                    )}
                  </motion.div>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
