import React from "react";
import { motion } from "framer-motion";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
    this.handleReset = this.handleReset.bind(this);
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    if (import.meta.env.DEV) {
      console.error("[ErrorBoundary] Caught error:", error, info);
    }
  }

  handleReset() {
    this.setState({ hasError: false, error: null });
  }

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    const isDev = import.meta.env.DEV;

    return (
      <div
        style={{
          minHeight: "100vh",
          background: "var(--color-bg, #030712)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
          fontFamily: "'Montserrat', sans-serif",
        }}
      >
        {/* Animated football emoji */}
        <motion.div
          style={{ fontSize: "4rem", marginBottom: "1.5rem", display: "block" }}
          animate={{ y: [0, -18, 0] }}
          transition={{
            duration: 0.7,
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut",
          }}
          aria-hidden="true"
        >
          ⚽
        </motion.div>

        {/* Heading */}
        <h1
          style={{
            fontFamily: "'Bebas Neue', cursive",
            fontSize: "clamp(2.5rem, 8vw, 5rem)",
            color: "#f9fafb",
            letterSpacing: "0.05em",
            marginBottom: "1.5rem",
            textAlign: "center",
          }}
        >
          Something went wrong
        </h1>

        {/* Error card with spring animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          style={{
            background: "rgba(220, 38, 38, 0.08)",
            border: "1px solid rgba(220, 38, 38, 0.3)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            borderRadius: "1rem",
            padding: "1.5rem 2rem",
            maxWidth: "560px",
            width: "100%",
            marginBottom: "2rem",
            textAlign: "center",
          }}
        >
          <p
            style={{
              color: "#fca5a5",
              fontSize: "1rem",
              lineHeight: "1.6",
              wordBreak: "break-word",
            }}
          >
            {isDev && this.state.error
              ? this.state.error.message || String(this.state.error)
              : "An unexpected error occurred. Please try refreshing the page or return to the homepage."}
          </p>

          {isDev && this.state.error?.stack && (
            <pre
              style={{
                marginTop: "1rem",
                padding: "1rem",
                background: "rgba(0,0,0,0.4)",
                borderRadius: "0.5rem",
                fontSize: "0.7rem",
                color: "#f87171",
                textAlign: "left",
                overflowX: "auto",
                whiteSpace: "pre-wrap",
                wordBreak: "break-all",
              }}
            >
              {this.state.error.stack}
            </pre>
          )}
        </motion.div>

        {/* Action buttons */}
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }}>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: "0.75rem 1.75rem",
              borderRadius: "0.5rem",
              border: "none",
              background: "#16a34a",
              color: "#fff",
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 700,
              fontSize: "0.9rem",
              letterSpacing: "0.03em",
              cursor: "pointer",
              transition: "opacity 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            Try Again
          </button>

          <button
            onClick={() => (window.location.href = "/")}
            style={{
              padding: "0.75rem 1.75rem",
              borderRadius: "0.5rem",
              border: "1px solid rgba(156,163,175,0.4)",
              background: "transparent",
              color: "#d1d5db",
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 700,
              fontSize: "0.9rem",
              letterSpacing: "0.03em",
              cursor: "pointer",
              transition: "opacity 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.75")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;
