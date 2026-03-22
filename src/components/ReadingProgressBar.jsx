import { useState, useEffect } from "react";

export default function ReadingProgressBar() {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

      setProgress(Math.min(scrollPercent, 100));
      setVisible(scrollTop > 50);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className="fixed top-0 left-0 z-[60]"
      style={{
        width: `${progress}%`,
        height: "3px",
        background: "linear-gradient(to right, #22c55e, #06b6d4)",
        boxShadow: "0 0 10px rgba(34,197,94,0.5)",
        transition: "width 0.15s ease-out, opacity 0.3s ease",
        opacity: visible ? 1 : 0,
      }}
    />
  );
}
