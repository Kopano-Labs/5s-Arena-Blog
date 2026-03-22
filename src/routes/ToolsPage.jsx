import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 280, damping: 22 } },
};

/* ── Win-Rate Calculator ─────────────────────── */
function WinRateCalc() {
  const [wins, setWins] = useState("");
  const [draws, setDraws] = useState("");
  const [losses, setLosses] = useState("");

  const w = parseInt(wins) || 0;
  const d = parseInt(draws) || 0;
  const l = parseInt(losses) || 0;
  const total = w + d + l;
  const winRate = total > 0 ? ((w / total) * 100).toFixed(1) : "0.0";
  const points = w * 3 + d;
  const ppg = total > 0 ? (points / total).toFixed(2) : "0.00";

  return (
    <motion.div className="glass-card rounded-2xl p-6" variants={fadeUp}>
      <h3 style={{ fontFamily: "'Oswald',sans-serif", color: "#22c55e", fontSize: "1.1rem", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "1rem" }}>
        ⚽ Win Rate Calculator
      </h3>
      <div className="grid grid-cols-3 gap-3 mb-4">
        {[["Wins", wins, setWins, "#22c55e"], ["Draws", draws, setDraws, "#f59e0b"], ["Losses", losses, setLosses, "#ef4444"]].map(([label, val, set, clr]) => (
          <div key={label}>
            <label className="text-xs mb-1 block" style={{ fontFamily: "'Montserrat',sans-serif", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</label>
            <input
              type="number" min="0" value={val} onChange={e => set(e.target.value)}
              className="w-full px-3 py-2 rounded-lg text-sm outline-none focus:ring-2"
              style={{ background: "rgba(255,255,255,0.06)", color: "#f9fafb", border: `1px solid ${clr}44`, fontFamily: "'Inter',sans-serif", focusRingColor: clr }}
            />
          </div>
        ))}
      </div>
      {total > 0 && (
        <motion.div className="grid grid-cols-3 gap-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {[["Win Rate", `${winRate}%`, "#22c55e"], ["Points", points, "#06b6d4"], ["PPG", ppg, "#f59e0b"]].map(([label, value, clr]) => (
            <div key={label} className="text-center p-3 rounded-xl" style={{ background: `${clr}10`, border: `1px solid ${clr}30` }}>
              <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "1.5rem", color: clr }}>{value}</div>
              <div style={{ fontFamily: "'Montserrat',sans-serif", fontSize: "0.6rem", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</div>
            </div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}

/* ── Goal-Per-Game Calculator ────────────────── */
function GoalCalc() {
  const [goals, setGoals] = useState("");
  const [games, setGames] = useState("");

  const g = parseInt(goals) || 0;
  const m = parseInt(games) || 0;
  const gpg = m > 0 ? (g / m).toFixed(2) : "0.00";
  const projected = m > 0 ? Math.round((g / m) * 38) : 0;

  return (
    <motion.div className="glass-card rounded-2xl p-6" variants={fadeUp}>
      <h3 style={{ fontFamily: "'Oswald',sans-serif", color: "#06b6d4", fontSize: "1.1rem", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "1rem" }}>
        🥅 Goals Per Game
      </h3>
      <div className="grid grid-cols-2 gap-3 mb-4">
        {[["Goals", goals, setGoals], ["Games Played", games, setGames]].map(([label, val, set]) => (
          <div key={label}>
            <label className="text-xs mb-1 block" style={{ fontFamily: "'Montserrat',sans-serif", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</label>
            <input
              type="number" min="0" value={val} onChange={e => set(e.target.value)}
              className="w-full px-3 py-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-cyan-500/50"
              style={{ background: "rgba(255,255,255,0.06)", color: "#f9fafb", border: "1px solid rgba(6,182,212,0.3)", fontFamily: "'Inter',sans-serif" }}
            />
          </div>
        ))}
      </div>
      {m > 0 && (
        <motion.div className="grid grid-cols-2 gap-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="text-center p-3 rounded-xl" style={{ background: "rgba(6,182,212,0.1)", border: "1px solid rgba(6,182,212,0.3)" }}>
            <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "1.5rem", color: "#06b6d4" }}>{gpg}</div>
            <div style={{ fontFamily: "'Montserrat',sans-serif", fontSize: "0.6rem", color: "#6b7280", textTransform: "uppercase" }}>Per Game</div>
          </div>
          <div className="text-center p-3 rounded-xl" style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.3)" }}>
            <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "1.5rem", color: "#f59e0b" }}>{projected}</div>
            <div style={{ fontFamily: "'Montserrat',sans-serif", fontSize: "0.6rem", color: "#6b7280", textTransform: "uppercase" }}>38-Game Pace</div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

/* ── Team Comparison ─────────────────────────── */
function TeamCompare() {
  const [teamA, setTeamA] = useState({ name: "", goals: "", conceded: "", wins: "", games: "" });
  const [teamB, setTeamB] = useState({ name: "", goals: "", conceded: "", wins: "", games: "" });

  const calc = (t) => {
    const g = parseInt(t.goals) || 0, c = parseInt(t.conceded) || 0, w = parseInt(t.wins) || 0, m = parseInt(t.games) || 0;
    return {
      gd: g - c,
      winRate: m > 0 ? ((w / m) * 100).toFixed(1) : "0.0",
      gpg: m > 0 ? (g / m).toFixed(2) : "0.00",
    };
  };
  const a = calc(teamA), b = calc(teamB);
  const hasData = (parseInt(teamA.games) || 0) > 0 && (parseInt(teamB.games) || 0) > 0;

  const Field = ({ label, team, setTeam, field, placeholder }) => (
    <div>
      <label className="text-xs mb-1 block" style={{ fontFamily: "'Montserrat',sans-serif", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</label>
      <input
        type={field === "name" ? "text" : "number"} min="0" value={team[field]} placeholder={placeholder}
        onChange={e => setTeam({ ...team, [field]: e.target.value })}
        className="w-full px-3 py-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-green-500/50"
        style={{ background: "rgba(255,255,255,0.06)", color: "#f9fafb", border: "1px solid rgba(34,197,94,0.2)", fontFamily: "'Inter',sans-serif" }}
      />
    </div>
  );

  return (
    <motion.div className="glass-card rounded-2xl p-6 lg:col-span-2" variants={fadeUp}>
      <h3 style={{ fontFamily: "'Oswald',sans-serif", color: "#f59e0b", fontSize: "1.1rem", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "1rem" }}>
        ⚔️ Team Comparison
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
        {[["Team A", teamA, setTeamA, "#22c55e"], ["Team B", teamB, setTeamB, "#06b6d4"]].map(([label, team, set, clr]) => (
          <div key={label}>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-3 h-3 rounded-full" style={{ background: clr, boxShadow: `0 0 8px ${clr}` }} />
              <span style={{ fontFamily: "'Montserrat',sans-serif", fontSize: "0.75rem", color: clr, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}>{label}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="col-span-2"><Field label="Team Name" team={team} setTeam={set} field="name" placeholder="Enter name" /></div>
              <Field label="Goals" team={team} setTeam={set} field="goals" />
              <Field label="Conceded" team={team} setTeam={set} field="conceded" />
              <Field label="Wins" team={team} setTeam={set} field="wins" />
              <Field label="Games" team={team} setTeam={set} field="games" />
            </div>
          </div>
        ))}
      </div>
      {hasData && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="h-px my-4" style={{ background: "linear-gradient(90deg, transparent, rgba(34,197,94,0.3), transparent)" }} />
          <div className="grid grid-cols-3 gap-3 text-center">
            {[
              ["Win Rate", `${a.winRate}%`, `${b.winRate}%`],
              ["Goal Diff", a.gd > 0 ? `+${a.gd}` : a.gd, b.gd > 0 ? `+${b.gd}` : b.gd],
              ["Goals/Game", a.gpg, b.gpg],
            ].map(([label, va, vb]) => (
              <div key={label} className="p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="flex justify-between mb-1">
                  <span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "1.2rem", color: "#22c55e" }}>{va}</span>
                  <span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "1.2rem", color: "#06b6d4" }}>{vb}</span>
                </div>
                <div style={{ fontFamily: "'Montserrat',sans-serif", fontSize: "0.55rem", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

/* ── Fitness Calculator (BMI / Calories) ─────── */
function FitnessCalc() {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");

  const h = parseFloat(height) || 0;
  const w = parseFloat(weight) || 0;
  const bmi = h > 0 && w > 0 ? (w / ((h / 100) ** 2)).toFixed(1) : null;
  const category = bmi ? (bmi < 18.5 ? "Underweight" : bmi < 25 ? "Normal" : bmi < 30 ? "Overweight" : "Obese") : "";
  const catColor = bmi ? (bmi < 18.5 ? "#f59e0b" : bmi < 25 ? "#22c55e" : bmi < 30 ? "#f59e0b" : "#ef4444") : "#6b7280";
  // Estimated daily calories for an active footballer (Harris-Benedict rough approx)
  const bmr = w > 0 && h > 0 ? Math.round(10 * w + 6.25 * h - 5 * 25 + 5) : 0;
  const activeCals = Math.round(bmr * 1.725);

  return (
    <motion.div className="glass-card rounded-2xl p-6" variants={fadeUp}>
      <h3 style={{ fontFamily: "'Oswald',sans-serif", color: "#ef4444", fontSize: "1.1rem", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "1rem" }}>
        💪 Footballer Fitness
      </h3>
      <div className="grid grid-cols-2 gap-3 mb-4">
        {[["Height (cm)", height, setHeight], ["Weight (kg)", weight, setWeight]].map(([label, val, set]) => (
          <div key={label}>
            <label className="text-xs mb-1 block" style={{ fontFamily: "'Montserrat',sans-serif", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</label>
            <input
              type="number" min="0" value={val} onChange={e => set(e.target.value)}
              className="w-full px-3 py-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-red-500/50"
              style={{ background: "rgba(255,255,255,0.06)", color: "#f9fafb", border: "1px solid rgba(239,68,68,0.3)", fontFamily: "'Inter',sans-serif" }}
            />
          </div>
        ))}
      </div>
      {bmi && (
        <motion.div className="space-y-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="text-center p-3 rounded-xl" style={{ background: `${catColor}10`, border: `1px solid ${catColor}30` }}>
            <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "2rem", color: catColor }}>{bmi}</div>
            <div style={{ fontFamily: "'Montserrat',sans-serif", fontSize: "0.65rem", color: catColor, textTransform: "uppercase", letterSpacing: "0.08em" }}>BMI — {category}</div>
          </div>
          <div className="text-center p-3 rounded-xl" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)" }}>
            <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "1.4rem", color: "#ef4444" }}>{activeCals.toLocaleString()}</div>
            <div style={{ fontFamily: "'Montserrat',sans-serif", fontSize: "0.6rem", color: "#6b7280", textTransform: "uppercase" }}>Est. Daily Kcal (Active Player)</div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

/* ── Main Page ────────────────────────────────── */
export default function ToolsPage() {
  useEffect(() => {
    document.title = "Football Tools — 5s Arena Blog";
    window.scrollTo(0, 0);
  }, []);

  return (
    <div style={{ background: "var(--color-bg)", minHeight: "100vh" }}>
      {/* Hero */}
      <div
        className="relative overflow-hidden py-16 text-center"
        style={{
          background: "linear-gradient(135deg, #052e16 0%, #0d1117 60%, #111827 100%)",
          borderBottom: "1px solid rgba(34,197,94,0.15)",
        }}
      >
        <div className="absolute inset-0 pointer-events-none opacity-10"
          style={{ backgroundImage: `repeating-linear-gradient(0deg,transparent,transparent 60px,rgba(34,197,94,0.3) 60px,rgba(34,197,94,0.3) 61px),repeating-linear-gradient(90deg,transparent,transparent 100px,rgba(34,197,94,0.15) 100px,rgba(34,197,94,0.15) 101px)` }} />
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(34,197,94,0.08) 0%, transparent 60%)" }} />
        <motion.div className="relative z-10 px-4"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 200 }}>
          <div className="text-5xl mb-4">🧮</div>
          <h1 className="gradient-text mb-3"
            style={{ fontFamily: "'Bebas Neue',Impact,sans-serif", fontSize: "clamp(2.5rem,8vw,5rem)", letterSpacing: "0.05em", lineHeight: 1 }}>
            Football Tools
          </h1>
          <p style={{ fontFamily: "'Inter',sans-serif", color: "#9ca3af", maxWidth: "28rem", margin: "0 auto" }}>
            Interactive calculators for stats nerds, coaches, and players. Crunch the numbers that matter.
          </p>
        </motion.div>
      </div>

      {/* Tools Grid */}
      <motion.div
        className="max-w-5xl mx-auto px-4 py-12"
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <WinRateCalc />
          <GoalCalc />
          <TeamCompare />
          <FitnessCalc />
        </div>

        {/* Suggestions */}
        <motion.div className="mt-12 text-center" variants={fadeUp}>
          <p style={{ fontFamily: "'Inter',sans-serif", color: "#6b7280", fontSize: "0.85rem" }}>
            Have an idea for a new tool?{" "}
            <a href="https://wa.me/27637820245" target="_blank" rel="noopener noreferrer" style={{ color: "#22c55e" }}>
              Let us know on WhatsApp
            </a>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
