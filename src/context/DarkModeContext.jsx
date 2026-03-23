import { createContext, useContext, useState, useEffect } from "react";

export const THEMES = [
  {
    id: "dark",
    label: "🌙 Dark",
    bg: "#030712",
    surface: "#0d1117",
    text: "#f9fafb",
    subtext: "#9ca3af",
    accent: "#22c55e",
    border: "rgba(255,255,255,0.08)",
  },
  {
    id: "light",
    label: "☀️ Light",
    bg: "#f0fdf4",
    surface: "#ffffff",
    text: "#0a0f1a",
    subtext: "#4b5563",
    accent: "#16a34a",
    border: "rgba(0,0,0,0.08)",
  },
  {
    id: "reading",
    label: "📖 Reading",
    bg: "#fdf6e3",
    surface: "#fbeecf",
    text: "#2c1a00",
    subtext: "#78572a",
    accent: "#b45309",
    border: "rgba(100,60,0,0.15)",
  },
  {
    id: "wild",
    label: "🎆 Wild",
    bg: "#05000f",
    surface: "#0d0020",
    text: "#ffffff",
    subtext: "#d8b4fe",
    accent: "#f97316",
    border: "rgba(249,115,22,0.2)",
  },
];

const DarkModeContext = createContext();

export function DarkModeProvider({ children }) {
  const [theme, setThemeState] = useState(() => {
    const saved = localStorage.getItem("5s_theme");
    return THEMES.find((t) => t.id === saved)?.id || "dark";
  });

  const currentTheme = THEMES.find((t) => t.id === theme) || THEMES[0];
  const darkMode = theme === "dark" || theme === "wild";

  useEffect(() => {
    const root = document.documentElement;

    // Tailwind dark class
    if (darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    // CSS custom properties for non-Tailwind styling
    root.style.setProperty("--color-bg",      currentTheme.bg);
    root.style.setProperty("--color-surface", currentTheme.surface);
    root.style.setProperty("--color-text",    currentTheme.text);
    root.style.setProperty("--color-subtext", currentTheme.subtext);
    root.style.setProperty("--color-accent",  currentTheme.accent);
    root.style.setProperty("--color-border",  currentTheme.border);

    // Body background so the whole page matches
    document.body.style.background = currentTheme.bg;
    document.body.style.color = currentTheme.text;

    // Wild mode neon glow pulse on root
    if (theme === "wild") {
      root.setAttribute("data-theme", "wild");
    } else {
      root.removeAttribute("data-theme");
    }

    root.setAttribute("data-theme-id", theme);
    localStorage.setItem("5s_theme", theme);
  }, [theme, currentTheme, darkMode]);

  const setTheme = (id) => {
    if (THEMES.find((t) => t.id === id)) setThemeState(id);
  };

  // Backward-compatible toggle (dark ↔ light)
  const toggleDarkMode = () =>
    setThemeState((prev) => (prev === "dark" ? "light" : "dark"));

  return (
    <DarkModeContext.Provider
      value={{ darkMode, theme, setTheme, themes: THEMES, currentTheme, toggleDarkMode }}
    >
      {children}
    </DarkModeContext.Provider>
  );
}

export function useDarkMode() {
  const ctx = useContext(DarkModeContext);
  if (!ctx) throw new Error("useDarkMode must be used within a DarkModeProvider");
  return ctx;
}
