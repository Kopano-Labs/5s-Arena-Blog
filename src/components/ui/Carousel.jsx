import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Reusable Carousel component with auto-cycling and drag support.
 *
 * Usage:
 *   <Carousel items={items} renderItem={(item, i) => <div>{item.title}</div>} />
 *
 * Props:
 *   items        — Array of data objects
 *   renderItem   — (item, index) => ReactNode
 *   autoPlay     — boolean (default true)
 *   interval     — ms between slides (default 5000)
 *   showDots     — show dot indicators (default true)
 *   showArrows   — show prev/next arrows (default true)
 *   className    — optional wrapper class
 */

const slideVariants = {
  enter: (dir) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir) => ({ x: dir > 0 ? -300 : 300, opacity: 0 }),
};

export default function Carousel({
  items = [],
  renderItem,
  autoPlay = true,
  interval = 5000,
  showDots = true,
  showArrows = true,
  className = "",
}) {
  const [[current, direction], setCurrent] = useState([0, 0]);
  const timerRef = useRef(null);
  const pausedRef = useRef(false);

  const total = items.length;
  if (total === 0) return null;

  const go = useCallback(
    (dir) => {
      setCurrent(([prev]) => {
        const next = (prev + dir + total) % total;
        return [next, dir];
      });
    },
    [total]
  );

  /* Auto-play */
  useEffect(() => {
    if (!autoPlay || total <= 1) return;
    timerRef.current = setInterval(() => {
      if (!pausedRef.current) go(1);
    }, interval);
    return () => clearInterval(timerRef.current);
  }, [autoPlay, interval, total, go]);

  const pause = () => { pausedRef.current = true; };
  const resume = () => { pausedRef.current = false; };

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      onMouseEnter={pause}
      onMouseLeave={resume}
    >
      {/* Slide area */}
      <div className="relative w-full" style={{ minHeight: "200px" }}>
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={current}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="w-full"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.15}
            onDragEnd={(_, info) => {
              if (info.offset.x < -60) go(1);
              else if (info.offset.x > 60) go(-1);
            }}
          >
            {renderItem(items[current], current)}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Arrows */}
      {showArrows && total > 1 && (
        <>
          <motion.button
            onClick={() => go(-1)}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center z-10"
            style={{
              background: "rgba(0,0,0,0.5)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#f9fafb",
              fontSize: "1rem",
            }}
            whileHover={{ background: "rgba(34,197,94,0.3)", scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            ‹
          </motion.button>
          <motion.button
            onClick={() => go(1)}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center z-10"
            style={{
              background: "rgba(0,0,0,0.5)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#f9fafb",
              fontSize: "1rem",
            }}
            whileHover={{ background: "rgba(34,197,94,0.3)", scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            ›
          </motion.button>
        </>
      )}

      {/* Dots */}
      {showDots && total > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {items.map((_, i) => (
            <motion.button
              key={i}
              onClick={() => setCurrent([i, i > current ? 1 : -1])}
              className="rounded-full"
              style={{
                width: current === i ? 24 : 8,
                height: 8,
                background: current === i ? "#22c55e" : "rgba(255,255,255,0.15)",
                border: "none",
                transition: "width 0.3s ease, background 0.3s ease",
              }}
              whileHover={{ scale: 1.3 }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
