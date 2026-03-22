import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.07 } } };
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 280, damping: 22 } },
};

/* ── Mock data ── */
const MOCK_VITALS = { lcp: 1.2, inp: 48, cls: 0.03 };
const MOCK_CDN = {
  cacheHitRate: 94.7,
  totalRequests: "12.4K",
  bandwidth: "2.1 GB",
  edgeNodes: ["Cape Town", "London", "New York", "Singapore", "São Paulo", "Tokyo"],
};
const MOCK_TRAFFIC = [
  { page: "/", views: 4820, uniques: 2310 },
  { page: "/posts", views: 3140, uniques: 1450 },
  { page: "/fixtures", views: 2680, uniques: 1230 },
  { page: "/league", views: 1920, uniques: 890 },
  { page: "/about", views: 780, uniques: 420 },
  { page: "/tools", views: 560, uniques: 310 },
];
const MOCK_SOURCES = [
  { source: "Google Search", pct: 42 },
  { source: "Direct", pct: 28 },
  { source: "Social Media", pct: 18 },
  { source: "Referral", pct: 8 },
  { source: "Email", pct: 4 },
];

function AnimatedNumber({ value, duration = 1.5 }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = 0;
    const end = typeof value === "number" ? value : parseFloat(value);
    if (isNaN(end)) return;
    const step = end / (duration * 60);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setDisplay(end); clearInterval(timer); }
      else setDisplay(start);
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [value, duration]);
  return typeof value === "number" && value < 10
    ? display.toFixed(value < 1 ? 2 : 1)
    : Math.round(display).toLocaleString();
}

function VitalBadge({ label, value, unit, good }) {
  const color = good ? "#22c55e" : "#f59e0b";
  return (
    <motion.div variants={fadeUp} className="glass-card rounded-2xl p-5 text-center">
      <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "2.5rem", color }}>
        <AnimatedNumber value={value} />
      </div>
      <div style={{ fontFamily: "'Montserrat',sans-serif", fontSize: "0.65rem", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.08em" }}>
        {unit}
      </div>
      <div className="mt-2 flex items-center justify-center gap-1.5">
        <div className="w-2 h-2 rounded-full" style={{ background: color, boxShadow: `0 0 6px ${color}` }} />
        <span style={{ fontFamily: "'Inter',sans-serif", fontSize: "0.75rem", color }}>{label}</span>
      </div>
      <span className="text-xs mt-1 block" style={{ color: "#6b7280" }}>{good ? "Good" : "Needs Improvement"}</span>
    </motion.div>
  );
}

export default function AnalyticsPage() {
  useEffect(() => {
    document.title = "Analytics — 5s Arena Blog";
    window.scrollTo(0, 0);
  }, []);

  const maxViews = Math.max(...MOCK_TRAFFIC.map(t => t.views));

  return (
    <div style={{ background: "var(--color-bg)", minHeight: "100vh" }}>
      {/* Hero */}
      <div className="relative overflow-hidden py-16 text-center"
        style={{ background: "linear-gradient(135deg, #052e16 0%, #0d1117 60%, #111827 100%)", borderBottom: "1px solid rgba(34,197,94,0.15)" }}>
        <div className="absolute inset-0 pointer-events-none opacity-10"
          style={{ backgroundImage: `repeating-linear-gradient(0deg,transparent,transparent 60px,rgba(34,197,94,0.3) 60px,rgba(34,197,94,0.3) 61px)` }} />
        <motion.div className="relative z-10 px-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 200 }}>
          <div className="text-5xl mb-4">📊</div>
          <h1 className="gradient-text mb-3"
            style={{ fontFamily: "'Bebas Neue',Impact,sans-serif", fontSize: "clamp(2.5rem,8vw,5rem)", letterSpacing: "0.05em", lineHeight: 1 }}>
            Analytics
          </h1>
          <p style={{ fontFamily: "'Inter',sans-serif", color: "#9ca3af" }}>
            Privacy-focused site performance and traffic overview
          </p>
          <p className="mt-2 px-3 py-1 rounded-full inline-block text-xs" style={{ fontFamily: "'Montserrat',sans-serif", background: "rgba(34,197,94,0.15)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.3)" }}>
            Demo Data — Not Real Analytics
          </p>
        </motion.div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12 space-y-10">
        {/* Core Web Vitals */}
        <section>
          <div className="section-heading mb-6">
            <h2 style={{ fontFamily: "'Oswald',sans-serif", fontSize: "1.3rem", color: "#f9fafb" }}>Core Web Vitals</h2>
          </div>
          <motion.div className="grid grid-cols-1 sm:grid-cols-3 gap-5" variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <VitalBadge label="LCP" value={MOCK_VITALS.lcp} unit="Largest Contentful Paint (s)" good />
            <VitalBadge label="INP" value={MOCK_VITALS.inp} unit="Interaction to Next Paint (ms)" good />
            <VitalBadge label="CLS" value={MOCK_VITALS.cls} unit="Cumulative Layout Shift" good />
          </motion.div>
        </section>

        {/* CDN Performance */}
        <section>
          <div className="section-heading mb-6">
            <h2 style={{ fontFamily: "'Oswald',sans-serif", fontSize: "1.3rem", color: "#f9fafb" }}>CDN Performance</h2>
          </div>
          <motion.div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-6" variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            {[["Cache Hit Rate", `${MOCK_CDN.cacheHitRate}%`, "#22c55e"], ["Total Requests", MOCK_CDN.totalRequests, "#06b6d4"], ["Bandwidth", MOCK_CDN.bandwidth, "#f59e0b"]].map(([label, val, clr]) => (
              <motion.div key={label} variants={fadeUp} className="glass-card rounded-2xl p-5 text-center">
                <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "2rem", color: clr }}>{val}</div>
                <div style={{ fontFamily: "'Montserrat',sans-serif", fontSize: "0.65rem", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</div>
              </motion.div>
            ))}
          </motion.div>
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="glass-card rounded-2xl p-5">
            <h4 className="mb-3" style={{ fontFamily: "'Montserrat',sans-serif", fontSize: "0.75rem", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.08em" }}>Edge Nodes</h4>
            <div className="flex flex-wrap gap-2">
              {MOCK_CDN.edgeNodes.map(node => (
                <span key={node} className="px-3 py-1 rounded-full text-xs font-semibold"
                  style={{ fontFamily: "'Montserrat',sans-serif", background: "rgba(34,197,94,0.1)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.3)" }}>
                  🌐 {node}
                </span>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Top Pages */}
        <section>
          <div className="section-heading mb-6">
            <h2 style={{ fontFamily: "'Oswald',sans-serif", fontSize: "1.3rem", color: "#f9fafb" }}>Top Pages</h2>
          </div>
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="glass-card rounded-2xl p-5 space-y-3">
            {MOCK_TRAFFIC.map(({ page, views, uniques }) => (
              <motion.div key={page} variants={fadeUp} className="flex items-center gap-4">
                <span className="w-28 text-sm truncate" style={{ fontFamily: "'Inter',sans-serif", color: "#f9fafb" }}>{page}</span>
                <div className="flex-1 relative h-6 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: "linear-gradient(90deg, #22c55e, #06b6d4)" }}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${(views / maxViews) * 100}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </div>
                <span className="w-16 text-right text-sm" style={{ fontFamily: "'Bebas Neue',sans-serif", color: "#22c55e" }}>{views.toLocaleString()}</span>
                <span className="w-16 text-right text-xs" style={{ fontFamily: "'Inter',sans-serif", color: "#6b7280" }}>{uniques.toLocaleString()} uniq</span>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Traffic Sources */}
        <section>
          <div className="section-heading mb-6">
            <h2 style={{ fontFamily: "'Oswald',sans-serif", fontSize: "1.3rem", color: "#f9fafb" }}>Traffic Sources</h2>
          </div>
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            {MOCK_SOURCES.map(({ source, pct }) => (
              <motion.div key={source} variants={fadeUp} className="glass-card rounded-2xl p-4 text-center">
                <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "1.8rem", color: "#06b6d4" }}>{pct}%</div>
                <div style={{ fontFamily: "'Inter',sans-serif", fontSize: "0.7rem", color: "#9ca3af" }}>{source}</div>
              </motion.div>
            ))}
          </motion.div>
        </section>
      </div>
    </div>
  );
}
