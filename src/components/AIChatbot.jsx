import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import posts from "@/data/posts";

/* ── Quick questions ───────────────────────────────────────── */
const QUICK_QUESTIONS = [
  "Latest articles?",
  "How to join the league?",
  "Video posts?",
  "Author program?",
  "Contact us?",
  "Match fixtures?",
];

/* ── FAQ response database ─────────────────────────────────── */
const FAQ = {
  latest: {
    match: ["latest", "recent", "new", "newest"],
    response: "Here are the latest articles on 5s Arena Blog! Check out our newest pieces on football culture, tactics, and legends.",
    links: [{ label: "Browse Latest →", to: "/posts" }],
  },
  league: {
    match: ["league", "join", "play", "team", "register", "5-a-side", "five"],
    response: "The 5s Arena League runs competitive 5-a-side football in Cape Town! You can register your team, check standings, and see fixtures.",
    links: [{ label: "League Info →", to: "/league" }, { label: "View Fixtures →", to: "/fixtures" }],
  },
  video: {
    match: ["video", "watch", "highlights", "clip"],
    response: "We have 7 video posts featuring football skills, tactics breakdowns, and match highlights! They auto-play on hover.",
    links: [{ label: "Browse Posts →", to: "/posts" }],
  },
  author: {
    match: ["author", "write", "writer", "contribute", "publish", "blog"],
    response: "Want to write for 5s Arena? Apply through your profile page! Authors get their own dashboard with post management, tier rewards (Contributor → Editor), and achievement cards.",
    links: [{ label: "Your Profile →", to: "/profile" }, { label: "Author Dashboard →", to: "/author" }],
  },
  contact: {
    match: ["contact", "reach", "email", "phone", "message", "help"],
    response: "The fastest way to reach us is via WhatsApp! We're based in Cape Town, South Africa.",
    links: [{ label: "WhatsApp Us →", to: "https://wa.me/27637820245", external: true }],
  },
  fixtures: {
    match: ["fixture", "match", "score", "live", "standing", "table", "result"],
    response: "Check out live scores, upcoming fixtures, league standings, and match highlights all in one place!",
    links: [{ label: "Live Fixtures →", to: "/fixtures" }],
  },
  about: {
    match: ["about", "who", "what", "5s arena"],
    response: "5s Arena Blog is your home for football culture, tactics, legends, and community. We cover everything from grassroots 5-a-side to global football stories.",
    links: [{ label: "About Us →", to: "/about" }],
  },
  popular: {
    match: ["popular", "trending", "top", "best"],
    response: "Check out our Most Popular section for trending articles, league fixtures, and top-rated content!",
    links: [{ label: "Most Popular →", to: "/most-popular" }],
  },
};

/* ── Search posts by keyword ───────────────────────────────── */
function searchPosts(query) {
  const q = query.toLowerCase();
  return posts.filter(p =>
    p.title.toLowerCase().includes(q) ||
    p.category.toLowerCase().includes(q) ||
    p.tags?.some(t => t.toLowerCase().includes(q))
  ).slice(0, 3);
}

/* ── Get bot response ──────────────────────────────────────── */
function getBotResponse(message, unansweredCount) {
  const lower = message.toLowerCase();

  // Check FAQ matches
  for (const [, faq] of Object.entries(FAQ)) {
    if (faq.match.some(keyword => lower.includes(keyword))) {
      return { text: faq.response, links: faq.links };
    }
  }

  // Search posts
  const matched = searchPosts(message);
  if (matched.length > 0) {
    return {
      text: `I found ${matched.length} article${matched.length > 1 ? "s" : ""} matching your query:`,
      links: matched.map(p => ({ label: `📰 ${p.title}`, to: `/${p.slug}` })),
    };
  }

  // Escalation after 3 unanswered
  if (unansweredCount >= 2) {
    return {
      text: "I'm having trouble finding what you need. Let me connect you with our team directly — they'll be able to help!",
      links: [{ label: "💬 WhatsApp Us", to: "https://wa.me/27637820245", external: true }],
    };
  }

  return {
    text: "I'm not sure about that. Try asking about our articles, league, fixtures, video posts, or the author program! You can also browse our quick options below.",
    links: [],
  };
}

/* ═══════════════════════════════════════════════════════════════
   CHATBOT COMPONENT
   ═══════════════════════════════════════════════════════════════ */
export default function AIChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 0, from: "bot", text: "Hey there! ⚽ I'm the 5s Arena assistant. How can I help you today?", links: [] },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [unanswered, setUnanswered] = useState(0);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const handleSend = (text) => {
    const msg = text || input.trim();
    if (!msg) return;

    // User message
    const userMsg = { id: Date.now(), from: "user", text: msg };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setTyping(true);

    // Bot response after delay
    setTimeout(() => {
      const response = getBotResponse(msg, unanswered);
      const botMsg = { id: Date.now() + 1, from: "bot", ...response };
      setMessages(prev => [...prev, botMsg]);
      setTyping(false);

      // Track unanswered
      if (!response.links?.length && !response.text.includes("found")) {
        setUnanswered(prev => prev + 1);
      } else {
        setUnanswered(0);
      }
    }, 800 + Math.random() * 600);
  };

  return (
    <>
      {/* ── Toggle button ── */}
      <motion.button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-lg"
        style={{
          background: "linear-gradient(135deg,#059669,#22c55e)",
          boxShadow: "0 4px 20px rgba(34,197,94,0.4), 0 0 0 3px rgba(34,197,94,0.15)",
        }}
        whileHover={{ scale: 1.1, boxShadow: "0 8px 30px rgba(34,197,94,0.6)" }}
        whileTap={{ scale: 0.95 }}
        animate={open ? { rotate: 0 } : { rotate: [0, -10, 10, -5, 5, 0] }}
        transition={open ? {} : { duration: 0.5, repeat: Infinity, repeatDelay: 5 }}
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.span key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}
              className="text-xl text-white">✕</motion.span>
          ) : (
            <motion.span key="open" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
              className="text-2xl">⚽</motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* ── Chat window ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed bottom-24 right-6 z-50 flex flex-col overflow-hidden"
            style={{
              width: "min(380px, calc(100vw - 2rem))",
              height: "min(520px, calc(100vh - 8rem))",
              borderRadius: "1.25rem",
              background: "#0d1117",
              border: "1px solid rgba(34,197,94,0.2)",
              boxShadow: "0 16px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(34,197,94,0.1)",
            }}
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-5 py-4"
              style={{ background: "linear-gradient(135deg,#052e16,#0d1117)", borderBottom: "1px solid rgba(34,197,94,0.15)" }}>
              <div className="relative">
                <div className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ background: "rgba(34,197,94,0.2)", border: "1px solid rgba(34,197,94,0.4)" }}>
                  <span className="text-lg">⚽</span>
                </div>
                <motion.div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-500 border-2"
                  style={{ borderColor: "#0d1117" }}
                  animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 2, repeat: Infinity }} />
              </div>
              <div>
                <h3 style={{ fontFamily: "'Oswald',sans-serif", color: "#f9fafb", fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  5s Arena Bot
                </h3>
                <span style={{ fontFamily: "'Inter',sans-serif", color: "#22c55e", fontSize: "0.7rem" }}>Online</span>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3" style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(34,197,94,0.3) transparent" }}>
              {messages.map((msg) => (
                <motion.div key={msg.id}
                  className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 22 }}>
                  <div className="max-w-[85%]">
                    <div className="px-3.5 py-2.5 rounded-2xl text-sm"
                      style={{
                        fontFamily: "'Inter',sans-serif",
                        background: msg.from === "user" ? "linear-gradient(135deg,#059669,#22c55e)" : "rgba(255,255,255,0.06)",
                        color: msg.from === "user" ? "#fff" : "#d1d5db",
                        borderBottomRightRadius: msg.from === "user" ? "4px" : "16px",
                        borderBottomLeftRadius: msg.from === "bot" ? "4px" : "16px",
                        lineHeight: 1.5,
                      }}>
                      {msg.text}
                    </div>
                    {/* Links */}
                    {msg.links?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {msg.links.map((link, i) => (
                          link.external ? (
                            <a key={i} href={link.to} target="_blank" rel="noopener noreferrer"
                              className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                              style={{
                                fontFamily: "'Montserrat',sans-serif",
                                background: "rgba(34,197,94,0.12)",
                                border: "1px solid rgba(34,197,94,0.3)",
                                color: "#22c55e",
                              }}
                              onMouseEnter={e => { e.target.style.background = "rgba(34,197,94,0.25)"; }}
                              onMouseLeave={e => { e.target.style.background = "rgba(34,197,94,0.12)"; }}>
                              {link.label}
                            </a>
                          ) : (
                            <a key={i} href={link.to}
                              className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                              style={{
                                fontFamily: "'Montserrat',sans-serif",
                                background: "rgba(34,197,94,0.12)",
                                border: "1px solid rgba(34,197,94,0.3)",
                                color: "#22c55e",
                              }}
                              onMouseEnter={e => { e.target.style.background = "rgba(34,197,94,0.25)"; }}
                              onMouseLeave={e => { e.target.style.background = "rgba(34,197,94,0.12)"; }}>
                              {link.label}
                            </a>
                          )
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator */}
              {typing && (
                <motion.div className="flex justify-start"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div className="px-4 py-3 rounded-2xl flex gap-1.5"
                    style={{ background: "rgba(255,255,255,0.06)", borderBottomLeftRadius: "4px" }}>
                    {[0, 1, 2].map(i => (
                      <motion.div key={i}
                        className="w-2 h-2 rounded-full bg-green-500"
                        animate={{ y: [0, -6, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }} />
                    ))}
                  </div>
                </motion.div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Quick questions */}
            <div className="px-4 py-2 flex gap-1.5 overflow-x-auto scrollbar-hide"
              style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
              {QUICK_QUESTIONS.map(q => (
                <motion.button key={q} onClick={() => handleSend(q)}
                  className="px-3 py-1.5 rounded-full text-xs whitespace-nowrap flex-shrink-0"
                  style={{
                    fontFamily: "'Inter',sans-serif",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "#9ca3af",
                  }}
                  whileHover={{ background: "rgba(34,197,94,0.15)", borderColor: "rgba(34,197,94,0.3)", color: "#22c55e" }}
                  whileTap={{ scale: 0.95 }}>
                  {q}
                </motion.button>
              ))}
            </div>

            {/* Input */}
            <form onSubmit={(e) => { e.preventDefault(); handleSend(); }}
              className="flex gap-2 px-4 py-3"
              style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              <input type="text" value={input} onChange={e => setInput(e.target.value)}
                placeholder="Ask me anything..."
                className="flex-1 px-4 py-2.5 rounded-xl outline-none text-sm"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "#f9fafb",
                  fontFamily: "'Inter',sans-serif",
                }} />
              <motion.button type="submit"
                className="px-4 py-2.5 rounded-xl font-semibold text-sm"
                style={{
                  background: "linear-gradient(135deg,#059669,#22c55e)",
                  color: "#fff",
                  fontFamily: "'Montserrat',sans-serif",
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}>
                ↑
              </motion.button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
