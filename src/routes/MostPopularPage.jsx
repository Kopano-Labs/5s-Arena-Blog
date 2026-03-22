import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const panels = [
  {
    key: "blogs",
    icon: "📰",
    heading: "Most Popular Blogs",
    sub: "Top articles from our writers",
    cta: "Explore Articles",
    href: "/posts?sort=popular",
    gradient: "linear-gradient(135deg,#052e16 0%,#111827 100%)",
    glowColor: "rgba(34,197,94,0.5)",
    borderColor: "#22c55e",
    iconColor: "#22c55e",
    delay: 0,
  },
  {
    key: "league",
    icon: "🏆",
    heading: "League Fixtures",
    sub: "Live scores, standings & match highlights",
    cta: "View League",
    href: "/most-popular/league",
    gradient: "linear-gradient(135deg,#431407 0%,#111827 100%)",
    glowColor: "rgba(245,158,11,0.5)",
    borderColor: "#f59e0b",
    iconColor: "#f59e0b",
    delay: 0.15,
  },
  {
    key: "fixtures",
    icon: "⚽",
    heading: "All Fixtures",
    sub: "Full fixture list across all competitions",
    cta: "See Fixtures",
    href: "/fixtures",
    gradient: "linear-gradient(135deg,#082f49 0%,#111827 100%)",
    glowColor: "rgba(6,182,212,0.5)",
    borderColor: "#06b6d4",
    iconColor: "#06b6d4",
    delay: 0.3,
  },
];

export default function MostPopularPage() {
  useEffect(() => {
    document.title = "Most Popular — 5s Arena Blog";
    window.scrollTo(0, 0);
  }, []);

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "var(--color-bg)" }}
    >
      {/* Page Header */}
      <div
        className="relative overflow-hidden py-20 text-center"
        style={{
          background:
            "linear-gradient(to bottom, #052e16 0%, #0d1117 60%, var(--color-bg) 100%)",
          borderBottom: "1px solid rgba(34,197,94,0.15)",
        }}
      >
        {/* Subtle grid texture */}
        <div
          className="absolute inset-0 pointer-events-none opacity-10"
          style={{
            backgroundImage: `repeating-linear-gradient(0deg,transparent,transparent 60px,rgba(34,197,94,0.3) 60px,rgba(34,197,94,0.3) 61px),
                              repeating-linear-gradient(90deg,transparent,transparent 100px,rgba(34,197,94,0.15) 100px,rgba(34,197,94,0.15) 101px)`,
          }}
        />

        <motion.div
          className="relative z-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        >
          <span
            className="inline-block text-xs font-semibold px-3 py-1 rounded-full mb-4"
            style={{
              fontFamily: "'Montserrat',sans-serif",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "#22c55e",
              background: "rgba(34,197,94,0.1)",
              border: "1px solid rgba(34,197,94,0.3)",
            }}
          >
            Discover
          </span>

          <h1
            className="gradient-text mb-4 px-4"
            style={{
              fontFamily: "'Bebas Neue',Impact,sans-serif",
              fontSize: "clamp(3rem,10vw,7rem)",
              letterSpacing: "0.05em",
              lineHeight: 1,
            }}
          >
            Most Popular
          </h1>

          <p
            className="max-w-lg mx-auto px-6"
            style={{
              fontFamily: "'Inter',sans-serif",
              color: "#9ca3af",
              fontSize: "1rem",
            }}
          >
            Choose your destination — top articles, league fixtures, or the full
            match schedule.
          </p>
        </motion.div>
      </div>

      {/* 3-Panel Grid */}
      <div className="flex-1 flex items-center justify-center py-16 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full">
          {panels.map((panel) => (
            <PanelCard key={panel.key} panel={panel} />
          ))}
        </div>
      </div>
    </div>
  );
}

function PanelCard({ panel }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 22,
        delay: panel.delay,
      }}
    >
      <Link to={panel.href}>
        <motion.div
          className="relative rounded-2xl overflow-hidden cursor-pointer h-full"
          style={{
            background: panel.gradient,
            border: `1px solid ${panel.borderColor}40`,
            minHeight: "360px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "2.5rem 2rem",
            textAlign: "center",
          }}
          whileHover={{
            scale: 1.03,
            y: -8,
            boxShadow: `0 20px 60px ${panel.glowColor}, 0 0 0 1px ${panel.borderColor}80`,
          }}
          transition={{ type: "spring", stiffness: 280, damping: 20 }}
        >
          {/* Background glow orb */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse at 50% 40%, ${panel.glowColor}30 0%, transparent 70%)`,
            }}
          />

          {/* Icon */}
          <motion.div
            className="relative z-10 text-6xl mb-6 select-none"
            whileHover={{ scale: 1.2, rotate: [-5, 5, -3, 3, 0] }}
            transition={{ type: "spring", stiffness: 300 }}
            style={{ filter: `drop-shadow(0 0 16px ${panel.glowColor})` }}
          >
            {panel.icon}
          </motion.div>

          {/* Heading */}
          <h2
            className="relative z-10 mb-3"
            style={{
              fontFamily: "'Bebas Neue',Impact,sans-serif",
              fontSize: "clamp(1.8rem,3.5vw,2.5rem)",
              letterSpacing: "0.06em",
              color: "#f9fafb",
              lineHeight: 1.1,
              textShadow: `0 0 30px ${panel.glowColor}`,
            }}
          >
            {panel.heading}
          </h2>

          {/* Sub text */}
          <p
            className="relative z-10 mb-8"
            style={{
              fontFamily: "'Inter',sans-serif",
              color: "#9ca3af",
              fontSize: "0.9rem",
              lineHeight: 1.5,
            }}
          >
            {panel.sub}
          </p>

          {/* CTA Button */}
          <motion.span
            className="relative z-10 px-6 py-3 rounded-xl font-semibold text-sm inline-flex items-center gap-2"
            style={{
              fontFamily: "'Montserrat',sans-serif",
              background: `linear-gradient(135deg, ${panel.borderColor}30, ${panel.borderColor}15)`,
              border: `1px solid ${panel.borderColor}60`,
              color: panel.borderColor,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}
            whileHover={{
              background: panel.borderColor,
              color: "#030712",
            }}
            transition={{ duration: 0.2 }}
          >
            {panel.cta}
            <span style={{ fontSize: "1rem" }}>→</span>
          </motion.span>

          {/* Bottom left border accent */}
          <div
            className="absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl"
            style={{
              background: `linear-gradient(90deg, ${panel.borderColor}, transparent)`,
            }}
          />
        </motion.div>
      </Link>
    </motion.div>
  );
}
