import { IKImage, IKContext } from "@imagekit/react";
import { useState } from "react";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  const imageKitEndpoint =
    import.meta.env.VITE_IK_URL_ENDPOINT ||
    "https://ik.imagekit.io/default_fallback";

  const links = ["Home", "Trending", "Most Popular", "About"];

  return (
    <nav className="w-full h-16 md:h-20 flex items-center justify-between px-4">
      {/* LOGO */}
      <div className="flex items-center gap-4 text-2xl font-bold">
        <IKContext urlEndpoint={imageKitEndpoint}>
          <IKImage
            path="/logo.png"
            className="w-8 h-8"
            alt="5s Arena Blog Logo"
          />
        </IKContext>
        <span>5s Arena Blog</span>
      </div>

      {/* MOBILE MENU */}
      <div className="md:hidden">
        <div
          className="cursor-pointer text-4xl select-none"
          onClick={() => setOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          {open ? "X" : "☰"}
        </div>
        <div
          className={`fixed top-16 w-full h-screen flex flex-col items-center justify-center gap-8 font-medium text-lg bg-green-700 transition-transform duration-300 ease-in-out z-50 ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {links.map((link) => (
            <a key={link} href="/">
              {link}
            </a>
          ))}
          <a href="/">
            <button className="py-2 px-4 rounded-3xl bg-green-800 text-white shadow-md">
              Login ✋🏿
            </button>
          </a>
        </div>
      </div>

      {/* DESKTOP MENU */}
      <div className="hidden md:flex items-center gap-8 xl:gap-12 font-medium">
        {links.map((link) => (
          <a key={link} href="/">
            {link}
          </a>
        ))}
        <a href="/">
          <button className="py-2 px-4 rounded-3xl bg-green-800 text-white shadow-md hover:bg-green-900 transition-colors">
            Login ✋🏿
          </button>
        </a>
      </div>
    </nav>
  );
};

export default Navbar;