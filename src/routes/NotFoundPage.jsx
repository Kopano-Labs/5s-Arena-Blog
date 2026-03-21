import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <h1 className="text-6xl font-bold text-green-900 mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-8">
        Oops! This page doesn&apos;t exist. The ball went out of bounds.
      </p>
      <Link
        to="/"
        className="px-6 py-3 bg-green-700 text-white rounded-full hover:bg-green-600 transition-colors font-semibold"
      >
        Back to Home
      </Link>
    </div>
  );
}
