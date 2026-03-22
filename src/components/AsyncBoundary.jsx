import React, { Suspense } from "react";
import ErrorBoundary from "@/components/ErrorBoundary";

/** Spinning green ring — matches the blog's PageLoader design system. */
const SpinnerFallback = () => (
  <div
    style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      background: "var(--color-bg, #030712)",
    }}
  >
    <div
      style={{
        width: "3rem",
        height: "3rem",
        borderRadius: "9999px",
        border: "4px solid rgba(34,197,94,0.3)",
        borderTopColor: "#22c55e",
        animation: "spin 0.75s linear infinite",
      }}
    />
    <p
      style={{
        marginTop: "1rem",
        fontFamily: "'Montserrat', sans-serif",
        color: "#6b7280",
        fontSize: "0.875rem",
      }}
    >
      Loading…
    </p>

    {/* Keyframe injected once — harmless if duplicated */}
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

/**
 * AsyncBoundary wraps children with both an ErrorBoundary and a Suspense
 * boundary so that lazy-loaded components and async operations are covered
 * by a single composable wrapper.
 *
 * Usage:
 *   <AsyncBoundary>
 *     <SomeLazyComponent />
 *   </AsyncBoundary>
 *
 * You can override the loading fallback via the `fallback` prop.
 */
const AsyncBoundary = ({ children, fallback }) => (
  <ErrorBoundary>
    <Suspense fallback={fallback ?? <SpinnerFallback />}>
      {children}
    </Suspense>
  </ErrorBoundary>
);

export default AsyncBoundary;
