import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  CalendarDays,
  Users,
  GraduationCap,
  FileSpreadsheet,
  ArrowRight,
  Sparkles,
  Sun,
  Moon,
  CheckCircle2,
} from "lucide-react";
import { useTheme } from "@/lib/theme";

export default function Index() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Splash screen timing
    const t = setTimeout(() => setShowSplash(false), 2400);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <AnimatePresence mode="wait">{showSplash && <Splash />}</AnimatePresence>
      {!showSplash && <Landing />}
    </>
  );
}

// --- PREMIUM SPLASH SCREEN ---
function Splash() {
  return (
    <motion.div
      key="splash"
      exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background"
    >
      <div className="relative flex items-center justify-center">
        {/* Pulsing Outer Glow */}
        <motion.div
          animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute h-32 w-32 rounded-full blur-2xl"
          style={{ background: "var(--gradient-hero)" }}
        />

        {/* Main Icon Container */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0, rotate: -15 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.5 }}
          className="relative z-10 flex h-20 w-20 items-center justify-center rounded-[1.5rem] shadow-2xl ring-1 ring-white/20"
          style={{ background: "var(--gradient-hero)" }}
        >
          <CalendarDays className="h-10 w-10 text-white drop-shadow-md" />
        </motion.div>
      </div>

      {/* Text & Loading Dots */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="mt-8 flex flex-col items-center"
      >
        <h1 className="font-serif text-2xl font-bold tracking-tight text-foreground">
          Timetable Studio
        </h1>
        <div className="mt-4 flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ y: [0, -6, 0], opacity: [0.3, 1, 0.3] }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.15,
                ease: "easeInOut",
              }}
              className="h-1.5 w-1.5 rounded-full bg-primary"
            />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

// --- PREMIUM LANDING PAGE ---
function Landing() {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="relative min-h-screen bg-background overflow-hidden selection:bg-primary/20"
    >
      {/* Background Ambient Glows */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] h-[500px] w-[500px] rounded-full bg-primary/10 blur-[100px]" />
        <div className="absolute top-[20%] -right-[10%] h-[400px] w-[400px] rounded-full bg-blue-500/10 blur-[100px]" />
      </div>

      {/* Floating Glass Header */}
      <header className="fixed top-4 inset-x-0 mx-auto z-40 flex w-[90%] max-w-6xl items-center justify-between rounded-2xl border border-border/40 bg-background/60 px-5 py-3 backdrop-blur-xl shadow-sm transition-all md:px-6 md:py-4">
        <div className="flex items-center gap-2.5">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-xl shadow-sm ring-1 ring-white/10"
            style={{ background: "var(--gradient-hero)" }}
          >
            <CalendarDays className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-serif text-lg font-bold tracking-tight text-foreground md:text-xl">
            Timetable Studio
          </span>
        </div>

        <div className="flex items-center gap-3 md:gap-5">
          <button
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-all hover:bg-secondary hover:text-foreground active:scale-95"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </button>
          <Link
            to="/dashboard"
            className="group hidden md:inline-flex items-center gap-1 text-sm font-semibold text-foreground transition-all hover:text-primary"
          >
            Dashboard
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            to="/dashboard"
            className="md:hidden inline-flex h-9 items-center justify-center rounded-xl px-4 text-sm font-semibold text-primary-foreground transition-active active:scale-95"
            style={{ background: "var(--gradient-hero)" }}
          >
            Open
          </Link>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-7xl px-6 pb-24 pt-32 md:pt-48">
        {/* HERO SECTION */}
        <div className="grid items-center gap-16 md:grid-cols-2">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Smart scheduling for modern schools
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="mt-6 font-serif text-5xl font-bold leading-[1.1] tracking-tight text-foreground md:text-6xl lg:text-7xl"
            >
              The school timetable,{" "}
              <span
                className="bg-clip-text text-transparent pb-2"
                style={{ backgroundImage: "var(--gradient-hero)" }}
              >
                reimagined.
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="mt-6 max-w-lg text-lg text-muted-foreground"
            >
              Manage teachers, classes, subjects, and period slots effortlessly.
              Auto-generate a clash-free schedule and export to Excel in
              seconds.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="mt-10 flex flex-wrap gap-4"
            >
              <Link
                to="/dashboard"
                className="group inline-flex items-center gap-2 rounded-2xl px-7 py-4 text-base font-semibold text-primary-foreground transition-all hover:scale-[1.03] hover:shadow-lg active:scale-95"
                style={{
                  background: "var(--gradient-hero)",
                  boxShadow: "var(--shadow-elegant)",
                }}
              >
                Start Generating Free
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </div>

          {/* HERO GLASS CARD (Right side) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, rotateY: 15 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ delay: 0.4, duration: 0.8, type: "spring" }}
            className="relative perspective-1000"
          >
            <div
              className="absolute -inset-2 rounded-[2.5rem] opacity-40 blur-2xl"
              style={{ background: "var(--gradient-hero)" }}
            />
            <div
              className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-card/40 p-6 backdrop-blur-2xl ring-1 ring-border/50"
              style={{ boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
            >
              <div className="flex items-center justify-between border-b border-border/50 pb-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="font-bold text-foreground">
                    Class VI · Schedule
                  </span>
                </div>
                <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-semibold text-muted-foreground">
                  7 periods
                </span>
              </div>
              <div className="mt-5 space-y-2.5 text-sm">
                {[
                  ["08:00", "English", "Anubhuti Mam"],
                  ["08:40", "Maths", "Arvind Sir"],
                  ["09:20", "Sanskrit", "Anjali Mam"],
                  ["10:20", "Science", "Yuvika Mam"],
                  ["11:00", "Hindi", "Suanchal Mam"],
                ].map(([t, s, te], i) => (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + i * 0.1 }}
                    key={t}
                    className="group flex items-center justify-between rounded-xl border border-border/40 bg-background/50 px-4 py-3 transition-colors hover:bg-secondary/80"
                  >
                    <span className="font-mono text-[13px] font-medium text-muted-foreground/80">
                      {t}
                    </span>
                    <span className="font-bold text-foreground">{s}</span>
                    <span className="text-[13px] font-medium text-muted-foreground">
                      {te}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* FEATURES SECTION (Scroll Animations) */}
        <div id="features" className="mt-40">
          <div className="mb-12 text-center">
            <h2 className="font-serif text-3xl font-bold text-foreground md:text-4xl">
              Everything you need
            </h2>
            <p className="mt-3 text-muted-foreground">
              Built to handle complex school requirements simply.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-4">
            {[
              {
                icon: Users,
                title: "Teacher Management",
                desc: "Assign subjects and multi-class mappings seamlessly.",
              },
              {
                icon: CheckCircle2,
                title: "Clash-Free Logic",
                desc: "Smart algorithm prevents double-booking teachers.",
              },
              {
                icon: CalendarDays,
                title: "Custom Time Slots",
                desc: "Adjust period timings and daily schedules easily.",
              },
              {
                icon: FileSpreadsheet,
                title: "1-Click Export",
                desc: "Download master and class-wise Excel files instantly.",
              },
            ].map((f, i) => (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                key={f.title}
                className="group rounded-[1.5rem] border border-border/50 bg-card p-7 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
                  <f.icon className="h-6 w-6" />
                </div>
                <h3 className="font-serif text-xl font-bold text-foreground">
                  {f.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      {/* CLEAN PREMIUM FOOTER */}
      <footer className="border-t border-border/40 bg-card/30 py-8 text-center backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-2 px-6">
          <div className="flex items-center gap-2 text-foreground/80">
            <CalendarDays className="h-4 w-4" />
            <span className="font-serif font-bold">Timetable Studio</span>
          </div>
          <p className="text-[13px] text-muted-foreground">
            © {new Date().getFullYear()} Timetable Studio. All rights reserved.
          </p>
        </div>
      </footer>
    </motion.div>
  );
}
