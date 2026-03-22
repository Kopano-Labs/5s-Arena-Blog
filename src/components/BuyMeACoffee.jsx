import { motion } from "framer-motion";

/**
 * "Buy Me a Coffee" floating button + sidebar widget.
 * Links to a Ko-fi or BMC page (placeholder — update href).
 */

const CoffeeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 8h1a4 4 0 110 8h-1" />
    <path d="M3 8h14v9a4 4 0 01-4 4H7a4 4 0 01-4-4V8z" />
    <line x1="6" y1="2" x2="6" y2="4" />
    <line x1="10" y1="2" x2="10" y2="4" />
    <line x1="14" y1="2" x2="14" y2="4" />
  </svg>
);

/* ── Inline widget for sidebar / footer ─────────────────── */
export function BuyMeACoffeeCard() {
  return (
    <motion.a
      href="https://ko-fi.com/5sarena"
      target="_blank"
      rel="noopener noreferrer"
      className="block glass-card rounded-2xl p-5 text-center group cursor-pointer"
      whileHover={{ y: -4, boxShadow: "0 12px 30px rgba(251,191,36,0.15)" }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ type: "spring", stiffness: 280, damping: 22 }}
    >
      <div className="text-3xl mb-2">☕</div>
      <h4
        className="mb-1"
        style={{
          fontFamily: "'Oswald', sans-serif",
          fontSize: "1rem",
          color: "#f9fafb",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
        }}
      >
        Support the Blog
      </h4>
      <p
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: "0.8rem",
          color: "#9ca3af",
          lineHeight: 1.5,
          marginBottom: "0.75rem",
        }}
      >
        Love our football content? Buy us a coffee to keep the articles coming!
      </p>
      <motion.div
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold"
        style={{
          fontFamily: "'Montserrat', sans-serif",
          background: "linear-gradient(135deg, #f59e0b, #d97706)",
          color: "#fff",
          boxShadow: "0 0 16px rgba(245,158,11,0.3)",
        }}
        whileHover={{ boxShadow: "0 0 28px rgba(245,158,11,0.5)" }}
      >
        <CoffeeIcon />
        Buy Me a Coffee
      </motion.div>
    </motion.a>
  );
}

/* ── Floating button (fixed position) ───────────────────── */
export default function BuyMeACoffee() {
  return (
    <motion.a
      href="https://ko-fi.com/5sarena"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Buy Me a Coffee"
      className="fixed bottom-20 left-5 z-40 flex items-center gap-2 px-4 py-2.5 rounded-full shadow-lg cursor-pointer group"
      style={{
        background: "linear-gradient(135deg, #f59e0b, #d97706)",
        color: "#fff",
        fontFamily: "'Montserrat', sans-serif",
        fontSize: "0.8rem",
        fontWeight: 600,
        boxShadow: "0 4px 20px rgba(245,158,11,0.35)",
      }}
      initial={{ opacity: 0, x: -60 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 20, delay: 1.5 }}
      whileHover={{ scale: 1.05, boxShadow: "0 6px 30px rgba(245,158,11,0.5)" }}
      whileTap={{ scale: 0.95 }}
    >
      <CoffeeIcon />
      <span className="hidden sm:inline">Buy me a coffee</span>
    </motion.a>
  );
}
