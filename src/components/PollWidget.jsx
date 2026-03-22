import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

function PollWidget({ question, options, pollId }) {
  const storageKeyVotes = `5s_polls_${pollId}`;
  const storageKeyVoted = `5s_poll_voted_${pollId}`;

  const [votes, setVotes] = useState(() => {
    const stored = localStorage.getItem(storageKeyVotes);
    if (stored) return JSON.parse(stored);
    const initial = {};
    options.forEach((opt) => (initial[opt] = 0));
    return initial;
  });

  const [userVote, setUserVote] = useState(() => {
    return localStorage.getItem(storageKeyVoted) || null;
  });

  const [selected, setSelected] = useState(null);
  const hasVoted = userVote !== null;

  const totalVotes = Object.values(votes).reduce((sum, c) => sum + c, 0);

  const handleVote = () => {
    if (!selected || hasVoted) return;
    const updated = { ...votes, [selected]: (votes[selected] || 0) + 1 };
    setVotes(updated);
    setUserVote(selected);
    localStorage.setItem(storageKeyVotes, JSON.stringify(updated));
    localStorage.setItem(storageKeyVoted, selected);
  };

  const getPercentage = (option) => {
    if (totalVotes === 0) return 0;
    return Math.round((votes[option] / totalVotes) * 100);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className="w-full max-w-md mx-auto rounded-2xl p-6"
      style={{
        background: "rgba(255,255,255,0.05)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        border: "1px solid rgba(255,255,255,0.1)",
      }}
    >
      {/* Question */}
      <h3
        className="text-xl font-bold text-white mb-5"
        style={{ fontFamily: "'Oswald', sans-serif" }}
      >
        {question}
      </h3>

      <AnimatePresence mode="wait">
        {!hasVoted ? (
          /* Voting View */
          <motion.div
            key="vote-view"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.25 }}
          >
            <div className="flex flex-col gap-3 mb-5">
              {options.map((option) => (
                <button
                  key={option}
                  onClick={() => setSelected(option)}
                  className="w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center gap-3"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    background:
                      selected === option
                        ? "rgba(34,197,94,0.15)"
                        : "rgba(255,255,255,0.03)",
                    border:
                      selected === option
                        ? "1px solid rgba(34,197,94,0.5)"
                        : "1px solid rgba(255,255,255,0.07)",
                    color: selected === option ? "#22c55e" : "rgba(255,255,255,0.8)",
                  }}
                  onMouseEnter={(e) => {
                    if (selected !== option) {
                      e.currentTarget.style.background = "rgba(34,197,94,0.08)";
                      e.currentTarget.style.borderColor = "rgba(34,197,94,0.3)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selected !== option) {
                      e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
                    }
                  }}
                >
                  {/* Radio circle */}
                  <span
                    className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center"
                    style={{
                      border:
                        selected === option
                          ? "2px solid #22c55e"
                          : "2px solid rgba(255,255,255,0.25)",
                    }}
                  >
                    {selected === option && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ background: "#22c55e" }}
                      />
                    )}
                  </span>
                  <span className="text-sm">{option}</span>
                </button>
              ))}
            </div>

            {/* Vote Button */}
            <button
              onClick={handleVote}
              disabled={!selected}
              className="w-full py-2.5 rounded-lg font-semibold text-sm transition-all duration-200"
              style={{
                fontFamily: "'Inter', sans-serif",
                background: selected
                  ? "linear-gradient(135deg, #22c55e, #06b6d4)"
                  : "rgba(255,255,255,0.08)",
                color: selected ? "#030712" : "rgba(255,255,255,0.3)",
                cursor: selected ? "pointer" : "not-allowed",
              }}
            >
              Vote
            </button>
          </motion.div>
        ) : (
          /* Results View */
          <motion.div
            key="results-view"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
          >
            <div className="flex flex-col gap-3 mb-4">
              {options.map((option, i) => {
                const pct = getPercentage(option);
                const isUserChoice = userVote === option;
                return (
                  <div
                    key={option}
                    className="rounded-lg overflow-hidden px-4 py-3 relative"
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      border: isUserChoice
                        ? "1px solid rgba(34,197,94,0.6)"
                        : "1px solid rgba(255,255,255,0.07)",
                    }}
                  >
                    {/* Bar */}
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{
                        duration: 0.7,
                        delay: i * 0.1,
                        ease: "easeOut",
                      }}
                      className="absolute inset-y-0 left-0 rounded-lg"
                      style={{
                        background:
                          "linear-gradient(90deg, rgba(34,197,94,0.25), rgba(6,182,212,0.25))",
                      }}
                    />
                    {/* Content */}
                    <div className="relative z-10 flex items-center justify-between">
                      <span
                        className="text-sm"
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          color: isUserChoice ? "#22c55e" : "rgba(255,255,255,0.8)",
                          fontWeight: isUserChoice ? 600 : 400,
                        }}
                      >
                        {option}
                        {isUserChoice && (
                          <span className="ml-2 text-xs opacity-60">
                            &#10003;
                          </span>
                        )}
                      </span>
                      <span
                        className="text-sm flex items-center gap-2"
                        style={{
                          fontFamily: "'Montserrat', sans-serif",
                          color: "rgba(255,255,255,0.6)",
                        }}
                      >
                        <span className="font-semibold text-white">{pct}%</span>
                        <span className="text-xs">({votes[option]})</span>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Total Votes */}
            <p
              className="text-xs text-center"
              style={{
                fontFamily: "'Montserrat', sans-serif",
                color: "rgba(255,255,255,0.35)",
              }}
            >
              {totalVotes} total vote{totalVotes !== 1 ? "s" : ""}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default PollWidget;
