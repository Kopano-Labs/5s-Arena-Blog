import { useState } from "react";
import Image from "./image.jsx";   // ✅ default import, not { Image }

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="w-full h-16 md:h-20 flex items-center justify-between px-4">
      {/* LOGO */}
      <div className="flex items-center gap-4 text-2xl font-bold">
        <Image src="logo.png" alt="5's Arena Logo" w={32} h={32} />
        <span>5s Arena Blog</span>
      </div>

      {/* MOBILE MENU */}
      <div className="md:hidden">
        {/* MOBILE BUTTON */}
        <div
          className="cursor-pointer text-4xl"
          onClick={() => setOpen((prev) => !prev)}
        >
          {open ? "X" : "☰"}
        </div>

        {/* MOBILE LINK LIST */}
        <div
          className={`w-full h-screen flex flex-col items-center justify-center gap-8 font-medium text-lg absolute top-16 bg-green-700 transition-transform ease-in-out ${
            open ? "-right-0" : "-right-[100%]"
          }`}
        >
          <a href="/">Home</a>
          <a href="/">Trending</a>
          <a href="/">Most Popular</a>
          <a href="/">About</a>
          <a href="/">
            <button className="py-2 px-4 rounded-3xl bg-green-800 text-white shadow-md">
              Login ✋🏿
            </button>
          </a>
        </div>
      </div>

      {/* DESKTOP MENU */}
      <div className="hidden md:flex items-center gap-8 xl:gap-12 font-medium">
        <a href="/">Home</a>
        <a href="/">Trending</a>
        <a href="/">Most Popular</a>
        <a href="/">About</a>
        <a href="/">
          <button className="py-2 px-4 rounded-3xl bg-green-800 text-white shadow-md">
            Login ✋🏿
          </button>
        </a>
      </div>
    </nav>
  );
};

export default Navbar;