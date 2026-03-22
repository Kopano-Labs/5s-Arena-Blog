import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Reusable Accordion component.
 *
 * Usage:
 *   <Accordion items={[{ title: "Question", content: "Answer" }]} />
 *
 * Props:
 *   items     — Array of { title, content } objects
 *   allowMultiple — boolean, allow multiple items open (default false)
 *   className — optional wrapper class
 */
export default function Accordion({ items = [], allowMultiple = false, className = "" }) {
  const [openIndices, setOpenIndices] = useState(new Set());

  const toggle = (index) => {
    setOpenIndices((prev) => {
      const next = new Set(allowMultiple ? prev : []);
      if (prev.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {items.map((item, i) => {
        const isOpen = openIndices.has(i);
        return (
          <div
            key={i}
            className="rounded-xl overflow-hidden"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: `1px solid ${isOpen ? "rgba(34,197,94,0.3)" : "rgba(255,255,255,0.06)"}`,
              transition: "border-color 0.2s ease",
            }}
          >
            <button
              onClick={() => toggle(i)}
              className="w-full flex items-center justify-between px-5 py-4 text-left"
            >
              <span
                style={{
                  fontFamily: "'Oswald', sans-serif",
                  color: isOpen ? "#22c55e" : "#f9fafb",
                  fontSize: "0.95rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.03em",
                  transition: "color 0.2s ease",
                }}
              >
                {item.title}
              </span>
              <motion.span
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                style={{ color: "#22c55e", fontSize: "0.9rem" }}
              >
                ▾
              </motion.span>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 28 }}
                  className="overflow-hidden"
                >
                  <div
                    className="px-5 pb-4"
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      color: "#9ca3af",
                      fontSize: "0.875rem",
                      lineHeight: 1.6,
                    }}
                  >
                    {typeof item.content === "string" ? (
                      <p>{item.content}</p>
                    ) : (
                      item.content
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
