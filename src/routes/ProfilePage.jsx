import { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

/* ── Toggle pill component ─────────────────────────────────── */
function Toggle({ on, onToggle, label }) {
  return (
    <label className="flex items-center justify-between cursor-pointer group">
      <span style={{ fontFamily: "'Inter',sans-serif", color: "#d1d5db", fontSize: "0.9rem" }} className="group-hover:text-white transition-colors">
        {label}
      </span>
      <div onClick={onToggle}
        className="relative w-12 h-6 rounded-full transition-colors cursor-pointer flex-shrink-0"
        style={{ background: on ? "#22c55e" : "rgba(255,255,255,0.1)" }}>
        <motion.div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow"
          animate={{ x: on ? 24 : 0 }} transition={{ type: "spring", stiffness: 400, damping: 25 }} />
      </div>
    </label>
  );
}

/* ── Accordion component ───────────────────────────────────── */
function Accordion({ title, icon, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <motion.div className="rounded-2xl overflow-hidden"
      style={{ background: "rgba(17,24,39,0.8)", border: "1px solid rgba(255,255,255,0.06)", backdropFilter: "blur(8px)" }}>
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left transition-colors"
        style={{ background: "transparent" }}
        onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.03)"}
        onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
        <span className="flex items-center gap-3">
          <span className="text-lg">{icon}</span>
          <span style={{ fontFamily: "'Oswald',sans-serif", color: "#f9fafb", fontSize: "0.95rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            {title}
          </span>
        </span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.3 }} style={{ color: "#6b7280" }}>
          ▾
        </motion.span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden">
            <div className="px-5 pb-5" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ── Contact method pills ──────────────────────────────────── */
function ContactPills({ value, onChange }) {
  const opts = ["Email", "WhatsApp", "SMS"];
  return (
    <div className="flex gap-2">
      {opts.map(opt => (
        <motion.button key={opt}
          onClick={() => onChange(opt)}
          className="px-4 py-2 rounded-xl text-xs font-semibold"
          style={{
            fontFamily: "'Montserrat',sans-serif",
            background: value === opt ? "rgba(34,197,94,0.2)" : "rgba(255,255,255,0.05)",
            border: value === opt ? "1px solid rgba(34,197,94,0.5)" : "1px solid rgba(255,255,255,0.1)",
            color: value === opt ? "#22c55e" : "#9ca3af",
            letterSpacing: "0.05em",
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}>
          {opt}
        </motion.button>
      ))}
    </div>
  );
}

/* ── Status presets ────────────────────────────────────────── */
const STATUS_PRESETS = [
  { type: "online",  label: "Online",  color: "#22c55e" },
  { type: "busy",    label: "Busy",    color: "#eab308" },
  { type: "offline", label: "Offline", color: "#ef4444" },
];

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════ */
export default function ProfilePage() {
  const { user, updateProfile, applyForAuthor, logout, isAuthor, isAdmin } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  /* ── State ── */
  const [editName, setEditName] = useState(user?.name || "");
  const [editUsername, setEditUsername] = useState(user?.username || "");
  const [birthday, setBirthday] = useState(user?.birthday || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [contactMethod, setContactMethod] = useState(user?.contactMethod || "Email");
  const [newsletter, setNewsletter] = useState(user?.newsletter !== false);
  const [autoPlay, setAutoPlay] = useState(user?.autoVideoPlay !== false);
  const [profileImage, setProfileImage] = useState(user?.image || "");
  const [saved, setSaved] = useState(false);

  /* Password */
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [pwMsg, setPwMsg] = useState("");

  /* Author application */
  const [appReason, setAppReason] = useState("");
  const [appSample, setAppSample] = useState("");
  const [appSent, setAppSent] = useState(false);

  /* Status */
  const [statusType, setStatusType] = useState(() => {
    const s = localStorage.getItem("5s_user_status");
    return s ? JSON.parse(s).type : "online";
  });
  const [statusColor, setStatusColor] = useState(() => {
    const s = localStorage.getItem("5s_user_status");
    return s ? JSON.parse(s).color : "#22c55e";
  });
  const [customLabel, setCustomLabel] = useState(() => {
    const s = localStorage.getItem("5s_user_status");
    return s ? JSON.parse(s).label || "" : "";
  });
  const [showStatus, setShowStatus] = useState(() => {
    const s = localStorage.getItem("5s_user_status");
    return s ? JSON.parse(s).visible !== false : true;
  });

  useEffect(() => {
    document.title = "Profile — 5s Arena Blog";
    window.scrollTo(0, 0);
  }, []);

  if (!user) { navigate("/login"); return null; }

  const isGoogleUser = user.provider === "google";

  /* ── Handlers ── */
  const handleSave = () => {
    updateProfile({
      name: editName,
      username: editUsername.startsWith("@") ? editUsername : `@${editUsername}`,
      birthday,
      phone,
      contactMethod,
      newsletter,
      autoVideoPlay: autoPlay,
      image: profileImage,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setProfileImage(ev.target.result);
      updateProfile({ image: ev.target.result });
    };
    reader.readAsDataURL(file);
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    setPwMsg("");
    if (!isGoogleUser && currentPw !== user.password) { setPwMsg("Current password is incorrect."); return; }
    if (newPw.length < 6) { setPwMsg("New password must be at least 6 characters."); return; }
    if (newPw !== confirmPw) { setPwMsg("Passwords do not match."); return; }
    updateProfile({ password: newPw });
    setPwMsg("Password updated successfully!");
    setCurrentPw(""); setNewPw(""); setConfirmPw("");
    setTimeout(() => setPwMsg(""), 3000);
  };

  const handleApply = (e) => {
    e.preventDefault();
    applyForAuthor({ reason: appReason, sampleTopic: appSample });
    setAppSent(true);
  };

  const handleStatusSave = () => {
    const data = { type: statusType, color: statusColor, label: customLabel, visible: showStatus };
    localStorage.setItem("5s_user_status", JSON.stringify(data));
    // Save status history
    const hist = JSON.parse(localStorage.getItem("5s_status_history") || "[]");
    if (statusType === "custom" && customLabel) {
      const exists = hist.find(h => h.label === customLabel);
      if (!exists) {
        hist.unshift({ label: customLabel, color: statusColor });
        localStorage.setItem("5s_status_history", JSON.stringify(hist.slice(0, 5)));
      }
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const statusHistory = JSON.parse(localStorage.getItem("5s_status_history") || "[]");

  const roleGradient = isAdmin
    ? "linear-gradient(135deg,#dc2626,#ef4444)"
    : isAuthor
    ? "linear-gradient(135deg,#059669,#22c55e)"
    : "linear-gradient(135deg,#374151,#6b7280)";

  return (
    <div style={{ background: "var(--color-bg)", minHeight: "100vh" }}>

      {/* ── Header ── */}
      <div className="relative overflow-hidden py-16"
        style={{ background: "linear-gradient(135deg,#052e16 0%,#0d1117 60%,#111827 100%)", borderBottom: "1px solid rgba(34,197,94,0.15)" }}>
        <div className="absolute inset-0 pointer-events-none opacity-10"
          style={{ backgroundImage: `repeating-linear-gradient(0deg,transparent,transparent 50px,rgba(34,197,94,0.3) 50px,rgba(34,197,94,0.3) 51px)` }} />

        <motion.div className="relative z-10 text-center max-w-xl mx-auto px-4"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 200 }}>

          {/* Profile photo */}
          <div className="relative inline-block mb-4">
            <motion.div
              className="w-28 h-28 rounded-full overflow-hidden mx-auto cursor-pointer relative group"
              style={{ border: "3px solid rgba(34,197,94,0.5)", boxShadow: "0 0 30px rgba(34,197,94,0.3)" }}
              onClick={() => fileInputRef.current?.click()}
              whileHover={{ scale: 1.05 }}>
              {profileImage ? (
                <img src={profileImage} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center" style={{ background: "rgba(34,197,94,0.2)" }}>
                  <span className="text-4xl">👤</span>
                </div>
              )}
              {/* Camera overlay */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: "rgba(0,0,0,0.6)" }}>
                <span className="text-2xl">📷</span>
              </div>
            </motion.div>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />

            {/* Status dot */}
            <motion.div className="absolute bottom-1 right-1 w-5 h-5 rounded-full border-2"
              style={{ background: statusColor, borderColor: "#111827", boxShadow: `0 0 8px ${statusColor}` }}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }} />
          </div>

          <h1 style={{ fontFamily: "'Bebas Neue',Impact,sans-serif", fontSize: "2.5rem", color: "#f9fafb", letterSpacing: "0.05em" }}>
            {user.name}
          </h1>
          <p style={{ fontFamily: "'Inter',sans-serif", color: "#6b7280", fontSize: "0.9rem", marginBottom: "0.5rem" }}>{user.email}</p>
          <span className="inline-block px-4 py-1 rounded-full text-xs font-bold"
            style={{ fontFamily: "'Montserrat',sans-serif", background: roleGradient, color: "#fff", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            {user.role}
          </span>
        </motion.div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-2xl mx-auto px-4 py-10 space-y-4">

        {/* Profile Info */}
        <Accordion title="Profile Information" icon="👤" defaultOpen>
          <div className="space-y-4 pt-4">
            <div>
              <label className="block text-xs mb-1" style={{ fontFamily: "'Montserrat',sans-serif", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.08em" }}>Display Name</label>
              <input type="text" value={editName} onChange={e => setEditName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl outline-none text-sm"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#f9fafb", fontFamily: "'Inter',sans-serif" }} />
            </div>
            <div>
              <label className="block text-xs mb-1" style={{ fontFamily: "'Montserrat',sans-serif", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.08em" }}>Username</label>
              <input type="text" value={editUsername} onChange={e => setEditUsername(e.target.value)}
                placeholder="@username"
                className="w-full px-4 py-3 rounded-xl outline-none text-sm"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#f9fafb", fontFamily: "'Inter',sans-serif" }} />
            </div>
            <div>
              <label className="block text-xs mb-1" style={{ fontFamily: "'Montserrat',sans-serif", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.08em" }}>Email</label>
              <input type="email" value={user.email} readOnly
                className="w-full px-4 py-3 rounded-xl outline-none text-sm"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", color: "#6b7280", fontFamily: "'Inter',sans-serif", cursor: "not-allowed" }} />
            </div>
            <div>
              <label className="block text-xs mb-1" style={{ fontFamily: "'Montserrat',sans-serif", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.08em" }}>Birthday</label>
              <input type="date" value={birthday} onChange={e => setBirthday(e.target.value)}
                className="w-full px-4 py-3 rounded-xl outline-none text-sm"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#f9fafb", fontFamily: "'Inter',sans-serif", colorScheme: "dark" }} />
            </div>
            <motion.button onClick={handleSave}
              className="btn-primary px-6 py-2.5 rounded-xl font-semibold text-sm"
              style={{ fontFamily: "'Montserrat',sans-serif" }}
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              {saved ? "✓ Saved!" : "Save Changes"}
            </motion.button>
          </div>
        </Accordion>

        {/* Security */}
        <Accordion title="Security" icon="🔒">
          <form onSubmit={handlePasswordChange} className="space-y-4 pt-4">
            {!isGoogleUser && (
              <div>
                <label className="block text-xs mb-1" style={{ fontFamily: "'Montserrat',sans-serif", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.08em" }}>Current Password</label>
                <input type="password" value={currentPw} onChange={e => setCurrentPw(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl outline-none text-sm"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#f9fafb", fontFamily: "'Inter',sans-serif" }}
                  required />
              </div>
            )}
            <div>
              <label className="block text-xs mb-1" style={{ fontFamily: "'Montserrat',sans-serif", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.08em" }}>New Password</label>
              <input type="password" value={newPw} onChange={e => setNewPw(e.target.value)}
                className="w-full px-4 py-3 rounded-xl outline-none text-sm"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#f9fafb", fontFamily: "'Inter',sans-serif" }}
                required minLength={6} />
            </div>
            <div>
              <label className="block text-xs mb-1" style={{ fontFamily: "'Montserrat',sans-serif", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.08em" }}>Confirm Password</label>
              <input type="password" value={confirmPw} onChange={e => setConfirmPw(e.target.value)}
                className="w-full px-4 py-3 rounded-xl outline-none text-sm"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#f9fafb", fontFamily: "'Inter',sans-serif" }}
                required />
            </div>
            {pwMsg && (
              <p style={{ fontFamily: "'Inter',sans-serif", fontSize: "0.8rem", color: pwMsg.includes("success") ? "#22c55e" : "#f87171" }}>
                {pwMsg}
              </p>
            )}
            <motion.button type="submit"
              className="px-6 py-2.5 rounded-xl font-semibold text-sm"
              style={{ fontFamily: "'Montserrat',sans-serif", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.15)", color: "#f9fafb" }}
              whileHover={{ background: "rgba(255,255,255,0.1)" }}>
              Update Password
            </motion.button>
          </form>
        </Accordion>

        {/* Communications */}
        <Accordion title="Communications" icon="📱">
          <div className="space-y-5 pt-4">
            <div>
              <label className="block text-xs mb-1" style={{ fontFamily: "'Montserrat',sans-serif", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.08em" }}>Phone Number</label>
              <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                placeholder="+27 63 782 0245"
                className="w-full px-4 py-3 rounded-xl outline-none text-sm"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#f9fafb", fontFamily: "'Inter',sans-serif" }} />
            </div>
            <div>
              <label className="block text-xs mb-2" style={{ fontFamily: "'Montserrat',sans-serif", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.08em" }}>Preferred Contact</label>
              <ContactPills value={contactMethod} onChange={setContactMethod} />
            </div>
            <Toggle on={newsletter} onToggle={() => setNewsletter(!newsletter)} label="Subscribe to newsletter" />
            <motion.button onClick={handleSave}
              className="btn-primary px-6 py-2.5 rounded-xl font-semibold text-sm"
              style={{ fontFamily: "'Montserrat',sans-serif" }}
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              {saved ? "✓ Saved!" : "Save Communications"}
            </motion.button>
          </div>
        </Accordion>

        {/* Preferences */}
        <Accordion title="Preferences" icon="🎬">
          <div className="space-y-5 pt-4">
            <Toggle on={autoPlay} onToggle={() => setAutoPlay(!autoPlay)} label="Auto-play videos on hover" />
            <p style={{ fontFamily: "'Inter',sans-serif", color: "#6b7280", fontSize: "0.75rem" }}>
              When enabled, video posts will auto-play when you hover over them.
            </p>
            <motion.button onClick={() => { updateProfile({ autoVideoPlay: autoPlay }); setSaved(true); setTimeout(() => setSaved(false), 2500); }}
              className="px-5 py-2 rounded-xl font-semibold text-sm"
              style={{ fontFamily: "'Montserrat',sans-serif", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.15)", color: "#d1d5db" }}
              whileHover={{ background: "rgba(255,255,255,0.1)" }}>
              Save Preference
            </motion.button>
          </div>
        </Accordion>

        {/* My Status */}
        <Accordion title="My Status" icon="🟢">
          <div className="space-y-5 pt-4">
            {/* Current status */}
            <div className="flex items-center gap-3">
              <motion.div className="w-4 h-4 rounded-full"
                style={{ background: statusColor, boxShadow: `0 0 10px ${statusColor}` }}
                animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }} />
              <span style={{ fontFamily: "'Inter',sans-serif", color: "#f9fafb", fontSize: "0.9rem" }}>
                {statusType === "custom" ? customLabel || "Custom" : statusType.charAt(0).toUpperCase() + statusType.slice(1)}
              </span>
            </div>

            {/* Preset options */}
            <div className="flex gap-2">
              {STATUS_PRESETS.map(s => (
                <motion.button key={s.type}
                  onClick={() => { setStatusType(s.type); setStatusColor(s.color); }}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold"
                  style={{
                    fontFamily: "'Montserrat',sans-serif",
                    background: statusType === s.type ? `${s.color}20` : "rgba(255,255,255,0.05)",
                    border: statusType === s.type ? `1px solid ${s.color}60` : "1px solid rgba(255,255,255,0.1)",
                    color: statusType === s.type ? s.color : "#9ca3af",
                  }}
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: s.color }} />
                  {s.label}
                </motion.button>
              ))}
            </div>

            {/* Custom status */}
            <div>
              <label className="block text-xs mb-2" style={{ fontFamily: "'Montserrat',sans-serif", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.08em" }}>Custom Status</label>
              <div className="flex gap-2">
                <input type="text" value={customLabel} maxLength={30}
                  onChange={e => { setCustomLabel(e.target.value); setStatusType("custom"); }}
                  placeholder="e.g. Writing an article..."
                  className="flex-1 px-4 py-2.5 rounded-xl outline-none text-sm"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#f9fafb", fontFamily: "'Inter',sans-serif" }} />
                <input type="color" value={statusColor}
                  onChange={e => { setStatusColor(e.target.value); setStatusType("custom"); }}
                  className="w-10 h-10 rounded-lg cursor-pointer border-0 p-0"
                  style={{ background: "transparent" }} />
              </div>
            </div>

            {/* Preview */}
            <div className="flex items-center gap-2 p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <span className="text-xs" style={{ color: "#6b7280", fontFamily: "'Montserrat',sans-serif" }}>Preview:</span>
              <div className="w-3 h-3 rounded-full" style={{ background: statusColor, boxShadow: `0 0 6px ${statusColor}` }} />
              <span style={{ fontFamily: "'Inter',sans-serif", color: "#d1d5db", fontSize: "0.85rem" }}>
                {statusType === "custom" ? customLabel || "Custom" : statusType.charAt(0).toUpperCase() + statusType.slice(1)}
              </span>
            </div>

            {/* Status history */}
            {statusHistory.length > 0 && (
              <div>
                <span className="block text-xs mb-2" style={{ fontFamily: "'Montserrat',sans-serif", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.08em" }}>Recent</span>
                <div className="flex flex-wrap gap-1.5">
                  {statusHistory.map((h, i) => (
                    <button key={i}
                      onClick={() => { setStatusType("custom"); setCustomLabel(h.label); setStatusColor(h.color); }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs"
                      style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "#9ca3af", fontFamily: "'Inter',sans-serif" }}>
                      <div className="w-2 h-2 rounded-full" style={{ background: h.color }} />
                      {h.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <Toggle on={showStatus} onToggle={() => setShowStatus(!showStatus)} label="Show my status to others" />

            <motion.button onClick={handleStatusSave}
              className="btn-primary px-6 py-2.5 rounded-xl font-semibold text-sm"
              style={{ fontFamily: "'Montserrat',sans-serif" }}
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              Save Status
            </motion.button>
          </div>
        </Accordion>

        {/* Author Application (readers only) */}
        {!isAuthor && !isAdmin && (
          <Accordion title="Apply for Author Program" icon="✍️">
            <div className="pt-4">
              {appSent ? (
                <div className="text-center py-6">
                  <div className="text-4xl mb-3">✅</div>
                  <p style={{ fontFamily: "'Oswald',sans-serif", color: "#22c55e", textTransform: "uppercase" }}>Application Submitted!</p>
                  <p style={{ fontFamily: "'Inter',sans-serif", color: "#6b7280", fontSize: "0.85rem", marginTop: "0.5rem" }}>
                    We&apos;ll review your application and get back to you.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleApply} className="space-y-4">
                  <div>
                    <label className="block text-xs mb-1" style={{ fontFamily: "'Montserrat',sans-serif", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                      Why do you want to write for 5s Arena?
                    </label>
                    <textarea value={appReason} onChange={e => setAppReason(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl outline-none text-sm resize-none h-24"
                      style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#f9fafb", fontFamily: "'Inter',sans-serif" }}
                      placeholder="Tell us about your passion for football writing..." required />
                  </div>
                  <div>
                    <label className="block text-xs mb-1" style={{ fontFamily: "'Montserrat',sans-serif", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                      Sample Article Topic
                    </label>
                    <input type="text" value={appSample} onChange={e => setAppSample(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl outline-none text-sm"
                      style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#f9fafb", fontFamily: "'Inter',sans-serif" }}
                      placeholder="e.g. The Evolution of Pressing in Modern Football" required />
                  </div>
                  <motion.button type="submit"
                    className="btn-primary px-6 py-2.5 rounded-xl font-semibold text-sm"
                    style={{ fontFamily: "'Montserrat',sans-serif" }}
                    whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    Submit Application
                  </motion.button>
                </form>
              )}
            </div>
          </Accordion>
        )}

        {/* Author Dashboard link */}
        {isAuthor && !isAdmin && (
          <Link to="/author">
            <motion.div className="rounded-2xl p-5 flex items-center justify-between"
              style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)" }}
              whileHover={{ background: "rgba(34,197,94,0.12)" }}>
              <span className="flex items-center gap-3">
                <span className="text-xl">👨‍💻</span>
                <span style={{ fontFamily: "'Oswald',sans-serif", color: "#22c55e", textTransform: "uppercase", letterSpacing: "0.05em" }}>Author Dashboard</span>
              </span>
              <span style={{ color: "#22c55e" }}>→</span>
            </motion.div>
          </Link>
        )}

        {/* Admin link */}
        {isAdmin && (
          <Link to="/admin">
            <motion.div className="rounded-2xl p-5 flex items-center justify-between"
              style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}
              whileHover={{ background: "rgba(239,68,68,0.12)" }}>
              <span className="flex items-center gap-3">
                <span className="text-xl">⚙️</span>
                <span style={{ fontFamily: "'Oswald',sans-serif", color: "#f87171", textTransform: "uppercase", letterSpacing: "0.05em" }}>Admin Dashboard</span>
              </span>
              <span style={{ color: "#f87171" }}>→</span>
            </motion.div>
          </Link>
        )}

        {/* Logout */}
        <motion.button
          onClick={() => { logout(); navigate("/"); }}
          className="w-full py-3.5 rounded-2xl font-semibold text-sm"
          style={{
            fontFamily: "'Montserrat',sans-serif",
            background: "rgba(239,68,68,0.08)",
            border: "1px solid rgba(239,68,68,0.2)",
            color: "#f87171",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
          whileHover={{ background: "rgba(239,68,68,0.15)" }}>
          Sign Out
        </motion.button>
      </div>
    </div>
  );
}
