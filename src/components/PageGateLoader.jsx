import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";

/* ── 5 icon gate sets — one cycles per visit (persists per session) ── */
const GATE_SETS = [
  {
    id: 0,
    icon: "⚽",
    title: "KICK TO ENTER",
    subtitle: "Tap the ball — score your way in!",
    color: "#22c55e",
    glow: "rgba(34,197,94,0.5)",
    clicks: 5,
    hint: "5 kicks needed",
  },
  {
    id: 1,
    icon: "🏆",
    title: "CLAIM THE GLORY",
    subtitle: "Touch the trophy to unlock the pitch!",
    color: "#f59e0b",
    glow: "rgba(245,158,11,0.5)",
    clicks: 3,
    hint: "3 taps to victory",
  },
  {
    id: 2,
    icon: "🎯",
    title: "HIT THE TARGET",
    subtitle: "Strike the bullseye to break through!",
    color: "#06b6d4",
    glow: "rgba(6,182,212,0.5)",
    clicks: 7,
    hint: "7 hits required",
  },
  {
    id: 3,
    icon: "⚡",
    title: "CHARGE IT UP!",
    subtitle: "Power the stadium — tap fast!",
    color: "#a855f7",
    glow: "rgba(168,85,247,0.5)",
    clicks: 4,
    hint: "4 charges needed",
  },
  {
    id: 4,
    icon: "🔥",
    title: "IGNITE THE PITCH",
    subtitle: "Light the fire to open the gates!",
    color: "#ef4444",
    glow: "rgba(239,68,68,0.5)",
    clicks: 6,
    hint: "6 taps to ignite",
  },
];

/* ── Pick which gate set to show — cycles each reload ── */
function pickGateIndex() {
  const stored = sessionStorage.getItem("5s_gate_idx");
  const prev = stored !== null ? parseInt(stored, 10) : -1;
  const next = (prev + 1) % GATE_SETS.length;
  sessionStorage.setItem("5s_gate_idx", String(next));
  return next;
}

/* ── Ripple burst on click ── */
function Ripple({ x, y, color }) {
  return (
    <motion.div
      className="pointer-events-none absolute rounded-full"
      style={{
        left: x - 60,
        top: y - 60,
        width: 120,
        height: 120,
        border: `3px solid ${color}`,
        background: `${color}20`,
      }}
      initial={{ scale: 0, opacity: 1 }}
      animate={{ scale: 2.5, opacity: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    />
  );
}

/* ── Floating particle ── */
function Particle({ color }) {
  const x = Math.random() * 600 - 300;
  const y = -(Math.random() * 300 + 100);
  const size = Math.random() * 10 + 4;
  return (
    <motion.div
      className="pointer-events-none absolute rounded-full"
      style={{
        width: size,
        height: size,
        background: color,
        left: "50%",
        top: "50%",
        opacity: 0.8,
      }}
      animate={{ x, y, opacity: 0, scale: [1, 1.5, 0] }}
      transition={{ duration: Math.random() * 0.8 + 0.5, ease: "easeOut" }}
    />
  );
}

export default function PageGateLoader({ onUnlock }) {
  const [gateIdx] = useState(() => pickGateIndex());
  const gate = GATE_SETS[gateIdx];

  const [clicks, setClicks] = useState(0);
  const [unlocked, setUnlocked] = useState(false);
  const [ripples, setRipples] = useState([]);
  const [particles, setParticles] = useState([]);
  const [shakeKey, setShakeKey] = useState(0);
  const controls = useAnimation();

  const progress = Math.min(clicks / gate.clicks, 1);
  const progressPct = Math.round(progress * 100);

  /* Click the icon */
  const handleClick = useCallback(
    (e) => {
      if (unlocked) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      /* Ripple */
      const rid = Date.now();
      setRipples((r) => [...r, { id: rid, x, y }]);
      setTimeout(() => setRipples((r) => r.filter((i) => i.id !== rid)), 700);

      /* Particles every 2 clicks */
      if ((clicks + 1) % 2 === 0) {
        const pid = Date.now() + 1;
        setParticles((p) => [...p, { id: pid }]);
        setTimeout(() => setParticles((p) => p.filter((i) => i.id !== pid)), 900);
      }

      /* Shake the icon */
      setShakeKey((k) => k + 1);
      controls.start({
        rotate: [0, -15, 15, -10, 10, -5, 5, 0],
        scale: [1, 1.3, 1.1, 1.25, 1],
        transition: { duration: 0.45, type: "spring", stiffness: 400 },
      });

      const next = clicks + 1;
      setClicks(next);

      if (next >= gate.clicks) {
        setTimeout(() => setUnlocked(true), 400);
        setTimeout(() => onUnlock(), 1600);
      }
    },
    [clicks, gate.clicks, unlocked, controls, onUnlock]
  );

  /* Play again */
  const handlePlayAgain = () => {
    setClicks(0);
    setUnlocked(false);
    setRipples([]);
    setParticles([]);
    controls.start({ rotate: 0, scale: 1 });
    /* Pick next gate */
    const next = (gateIdx + 1) % GATE_SETS.length;
    sessionStorage.setItem("5s_gate_idx", String(next));
    window.location.reload();
  };

  return (
    <AnimatePresence>
      {!unlocked ? (
        <motion.div
          key="gate"
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
          style={{
            background:
              "radial-gradient(ellipse at 50% 40%, #052e16 0%, #0d1117 50%, #030712 100%)",
          }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.7 }}
        >
          {/* Ambient glow blobs */}
          <motion.div
            className="absolute rounded-full pointer-events-none"
            style={{
              width: 600,
              height: 600,
              background: `radial-gradient(circle, ${gate.glow} 0%, transparent 70%)`,
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
            animate={{ scale: [0.8, 1.1, 0.8], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Pitch lines texture */}
          <div
            className="absolute inset-0 pointer-events-none opacity-10"
            style={{
              backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 48px, rgba(34,197,94,0.4) 48px, rgba(34,197,94,0.4) 49px),
                repeating-linear-gradient(90deg, transparent, transparent 48px, rgba(34,197,94,0.4) 48px, rgba(34,197,94,0.4) 49px)`,
            }}
          />

          {/* Gate set indicator dots */}
          <div className="absolute top-8 flex gap-2">
            {GATE_SETS.map((g, i) => (
              <motion.div
                key={g.id}
                className="w-2 h-2 rounded-full"
                style={{
                  background: i === gateIdx ? gate.color : "rgba(255,255,255,0.15)",
                  boxShadow: i === gateIdx ? `0 0 8px ${gate.color}` : "none",
                }}
                animate={i === gateIdx ? { scale: [1, 1.4, 1] } : {}}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            ))}
          </div>

          {/* Title */}
          <motion.div
            className="text-center mb-10 px-4"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
          >
            <motion.p
              className="text-xs tracking-[0.3em] mb-2"
              style={{ fontFamily: "'Montserrat',sans-serif", color: gate.color }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              INTERACTIVE ENTRY
            </motion.p>
            <h1
              style={{
                fontFamily: "'Bebas Neue',Impact,sans-serif",
                fontSize: "clamp(2.5rem,8vw,5rem)",
                letterSpacing: "0.08em",
                color: "#f9fafb",
                textShadow: `0 0 40px ${gate.glow}, 0 4px 20px rgba(0,0,0,0.8)`,
              }}
            >
              {gate.title}
            </h1>
            <p style={{ fontFamily: "'Inter',sans-serif", color: "#9ca3af", fontSize: "1rem", marginTop: "0.5rem" }}>
              {gate.subtitle}
            </p>
          </motion.div>

          {/* Big clickable icon */}
          <div className="relative flex items-center justify-center mb-12">
            {/* Ripples */}
            {ripples.map((r) => (
              <Ripple key={r.id} x={r.x} y={r.y} color={gate.color} />
            ))}
            {/* Particles */}
            {particles.map((p) => (
              <Particle key={p.id} color={gate.color} />
            ))}

            {/* Outer glow ring */}
            <motion.div
              className="absolute rounded-full pointer-events-none"
              style={{
                width: 280,
                height: 280,
                border: `2px solid ${gate.color}40`,
                boxShadow: `0 0 40px ${gate.glow}, inset 0 0 40px ${gate.glow}20`,
              }}
              animate={{ scale: [1, 1.06, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.8, repeat: Infinity }}
            />
            <motion.div
              className="absolute rounded-full pointer-events-none"
              style={{ width: 320, height: 320, border: `1px solid ${gate.color}20` }}
              animate={{ scale: [1, 1.12, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 2.4, repeat: Infinity }}
            />

            {/* THE GIANT ICON */}
            <motion.div
              key={shakeKey}
              animate={controls}
              className="cursor-pointer select-none relative z-10"
              style={{
                fontSize: "clamp(140px,22vw,200px)",
                filter: `drop-shadow(0 0 30px ${gate.glow}) drop-shadow(0 0 60px ${gate.glow})`,
                lineHeight: 1,
              }}
              onClick={handleClick}
              whileTap={{ scale: 0.88 }}
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.4 }}
            >
              {gate.icon}
            </motion.div>
          </div>

          {/* Progress fill */}
          <div className="w-full max-w-xs px-6 mb-4">
            <div
              className="flex items-center justify-between mb-2"
              style={{ fontFamily: "'Montserrat',sans-serif", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em" }}
            >
              <span style={{ color: "#6b7280" }}>{gate.hint}</span>
              <span style={{ color: gate.color, fontWeight: 700 }}>{progressPct}%</span>
            </div>
            <div className="w-full h-3 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: `linear-gradient(90deg, ${gate.color}80, ${gate.color})`,
                  boxShadow: `0 0 10px ${gate.glow}`,
                }}
                animate={{ width: `${progressPct}%` }}
                transition={{ type: "spring", stiffness: 200, damping: 25 }}
              />
            </div>
            {/* Click counter dots */}
            <div className="flex gap-2 justify-center mt-3">
              {Array.from({ length: gate.clicks }).map((_, i) => (
                <motion.div
                  key={i}
                  className="rounded-full"
                  style={{
                    width: 8,
                    height: 8,
                    background: i < clicks ? gate.color : "rgba(255,255,255,0.1)",
                    boxShadow: i < clicks ? `0 0 6px ${gate.glow}` : "none",
                  }}
                  animate={i < clicks ? { scale: [1, 1.5, 1] } : {}}
                  transition={{ duration: 0.3 }}
                />
              ))}
            </div>
          </div>

          {/* Play again */}
          <motion.button
            onClick={handlePlayAgain}
            className="flex items-center gap-2 px-5 py-2 rounded-full text-xs mt-2"
            style={{
              fontFamily: "'Montserrat',sans-serif",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#6b7280",
            }}
            whileHover={{ color: "#f9fafb", borderColor: gate.color, background: `${gate.color}10` }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            🔄 Try Another Gate
          </motion.button>

          {/* 5s Arena branding */}
          <motion.p
            className="absolute bottom-6"
            style={{ fontFamily: "'Oswald',sans-serif", color: "#374151", fontSize: "0.75rem", letterSpacing: "0.15em", textTransform: "uppercase" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            5s Arena Blog
          </motion.p>
        </motion.div>
      ) : (
        /* UNLOCK BLAST */
        <motion.div
          key="unlock"
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
          style={{ background: gate.color }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: [0, 1, 1, 0], scale: [0.5, 1.05, 1, 1.2] }}
          transition={{ duration: 1.4, times: [0, 0.2, 0.7, 1] }}
        >
          <motion.div
            style={{ fontSize: 120 }}
            animate={{ scale: [0, 1.3, 1], rotate: [0, 20, -10, 0] }}
            transition={{ duration: 0.6, type: "spring" }}
          >
            {gate.icon}
          </motion.div>
          <motion.p
            style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "2.5rem", color: "#fff", letterSpacing: "0.1em" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            GATES OPEN!
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
