import { useState } from "react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setEmail("");
    }
  };

  return (
    <section
      className="py-16 bg-cover bg-center relative"
      style={{ backgroundImage: "url('/backgrounds/football-legends-background-6.jpg')" }}
    >
      <div className="absolute inset-0 bg-green-900/85" />
      <div className="relative z-10 max-w-2xl mx-auto px-4 text-center text-white">
        <h2 className="text-3xl font-bold mb-3">Stay in the Game!</h2>
        <p className="text-green-200 mb-8">
          Get the latest posts delivered to your inbox. Football culture, stories, and more.
        </p>
        {submitted ? (
          <div className="bg-green-600/30 border border-green-400 rounded-lg p-6">
            <p className="text-lg font-semibold">You&apos;re on the team!</p>
            <p className="text-green-200 text-sm mt-1">Check your inbox for a confirmation.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 justify-center">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email..."
              className="px-5 py-3 rounded-full text-gray-900 w-full sm:w-80 outline-none focus:ring-2 focus:ring-green-400"
              required
            />
            <button
              type="submit"
              className="px-8 py-3 bg-green-500 hover:bg-green-400 text-white font-semibold rounded-full transition-colors"
            >
              Subscribe
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
