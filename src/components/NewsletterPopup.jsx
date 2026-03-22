import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX } from "react-icons/fi";

export default function NewsletterPopup() {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const dismissed = sessionStorage.getItem("newsletter_dismissed");
    if (dismissed) return;
    const timer = setTimeout(() => setShow(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setShow(false);
    sessionStorage.setItem("newsletter_dismissed", "true");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      const subs = JSON.parse(localStorage.getItem("5s_newsletter_subs") || "[]");
      if (!subs.includes(email)) {
        subs.push(email);
        localStorage.setItem("5s_newsletter_subs", JSON.stringify(subs));
      }
      setSubmitted(true);
      setEmail("");
      setTimeout(handleClose, 2500);
    }
  };

  return (
    <AnimatePresence>
      {show && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[9998]"
            style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <motion.div
              className="rounded-2xl max-w-md w-full p-8 relative"
              style={{
                background: "rgba(17,24,39,0.95)",
                border: "1px solid rgba(34,197,94,0.2)",
                boxShadow: "0 25px 80px rgba(0,0,0,0.6), 0 0 40px rgba(34,197,94,0.1)",
                backdropFilter: "blur(20px)",
              }}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              {/* Close */}
              <motion.button
                onClick={handleClose}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full transition-colors cursor-pointer"
                style={{ background: "rgba(255,255,255,0.05)", color: "#6b7280" }}
                whileHover={{ background: "rgba(255,255,255,0.1)", color: "#f9fafb" }}
                whileTap={{ scale: 0.9 }}
              >
                <FiX size={18} />
              </motion.button>

              {/* Logo */}
              <div className="flex justify-center mb-5">
                <img
                  src="/logo.png"
                  alt="5s Arena"
                  className="w-16 h-16 rounded-full object-cover"
                  style={{ boxShadow: "0 0 20px rgba(34,197,94,0.4)", border: "2px solid rgba(34,197,94,0.3)" }}
                />
              </div>

              {submitted ? (
                <motion.div className="text-center"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 300 }}>
                  <div className="text-4xl mb-3">🎉</div>
                  <h3 style={{ fontFamily: "'Bebas Neue', Impact, sans-serif", fontSize: "1.8rem", color: "#f9fafb", letterSpacing: "0.05em" }}>
                    You&apos;re on the team!
                  </h3>
                  <p style={{ fontFamily: "'Inter', sans-serif", color: "#6b7280", fontSize: "0.85rem", marginTop: "0.5rem" }}>
                    Check your inbox for the latest stories from 5s Arena Blog.
                  </p>
                </motion.div>
              ) : (
                <>
                  <h3 className="text-center mb-2"
                    style={{ fontFamily: "'Bebas Neue', Impact, sans-serif", fontSize: "1.6rem", color: "#f9fafb", letterSpacing: "0.04em" }}>
                    Be the first to hear new stories
                  </h3>
                  <p className="text-center mb-6"
                    style={{ fontFamily: "'Inter', sans-serif", color: "#22c55e", fontSize: "0.85rem" }}>
                    Join for free to get the latest football culture, stories, and updates.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium mb-1.5"
                        style={{ fontFamily: "'Montserrat', sans-serif", color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                        Your email
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email address"
                        className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all focus:ring-2 focus:ring-green-500/50"
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          background: "rgba(255,255,255,0.06)",
                          border: "1px solid rgba(255,255,255,0.1)",
                          color: "#f9fafb",
                        }}
                        required
                      />
                    </div>
                    <motion.button
                      type="submit"
                      className="w-full btn-primary py-3 rounded-xl font-bold text-white text-sm"
                      style={{ fontFamily: "'Montserrat', sans-serif" }}
                      whileHover={{ y: -1 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Subscribe
                    </motion.button>
                  </form>

                  <p className="text-center text-xs mt-4"
                    style={{ fontFamily: "'Inter', sans-serif", color: "#4b5563" }}>
                    No spam, ever. Unsubscribe anytime.
                  </p>
                </>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
