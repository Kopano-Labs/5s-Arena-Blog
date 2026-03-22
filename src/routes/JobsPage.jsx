import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 260, damping: 20 } },
};

const CATEGORIES = ["All", "Coaching", "Management", "Content", "Events", "Community"];

const CATEGORY_COLORS = {
  Coaching: "#22c55e",
  Management: "#f59e0b",
  Content: "#06b6d4",
  Events: "#a855f7",
  Community: "#ec4899",
};

const TYPE_COLORS = {
  "Part-Time": "#f59e0b",
  "Full-Time": "#22c55e",
  Freelance: "#06b6d4",
  Contract: "#a855f7",
};

const JOBS = [
  {
    title: "5-a-Side League Referee",
    category: "Events",
    type: "Part-Time",
    location: "Cape Town",
    salary: "R150/hr",
    desc: "Officiate local 5-a-side league matches and ensure fair play across all divisions.",
  },
  {
    title: "Football Content Writer",
    category: "Content",
    type: "Freelance",
    location: "Remote",
    salary: "R200/article",
    desc: "Write engaging match reports, opinion pieces, and tactical breakdowns for the blog.",
  },
  {
    title: "Youth Football Coach",
    category: "Coaching",
    type: "Part-Time",
    location: "Cape Town",
    salary: "R250/hr",
    desc: "Train and develop U12 players with structured sessions focused on fundamentals.",
  },
  {
    title: "Social Media Manager",
    category: "Content",
    type: "Full-Time",
    location: "Remote",
    salary: "R15,000/mo",
    desc: "Grow our social channels with match-day content, reels, and community engagement.",
  },
  {
    title: "Tournament Coordinator",
    category: "Events",
    type: "Contract",
    location: "Cape Town",
    salary: "R12,000/mo",
    desc: "Plan and execute weekend 5-a-side tournaments including logistics and sponsorships.",
  },
  {
    title: "Community Engagement Officer",
    category: "Community",
    type: "Full-Time",
    location: "Cape Town",
    salary: "R18,000/mo",
    desc: "Build partnerships with local clubs, schools, and organisations to grow grassroots football.",
  },
  {
    title: "Goalkeeper Coach",
    category: "Coaching",
    type: "Part-Time",
    location: "Johannesburg",
    salary: "R300/hr",
    desc: "Run specialised goalkeeper training sessions for amateur and semi-pro keepers.",
  },
  {
    title: "Football Blog Editor",
    category: "Content",
    type: "Full-Time",
    location: "Remote",
    salary: "R20,000/mo",
    desc: "Oversee editorial calendar, review submissions, and maintain quality across all posts.",
  },
];

export default function JobsPage() {
  const [active, setActive] = useState("All");

  useEffect(() => {
    document.title = "Job Board — 5s Arena Blog";
    window.scrollTo(0, 0);
  }, []);

  const filtered = active === "All" ? JOBS : JOBS.filter((j) => j.category === active);

  const whatsappLink = (title) =>
    `https://wa.me/27637820245?text=${encodeURIComponent(`Hi, I'm interested in the "${title}" position listed on 5s Arena Blog. I'd like to apply!`)}`;

  return (
    <div style={{ background: "var(--color-bg, #030712)", minHeight: "100vh" }}>
      {/* Hero */}
      <div
        className="relative overflow-hidden py-20 text-center"
        style={{
          background: "linear-gradient(135deg, #052e16 0%, #0d1117 60%, #111827 100%)",
          borderBottom: "1px solid rgba(34,197,94,0.15)",
        }}
      >
        {/* Pitch line textures */}
        <div
          className="absolute inset-0 pointer-events-none opacity-10"
          style={{
            backgroundImage: `repeating-linear-gradient(0deg,transparent,transparent 60px,rgba(34,197,94,0.3) 60px,rgba(34,197,94,0.3) 61px),
              repeating-linear-gradient(90deg,transparent,transparent 60px,rgba(34,197,94,0.15) 60px,rgba(34,197,94,0.15) 61px)`,
          }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full border border-green-500/10 pointer-events-none" />

        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          style={{
            fontFamily: "'Bebas Neue',sans-serif",
            fontSize: "clamp(2.5rem,6vw,4rem)",
            color: "#f9fafb",
            letterSpacing: "0.04em",
            lineHeight: 1.1,
            position: "relative",
          }}
        >
          Job Board
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, type: "spring", stiffness: 260, damping: 20 }}
          style={{
            fontFamily: "'Inter',sans-serif",
            color: "#9ca3af",
            fontSize: "1.05rem",
            marginTop: "0.75rem",
            position: "relative",
          }}
        >
          Football careers and opportunities
        </motion.p>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Filter pills */}
        <motion.div
          className="flex flex-wrap gap-2 justify-center mb-10"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          {CATEGORIES.map((cat) => {
            const isActive = active === cat;
            return (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                style={{
                  fontFamily: "'Montserrat',sans-serif",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  padding: "0.45rem 1.1rem",
                  borderRadius: "9999px",
                  border: isActive ? "1px solid #22c55e" : "1px solid rgba(255,255,255,0.1)",
                  background: isActive ? "rgba(34,197,94,0.15)" : "rgba(255,255,255,0.04)",
                  color: isActive ? "#22c55e" : "#9ca3af",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                {cat}
              </button>
            );
          })}
        </motion.div>

        {/* Job grid */}
        <motion.div
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-2"
          variants={stagger}
          initial="hidden"
          animate="visible"
          key={active}
        >
          {filtered.map((job) => (
            <motion.div
              key={job.title}
              className="glass-card rounded-2xl p-6 flex flex-col gap-3"
              variants={fadeUp}
              whileHover={{ y: -6, boxShadow: "0 12px 40px rgba(34,197,94,0.12)" }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              {/* Title */}
              <h3
                style={{
                  fontFamily: "'Oswald',sans-serif",
                  color: "#f9fafb",
                  fontSize: "1.2rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.03em",
                  margin: 0,
                }}
              >
                {job.title}
              </h3>

              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                <span
                  style={{
                    fontFamily: "'Montserrat',sans-serif",
                    fontSize: "0.65rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    padding: "0.25rem 0.65rem",
                    borderRadius: "9999px",
                    background: `${CATEGORY_COLORS[job.category]}18`,
                    color: CATEGORY_COLORS[job.category],
                    border: `1px solid ${CATEGORY_COLORS[job.category]}30`,
                  }}
                >
                  {job.category}
                </span>
                <span
                  style={{
                    fontFamily: "'Montserrat',sans-serif",
                    fontSize: "0.65rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    padding: "0.25rem 0.65rem",
                    borderRadius: "9999px",
                    background: `${TYPE_COLORS[job.type]}18`,
                    color: TYPE_COLORS[job.type],
                    border: `1px solid ${TYPE_COLORS[job.type]}30`,
                  }}
                >
                  {job.type}
                </span>
              </div>

              {/* Location */}
              <div
                style={{
                  fontFamily: "'Inter',sans-serif",
                  fontSize: "0.85rem",
                  color: "#9ca3af",
                }}
              >
                📍 {job.location}
              </div>

              {/* Salary */}
              <div
                style={{
                  fontFamily: "'Bebas Neue',sans-serif",
                  fontSize: "1.4rem",
                  color: "#22c55e",
                  letterSpacing: "0.03em",
                }}
              >
                {job.salary}
              </div>

              {/* Description */}
              <p
                style={{
                  fontFamily: "'Inter',sans-serif",
                  fontSize: "0.85rem",
                  color: "#6b7280",
                  lineHeight: 1.5,
                  margin: 0,
                }}
              >
                {job.desc}
              </p>

              {/* Apply button */}
              <a
                href={whatsappLink(job.title)}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  marginTop: "auto",
                  padding: "0.6rem 1.2rem",
                  borderRadius: "0.75rem",
                  background: "rgba(34,197,94,0.12)",
                  border: "1px solid rgba(34,197,94,0.3)",
                  color: "#22c55e",
                  fontFamily: "'Montserrat',sans-serif",
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  textDecoration: "none",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  width: "fit-content",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(34,197,94,0.25)";
                  e.currentTarget.style.borderColor = "rgba(34,197,94,0.5)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(34,197,94,0.12)";
                  e.currentTarget.style.borderColor = "rgba(34,197,94,0.3)";
                }}
              >
                Apply via WhatsApp
              </a>
            </motion.div>
          ))}
        </motion.div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p style={{ fontFamily: "'Inter',sans-serif", color: "#6b7280", fontSize: "1rem" }}>
              No jobs found in this category.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
