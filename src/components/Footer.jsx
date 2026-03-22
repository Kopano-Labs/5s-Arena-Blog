import { Link } from "react-router-dom";
import { motion } from "framer-motion";

/* Social icon SVGs */
const FacebookIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.268h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
  </svg>
);

const TikTokIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.34 6.34 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.97a8.16 8.16 0 004.77 1.52V7.04a4.85 4.85 0 01-1-.35z"/>
  </svg>
);

const WhatsAppIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const SOCIAL_LINKS = [
  { href: "https://www.facebook.com/people/Fives-Arena/61588019843126/", Icon: FacebookIcon,  label: "Facebook",  hoverColor: "#1877f2" },
  { href: "https://www.instagram.com/fivesarena",                         Icon: InstagramIcon, label: "Instagram", hoverColor: "#e1306c" },
  { href: "https://www.tiktok.com/@fivesarena",                           Icon: TikTokIcon,    label: "TikTok",   hoverColor: "#69c9d0" },
  { href: "https://wa.me/27637820245",                                    Icon: WhatsAppIcon,  label: "WhatsApp", hoverColor: "#25d366" },
];

const QUICK_LINKS = [
  { to: "/",             label: "Home" },
  { to: "/fixtures",     label: "Fixtures" },
  { to: "/league",       label: "League" },
  { to: "/most-popular", label: "Most Popular" },
  { to: "/posts",        label: "All Articles" },
  { to: "/authors",      label: "Authors" },
  { to: "/tools",        label: "Tools" },
  { to: "/shop",         label: "Shop" },
  { to: "/jobs",         label: "Jobs" },
  { to: "/about",        label: "About" },
];

const CATEGORIES = ["Culture", "Legends", "Skills", "Tactics", "Fitness", "Community"];

export default function Footer() {
  return (
    <footer
      className="relative overflow-hidden text-white mt-auto"
      style={{
        background: "linear-gradient(to bottom, #052e16 0%, #030712 100%)",
        borderTop: "1px solid rgba(34,197,94,0.25)",
        boxShadow: "0 -4px 40px rgba(34,197,94,0.08)",
      }}
    >
      {/* Subtle football pitch line texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-5"
        style={{
          backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(34,197,94,0.4) 40px, rgba(34,197,94,0.4) 41px),
                            repeating-linear-gradient(90deg, transparent, transparent 80px, rgba(34,197,94,0.2) 80px, rgba(34,197,94,0.2) 81px)`,
        }}
      />

      {/* Watermark logo */}
      <img src="/logo.png" alt="" className="absolute right-4 bottom-4 w-36 h-36 opacity-5 pointer-events-none select-none" />

      <div className="max-w-6xl mx-auto px-6 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Brand column */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <img src="/logo.png" alt="5s Arena" className="w-10 h-10 rounded-full" style={{ boxShadow: "0 0 12px rgba(34,197,94,0.4)" }} />
              <h3 style={{ fontFamily: "'Oswald', sans-serif", fontSize: "1.2rem", letterSpacing: "0.05em", color: "#f9fafb" }}>
                5s Arena <span style={{ color: "#22c55e" }}>Blog</span>
              </h3>
            </div>
            <p style={{ fontFamily: "'Inter', sans-serif", color: "#6b7280", fontSize: "0.875rem", lineHeight: "1.6" }}>
              Your home for football culture, tactics, legends, and community. Join the conversation.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4
              className="mb-4 pb-2"
              style={{
                fontFamily: "'Oswald', sans-serif",
                fontSize: "0.95rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#22c55e",
                borderBottom: "1px solid rgba(34,197,94,0.2)",
              }}
            >
              Quick Links
            </h4>
            <ul className="space-y-2">
              {QUICK_LINKS.map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="transition-colors text-sm"
                    style={{ fontFamily: "'Inter', sans-serif", color: "#9ca3af" }}
                    onMouseEnter={(e) => (e.target.style.color = "#22c55e")}
                    onMouseLeave={(e) => (e.target.style.color = "#9ca3af")}
                  >
                    → {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4
              className="mb-4 pb-2"
              style={{
                fontFamily: "'Oswald', sans-serif",
                fontSize: "0.95rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#22c55e",
                borderBottom: "1px solid rgba(34,197,94,0.2)",
              }}
            >
              Categories
            </h4>
            <ul className="space-y-2">
              {CATEGORIES.map((cat) => (
                <li key={cat}>
                  <Link
                    to={`/posts?category=${cat}`}
                    className="transition-colors text-sm"
                    style={{ fontFamily: "'Inter', sans-serif", color: "#9ca3af" }}
                    onMouseEnter={(e) => (e.target.style.color = "#22c55e")}
                    onMouseLeave={(e) => (e.target.style.color = "#9ca3af")}
                  >
                    → {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social + Contact */}
          <div>
            <h4
              className="mb-4 pb-2"
              style={{
                fontFamily: "'Oswald', sans-serif",
                fontSize: "0.95rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#22c55e",
                borderBottom: "1px solid rgba(34,197,94,0.2)",
              }}
            >
              Follow Us
            </h4>
            <div className="flex flex-wrap gap-3 mb-6">
              {SOCIAL_LINKS.map(({ href, Icon, label, hoverColor }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="p-2.5 rounded-xl transition-all"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: "#9ca3af",
                  }}
                  whileHover={{ color: hoverColor, borderColor: hoverColor, background: `${hoverColor}15`, scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  title={label}
                >
                  <Icon />
                </motion.a>
              ))}
            </div>
            <p style={{ fontFamily: "'Inter', sans-serif", color: "#6b7280", fontSize: "0.8rem" }}>
              📍 Cape Town, South Africa<br />
              📱 <a href="https://wa.me/27637820245" style={{ color: "#22c55e" }}>WhatsApp Us</a>
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)", color: "#4b5563", fontFamily: "'Inter', sans-serif" }}
        >
          <span>&copy; {new Date().getFullYear()} 5s Arena Blog. All rights reserved.</span>
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1">
            <Link to="/about" className="hover:text-green-500 transition-colors">About</Link>
            <span>·</span>
            <Link to="/roadmap" className="hover:text-green-500 transition-colors">Roadmap</Link>
            <span>·</span>
            <Link to="/analytics" className="hover:text-green-500 transition-colors">Analytics</Link>
            <span>·</span>
            <Link to="/affiliate-disclosure" className="hover:text-green-500 transition-colors">Affiliates</Link>
            <span>·</span>
            <a href="https://wa.me/27637820245" className="hover:text-green-500 transition-colors">Contact</a>
            <span>·</span>
            <a href="/rss.xml" target="_blank" rel="noopener noreferrer" className="hover:text-green-500 transition-colors">RSS</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
