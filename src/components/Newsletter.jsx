import { useState } from "react";
import { motion } from "framer-motion";
import { useToast } from "@/components/Toast";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const { showToast } = useToast();

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
      showToast("You're subscribed! Welcome to the community. ⚽", "success");
    }
  };

  return (
    <section className="relative overflow-hidden py-16">
      {/* Background */}
      <div className="absolute inset-0"
        style={{
          background: "linear-gradient(135deg, #052e16 0%, #0d1117 60%, #111827 100%)",
          borderTop: "1px solid rgba(34,197,94,0.15)",
          borderBottom: "1px solid rgba(34,197,94,0.15)",
        }}
      />
      {/* Pitch lines */}
      <div className="absolute inset-0 pointer-events-none opacity-10"
        style={{ backgroundImage: `repeating-linear-gradient(0deg,transparent,transparent 50px,rgba(34,197,94,0.3) 50px,rgba(34,197,94,0.3) 51px)` }} />
      {/* Radial glow */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(34,197,94,0.08) 0%, transparent 60%)" }} />

      <div className="relative z-10 max-w-2xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          <div className="text-4xl mb-4">⚽</div>
          <h2 className="gradient-text mb-3"
            style={{ fontFamily: "'Bebas Neue', Impact, sans-serif", fontSize: "clamp(2rem, 5vw, 3rem)", letterSpacing: "0.05em" }}>
            Stay in the Game!
          </h2>
          <p style={{ fontFamily: "'Inter', sans-serif", color: "#9ca3af", marginBottom: "2rem" }}>
            Get the latest posts delivered to your inbox. Football culture, stories, and more.
          </p>

          {submitted ? (
            <motion.div
              className="glass-card rounded-2xl p-6"
              style={{ borderColor: "rgba(34,197,94,0.3)" }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="text-3xl mb-2">🎉</div>
              <p style={{ fontFamily: "'Oswald', sans-serif", color: "#f9fafb", fontSize: "1.2rem", textTransform: "uppercase" }}>
                You&apos;re on the team!
              </p>
              <p style={{ fontFamily: "'Inter', sans-serif", color: "#6b7280", fontSize: "0.85rem", marginTop: "0.5rem" }}>
                Check your inbox for the latest stories.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email..."
                className="flex-1 px-5 py-3 rounded-xl text-sm outline-none transition-all focus:ring-2 focus:ring-green-500/50"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "#f9fafb",
                }}
                required
              />
              <motion.button
                type="submit"
                className="btn-primary px-8 py-3 rounded-xl font-bold text-white text-sm"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
              >
                Subscribe
              </motion.button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}
