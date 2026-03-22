/**
 * Reusable Badge component for category, status, and role labels.
 *
 * Usage:
 *   <Badge label="Culture" />
 *   <Badge label="LIVE" variant="live" />
 *   <Badge label="Admin" variant="role" color="#06b6d4" />
 *
 * Props:
 *   label     — Text to display
 *   variant   — "category" (default) | "status" | "role" | "live" | "custom"
 *   color     — Override colour (hex)
 *   size      — "sm" (default) | "md" | "lg"
 *   className — Additional classes
 */

const CATEGORY_COLORS = {
  Culture: "#10b981",
  Legends: "#f59e0b",
  Skills: "#06b6d4",
  Tactics: "#8b5cf6",
  Fitness: "#ef4444",
  Community: "#3b82f6",
  News: "#34d399",
  "Women's Game": "#ec4899",
};

const SIZE_MAP = {
  sm: { px: "px-2", py: "py-0.5", text: "text-[0.6rem]" },
  md: { px: "px-3", py: "py-1", text: "text-xs" },
  lg: { px: "px-4", py: "py-1.5", text: "text-sm" },
};

export default function Badge({
  label,
  variant = "category",
  color,
  size = "sm",
  className = "",
}) {
  const resolvedColor =
    color || CATEGORY_COLORS[label] || "#22c55e";

  const sizeClasses = SIZE_MAP[size] || SIZE_MAP.sm;

  const isLive = variant === "live";

  return (
    <span
      className={`inline-flex items-center gap-1.5 ${sizeClasses.px} ${sizeClasses.py} rounded-full ${sizeClasses.text} font-semibold ${className}`}
      style={{
        fontFamily: "'Montserrat', sans-serif",
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        background: `${resolvedColor}20`,
        color: resolvedColor,
        border: `1px solid ${resolvedColor}44`,
      }}
    >
      {isLive && (
        <span
          className="w-1.5 h-1.5 rounded-full animate-pulse"
          style={{ background: resolvedColor, boxShadow: `0 0 6px ${resolvedColor}` }}
        />
      )}
      {label}
    </span>
  );
}
