import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-green-900 dark:bg-gray-900 text-white py-8 px-4 mt-auto">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Brand */}
        <div>
          <h3 className="text-xl font-bold mb-2">5s Arena Blog</h3>
          <p className="text-green-300 dark:text-green-400 text-sm">
            Your home for football culture, stories, and community.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-semibold mb-2">Quick Links</h4>
          <ul className="space-y-1 text-sm text-green-300 dark:text-green-400">
            <li><Link to="/" className="hover:text-white">Home</Link></li>
            <li><Link to="/posts" className="hover:text-white">All Posts</Link></li>
            <li><Link to="/about" className="hover:text-white">About</Link></li>
          </ul>
        </div>

        {/* Social */}
        <div>
          <h4 className="font-semibold mb-2">Follow Us</h4>
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

      <div className="max-w-6xl mx-auto mt-8 pt-4 border-t border-green-700 dark:border-gray-700 text-center text-sm text-green-400 dark:text-gray-500">
        &copy; {new Date().getFullYear()} 5s Arena Blog. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
