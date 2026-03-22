import { motion } from "framer-motion";

export function SkeletonPostCard({ layout = "grid" }) {
  if (layout === "list") {
    return (
      <div className="glass-card rounded-2xl overflow-hidden flex" style={{ height: "140px" }}>
        <div className="skeleton w-40 flex-shrink-0" style={{ borderRadius: "16px 0 0 16px" }} />
        <div className="flex-1 p-4 flex flex-col justify-center gap-3">
          <div className="skeleton h-3 w-16 rounded-full" />
          <div className="skeleton h-5 w-4/5" />
          <div className="skeleton h-3 w-3/5" />
          <div className="flex items-center gap-2 mt-1">
            <div className="skeleton w-6 h-6 rounded-full" />
            <div className="skeleton h-3 w-20" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl overflow-hidden">
      <div className="skeleton w-full" style={{ height: "180px", borderRadius: "16px 16px 0 0" }} />
      <div className="p-4 space-y-3">
        <div className="skeleton h-3 w-16 rounded-full" />
        <div className="skeleton h-5 w-full" />
        <div className="skeleton h-4 w-4/5" />
        <div className="flex items-center gap-2 mt-2">
          <div className="skeleton w-6 h-6 rounded-full" />
          <div className="skeleton h-3 w-24" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 9, layout = "grid" }) {
  return layout === "grid" ? (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}>
          <SkeletonPostCard layout="grid" />
        </motion.div>
      ))}
    </div>
  ) : (
    <div className="flex flex-col gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div key={i}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.05 }}>
          <SkeletonPostCard layout="list" />
        </motion.div>
      ))}
    </div>
  );
}

export default SkeletonPostCard;
