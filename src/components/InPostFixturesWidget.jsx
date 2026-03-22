import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

/* ── Shared mock data (subset for sidebar) ──────────────────── */
const LEAGUE_META = {
  PL:  { name: "Premier League", accent: "#a855f7" },
  LL:  { name: "La Liga",        accent: "#f97316" },
  SA:  { name: "Serie A",        accent: "#3b82f6" },
  BL:  { name: "Bundesliga",     accent: "#ef4444" },
  PSL: { name: "PSL",            accent: "#eab308" },
  UCL: { name: "Champions League", accent: "#1e3a8a" },
};

const sidebarMatches = [
  { id: 1, league: "PL",  home: "Arsenal",        away: "Chelsea",          homeScore: 2, awayScore: 1, status: "IN_PLAY", minute: 67 },
  { id: 2, league: "SA",  home: "Inter Milan",    away: "AC Milan",         homeScore: 2, awayScore: 2, status: "IN_PLAY", minute: 88 },
  { id: 5, league: "PL",  home: "Brighton",       away: "West Ham",         homeScore: null, awayScore: null, status: "TIMED", kickoff: "17:30" },
];

const standings = [
  { pos: 1, team: "Arsenal",         p: 28, w: 22, pts: 70 },
  { pos: 2, team: "Man City",        p: 28, w: 20, pts: 64 },
  { pos: 3, team: "Liverpool",       p: 28, w: 19, pts: 62 },
  { pos: 4, team: "Chelsea",         p: 28, w: 16, pts: 52 },
  { pos: 5, team: "Tottenham",       p: 28, w: 15, pts: 49 },
];

/* ── Mini badge ────────────────────────────────────────────── */
function TeamAbbr({ name }) {
  const abbr = name.split(" ").map(w => w[0]).join("").slice(0, 3).toUpperCase();
  return (
    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full text-white"
      style={{ background: "rgba(34,197,94,0.2)", fontSize: "0.55rem", fontWeight: 700, fontFamily: "'Montserrat',sans-serif" }}>
      {abbr}
    </span>
  );
}

/* ── Live pulse badge ──────────────────────────────────────── */
function LiveDot() {
  return (
    <motion.span className="inline-block w-2 h-2 rounded-full bg-red-500"
      animate={{ opacity: [1, 0.3, 1] }}
      transition={{ duration: 1.2, repeat: Infinity }} />
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN WIDGET — fixtures + standings + join CTA
   ═══════════════════════════════════════════════════════════════ */
export default function InPostFixturesWidget() {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="flex flex-col gap-5">

      {/* ── Fixtures Card ──────────────────────────────────── */}
      <motion.div
        className="rounded-2xl overflow-hidden"
        style={{
          background: "rgba(17,24,39,0.8)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(34,197,94,0.2)",
          boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
        }}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 200, damping: 22 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3"
          style={{ borderBottom: "1px solid rgba(34,197,94,0.15)" }}>
          <h4 style={{ fontFamily: "'Oswald',sans-serif", fontSize: "0.9rem", color: "#22c55e", textTransform: "uppercase", letterSpacing: "0.1em" }}>
            ⚽ Live &amp; Upcoming
          </h4>
          <Link to="/fixtures"
            className="text-xs transition-colors"
            style={{ fontFamily: "'Inter',sans-serif", color: "#9ca3af" }}
            onMouseEnter={e => e.target.style.color = "#22c55e"}
            onMouseLeave={e => e.target.style.color = "#9ca3af"}>
            See All →
          </Link>
        </div>

        {/* Matches */}
        <div className="divide-y" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
          {sidebarMatches.map((m, i) => (
            <motion.div key={m.id}
              className="px-4 py-3 flex items-center gap-3"
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}>

              {/* League accent dot */}
              <div className="w-1 h-8 rounded-full flex-shrink-0"
                style={{ background: LEAGUE_META[m.league]?.accent || "#6b7280" }} />

              <div className="flex-1 min-w-0">
                {/* Home */}
                <div className="flex items-center gap-2 mb-1">
                  <TeamAbbr name={m.home} />
                  <span className="text-xs truncate" style={{ fontFamily: "'Inter',sans-serif", color: "#d1d5db" }}>
                    {m.home}
                  </span>
                  {m.status === "IN_PLAY" && (
                    <span className="ml-auto font-bold text-sm" style={{ fontFamily: "'Bebas Neue',sans-serif", color: "#f9fafb" }}>
                      {m.homeScore}
                    </span>
                  )}
                </div>
                {/* Away */}
                <div className="flex items-center gap-2">
                  <TeamAbbr name={m.away} />
                  <span className="text-xs truncate" style={{ fontFamily: "'Inter',sans-serif", color: "#d1d5db" }}>
                    {m.away}
                  </span>
                  {m.status === "IN_PLAY" && (
                    <span className="ml-auto font-bold text-sm" style={{ fontFamily: "'Bebas Neue',sans-serif", color: "#f9fafb" }}>
                      {m.awayScore}
                    </span>
                  )}
                </div>
              </div>

              {/* Status */}
              <div className="flex-shrink-0 text-right">
                {m.status === "IN_PLAY" ? (
                  <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full"
                    style={{ background: "rgba(239,68,68,0.15)", color: "#f87171", border: "1px solid rgba(239,68,68,0.3)" }}>
                    <LiveDot /> {m.minute}&apos;
                  </span>
                ) : (
                  <span className="text-xs" style={{ color: "#6b7280", fontFamily: "'Inter',sans-serif" }}>
                    ⏰ {m.kickoff}
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ── Standings Snippet ──────────────────────────────── */}
      <motion.div
        className="rounded-2xl overflow-hidden"
        style={{
          background: "rgba(17,24,39,0.8)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(34,197,94,0.2)",
          boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
        }}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 200, damping: 22, delay: 0.1 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3"
          style={{ borderBottom: "1px solid rgba(34,197,94,0.15)" }}>
          <h4 style={{ fontFamily: "'Oswald',sans-serif", fontSize: "0.9rem", color: "#22c55e", textTransform: "uppercase", letterSpacing: "0.1em" }}>
            🏆 Premier League
          </h4>
          <Link to="/fixtures"
            className="text-xs transition-colors"
            style={{ fontFamily: "'Inter',sans-serif", color: "#9ca3af" }}
            onMouseEnter={e => e.target.style.color = "#22c55e"}
            onMouseLeave={e => e.target.style.color = "#9ca3af"}>
            Full Standings →
          </Link>
        </div>

        {/* Table header */}
        <div className="grid grid-cols-[24px_1fr_30px_30px_40px] gap-1 px-4 py-2 text-xs"
          style={{ fontFamily: "'Montserrat',sans-serif", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.08em", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
          <span>#</span><span>Team</span><span className="text-center">P</span><span className="text-center">W</span><span className="text-center font-bold">Pts</span>
        </div>

        {/* Rows */}
        {standings.map((row, i) => (
          <motion.div key={row.team}
            className="grid grid-cols-[24px_1fr_30px_30px_40px] gap-1 px-4 py-2 items-center"
            style={{
              borderBottom: i < standings.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
              background: i === 0 ? "rgba(34,197,94,0.06)" : "transparent",
            }}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}>
            <span className="text-xs font-bold" style={{ color: i === 0 ? "#22c55e" : "#9ca3af", fontFamily: "'Montserrat',sans-serif" }}>{row.pos}</span>
            <span className="text-xs truncate" style={{ fontFamily: "'Inter',sans-serif", color: "#d1d5db" }}>{row.team}</span>
            <span className="text-xs text-center" style={{ color: "#9ca3af" }}>{row.p}</span>
            <span className="text-xs text-center" style={{ color: "#9ca3af" }}>{row.w}</span>
            <span className="text-xs text-center font-bold" style={{ color: "#f9fafb", fontFamily: "'Montserrat',sans-serif" }}>{row.pts}</span>
          </motion.div>
        ))}
      </motion.div>

      {/* ── Join League CTA ────────────────────────────────── */}
      <motion.div
        className="rounded-2xl overflow-hidden relative"
        style={{
          background: "linear-gradient(135deg,rgba(5,46,22,0.9),rgba(17,24,39,0.9))",
          border: "1px solid transparent",
          boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
        }}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 200, damping: 22, delay: 0.2 }}
        whileHover={{ boxShadow: "0 0 30px rgba(34,197,94,0.3), 0 0 0 1px rgba(34,197,94,0.4)" }}
      >
        {/* Animated border glow */}
        <div className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            background: "linear-gradient(135deg,rgba(34,197,94,0.3),rgba(6,182,212,0.3),rgba(34,197,94,0.3))",
            backgroundSize: "200% 200%",
            animation: "bg-pan-left 4s linear infinite",
            maskImage: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            maskComposite: "xor",
            WebkitMaskComposite: "xor",
            padding: "1px",
            borderRadius: "1rem",
          }} />

        <div className="p-5 text-center relative z-10">
          <div className="text-3xl mb-2">⚽</div>
          <h4 style={{ fontFamily: "'Oswald',sans-serif", fontSize: "1.1rem", color: "#f9fafb", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.5rem" }}>
            Join the League
          </h4>
          <p style={{ fontFamily: "'Inter',sans-serif", color: "#9ca3af", fontSize: "0.8rem", lineHeight: 1.5, marginBottom: "1rem" }}>
            Play competitive 5-a-side football. Register your team today.
          </p>
          <div className="flex flex-col sm:flex-row gap-2">
            <Link to="/league" className="flex-1">
              <motion.button
                className="w-full btn-primary py-2.5 rounded-xl text-xs font-semibold"
                style={{ fontFamily: "'Montserrat',sans-serif" }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}>
                Join League
              </motion.button>
            </Link>
            <a href="https://wa.me/27637820245" target="_blank" rel="noopener noreferrer" className="flex-1">
              <motion.button
                className="w-full py-2.5 rounded-xl text-xs font-semibold"
                style={{
                  fontFamily: "'Montserrat',sans-serif",
                  background: "rgba(37,211,102,0.15)",
                  border: "1px solid rgba(37,211,102,0.4)",
                  color: "#25d366",
                }}
                whileHover={{ background: "rgba(37,211,102,0.25)", scale: 1.03 }}
                whileTap={{ scale: 0.97 }}>
                WhatsApp Us
              </motion.button>
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
