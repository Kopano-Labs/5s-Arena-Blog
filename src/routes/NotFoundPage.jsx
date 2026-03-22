import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect } from "react";

export default function NotFoundPage() {
  useEffect(() => {
    document.title = "404 — 5s Arena Blog";
  }, []);

  return (
    <div className="flex flex-col items-center justify-center px-4 text-center"
      style={{ background: "var(--color-bg)", minHeight: "80vh" }}>

      {/* Animated football */}
      <motion.div
        className="text-7xl mb-6"
        animate={{ y: [0, -20, 0], rotate: [0, 10, -10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        ⚽
      </motion.div>

      {/* 404 */}
      <motion.h1
        className="gradient-text mb-4"
        style={{
          fontFamily: "'Bebas Neue', Impact, sans-serif",
          fontSize: "clamp(5rem, 15vw, 12rem)",
          letterSpacing: "0.08em",
          lineHeight: 1,
        }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
      >
        404
      </motion.h1>

      <motion.p
        style={{ fontFamily: "'Oswald', sans-serif", fontSize: "1.3rem", color: "#f9fafb", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.5rem" }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        Out of Bounds!
      </motion.p>

      <motion.p
        style={{ fontFamily: "'Inter', sans-serif", color: "#6b7280", fontSize: "1rem", marginBottom: "2rem", maxWidth: "28rem" }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        The page you&apos;re looking for doesn&apos;t exist. Looks like the ball went over the touchline.
      </motion.p>

      <motion.div
        className="flex flex-wrap gap-3 justify-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Link to="/">
          <motion.button
            className="btn-primary px-7 py-3 rounded-xl font-bold text-white text-sm"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
          >
            Back to Home
          </motion.button>
        </Link>
        <Link to="/posts">
          <motion.button
            className="px-7 py-3 rounded-xl font-bold text-sm"
            style={{
              fontFamily: "'Montserrat', sans-serif",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#d1d5db",
            }}
            whileHover={{ y: -2, background: "rgba(255,255,255,0.1)" }}
            whileTap={{ scale: 0.97 }}
          >
            Browse Posts
          </motion.button>
        </Link>
      </motion.div>

      {/* Decorative pitch lines */}
      <div className="absolute inset-0 pointer-events-none opacity-5 -z-10"
        style={{ backgroundImage: `repeating-linear-gradient(0deg,transparent,transparent 80px,rgba(34,197,94,0.3) 80px,rgba(34,197,94,0.3) 81px)` }} />
    </div>
  );
}
