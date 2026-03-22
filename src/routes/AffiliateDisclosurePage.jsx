import { useEffect } from "react";
import { motion } from "framer-motion";

const spring = { type: "spring", stiffness: 200 };

const sections = [
  {
    title: "What Are Affiliate Links?",
    body: (
      <p>
        Some of the links on this blog are <strong style={{ color: "#22c55e" }}>affiliate links</strong>.
        This means that if you click on one of these links and make a purchase, we may receive a small
        commission — at <em>no extra cost</em> to you. These commissions help us keep 5s Arena Blog
        running and allow us to continue producing the football content you love.
      </p>
    ),
  },
  {
    title: "Our Promise",
    body: (
      <p>
        Editorial integrity is our top priority. We <strong style={{ color: "#22c55e" }}>only recommend
        products and services we genuinely believe in</strong> and have either used ourselves or
        thoroughly researched. Our opinions are always our own, and affiliate partnerships never
        influence our editorial content or recommendations.
      </p>
    ),
  },
  {
    title: "How It Works",
    body: (
      <p>
        When you click an affiliate link on our site and complete a purchase, the retailer pays us a
        small referral commission. This is a standard industry practice and does not affect the price
        you pay. These earnings go directly toward covering hosting costs, paying our writers, and
        improving the blog experience for every reader.
      </p>
    ),
  },
  {
    title: "Products We Recommend",
    body: (
      <ul className="list-none space-y-2 pl-0">
        {[
          "Football boots & footwear",
          "Training equipment & accessories",
          "Books & coaching resources",
          "Online courses & memberships",
          "Nutrition & recovery products",
        ].map((item) => (
          <li key={item} className="flex items-center gap-3">
            <span
              className="inline-block w-2 h-2 rounded-full flex-shrink-0"
              style={{ background: "#22c55e" }}
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    ),
  },
  {
    title: "Contact Us",
    body: (
      <p>
        Have questions about our affiliate relationships or anything else? We&apos;re happy to chat.
        Reach out via{" "}
        <a
          href="https://wa.me/27637820245"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#22c55e", textDecoration: "underline" }}
        >
          WhatsApp
        </a>{" "}
        or visit our{" "}
        <a href="/about" style={{ color: "#22c55e", textDecoration: "underline" }}>
          About page
        </a>{" "}
        to learn more about the team behind 5s Arena Blog.
      </p>
    ),
  },
];

export default function AffiliateDisclosurePage() {
  useEffect(() => {
    document.title = "Affiliate Disclosure — 5s Arena Blog";
    window.scrollTo(0, 0);
  }, []);

  return (
    <div style={{ background: "var(--color-bg, #030712)", minHeight: "100vh" }}>

      {/* ── Hero header ── */}
      <div
        className="relative overflow-hidden py-20 text-center"
        style={{
          background: "linear-gradient(135deg,#052e16 0%,#0d1117 60%,#030712 100%)",
          borderBottom: "1px solid rgba(34,197,94,0.15)",
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none opacity-10"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg,transparent,transparent 60px,rgba(34,197,94,0.3) 60px,rgba(34,197,94,0.3) 61px),repeating-linear-gradient(90deg,transparent,transparent 100px,rgba(34,197,94,0.15) 100px,rgba(34,197,94,0.15) 101px)",
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at 50% 50%,rgba(34,197,94,0.1) 0%,transparent 60%)",
          }}
        />

        <motion.div
          className="relative z-10 px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={spring}
        >
          <h1
            className="gradient-text mb-4"
            style={{
              fontFamily: "'Bebas Neue',Impact,sans-serif",
              fontSize: "clamp(3rem,10vw,6rem)",
              letterSpacing: "0.05em",
              lineHeight: 1,
            }}
          >
            Affiliate Disclosure
          </h1>
          <p
            className="max-w-lg mx-auto"
            style={{
              fontFamily: "'Inter',sans-serif",
              color: "#9ca3af",
              fontSize: "1rem",
              lineHeight: 1.6,
            }}
          >
            Transparency matters. Here&apos;s how affiliate links work on 5s Arena Blog.
          </p>
        </motion.div>
      </div>

      {/* ── Content ── */}
      <div
        className="max-w-3xl mx-auto px-4 py-16 space-y-10"
        style={{ fontFamily: "'Inter',sans-serif", color: "#d1d5db", fontSize: "1rem", lineHeight: 1.8 }}
      >
        {sections.map((section, i) => (
          <motion.div
            key={section.title}
            className="rounded-2xl p-6 sm:p-8"
            style={{
              background: "rgba(255,255,255,0.05)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ ...spring, delay: i * 0.08 }}
          >
            <div className="section-heading mb-4">
              <h2
                style={{
                  fontFamily: "'Oswald',sans-serif",
                  fontSize: "1.5rem",
                  color: "#f9fafb",
                  margin: 0,
                }}
              >
                {section.title}
              </h2>
            </div>
            {section.body}
          </motion.div>
        ))}

        {/* Footer note */}
        <motion.p
          className="text-center pt-6"
          style={{
            fontFamily: "'Montserrat',sans-serif",
            color: "#6b7280",
            fontSize: "0.85rem",
            letterSpacing: "0.02em",
          }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          Last updated: March 2026
        </motion.p>
      </div>
    </div>
  );
}
