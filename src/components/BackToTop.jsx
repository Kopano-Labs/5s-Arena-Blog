import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          onClick={scrollToTop}
          className="fixed bottom-6 left-6 z-50 w-11 h-11 rounded-full flex items-center justify-center cursor-pointer"
          style={{
            background: "linear-gradient(135deg, #059669 0%, #10b981 100%)",
            boxShadow: "0 0 20px rgba(16,185,129,0.4), 0 4px 12px rgba(0,0,0,0.4)",
            border: "1px solid rgba(255,255,255,0.15)",
          }}
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.8 }}
          transition={{ type: "spring", stiffness: 300, damping: 22 }}
          whileHover={{ y: -3, boxShadow: "0 0 30px rgba(16,185,129,0.6), 0 8px 20px rgba(0,0,0,0.4)" }}
          whileTap={{ scale: 0.9 }}
          aria-label="Back to top"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="18 15 12 9 6 15" />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
