import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-green-900 dark:bg-gray-900 text-white py-10 px-4 mt-auto relative overflow-hidden">
      {/* Watermark logo */}
      <img
        src="/logo.png"
        alt=""
        className="absolute right-4 bottom-4 w-40 h-40 opacity-10 pointer-events-none select-none"
      />

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-3 mb-3">
            <img src="/logo.png" alt="5s Arena" className="w-10 h-10 rounded-full" />
            <h3 className="text-xl font-bold">5s Arena Blog</h3>
          </div>
          <p className="text-green-300 dark:text-green-400 text-sm">
            Your home for football culture, stories, and community.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-semibold mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm text-green-300 dark:text-green-400">
            <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
            <li><Link to="/posts" className="hover:text-white transition-colors">All Posts</Link></li>
            <li><Link to="/league" className="hover:text-white transition-colors">League</Link></li>
            <li><Link to="/about" className="hover:text-white transition-colors">About</Link></li>
          </ul>
        </div>

        {/* Social */}
        <div>
          <h4 className="font-semibold mb-3">Follow Us</h4>
          <div className="flex gap-4">
            <a href="#" aria-label="Facebook">
              <img src="/youtube-images/facebook.svg" alt="Facebook" className="w-6 h-6 invert" />
            </a>
            <a href="#" aria-label="Instagram">
              <img src="/youtube-images/instagram.svg" alt="Instagram" className="w-6 h-6 invert" />
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-8 pt-4 border-t border-green-700 dark:border-gray-700 text-center text-sm text-green-400 dark:text-gray-500 relative z-10">
        &copy; {new Date().getFullYear()} 5s Arena Blog. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
