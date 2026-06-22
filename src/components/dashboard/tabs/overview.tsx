import { motion, Variants } from "framer-motion";
import {
  Users,
  GraduationCap,
  BookOpen,
  Clock,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { useClasses, usePeriods, useSubjects, useTeachers } from "@/lib/store";
import { SectionHeader } from "@/components/ui/section-header";

// Framer Motion Animation Variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }, // Ek-ek karke cards aayenge (waterfall effect)
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
};

export function Overview({ onJump }: { onJump: (tab: string) => void }) {
  const [teachers] = useTeachers();
  const [classes] = useClasses();
  const [subjects] = useSubjects();
  const [periods] = usePeriods();

  // Premium colored gradients for each card hover state
  const stats = [
    {
      label: "Teachers",
      value: teachers.length,
      icon: Users,
      tab: "teachers",
      color: "from-blue-500/20 to-cyan-500/20",
      iconColor: "text-blue-500",
    },
    {
      label: "Classes",
      value: classes.length,
      icon: GraduationCap,
      tab: "classes",
      color: "from-purple-500/20 to-pink-500/20",
      iconColor: "text-purple-500",
    },
    {
      label: "Subjects",
      value: subjects.length,
      icon: BookOpen,
      tab: "subjects",
      color: "from-orange-500/20 to-red-500/20",
      iconColor: "text-orange-500",
    },
    {
      label: "Period Slots",
      value: periods.length,
      icon: Clock,
      tab: "periods",
      color: "from-emerald-500/20 to-teal-500/20",
      iconColor: "text-emerald-500",
    },
  ];

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <SectionHeader
        title="Welcome back"
        desc="Here's a quick overview of your timetable data."
      />

      {/* --- STATS GRID --- */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <motion.button
            variants={itemVariants}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            whileTap={{ scale: 0.98 }}
            key={s.label}
            onClick={() => onJump(s.tab)}
            className="group relative overflow-hidden rounded-[1.5rem] border border-border/50 bg-card p-6 text-left shadow-sm transition-shadow hover:shadow-xl dark:hover:shadow-primary/5"
          >
            {/* Background Hover Aura (Glow) */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${s.color} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
            />

            {/* Top Row: Icon + Arrow */}
            <div className="relative z-10 flex items-center justify-between">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary/80 ring-1 ring-border/50 transition-transform group-hover:scale-110 ${s.iconColor}`}
              >
                <s.icon className="h-6 w-6" />
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground/30 transition-all group-hover:translate-x-1 group-hover:text-foreground" />
            </div>

            {/* Bottom Row: Numbers */}
            <div className="relative z-10 mt-6">
              <div className="font-serif text-4xl font-bold tracking-tight text-foreground">
                {s.value}
              </div>
              <div className="mt-1 text-sm font-medium text-muted-foreground">
                Total {s.label}
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {/* --- PREMIUM GENERATE BANNER --- */}
      <motion.div
        variants={itemVariants}
        className="relative mt-10 overflow-hidden rounded-[2rem] p-8 text-primary-foreground transition-all hover:shadow-2xl md:p-10"
        style={{
          background: "var(--gradient-hero)",
          boxShadow: "0 20px 40px -15px rgba(0,0,0,0.25)",
        }}
      >
        {/* Ambient Blur Blobs (Deep Glassmorphism) */}
        <div className="absolute -right-10 -top-10 h-64 w-64 rounded-full bg-white/15 blur-3xl" />
        <div className="absolute -bottom-20 -left-10 h-40 w-40 rounded-full bg-black/15 blur-2xl" />

        <div className="relative z-10 flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div className="max-w-xl">
            <h2 className="flex items-center gap-3 font-serif text-3xl font-bold tracking-tight">
              <Sparkles className="h-8 w-8 text-yellow-300 drop-shadow-md" />
              Ready to generate?
            </h2>
            <p className="mt-3 text-[16px] leading-relaxed text-white/85">
              Your data is ready. Let our smart algorithm build a clash-free,
              six-day schedule for you. Export it directly to Excel with just
              one click.
            </p>
          </div>

          <button
            onClick={() => onJump("timetable")}
            className="group relative flex shrink-0 items-center gap-2 overflow-hidden rounded-2xl bg-white px-8 py-4 text-[15px] font-bold text-slate-900 shadow-xl ring-1 ring-black/5 transition-all hover:scale-[1.03] active:scale-95"
          >
            {/* Text & Icon */}
            <span className="relative z-10 flex items-center gap-2">
              Open Generator
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </span>

            {/* Button Hover Shimmer Effect */}
            <div className="absolute inset-0 z-0 -translate-x-[150%] bg-gradient-to-r from-transparent via-black/5 to-transparent transition-transform duration-500 group-hover:translate-x-[150%]" />
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
