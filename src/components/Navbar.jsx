/**
 * Navbar Component
 * Author: https://www.linkedin.com/in/kholofelo-robyn-rababalela-7a26273b6
 */
import { IKImage, IKContext } from "@imagekit/react";
import { useState } from "react";

const Navbar = () => {
    const [open, setOpen] = useState(false);
    
    // Safety Fallback: Prevents a fatal React crash if your .env file is missing
    const imageKitEndpoint = import.meta.env.VITE_IK_URL_ENDPOINT || "https://ik.imagekit.io/default_fallback";
    
    return (
        <div className="w-full h-16 md:h-20 flex items-center justify-between">
            {/* LOGO */}
            <div className="flex items-center gap-4 text-2xl font-bold">
                {/* Corrected IKContext Syntax */}
                <IKContext urlEndpoint={imageKitEndpoint}>
                    <IKImage path="/logo.png" className="w-8 h-8" alt="5s Arena Blog Logo" />
                </IKContext>
                <span>5s Arena Blog</span>
            </div>
            
            {/* MOBILE MENU */}
            <div className="md:hidden">
                <div
                    className="cursor-pointer text-4xl select-none"
                    onClick={() => setOpen((prev) => !prev)}
                >
                    {open ? "X" : "☰"}
                </div>
                {/*MOBILE LINK LIST */}
                <div 
                    className={`w-full h-screen flex flex-col items-center justify-center gap-8 font-medium text-lg absolute top-16 bg-green-700 transition-all ease-in-out z-50 ${
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
                    <button className="py-2 px-4 rounded-3xl bg-green-800 text-white shadow-md hover:bg-green-900 transition-colors">
                        Login ✋🏿
                    </button>
                </a>
            </div>
        </div>
  );
};

export default Navbar;