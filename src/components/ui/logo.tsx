import { motion } from "framer-motion";
import { CalendarDays, Sparkles } from "lucide-react";

export function Logo({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <div
      className={`relative flex shrink-0 items-center justify-center ${className}`}
    >
      {/* Background Glow / Aura */}
      <div
        className="absolute inset-0 rounded-xl blur-[8px] opacity-60"
        style={{ background: "var(--gradient-hero)" }}
      />

      {/* Main Glass Box */}
      <div
        className="relative flex h-full w-full overflow-hidden items-center justify-center rounded-xl shadow-inner ring-1 ring-white/30"
        style={{ background: "var(--gradient-hero)" }}
      >
        {/* Continuous Shine/Shimmer Animation */}
        <motion.div
          animate={{ x: ["-150%", "250%"] }}
          transition={{
            repeat: Infinity,
            duration: 3,
            ease: "easeInOut",
            repeatDelay: 1,
          }}
          className="absolute inset-0 z-0 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/30 to-transparent"
        />

        {/* Main Icon */}
        <CalendarDays className="relative z-10 h-[55%] w-[55%] text-white drop-shadow-md" />
      </div>

      {/* Magical Floating Sparkle */}
      <motion.div
        animate={{
          rotate: [0, 15, -15, 0],
          scale: [1, 1.2, 0.9, 1],
        }}
        transition={{
          repeat: Infinity,
          duration: 4,
          ease: "easeInOut",
        }}
        className="absolute -right-1.5 -top-1.5 z-20 text-yellow-300 drop-shadow-[0_0_8px_rgba(253,224,71,0.8)]"
      >
        <Sparkles className="h-4 w-4 fill-yellow-300" />
      </motion.div>
    </div>
  );
}
