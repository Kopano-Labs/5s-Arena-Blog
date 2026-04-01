import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AIChatbot from "@/components/AIChatbot";
import FloatingNavDropdown from "@/components/FloatingNavDropdown";
import SearchModal from "@/components/SearchModal";
import BackToTop from "@/components/BackToTop";
import ReadingProgressBar from "@/components/ReadingProgressBar";
import BuyMeACoffee from "@/components/BuyMeACoffee";
import { useDarkMode } from "@/context/DarkModeContext";

export default function MainLayout() {
  const { darkMode } = useDarkMode();
  const location = useLocation();

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-body");
    } else {
      document.body.classList.remove("dark-body");
    }
  }, [darkMode]);

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? "dark" : ""}`}>
      <ReadingProgressBar />
      <Navbar />
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />

      {/* Global floating components */}
      <AIChatbot />
      <FloatingNavDropdown />
      <SearchModal />
      <BackToTop />
      <BuyMeACoffee />
    </div>
  );
}
