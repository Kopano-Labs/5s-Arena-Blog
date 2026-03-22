import { useState, useEffect, useCallback, createContext, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ── Toast Context ── */
const ToastContext = createContext(null);

let _toastId = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "success", duration = 3000) => {
    const id = ++_toastId;
    setToasts((prev) => [...prev, { id, message, type, duration }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      {/* Toast Container — fixed bottom-right */}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none" style={{ maxWidth: 360 }}>
        <AnimatePresence>
          {toasts.map((toast) => (
            <ToastItem key={toast.id} toast={toast} onDismiss={removeToast} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

/* ── Toast Item ── */
const typeConfig = {
  success: { icon: "✓", bg: "rgba(34,197,94,0.15)", border: "rgba(34,197,94,0.4)", color: "#22c55e" },
  error:   { icon: "✕", bg: "rgba(239,68,68,0.15)", border: "rgba(239,68,68,0.4)", color: "#ef4444" },
  info:    { icon: "ℹ", bg: "rgba(6,182,212,0.15)", border: "rgba(6,182,212,0.4)", color: "#06b6d4" },
  warning: { icon: "⚠", bg: "rgba(234,179,8,0.15)", border: "rgba(234,179,8,0.4)", color: "#eab308" },
};

function ToastItem({ toast, onDismiss }) {
  const config = typeConfig[toast.type] || typeConfig.success;

  useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.id), toast.duration);
    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onDismiss]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 80, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 80, scale: 0.9 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="pointer-events-auto cursor-pointer rounded-xl px-4 py-3 backdrop-blur-md flex items-center gap-3"
      style={{
        background: config.bg,
        border: `1px solid ${config.border}`,
        boxShadow: `0 8px 32px rgba(0,0,0,0.4), 0 0 12px ${config.border}`,
      }}
      onClick={() => onDismiss(toast.id)}
    >
      <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ background: `${config.color}22`, border: `1px solid ${config.color}44` }}>
        <span style={{ color: config.color, fontSize: "0.8rem", fontWeight: 700 }}>{config.icon}</span>
      </div>
      <p style={{ fontFamily: "'Inter',sans-serif", color: "#d1d5db", fontSize: "0.8rem", lineHeight: 1.4 }}>
        {toast.message}
      </p>
    </motion.div>
  );
}

export default ToastProvider;
