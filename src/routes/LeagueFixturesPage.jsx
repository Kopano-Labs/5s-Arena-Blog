import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useInView } from "framer-motion";

// ── Mock data (shared with FixturesPage) ──────────────────────
const mockMatches = [
  { id:1,  league:'PL',  home:'Arsenal',          away:'Chelsea',           homeScore:2, awayScore:1, status:'IN_PLAY', minute:67 },
  { id:2,  league:'PL',  home:'Manchester City',   away:'Liverpool',         homeScore:1, awayScore:1, status:'IN_PLAY', minute:34 },
  { id:11, league:'SA',  home:'Inter Milan',       away:'AC Milan',          homeScore:2, awayScore:2, status:'IN_PLAY', minute:88 },
  { id:22, league:'PSL', home:'AmaZulu',           away:'Sekhukhune United', homeScore:0, awayScore:0, status:'IN_PLAY', minute:22 },
  { id:5,  league:'PL',  home:'Brighton',          away:'West Ham',          homeScore:null, awayScore:null, status:'TIMED', kickoff:'17:30' },
  { id:6,  league:'PL',  home:'Everton',           away:'Wolves',            homeScore:null, awayScore:null, status:'TIMED', kickoff:'20:00' },
  { id:21, league:'PSL', home:'Cape Town City',    away:'Stellenbosch',      homeScore:null, awayScore:null, status:'TIMED', kickoff:'19:30' },
];

const LEAGUE_META = {
  PL:  { name: 'Premier League',        accent: '#a855f7' },
  LL:  { name: 'La Liga',               accent: '#f97316' },
  SA:  { name: 'Serie A',               accent: '#3b82f6' },
  BL:  { name: 'Bundesliga',            accent: '#ef4444' },
  PSL: { name: 'Premier Soccer League', accent: '#eab308' },
  UCL: { name: 'Champions League',      accent: '#1e3a8a' },
};

const WHY_JOIN = [
  { icon: "⚽", title: "Weekly Games", desc: "Play competitive 5-a-side every week in structured, organised matches.", color: "#22c55e" },
  { icon: "🏆", title: "Competitive Tables", desc: "Track your team's progress through real league tables and standings.", color: "#f59e0b" },
  { icon: "🥇", title: "Awards & Trophies", desc: "End of season awards, trophies, and recognition for top performers.", color: "#06b6d4" },
  { icon: "👥", title: "Community", desc: "Join a passionate community of football lovers in Cape Town.", color: "#a855f7" },
];

// ── useCounter hook ───────────────────────────────────────────
function useCounter(target, duration = 1500) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target, duration]);

  return [count, ref];
}

// ── Mini live badge ───────────────────────────────────────────
function LiveBadge({ minute }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-bold"
      style={{ background: "rgba(239,68,68,0.2)", color: "#f87171", border: "1px solid rgba(239,68,68,0.4)" }}>
      <motion.span className="w-2 h-2 rounded-full bg-red-500"
        animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.2, repeat: Infinity }} />
      LIVE {minute}&apos;
    </span>
  );
}

// ── Team name badge ───────────────────────────────────────────
function TeamBadge({ name }) {
  const abbr = name.split(" ").map(w => w[0]).join("").slice(0, 3).toUpperCase();
  return (
    <div className="flex flex-col items-center gap-1 min-w-0">
      <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
        style={{ background: "rgba(34,197,94,0.2)", border: "1px solid rgba(34,197,94,0.3)", fontSize: "0.65rem" }}>
        {abbr}
      </div>
      <span className="text-xs text-center leading-tight max-w-[80px] truncate"
        style={{ fontFamily: "'Inter',sans-serif", color: "#d1d5db" }}>
        {name}
      </span>
    </div>
  );
}

export default function LeagueFixturesPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const [articlesCount, articlesRef] = useCounter(46);
  const [videosCount, videosRef] = useCounter(7);
  const [leaguesCount, leaguesRef] = useCounter(4);
  const [teamsCount, teamsRef] = useCounter(120);

  useEffect(() => {
    document.title = "Join the League — 5s Arena";
    window.scrollTo(0, 0);
  }, []);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    const subs = JSON.parse(localStorage.getItem("5s_league_subscribers") || "[]");
    subs.push({ name: name.trim(), email: email.trim(), date: new Date().toISOString() });
    localStorage.setItem("5s_league_subscribers", JSON.stringify(subs));
    setSubscribed(true);
  };

  const liveMatches = mockMatches.filter(m => m.status === "IN_PLAY");
  const upcomingMatches = mockMatches.filter(m => m.status === "TIMED");

  return (
    <div style={{ background: "var(--color-bg)", minHeight: "100vh" }}>

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden flex flex-col items-center justify-center text-center"
        style={{
          minHeight: "85vh",
          background: "linear-gradient(135deg,#052e16 0%,#0d1117 50%,#030712 100%)",
        }}
      >
        {/* Animated pitch lines */}
        <div className="absolute inset-0 pointer-events-none opacity-10"
          style={{
            backgroundImage: `repeating-linear-gradient(0deg,transparent,transparent 60px,rgba(34,197,94,0.4) 60px,rgba(34,197,94,0.4) 61px),
                              repeating-linear-gradient(90deg,transparent,transparent 100px,rgba(34,197,94,0.2) 100px,rgba(34,197,94,0.2) 101px)`,
          }}
        />
        {/* Hero glow */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 50% 40%,rgba(34,197,94,0.12) 0%,transparent 65%)" }} />

        <motion.div className="relative z-10 px-4 max-w-4xl"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 160, damping: 20 }}>

          {/* Spinning football */}
          <motion.div className="text-6xl mb-6 inline-block"
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}>
            ⚽
          </motion.div>

          <h1
            className="gradient-text mb-6"
            style={{
              fontFamily: "'Bebas Neue',Impact,sans-serif",
              fontSize: "clamp(3.5rem,12vw,8rem)",
              letterSpacing: "0.04em",
              lineHeight: 0.95,
            }}
          >
            Join the<br />5s Arena League
          </h1>

          <p className="mb-8 max-w-xl mx-auto"
            style={{ fontFamily: "'Inter',sans-serif", color: "#9ca3af", fontSize: "1.1rem", lineHeight: 1.6 }}>
            Competitive 5-a-side football in Cape Town. Real matches, real tables, real trophies.
            Join our growing community of passionate players.
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/league">
              <motion.button
                className="btn-primary px-8 py-3 rounded-xl font-bold text-base"
                style={{ fontFamily: "'Montserrat',sans-serif" }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.96 }}>
                Register Your Team →
              </motion.button>
            </Link>
            <a href="https://wa.me/27637820245" target="_blank" rel="noopener noreferrer">
              <motion.button
                className="px-8 py-3 rounded-xl font-bold text-base"
                style={{
                  fontFamily: "'Montserrat',sans-serif",
                  background: "rgba(37,211,102,0.15)",
                  border: "1px solid rgba(37,211,102,0.4)",
                  color: "#25d366",
                }}
                whileHover={{ background: "rgba(37,211,102,0.25)", scale: 1.05 }}
                whileTap={{ scale: 0.96 }}>
                📱 WhatsApp Us
              </motion.button>
            </a>
          </div>
        </motion.div>

        {/* Scroll cue */}
        <motion.div className="absolute bottom-8"
          animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}>
          <div className="w-6 h-10 rounded-full border-2 border-green-500/30 flex items-start justify-center pt-2">
            <motion.div className="w-1.5 h-3 rounded-full bg-green-500"
              animate={{ opacity: [1, 0] }} transition={{ duration: 1.5, repeat: Infinity }} />
          </div>
        </motion.div>
      </section>

      {/* ── LIVE FIXTURES STRIP ──────────────────────────────── */}
      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div className="section-heading mb-8"
            initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ type: "spring", stiffness: 200 }}>
            <h2 style={{ fontFamily: "'Oswald',sans-serif", fontSize: "1.5rem", color: "#f9fafb", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Live &amp; Upcoming Matches
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...liveMatches, ...upcomingMatches].slice(0, 6).map((match, i) => (
              <motion.div key={match.id}
                className="glass-card rounded-xl p-4"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 200, damping: 22, delay: i * 0.07 }}>

                {/* League badge */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold"
                    style={{ fontFamily: "'Montserrat',sans-serif", color: LEAGUE_META[match.league]?.accent || "#9ca3af", textTransform: "uppercase" }}>
                    {LEAGUE_META[match.league]?.name}
                  </span>
                  {match.status === "IN_PLAY"
                    ? <LiveBadge minute={match.minute} />
                    : <span className="text-xs" style={{ color: "#9ca3af" }}>⏰ {match.kickoff}</span>
                  }
                </div>

                {/* Match row */}
                <div className="flex items-center justify-between gap-2">
                  <TeamBadge name={match.home} />
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {match.status === "IN_PLAY" ? (
                      <>
                        <span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "1.8rem", color: "#f9fafb" }}>{match.homeScore}</span>
                        <span style={{ color: "#6b7280", fontWeight: "bold" }}>–</span>
                        <span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "1.8rem", color: "#f9fafb" }}>{match.awayScore}</span>
                      </>
                    ) : (
                      <span style={{ fontFamily: "'Oswald',sans-serif", color: "#6b7280", fontSize: "1rem" }}>vs</span>
                    )}
                  </div>
                  <TeamBadge name={match.away} />
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-6">
            <Link to="/fixtures">
              <motion.button className="px-6 py-2.5 rounded-xl text-sm font-semibold"
                style={{
                  fontFamily: "'Montserrat',sans-serif",
                  background: "rgba(34,197,94,0.1)",
                  border: "1px solid rgba(34,197,94,0.3)",
                  color: "#22c55e",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
                whileHover={{ background: "rgba(34,197,94,0.2)" }}>
                See All Fixtures →
              </motion.button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ────────────────────────────────────────── */}
      <section className="py-10 px-4"
        style={{ background: "rgba(17,24,39,0.6)", borderTop: "1px solid rgba(34,197,94,0.1)", borderBottom: "1px solid rgba(34,197,94,0.1)" }}>
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { ref: articlesRef, count: articlesCount, label: "Articles", icon: "📰", suffix: "" },
            { ref: videosRef, count: videosCount, label: "Video Posts", icon: "🎥", suffix: "" },
            { ref: leaguesRef, count: leaguesCount, label: "Competitions", icon: "🏆", suffix: "" },
            { ref: teamsRef, count: teamsCount, label: "Teams Tracked", icon: "⚽", suffix: "+" },
          ].map(({ ref, count, label, icon, suffix }) => (
            <div key={label} ref={ref}>
              <div className="text-2xl mb-1">{icon}</div>
              <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "2.5rem", color: "#22c55e", lineHeight: 1 }}>
                {count}{suffix}
              </div>
              <div style={{ fontFamily: "'Montserrat',sans-serif", fontSize: "0.75rem", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                {label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── WHY JOIN ─────────────────────────────────────────── */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div className="section-heading mb-10 text-center"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ type: "spring", stiffness: 200 }}>
            <h2 style={{ fontFamily: "'Oswald',sans-serif", fontSize: "2rem", color: "#f9fafb", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Why Join 5s Arena?
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {WHY_JOIN.map((item, i) => (
              <motion.div key={item.title}
                className="glass-card rounded-2xl p-6 text-center"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 200, damping: 22, delay: i * 0.1 }}
                whileHover={{ y: -6, boxShadow: `0 16px 40px ${item.color}30` }}>
                <motion.div className="text-4xl mb-4"
                  whileHover={{ scale: 1.2 }} transition={{ type: "spring", stiffness: 300 }}>
                  {item.icon}
                </motion.div>
                <h3 style={{ fontFamily: "'Oswald',sans-serif", fontSize: "1.1rem", color: item.color, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.5rem" }}>
                  {item.title}
                </h3>
                <p style={{ fontFamily: "'Inter',sans-serif", color: "#9ca3af", fontSize: "0.875rem", lineHeight: 1.5 }}>
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SIGN UP SECTION ──────────────────────────────────── */}
      <section className="py-16 px-4"
        style={{ background: "linear-gradient(to bottom,rgba(5,46,22,0.4),rgba(3,7,18,0))" }}>
        <div className="max-w-5xl mx-auto">
          <motion.div className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ type: "spring", stiffness: 200 }}>
            <h2 style={{ fontFamily: "'Oswald',sans-serif", fontSize: "2rem", color: "#f9fafb", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Stay in the Loop
            </h2>
            <p style={{ fontFamily: "'Inter',sans-serif", color: "#9ca3af", marginTop: "0.5rem" }}>
              Get fixtures, results, and league news delivered to you.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Email form */}
            <motion.div className="glass-card rounded-2xl p-6"
              initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ type: "spring", stiffness: 200, delay: 0 }}>
              <h3 style={{ fontFamily: "'Oswald',sans-serif", color: "#22c55e", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "1rem" }}>
                📧 Email Updates
              </h3>
              <AnimatePresence mode="wait">
                {subscribed ? (
                  <motion.div key="success"
                    initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-4">
                    <div className="text-3xl mb-2">🎉</div>
                    <p style={{ fontFamily: "'Inter',sans-serif", color: "#22c55e", fontWeight: 600 }}>
                      You&apos;re subscribed!
                    </p>
                    <p style={{ fontFamily: "'Inter',sans-serif", color: "#9ca3af", fontSize: "0.8rem" }}>
                      We&apos;ll keep you in the loop.
                    </p>
                  </motion.div>
                ) : (
                  <motion.form key="form" onSubmit={handleSubscribe} className="flex flex-col gap-3">
                    <input
                      type="text"
                      placeholder="Your name"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      required
                      className="px-3 py-2 rounded-lg text-sm outline-none"
                      style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#f9fafb", fontFamily: "'Inter',sans-serif" }}
                    />
                    <input
                      type="email"
                      placeholder="Your email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                      className="px-3 py-2 rounded-lg text-sm outline-none"
                      style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#f9fafb", fontFamily: "'Inter',sans-serif" }}
                    />
                    <button type="submit" className="btn-primary py-2 rounded-lg text-sm font-semibold"
                      style={{ fontFamily: "'Montserrat',sans-serif" }}>
                      Subscribe
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </motion.div>

            {/* WhatsApp CTA */}
            <motion.div className="glass-card rounded-2xl p-6 flex flex-col items-center justify-center text-center"
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
              whileHover={{ boxShadow: "0 16px 40px rgba(37,211,102,0.25)" }}>
              <div className="text-4xl mb-4">📱</div>
              <h3 style={{ fontFamily: "'Oswald',sans-serif", color: "#25d366", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.5rem" }}>
                WhatsApp Us
              </h3>
              <p style={{ fontFamily: "'Inter',sans-serif", color: "#9ca3af", fontSize: "0.875rem", marginBottom: "1.5rem", lineHeight: 1.5 }}>
                Message us directly for fixture updates, team registration, and match info.
              </p>
              <a href="https://wa.me/27637820245" target="_blank" rel="noopener noreferrer">
                <motion.button
                  className="px-6 py-2.5 rounded-xl font-semibold text-sm"
                  style={{
                    fontFamily: "'Montserrat',sans-serif",
                    background: "rgba(37,211,102,0.15)",
                    border: "1px solid rgba(37,211,102,0.4)",
                    color: "#25d366",
                  }}
                  whileHover={{ background: "#25d366", color: "#030712", scale: 1.05 }}
                  whileTap={{ scale: 0.96 }}>
                  Open WhatsApp →
                </motion.button>
              </a>
            </motion.div>

            {/* SMS CTA */}
            <motion.div className="glass-card rounded-2xl p-6 flex flex-col items-center justify-center text-center"
              initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              whileHover={{ boxShadow: "0 16px 40px rgba(6,182,212,0.25)" }}>
              <div className="text-4xl mb-4">💬</div>
              <h3 style={{ fontFamily: "'Oswald',sans-serif", color: "#06b6d4", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.5rem" }}>
                Get SMS Alerts
              </h3>
              <p style={{ fontFamily: "'Inter',sans-serif", color: "#9ca3af", fontSize: "0.875rem", marginBottom: "1.5rem", lineHeight: 1.5 }}>
                SMS us &ldquo;JOIN LEAGUE&rdquo; and we&apos;ll add you to our fixture alerts list.
              </p>
              <a href="sms:+27637820245?body=JOIN%20LEAGUE">
                <motion.button
                  className="px-6 py-2.5 rounded-xl font-semibold text-sm"
                  style={{
                    fontFamily: "'Montserrat',sans-serif",
                    background: "rgba(6,182,212,0.15)",
                    border: "1px solid rgba(6,182,212,0.4)",
                    color: "#06b6d4",
                  }}
                  whileHover={{ background: "#06b6d4", color: "#030712", scale: 1.05 }}
                  whileTap={{ scale: 0.96 }}>
                  Send SMS →
                </motion.button>
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── BIG CTA FOOTER ───────────────────────────────────── */}
      <section className="py-20 px-4 text-center"
        style={{ background: "linear-gradient(to bottom,rgba(5,46,22,0.3),rgba(3,7,18,0.8))" }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ type: "spring", stiffness: 200 }}>
          <div className="text-5xl mb-4">🚀</div>
          <h2
            className="gradient-text mb-4"
            style={{ fontFamily: "'Bebas Neue',Impact,sans-serif", fontSize: "clamp(2.5rem,8vw,5rem)", letterSpacing: "0.05em" }}>
            Ready to Play?
          </h2>
          <p className="mb-8 max-w-md mx-auto"
            style={{ fontFamily: "'Inter',sans-serif", color: "#9ca3af", fontSize: "1rem" }}>
            Join Cape Town&apos;s most exciting 5-a-side football league. All skill levels welcome.
          </p>
          <Link to="/league">
            <motion.button
              className="btn-primary px-10 py-4 rounded-2xl font-bold text-lg"
              style={{ fontFamily: "'Montserrat',sans-serif" }}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.96 }}>
              Join the League →
            </motion.button>
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
