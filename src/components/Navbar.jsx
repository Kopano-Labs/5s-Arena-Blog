import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiSun, FiMoon, FiSearch } from "react-icons/fi";
import Image from "./image.jsx";
import { useDarkMode } from "@/context/DarkModeContext";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { darkMode, toggleDarkMode } = useDarkMode();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      navigate(`/posts?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  return (
    <nav className="w-full h-16 md:h-20 flex items-center justify-between px-4 bg-green-900 dark:bg-gray-900 text-white">
      {/* LOGO */}
      <Link to="/" className="flex items-center gap-4 text-2xl font-bold">
        <Image src="logo.png" alt="5&apos;s Arena Logo" w={32} h={32} />
        <span>5s Arena Blog</span>
      </Link>

      {/* MOBILE MENU */}
      <div className="md:hidden flex items-center gap-3">
        <button onClick={toggleDarkMode} className="text-xl p-1">
          {darkMode ? <FiSun /> : <FiMoon />}
        </button>
        <div
          className="cursor-pointer text-4xl z-50 relative"
          onClick={() => setOpen((prev) => !prev)}
        >
          {open ? "X" : "\u2630"}
        </div>

        {/* MOBILE LINK LIST */}
        <div
          className={`w-full h-screen flex flex-col items-center justify-center gap-8 font-medium text-lg fixed top-16 left-0 bg-green-700 dark:bg-gray-800 text-white z-40 transition-transform ease-in-out duration-300 ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="relative w-64">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
              placeholder="Search posts..."
              className="w-full pl-10 pr-4 py-2 rounded-full bg-white/20 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-green-400 text-sm"
            />
          </div>
          <Link to="/" onClick={() => setOpen(false)}>Home</Link>
          <Link to="/posts?sort=trending" onClick={() => setOpen(false)}>Trending</Link>
          <Link to="/posts?sort=popular" onClick={() => setOpen(false)}>Most Popular</Link>
          <Link to="/about" onClick={() => setOpen(false)}>About</Link>
          <Link to="/login" onClick={() => setOpen(false)}>
            <button className="py-2 px-4 rounded-3xl bg-green-800 dark:bg-green-700 text-white shadow-md">
              Login
            </button>
          </Link>
        </div>
      </div>

      {/* DESKTOP MENU */}
      <div className="hidden md:flex items-center gap-6 xl:gap-8 font-medium">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearch}
            placeholder="Search posts..."
            className="pl-10 pr-4 py-2 rounded-full bg-white/20 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-green-400 text-sm w-48 xl:w-56"
          />
        </div>
        <Link to="/" className="hover:text-green-300 transition-colors">Home</Link>
        <Link to="/posts?sort=trending" className="hover:text-green-300 transition-colors">Trending</Link>
        <Link to="/posts?sort=popular" className="hover:text-green-300 transition-colors">Most Popular</Link>
        <Link to="/about" className="hover:text-green-300 transition-colors">About</Link>
        <button onClick={toggleDarkMode} className="text-xl p-1 hover:text-green-300 transition-colors">
          {darkMode ? <FiSun /> : <FiMoon />}
        </button>
        <Link to="/login">
          <button className="py-2 px-4 rounded-3xl bg-green-600 hover:bg-green-500 dark:bg-green-700 dark:hover:bg-green-600 text-white shadow-md transition-colors">
            Login
          </button>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
