import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * TableOfContents — auto-extracts h2/h3 headings from post HTML content
 * and renders a sticky navigable TOC with active section highlighting.
 *
 * Props:
 *   content — HTML string of post content
 *   minHeadings — minimum headings needed to show TOC (default 3)
 */
export default function TableOfContents({ content = "", minHeadings = 3 }) {
  const [activeId, setActiveId] = useState(null);
  const [open, setOpen] = useState(true);
  const observerRef = useRef(null);

  // Extract headings from HTML string
  const headings = (() => {
    const div = document.createElement("div");
    div.innerHTML = content;
    const nodes = div.querySelectorAll("h2, h3");
    return Array.from(nodes).map((node, i) => ({
      id: `heading-${i}`,
      text: node.textContent.trim(),
      level: parseInt(node.tagName[1]),
    }));
  })();

  // Inject IDs into actual DOM headings after render
  useEffect(() => {
    if (headings.length < minHeadings) return;
    const articleHeadings = document.querySelectorAll("article h2, article h3, .prose h2, .prose h3");
    articleHeadings.forEach((el, i) => {
      if (i < headings.length) el.id = `heading-${i}`;
    });

    // IntersectionObserver for active section
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: 0 }
    );
    articleHeadings.forEach((el) => observerRef.current.observe(el));
    return () => observerRef.current?.disconnect();
  }, [content, headings.length, minHeadings]);

  if (headings.length < minHeadings) return null;

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 80; // account for sticky navbar
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <motion.div
      className="rounded-2xl overflow-hidden mb-6"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(34,197,94,0.15)",
        backdropFilter: "blur(8px)",
      }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 280, damping: 22 }}
    >
      {/* Header */}
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center justify-between px-5 py-4"
      >
        <div className="flex items-center gap-2">
          <span style={{ color: "#22c55e", fontSize: "0.9rem" }}>☰</span>
          <span
            style={{
              fontFamily: "'Oswald', sans-serif",
              fontSize: "0.85rem",
              color: "#f9fafb",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            Table of Contents
          </span>
          <span
            className="px-1.5 py-0.5 rounded-full text-xs"
            style={{
              fontFamily: "'Montserrat', sans-serif",
              background: "rgba(34,197,94,0.15)",
              color: "#22c55e",
              border: "1px solid rgba(34,197,94,0.3)",
            }}
          >
            {headings.length}
          </span>
        </div>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          style={{ color: "#22c55e", fontSize: "0.8rem" }}
        >
          ▾
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-1">
              {headings.map((h) => {
                const isActive = activeId === h.id;
                return (
                  <motion.button
                    key={h.id}
                    onClick={() => scrollTo(h.id)}
                    className="w-full text-left flex items-start gap-2 px-3 py-1.5 rounded-lg transition-all"
                    style={{
                      paddingLeft: h.level === 3 ? "1.75rem" : "0.75rem",
                      background: isActive ? "rgba(34,197,94,0.1)" : "transparent",
                      border: isActive ? "1px solid rgba(34,197,94,0.2)" : "1px solid transparent",
                    }}
                    whileHover={{ background: "rgba(255,255,255,0.04)" }}
                  >
                    <span
                      className="w-1 flex-shrink-0 rounded-full mt-1.5"
                      style={{
                        height: "6px",
                        background: isActive ? "#22c55e" : "#374151",
                        minWidth: "6px",
                        transition: "background 0.2s ease",
                      }}
                    />
                    <span
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: h.level === 2 ? "0.8rem" : "0.75rem",
                        color: isActive ? "#22c55e" : "#9ca3af",
                        fontWeight: h.level === 2 ? 500 : 400,
                        lineHeight: 1.4,
                        transition: "color 0.2s ease",
                      }}
                    >
                      {h.text}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
