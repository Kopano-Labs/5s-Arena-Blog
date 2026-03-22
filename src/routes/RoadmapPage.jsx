import { useEffect } from "react";
import { motion } from "framer-motion";

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.07 } } };
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 280, damping: 22 } },
};

const ROADMAP = [
  {
    phase: "Completed",
    color: "#22c55e",
    icon: "✅",
    items: [
      { title: "Dark Premium Theme", desc: "Full dark theme with glassmorphism cards", pct: 100 },
      { title: "PWA Support", desc: "Install as mobile app, offline caching", pct: 100 },
      { title: "RSS Feed", desc: "Subscribe to new posts via RSS reader", pct: 100 },
      { title: "Social Media Integration", desc: "Real Facebook, Instagram, TikTok, WhatsApp links", pct: 100 },
      { title: "Author Program", desc: "Author dashboard, post management, rewards", pct: 100 },
      { title: "Fixtures & League Pages", desc: "Live fixtures, standings, league info", pct: 100 },
      { title: "AI Blog Assistant", desc: "Chatbot for navigating the blog", pct: 100 },
      { title: "46 Articles Published", desc: "Including 12 Serie A deep dives and 7 video posts", pct: 100 },
      { title: "Football Tools", desc: "Win rate, goals/game, team comparison, fitness calculators", pct: 100 },
      { title: "Search & ⌘K Modal", desc: "Full-text search with keyboard shortcut", pct: 100 },
    ],
  },
  {
    phase: "In Progress",
    color: "#f59e0b",
    icon: "🔨",
    items: [
      { title: "SSG Migration", desc: "Moving to static site generation for faster loads", pct: 35 },
      { title: "Headless CMS Integration", desc: "Content management via API-driven CMS", pct: 20 },
      { title: "User Comments via API", desc: "Server-backed comment system replacing localStorage", pct: 15 },
    ],
  },
  {
    phase: "Planned",
    color: "#06b6d4",
    icon: "📋",
    items: [
      { title: "Edge Caching & CDN", desc: "Global edge deployment for sub-100ms loads", pct: 0 },
      { title: "Serverless API Functions", desc: "Backend functions for auth, comments, newsletters", pct: 0 },
      { title: "Email Newsletter Automation", desc: "Automated weekly digest emails to subscribers", pct: 0 },
      { title: "Multi-language Support", desc: "Afrikaans, Zulu, Portuguese translations", pct: 0 },
      { title: "Digital Product Shop", desc: "Downloadable football resources and templates", pct: 0 },
      { title: "Affiliate Program", desc: "Earn from football gear and equipment recommendations", pct: 0 },
    ],
  },
];

function ProgressBar({ pct, color }) {
  return (
    <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
      <motion.div
        className="h-full rounded-full"
        style={{ background: color }}
        initial={{ width: 0 }}
        whileInView={{ width: `${pct}%` }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: "easeOut" }}
      />
    </div>
  );
}

export default function RoadmapPage() {
  useEffect(() => {
    document.title = "Roadmap — 5s Arena Blog";
    window.scrollTo(0, 0);
  }, []);

  return (
    <div style={{ background: "var(--color-bg)", minHeight: "100vh" }}>
      {/* Hero */}
      <div className="relative overflow-hidden py-16 text-center"
        style={{ background: "linear-gradient(135deg, #052e16 0%, #0d1117 60%, #111827 100%)", borderBottom: "1px solid rgba(34,197,94,0.15)" }}>
        <div className="absolute inset-0 pointer-events-none opacity-10"
          style={{ backgroundImage: `repeating-linear-gradient(0deg,transparent,transparent 60px,rgba(34,197,94,0.3) 60px,rgba(34,197,94,0.3) 61px)` }} />
        <motion.div className="relative z-10 px-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 200 }}>
          <div className="text-5xl mb-4">🗺️</div>
          <h1 className="gradient-text mb-3"
            style={{ fontFamily: "'Bebas Neue',Impact,sans-serif", fontSize: "clamp(2.5rem,8vw,5rem)", letterSpacing: "0.05em", lineHeight: 1 }}>
            Roadmap
          </h1>
          <p style={{ fontFamily: "'Inter',sans-serif", color: "#9ca3af" }}>
            Where we've been, where we're going. Track our progress.
          </p>
        </motion.div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12 space-y-12">
        {ROADMAP.map(({ phase, color, icon, items }) => (
          <section key={phase}>
            <motion.div className="section-heading mb-6" initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h2 style={{ fontFamily: "'Oswald',sans-serif", fontSize: "1.3rem", color: "#f9fafb" }}>
                {icon} {phase}
              </h2>
            </motion.div>
            <motion.div className="space-y-4" variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              {items.map(({ title, desc, pct }) => (
                <motion.div key={title} variants={fadeUp} className="glass-card rounded-2xl p-5">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <h3 style={{ fontFamily: "'Oswald',sans-serif", color: "#f9fafb", fontSize: "1rem", marginBottom: "0.25rem" }}>{title}</h3>
                      <p style={{ fontFamily: "'Inter',sans-serif", color: "#9ca3af", fontSize: "0.8rem" }}>{desc}</p>
                    </div>
                    <span className="flex-shrink-0 px-2 py-0.5 rounded-full text-xs font-bold"
                      style={{ fontFamily: "'Montserrat',sans-serif", color, background: `${color}15`, border: `1px solid ${color}44` }}>
                      {pct}%
                    </span>
                  </div>
                  <ProgressBar pct={pct} color={color} />
                </motion.div>
              ))}
            </motion.div>
          </section>
        ))}

        {/* CTA */}
        <motion.div className="text-center pt-6" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          <p style={{ fontFamily: "'Inter',sans-serif", color: "#6b7280", fontSize: "0.85rem", marginBottom: "1rem" }}>
            Have a feature request? We'd love to hear from you.
          </p>
          <a href="https://wa.me/27637820245" target="_blank" rel="noopener noreferrer">
            <motion.button className="btn-primary px-6 py-2.5 rounded-xl font-bold text-white text-sm"
              style={{ fontFamily: "'Montserrat',sans-serif" }} whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}>
              📱 WhatsApp Us Your Ideas
            </motion.button>
          </a>
        </motion.div>
      </div>
    </div>
  );
}
