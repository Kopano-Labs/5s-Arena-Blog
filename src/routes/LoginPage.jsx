import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth, GOOGLE_CLIENT_ID } from "@/context/AuthContext";
import { GoogleLogin } from "@react-oauth/google";

/* ── Particle field background (Bookit-style) ── */
function ParticleField() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;
    let particles = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    class Particle {
      constructor() { this.reset(); }
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.speedY = (Math.random() - 0.5) * 0.4;
        this.opacity = Math.random() * 0.5 + 0.1;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(34,197,94,${this.opacity})`;
        ctx.fill();
      }
    }

    for (let i = 0; i < 80; i++) particles.push(new Particle());

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => { p.update(); p.draw(); });

      // draw connecting lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(34,197,94,${0.08 * (1 - dist / 120)})`;
            ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 z-0" />;
}

/* ── Main Login Page ── */
export default function LoginPage() {
  const [mode, setMode] = useState("login"); // login | register
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login, register, googleLogin, user } = useAuth();

  useEffect(() => {
    if (user) navigate("/profile");
  }, [user, navigate]);

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");
    const result = login(email, password);
    if (result.success) {
      navigate("/");
    } else {
      setError(result.error);
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setError("");
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    const result = register(name, email, password);
    if (result.success) {
      navigate("/");
    } else {
      setError(result.error);
    }
  };

  const formVariants = {
    hidden: { opacity: 0, x: 40 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
    exit: { opacity: 0, x: -40, transition: { duration: 0.3 } },
  };

  return (
    <div className="min-h-screen bg-gray-950 flex relative overflow-hidden">
      <ParticleField />

      {/* Left branding panel */}
      <div className="hidden lg:flex lg:w-1/2 relative z-10 flex-col items-center justify-center p-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <img src="/logo.png" alt="5s Arena" className="w-32 h-32 mx-auto mb-6 rounded-full shadow-2xl shadow-green-500/20" />
          <h1 className="text-5xl font-bold text-white mb-4">
            5s <span className="text-green-500">Arena</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-md mx-auto leading-relaxed">
            Your home for football culture, stories, and community. Join thousands of fans sharing their passion for the beautiful game.
          </p>
          <div className="flex items-center justify-center gap-8 mt-10">
            <div className="text-center">
              <p className="text-3xl font-bold text-green-500">46+</p>
              <p className="text-gray-500 text-sm">Articles</p>
            </div>
            <div className="w-px h-12 bg-gray-700" />
            <div className="text-center">
              <p className="text-3xl font-bold text-green-500">6</p>
              <p className="text-gray-500 text-sm">Authors</p>
            </div>
            <div className="w-px h-12 bg-gray-700" />
            <div className="text-center">
              <p className="text-3xl font-bold text-green-500">10+</p>
              <p className="text-gray-500 text-sm">Categories</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right auth panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center relative z-10 px-4 py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <img src="/logo.png" alt="5s Arena" className="w-20 h-20 mx-auto mb-3 rounded-full shadow-lg" />
            <h2 className="text-2xl font-bold text-white">
              5s <span className="text-green-500">Arena</span>
            </h2>
          </div>

          {/* Card */}
          <div className="bg-gray-900/80 backdrop-blur-xl border border-gray-800 rounded-2xl p-8 shadow-2xl">
            {/* Tabs */}
            <div className="flex mb-8 bg-gray-800 rounded-xl p-1">
              <button
                onClick={() => { setMode("login"); setError(""); }}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
                  mode === "login"
                    ? "bg-green-600 text-white shadow-lg shadow-green-600/25"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => { setMode("register"); setError(""); }}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
                  mode === "register"
                    ? "bg-green-600 text-white shadow-lg shadow-green-600/25"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Register
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-900/30 border border-red-700 text-red-400 rounded-lg text-sm">
                {error}
              </div>
            )}

            <AnimatePresence mode="wait">
              {mode === "login" ? (
                <motion.form
                  key="login"
                  variants={formVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  onSubmit={handleLogin}
                  className="space-y-5"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Password</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                      placeholder="Your password"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 bg-green-600 hover:bg-green-500 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-green-600/25 hover:shadow-green-500/40"
                  >
                    Sign In
                  </button>
                  <p className="text-center text-xs text-gray-500 mt-2">
                    Demo: admin@5sarena.com / admin123
                  </p>
                </motion.form>
              ) : (
                <motion.form
                  key="register"
                  variants={formVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  onSubmit={handleRegister}
                  className="space-y-5"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Full Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                      placeholder="Your full name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Password</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                      placeholder="Min. 6 characters"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 bg-green-600 hover:bg-green-500 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-green-600/25 hover:shadow-green-500/40"
                  >
                    Create Account
                  </button>
                </motion.form>
              )}
            </AnimatePresence>

            {/* Divider */}
            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-gray-700" />
              <span className="text-xs text-gray-500 uppercase tracking-wider">or</span>
              <div className="flex-1 h-px bg-gray-700" />
            </div>

            {/* Google OAuth */}
            {GOOGLE_CLIENT_ID ? (
              <div className="flex justify-center">
                <GoogleLogin
                  onSuccess={(credentialResponse) => {
                    const result = googleLogin(credentialResponse);
                    if (result.success) {
                      navigate("/");
                    } else {
                      setError(result.error);
                    }
                  }}
                  onError={() => setError("Google sign-in failed. Please try again.")}
                  theme="filled_black"
                  shape="pill"
                  size="large"
                  text={mode === "login" ? "signin_with" : "signup_with"}
                  width="320"
                />
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setError("Google OAuth not configured. Add VITE_GOOGLE_CLIENT_ID to your .env file.")}
                className="w-full flex items-center justify-center gap-3 py-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 font-medium rounded-xl transition-all"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                {mode === "login" ? "Sign in with Google" : "Sign up with Google"}
              </button>
            )}
          </div>

          <p className="text-center text-gray-600 text-xs mt-6">
            &copy; {new Date().getFullYear()} 5s Arena Blog. All rights reserved.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
