import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiSun, FiMoon, FiSearch, FiUser, FiX, FiMenu } from "react-icons/fi";
import { useDarkMode } from "@/context/DarkModeContext";
import { useAuth } from "@/context/AuthContext";

/* ── Social icon SVGs ─────────────────────────────────────── */
const FacebookIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.268h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
  </svg>
);

const TikTokIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.34 6.34 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.97a8.16 8.16 0 004.77 1.52V7.04a4.85 4.85 0 01-1-.35z"/>
  </svg>
);

/* ── Nav links config ─────────────────────────────────────── */
const NAV_LINKS = [
  { to: "/",                 label: "Home",         icon: "🏠" },
  { to: "/fixtures",         label: "Fixtures",     icon: "⚽" },
  { to: "/league",           label: "League",       icon: "🏆" },
  { to: "/most-popular",     label: "Popular",      icon: "🔥" },
  { to: "/authors",          label: "Authors",      icon: "✍️" },
  { to: "/about",            label: "About",        icon: "ℹ️" },
];

const SOCIAL_LINKS = [
  { href: "https://www.facebook.com/people/Fives-Arena/61588019843126/", Icon: FacebookIcon, label: "Facebook", hoverColor: "#1877f2" },
  { href: "https://www.instagram.com/fivesarena", Icon: InstagramIcon, label: "Instagram", hoverColor: "#e1306c" },
  { href: "https://www.tiktok.com/@fivesarena", Icon: TikTokIcon, label: "TikTok", hoverColor: "#69c9d0" },
];

/* ── Status dot reads from localStorage ──────────────────────── */
function StatusDot() {
  const stored = typeof window !== "undefined" ? localStorage.getItem("5s_user_status") : null;
  const status = stored ? JSON.parse(stored) : { type: "online", color: "#22c55e" };
  if (status.visible === false) return null;
  return (
    <motion.div
      className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full border-2"
      style={{ background: status.color, borderColor: "#059669", boxShadow: `0 0 6px ${status.color}` }}
      animate={{ scale: [1, 1.3, 1] }}
      transition={{ duration: 2, repeat: Infinity }}
    />
  );
}

export default function Navbar() {
  const [open, setOpen]         = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { darkMode, toggleDarkMode }  = useDarkMode();
  const { user }    = useAuth();
  const navigate    = useNavigate();
  const location    = useLocation();

  /* scroll watcher */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* close mobile menu on route change */
  useEffect(() => { setOpen(false); }, [location.pathname]);

  const handleSearch = (e) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      navigate(`/posts?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  const isActive = (to) => {
    if (to === "/") return location.pathname === "/";
    return location.pathname.startsWith(to);
  };

  /* mobile menu item variants */
  const mobileItem = {
    hidden:  { opacity: 0, x: 40 },
    visible: (i) => ({ opacity: 1, x: 0, transition: { delay: i * 0.06, type: "spring", stiffness: 280, damping: 22 } }),
  };

  return (
    <>
      <nav
        className="w-full h-16 md:h-18 flex items-center justify-between px-4 md:px-6 sticky top-0 z-50 transition-all duration-300"
        style={{
          background: "linear-gradient(135deg, #052e16 0%, #0d1117 60%, #111827 100%)",
          boxShadow: scrolled
            ? "0 4px 20px rgba(0,0,0,0.5), 0 0 40px rgba(34,197,94,0.05)"
            : "0 2px 10px rgba(0,0,0,0.3)",
          backdropFilter: scrolled ? "blur(12px)" : "none",
        }}
      >
        {/* ── LOGO ─────────────────────────────────────────── */}
        <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
          <motion.img
            src="/logo.png"
            alt="5s Arena"
            className="w-9 h-9 rounded-full shadow-lg"
            style={{ boxShadow: "0 0 12px rgba(34,197,94,0.4)" }}
            animate={{ boxShadow: ["0 0 8px rgba(34,197,94,0.3)", "0 0 20px rgba(34,197,94,0.6)", "0 0 8px rgba(34,197,94,0.3)"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
          <span
            className="hidden sm:inline font-bold text-lg tracking-wide"
            style={{ fontFamily: "'Oswald', sans-serif", color: "#f9fafb" }}
          >
            5s Arena<span style={{ color: "#22c55e" }}> Blog</span>
          </span>
        </Link>

        {/* ── DESKTOP NAV ──────────────────────────────────── */}
        <div className="hidden md:flex items-center gap-5 lg:gap-7">
          {/* Search */}
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
              placeholder="Search posts..."
              className="pl-9 pr-16 py-1.5 rounded-full text-sm w-40 lg:w-52 outline-none focus:ring-2 focus:ring-green-500/50 transition-all"
              style={{ background: "rgba(255,255,255,0.08)", color: "#f9fafb", border: "1px solid rgba(255,255,255,0.12)" }}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-0.5 pointer-events-none">
              <kbd className="px-1 py-0.5 rounded text-[0.55rem]"
                style={{ fontFamily: "'Montserrat',sans-serif", background: "rgba(255,255,255,0.1)", color: "#6b7280", border: "1px solid rgba(255,255,255,0.12)" }}>
                ⌘K
              </kbd>
            </div>
          </div>

          {/* Nav links */}
          {NAV_LINKS.map(({ to, label, icon }) => (
            <Link
              key={to}
              to={to}
              className="nav-link text-sm font-medium transition-colors flex items-center gap-1.5 py-1"
              style={{
                fontFamily: "'Montserrat', sans-serif",
                color: isActive(to) ? "#22c55e" : "#d1d5db",
              }}
            >
              <span style={{ fontSize: "14px" }}>{icon}</span>
              {label}
              {isActive(to) && (
                <motion.div
                  layoutId="activeBar"
                  className="absolute -bottom-1 left-0 right-0 h-0.5 rounded"
                  style={{ background: "#22c55e" }}
                />
              )}
            </Link>
          ))}

          {/* Social micro-icons */}
          <div className="flex items-center gap-2 border-l border-white/10 pl-4">
            {SOCIAL_LINKS.map(({ href, Icon, label, hoverColor }) => (
              <motion.a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="text-gray-400 transition-colors p-1 rounded"
                whileHover={{ color: hoverColor, scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
              >
                <Icon />
              </motion.a>
            ))}
          </div>

          {/* Dark mode toggle */}
          <motion.button
            onClick={toggleDarkMode}
            className="text-gray-400 hover:text-green-400 transition-colors p-1"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {darkMode ? <FiSun size={18} /> : <FiMoon size={18} />}
          </motion.button>

          {/* Auth button */}
          {user ? (
            <Link to="/profile">
              <motion.div
                className="flex items-center gap-2 py-1.5 px-3 rounded-full cursor-pointer relative"
                style={{
                  background: "linear-gradient(135deg, #059669, #10b981)",
                  boxShadow: "0 0 16px rgba(16,185,129,0.35)",
                }}
                whileHover={{ boxShadow: "0 0 28px rgba(16,185,129,0.55)", y: -1 }}
                whileTap={{ scale: 0.97 }}
              >
                {user.image ? (
                  <img src={user.image} alt="" className="w-5 h-5 rounded-full object-cover" />
                ) : (
                  <FiUser size={14} />
                )}
                <span className="text-sm font-semibold" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  {user.name?.split(" ")[0]}
                </span>
                {/* Status dot */}
                <StatusDot />
              </motion.div>
            </Link>
          ) : (
            <Link to="/login">
              <motion.button
                className="btn-primary py-1.5 px-4 rounded-full text-sm font-semibold text-white"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
              >
                Login
              </motion.button>
            </Link>
          )}
        </div>

        {/* ── MOBILE CONTROLS ──────────────────────────────── */}
        <div className="md:hidden flex items-center gap-3">
          <motion.button onClick={toggleDarkMode} whileTap={{ scale: 0.9 }} className="text-gray-300 p-1">
            {darkMode ? <FiSun size={18} /> : <FiMoon size={18} />}
          </motion.button>
          <motion.button
            onClick={() => setOpen((p) => !p)}
            className="text-gray-300 p-1 z-50"
            whileTap={{ scale: 0.9 }}
          >
            {open ? <FiX size={24} /> : <FiMenu size={24} />}
          </motion.button>
        </div>
      </nav>

      {/* ── MOBILE DRAWER ────────────────────────────────────── */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-16 left-0 w-full h-[calc(100vh-4rem)] z-40 flex flex-col items-center justify-center gap-6 pt-6 pb-10"
            style={{ background: "linear-gradient(160deg, #052e16 0%, #0d1117 50%, #111827 100%)" }}
          >
            {/* Mobile search */}
            <div className="relative w-64">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
                placeholder="Search posts..."
                className="w-full pl-9 pr-4 py-2 rounded-full text-sm outline-none"
                style={{ background: "rgba(255,255,255,0.1)", color: "#f9fafb", border: "1px solid rgba(255,255,255,0.15)" }}
              />
            </div>

            {/* Mobile nav links */}
            {NAV_LINKS.map(({ to, label, icon }, i) => (
              <motion.div key={to} custom={i} variants={mobileItem} initial="hidden" animate="visible">
                <Link
                  to={to}
                  className="flex items-center gap-3 text-xl font-semibold transition-colors"
                  style={{
                    fontFamily: "'Oswald', sans-serif",
                    color: isActive(to) ? "#22c55e" : "#f9fafb",
                    textShadow: isActive(to) ? "0 0 20px rgba(34,197,94,0.5)" : "none",
                  }}
                >
                  <span>{icon}</span>
                  {label.toUpperCase()}
                </Link>
              </motion.div>
            ))}

            {/* Mobile social icons */}
            <motion.div
              custom={NAV_LINKS.length}
              variants={mobileItem}
              initial="hidden"
              animate="visible"
              className="flex items-center gap-5 mt-2"
            >
              {SOCIAL_LINKS.map(({ href, Icon, label, hoverColor }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="text-gray-400 p-2 rounded-full"
                  style={{ background: "rgba(255,255,255,0.05)" }}
                  whileHover={{ color: hoverColor, scale: 1.2, background: "rgba(255,255,255,0.1)" }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Icon />
                </motion.a>
              ))}
            </motion.div>

            {/* Mobile auth button */}
            <motion.div custom={NAV_LINKS.length + 1} variants={mobileItem} initial="hidden" animate="visible">
              {user ? (
                <Link to="/profile">
                  <div
                    className="flex items-center gap-2 py-2.5 px-6 rounded-full font-semibold"
                    style={{
                      background: "linear-gradient(135deg, #059669, #10b981)",
                      boxShadow: "0 0 20px rgba(16,185,129,0.4)",
                      fontFamily: "'Montserrat', sans-serif",
                    }}
                  >
                    {user.image ? (
                      <img src={user.image} alt="" className="w-5 h-5 rounded-full object-cover" />
                    ) : (
                      <FiUser size={16} />
                    )}
                    <span>{user.name?.split(" ")[0]}</span>
                  </div>
                </Link>
              ) : (
                <Link to="/login">
                  <div
                    className="py-2.5 px-8 rounded-full font-semibold text-white"
                    style={{
                      background: "linear-gradient(135deg, #059669, #10b981)",
                      boxShadow: "0 0 20px rgba(16,185,129,0.4)",
                      fontFamily: "'Montserrat', sans-serif",
                    }}
                  >
                    Login
                  </div>
                </Link>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
