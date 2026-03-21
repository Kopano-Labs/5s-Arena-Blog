import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { FaFacebookF, FaWhatsapp, FaLink } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import api from "@/services/api";
import Sidebar from "@/components/Sidebar";

export default function SinglePostPage() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentForm, setCommentForm] = useState({ name: "", email: "", content: "" });
  const [commentSubmitting, setCommentSubmitting] = useState(false);
  const [commentSuccess, setCommentSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/posts/${slug}`);
        setPost(res.data);
        setNotFound(false);
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [slug]);

  useEffect(() => {
    if (!post?._id) return;
    const fetchComments = async () => {
      try {
        const res = await api.get(`/comments/${post._id}`);
        setComments(res.data || []);
      } catch {
        setComments([]);
      }
    };
    fetchComments();
  }, [post]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    setCommentSubmitting(true);
    try {
      const res = await api.post(`/comments/${post._id}`, {
        author: commentForm.name,
        email: commentForm.email,
        content: commentForm.content,
      });
      setComments((prev) => [...prev, res.data]);
      setCommentForm({ name: "", email: "", content: "" });
      setCommentSuccess(true);
      setTimeout(() => setCommentSuccess(false), 3000);
    } catch {
      // Silently fail
    } finally {
      setCommentSubmitting(false);
    }
  };

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="animate-pulse">
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-xl mb-6" />
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto mb-4" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto" />
        </div>
      </div>
    );
  }

  if (notFound || !post) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center dark:bg-gray-950">
        <h1 className="text-5xl font-bold text-green-900 dark:text-green-400 mb-4">Post Not Found</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
          Sorry, we couldn&apos;t find the post you&apos;re looking for.
        </p>
        <Link
          to="/posts"
          className="px-6 py-3 bg-green-700 text-white rounded-full hover:bg-green-600 transition-colors font-semibold"
        >
          Browse All Posts
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 dark:bg-gray-950">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content */}
        <article className="lg:w-2/3">
          {/* Cover Image */}
          {(post.coverImage || post.img || post.image) && (
            <img
              src={post.coverImage || post.img || post.image}
              alt={post.title}
              className="w-full h-72 md:h-96 object-cover rounded-xl mb-6"
            />
          )}

          {/* Category Badge */}
          {post.category && (
            <span className="inline-block px-3 py-1 text-xs font-semibold text-green-800 dark:text-green-300 bg-green-100 dark:bg-green-900 rounded-full uppercase mb-3">
              {post.category}
            </span>
          )}

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {post.title}
          </h1>

          {/* Author Info */}
          <div className="flex items-center gap-3 mb-8 text-sm text-gray-500 dark:text-gray-400">
            <img
              src={post.author?.image || post.user?.img || post.authorImg || "/authors/Jackson Wayne.png"}
              alt={post.author?.name || post.user?.username || "Author"}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <p className="font-semibold text-gray-800 dark:text-gray-200">
                {post.author?.name || post.user?.username || post.author}
              </p>
              <p>
                {post.createdAt ? new Date(post.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "Recently"}
                {post.readingTime ? ` \u00B7 ${post.readingTime} min read` : ""}
              </p>
            </div>
          </div>

          {/* Article Content */}
          <div
            className="prose prose-lg dark:prose-invert max-w-none mb-10 text-gray-800 dark:text-gray-300"
            dangerouslySetInnerHTML={{ __html: post.content || post.desc || "" }}
          />

          {/* Social Share */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mb-10">
            <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase mb-3">Share this post</h4>
            <div className="flex gap-3">
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                <FaFacebookF />
              </a>
              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(post.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-black text-white hover:bg-gray-800 transition-colors"
              >
                <FaXTwitter />
              </a>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(post.title + " " + shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-green-500 text-white hover:bg-green-600 transition-colors"
              >
                <FaWhatsapp />
              </a>
              <button
                onClick={handleCopyLink}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                <FaLink />
              </button>
              {copied && <span className="self-center text-sm text-green-600 dark:text-green-400">Copied!</span>}
            </div>
          </div>

          {/* Comments Section */}
          <section className="border-t border-gray-200 dark:border-gray-700 pt-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Comments ({comments.length})
            </h3>

            {/* Comment List */}
            {comments.length > 0 ? (
              <div className="space-y-6 mb-8">
                {comments.map((comment) => (
                  <div key={comment._id || comment.id} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold text-gray-800 dark:text-white text-sm">
                        {comment.name || comment.author || "Anonymous"}
                      </span>
                      <span className="text-xs text-gray-400">
                        {comment.createdAt ? new Date(comment.createdAt).toLocaleDateString() : ""}
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">{comment.content || comment.text}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 dark:text-gray-500 mb-8">No comments yet. Be the first to share your thoughts!</p>
            )}

            {/* Comment Form */}
            <form onSubmit={handleCommentSubmit} className="space-y-4 bg-white dark:bg-gray-800 rounded-xl p-6 shadow">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Leave a Comment</h4>
              {commentSuccess && (
                <p className="text-green-600 dark:text-green-400 text-sm font-medium">Comment posted successfully!</p>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Your name"
                  value={commentForm.name}
                  onChange={(e) => setCommentForm({ ...commentForm, name: e.target.value })}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
                <input
                  type="email"
                  placeholder="Your email"
                  value={commentForm.email}
                  onChange={(e) => setCommentForm({ ...commentForm, email: e.target.value })}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <textarea
                placeholder="Write your comment..."
                value={commentForm.content}
                onChange={(e) => setCommentForm({ ...commentForm, content: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-green-500 resize-y"
                required
              />
              <button
                type="submit"
                disabled={commentSubmitting}
                className="px-6 py-2 bg-green-700 hover:bg-green-600 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
              >
                {commentSubmitting ? "Posting..." : "Post Comment"}
              </button>
            </form>
          </section>
        </article>

        {/* Sidebar */}
        <div className="lg:w-1/3">
          <Sidebar />
        </div>
      </div>
    </div>
  );
}
