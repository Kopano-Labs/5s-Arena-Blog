import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import api from "@/services/api";

const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["blockquote", "code-block"],
    ["link", "image"],
    ["clean"],
  ],
};

export default function Write() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [tags, setTags] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      const postData = {
        title,
        category,
        content,
        img: coverImage,
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
      };

      const res = await api.post("/posts", postData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const slug = res.data.slug || res.data.title?.toLowerCase().replace(/\s+/g, "-");
      navigate(`/${slug}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to publish post. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 dark:bg-gray-950 min-h-screen">
      <h1 className="text-3xl font-bold text-green-900 dark:text-green-400 mb-8">Write a New Post</h1>

      {error && (
        <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-400 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Post Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            placeholder="Enter your post title..."
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            required
          >
            <option value="">Select a category</option>
            <option value="Culture">Culture</option>
            <option value="Legends">Legends</option>
            <option value="Skills">Skills</option>
            <option value="Tactics">Tactics</option>
            <option value="5-a-Side">5-a-Side</option>
            <option value="Women&apos;s Game">Women&apos;s Game</option>
            <option value="Development">Development</option>
            <option value="Fitness">Fitness</option>
            <option value="Community">Community</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cover Image URL</label>
          <input
            type="url"
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            placeholder="https://example.com/image.jpg"
          />
          {coverImage && (
            <img src={coverImage} alt="Cover preview" className="mt-3 w-full h-48 object-cover rounded-lg" />
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tags (comma-separated)</label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            placeholder="football, tactics, culture"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Content</label>
          <div className="bg-white dark:bg-gray-800 rounded-lg">
            <ReactQuill
              theme="snow"
              value={content}
              onChange={setContent}
              modules={quillModules}
              placeholder="Write your post content here..."
              className="dark:text-white"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="px-8 py-3 bg-green-700 hover:bg-green-600 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
        >
          {submitting ? "Publishing..." : "Publish Post"}
        </button>
      </form>
    </div>
  );
}
