import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 280, damping: 22 } },
};

const CATEGORY_STYLES = {
  Tactics: { gradient: "linear-gradient(135deg, #7c3aed, #a855f7)", badge: "#7c3aed" },
  Fitness: { gradient: "linear-gradient(135deg, #dc2626, #f43f5e)", badge: "#dc2626" },
  Community: { gradient: "linear-gradient(135deg, #2563eb, #3b82f6)", badge: "#2563eb" },
  Skills: { gradient: "linear-gradient(135deg, #0891b2, #06b6d4)", badge: "#06b6d4" },
};

const PRODUCTS = [
  {
    id: 1,
    title: "5-a-Side Tactics Playbook",
    type: "PDF",
    price: 49,
    category: "Tactics",
    emoji: "📋",
    desc: "Master every formation, set-piece, and press-break with 40+ illustrated plays for small-sided football.",
  },
  {
    id: 2,
    title: "Football Fitness 8-Week Plan",
    type: "PDF",
    price: 79,
    category: "Fitness",
    emoji: "🏋️",
    desc: "Periodised strength, speed, and endurance programme designed specifically for amateur footballers.",
  },
  {
    id: 3,
    title: "Match Day Planner Template",
    type: "Spreadsheet",
    price: 29,
    category: "Community",
    emoji: "📅",
    desc: "Organise lineups, subs, and match stats with this ready-to-use Google Sheets template.",
  },
  {
    id: 4,
    title: "Football Skills Drill Cards",
    type: "PDF",
    price: 39,
    category: "Skills",
    emoji: "⚡",
    desc: "30 printable drill cards covering dribbling, passing, finishing, and first-touch exercises.",
  },
  {
    id: 5,
    title: "Team Captain's Guide",
    type: "eBook",
    price: 59,
    category: "Community",
    emoji: "©️",
    desc: "Lead your squad on and off the pitch — communication, motivation, and game-management tips.",
  },
  {
    id: 6,
    title: "Goalkeeper Training Manual",
    type: "PDF",
    price: 69,
    category: "Skills",
    emoji: "🧤",
    desc: "Positioning, shot-stopping, distribution, and mental-game drills for keepers of all levels.",
  },
  {
    id: 7,
    title: "Football Nutrition Guide",
    type: "PDF",
    price: 49,
    category: "Fitness",
    emoji: "🥗",
    desc: "Match-day meals, recovery shakes, and weekly meal plans to fuel peak performance.",
  },
  {
    id: 8,
    title: "Tournament Organiser Kit",
    type: "Bundle",
    price: 99,
    category: "Community",
    emoji: "🏆",
    desc: "Everything you need to run a 5-a-side tournament — brackets, rules, scoresheets, and posters.",
  },
];

export default function ShopPage() {
  const [toast, setToast] = useState(null);

  useEffect(() => {
    document.title = "The Shop | 5s Arena";
    window.scrollTo(0, 0);
  }, []);

  const handleAddToCart = (productTitle) => {
    setToast(`"${productTitle}" — Coming Soon!`);
    setTimeout(() => setToast(null), 2500);
  };

  return (
    <div style={{ background: "#030712", minHeight: "100vh", color: "#f9fafb" }}>
      {/* ── Hero ─────────────────────────────────────── */}
      <section
        className="relative overflow-hidden"
        style={{
          background: "linear-gradient(180deg, #030712 0%, #0a1628 50%, #030712 100%)",
          paddingTop: "6rem",
          paddingBottom: "4rem",
        }}
      >
        {/* Pitch-line textures */}
        <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.04 }}>
          <div style={{ position: "absolute", top: "50%", left: "10%", right: "10%", height: "1px", background: "#fff" }} />
          <div style={{ position: "absolute", top: "30%", bottom: "30%", left: "50%", width: "1px", background: "#fff" }} />
          <div
            style={{
              position: "absolute", top: "25%", left: "35%",
              width: "30%", height: "50%",
              border: "1px solid #fff", borderRadius: "50%",
            }}
          />
        </div>

        <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(2.8rem, 8vw, 5rem)",
              background: "linear-gradient(90deg, #22c55e, #06b6d4)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: "0.04em",
              marginBottom: "0.75rem",
            }}
          >
            The Shop
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, type: "spring", stiffness: 260, damping: 22 }}
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "1.1rem",
              color: "#9ca3af",
              maxWidth: "520px",
              margin: "0 auto",
              lineHeight: 1.6,
            }}
          >
            Downloadable football resources, templates, and guides — built for the 5-a-side community.
          </motion.p>
        </div>
      </section>

      {/* ── Product Grid ─────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        {/* Section heading with green bar */}
        <div className="flex items-center gap-3 mb-10">
          <div style={{ width: 4, height: 28, borderRadius: 2, background: "#22c55e" }} />
          <h2
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "1.6rem",
              letterSpacing: "0.05em",
              color: "#f9fafb",
            }}
          >
            Digital Products
          </h2>
        </div>

        <motion.div
          className="grid gap-6"
          style={{ gridTemplateColumns: "repeat(auto-fill, minmax(270px, 1fr))" }}
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {PRODUCTS.map((product) => {
            const cat = CATEGORY_STYLES[product.category];
            return (
              <motion.div
                key={product.id}
                variants={fadeUp}
                whileHover={{ y: -4, boxShadow: "0 16px 40px rgba(0,0,0,0.45)" }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="rounded-2xl overflow-hidden flex flex-col"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                {/* Image placeholder */}
                <div
                  className="flex items-center justify-center"
                  style={{
                    height: 160,
                    background: cat.gradient,
                    fontSize: "3.2rem",
                    position: "relative",
                  }}
                >
                  <span role="img" aria-label={product.category}>{product.emoji}</span>
                  {/* type badge */}
                  <span
                    style={{
                      position: "absolute",
                      bottom: 8,
                      right: 8,
                      fontFamily: "'Montserrat', sans-serif",
                      fontSize: "0.6rem",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      background: "rgba(0,0,0,0.45)",
                      color: "#f9fafb",
                      padding: "2px 8px",
                      borderRadius: 4,
                    }}
                  >
                    {product.type}
                  </span>
                </div>

                <div className="flex flex-col flex-1 p-5">
                  {/* Category badge */}
                  <span
                    style={{
                      fontFamily: "'Montserrat', sans-serif",
                      fontSize: "0.6rem",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      color: cat.badge,
                      background: `${cat.badge}18`,
                      padding: "3px 10px",
                      borderRadius: 999,
                      alignSelf: "flex-start",
                      marginBottom: "0.6rem",
                    }}
                  >
                    {product.category}
                  </span>

                  {/* Title */}
                  <h3
                    style={{
                      fontFamily: "'Oswald', sans-serif",
                      fontSize: "1.15rem",
                      color: "#f9fafb",
                      marginBottom: "0.4rem",
                      lineHeight: 1.25,
                    }}
                  >
                    {product.title}
                  </h3>

                  {/* Description */}
                  <p
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "0.82rem",
                      color: "#9ca3af",
                      lineHeight: 1.55,
                      flex: 1,
                      marginBottom: "1rem",
                    }}
                  >
                    {product.desc}
                  </p>

                  {/* Price + CTA */}
                  <div className="flex items-center justify-between">
                    <span
                      style={{
                        fontFamily: "'Bebas Neue', sans-serif",
                        fontSize: "1.5rem",
                        color: "#22c55e",
                        letterSpacing: "0.03em",
                      }}
                    >
                      R{product.price}
                    </span>

                    <button
                      onClick={() => handleAddToCart(product.title)}
                      className="cursor-pointer"
                      style={{
                        fontFamily: "'Montserrat', sans-serif",
                        fontSize: "0.72rem",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                        background: "linear-gradient(135deg, #22c55e, #16a34a)",
                        color: "#030712",
                        border: "none",
                        padding: "8px 18px",
                        borderRadius: 8,
                        transition: "opacity 0.2s",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
                      onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* ── Toast ─────────────────────────────────────── */}
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 30 }}
          style={{
            position: "fixed",
            bottom: 28,
            left: "50%",
            transform: "translateX(-50%)",
            fontFamily: "'Inter', sans-serif",
            fontSize: "0.88rem",
            background: "rgba(34,197,94,0.15)",
            border: "1px solid rgba(34,197,94,0.35)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            color: "#22c55e",
            padding: "10px 24px",
            borderRadius: 10,
            zIndex: 9999,
            whiteSpace: "nowrap",
          }}
        >
          {toast}
        </motion.div>
      )}
    </div>
  );
}
