import { Link } from "react-router-dom";
import { FaFacebookF, FaPinterestP, FaLinkedinIn, FaWhatsapp, FaTelegramPlane, FaEnvelope } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export default function ArticleFooter({ post, prevPost, nextPost }) {
  const url = typeof window !== "undefined" ? window.location.href : "";
  const encoded = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(post?.title || "");

  const shareButtons = [
    { href: `https://www.facebook.com/sharer/sharer.php?u=${encoded}`, icon: <FaFacebookF />, label: "Share", bg: "bg-blue-600 hover:bg-blue-700", showLabel: true },
    { href: `https://twitter.com/intent/tweet?url=${encoded}&text=${encodedTitle}`, icon: <FaXTwitter />, label: "Tweet", bg: "bg-gray-800 hover:bg-gray-900", showLabel: true },
    { href: `https://pinterest.com/pin/create/button/?url=${encoded}&description=${encodedTitle}`, icon: <FaPinterestP />, label: "Pin", bg: "bg-red-600 hover:bg-red-700", showLabel: true },
    { href: `https://www.linkedin.com/shareArticle?mini=true&url=${encoded}&title=${encodedTitle}`, icon: <FaLinkedinIn />, bg: "bg-blue-700 hover:bg-blue-800" },
    { href: `https://wa.me/?text=${encodeURIComponent((post?.title || "") + " " + url)}`, icon: <FaWhatsapp />, bg: "bg-green-500 hover:bg-green-600" },
    { href: `https://t.me/share/url?url=${encoded}&text=${encodedTitle}`, icon: <FaTelegramPlane />, bg: "bg-sky-500 hover:bg-sky-600" },
    { href: `mailto:?subject=${encodedTitle}&body=${encoded}`, icon: <FaEnvelope />, bg: "bg-gray-600 hover:bg-gray-700" },
  ];

  return (
    <div className="mt-10">
      {/* Tags */}
      {post?.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {post.tags.map((tag) => (
            <Link
              key={tag}
              to={`/posts?search=${encodeURIComponent(tag)}`}
              className="px-4 py-2 text-sm font-medium rounded-full border border-gray-800 dark:border-gray-500 text-gray-800 dark:text-gray-300 hover:bg-green-700 hover:text-white hover:border-green-700 transition-colors"
            >
              {tag}
            </Link>
          ))}
        </div>
      )}

      {/* Prev / Next Navigation */}
      <div className="flex items-stretch justify-between gap-4 border-t border-b border-gray-200 dark:border-gray-700 py-6 mb-8">
        {prevPost ? (
          <Link to={`/${prevPost.slug}`} className="flex items-center gap-3 group flex-1 min-w-0">
            <img
              src={prevPost.author?.image || "/authors/Jackson Wayne.png"}
              alt={prevPost.title}
              className="w-14 h-14 rounded-full object-cover flex-shrink-0"
            />
            <div className="min-w-0">
              <p className="text-xs text-gray-400 uppercase font-semibold">Previous Post</p>
              <p className="text-sm font-bold text-gray-800 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors truncate">
                {prevPost.title}
              </p>
            </div>
          </Link>
        ) : <div className="flex-1" />}

        {nextPost ? (
          <Link to={`/${nextPost.slug}`} className="flex items-center gap-3 group flex-1 min-w-0 justify-end text-right">
            <div className="min-w-0">
              <p className="text-xs text-gray-400 uppercase font-semibold">Next Post</p>
              <p className="text-sm font-bold text-gray-800 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors truncate">
                {nextPost.title}
              </p>
            </div>
            <img
              src={nextPost.author?.image || "/authors/Jackson Wayne.png"}
              alt={nextPost.title}
              className="w-14 h-14 rounded-full object-cover flex-shrink-0"
            />
          </Link>
        ) : <div className="flex-1" />}
      </div>

      {/* Share Buttons Row */}
      <div className="flex flex-wrap gap-2 justify-center">
        {shareButtons.map((btn, i) => (
          <a
            key={i}
            href={btn.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-2 px-4 py-2.5 rounded text-white font-medium text-sm transition-colors ${btn.bg} ${btn.showLabel ? "min-w-[120px] justify-center" : ""}`}
          >
            {btn.icon}
            {btn.showLabel && <span>{btn.label}</span>}
          </a>
        ))}
      </div>
    </div>
  );
}
