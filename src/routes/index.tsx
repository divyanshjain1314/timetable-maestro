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
} from "lucide-react";

export default function Index() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setShowSplash(false), 2600);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <AnimatePresence>{showSplash && <Splash />}</AnimatePresence>
      {!showSplash && <Landing />}
    </>
  );
}

function Splash() {
  return (
    <motion.div
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "var(--gradient-hero)" }}
    >
      <div className="text-center text-primary-foreground">
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl bg-white/15 backdrop-blur-xl ring-1 ring-white/30"
        >
          <CalendarDays className="h-12 w-12" />
        </motion.div>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.7 }}
          className="text-sm uppercase tracking-[0.4em] text-white/70"
        >
          Designed and developed by
        </motion.p>
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.7 }}
          className="mt-3 font-serif text-5xl font-semibold tracking-tight md:text-6xl"
        >
          Divyansh Jain
        </motion.h1>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="mx-auto mt-10 h-1 w-40 overflow-hidden rounded-full bg-white/20"
        >
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
            className="h-full w-1/2 bg-white"
          />
        </motion.div>
      </div>
    </motion.div>
  );
}

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-xl"
            style={{ background: "var(--gradient-hero)" }}
          >
            <CalendarDays className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-serif text-xl font-semibold text-foreground">
            Timetable Studio
          </span>
        </div>
        <Link
          to="/dashboard"
          className="text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          Open dashboard →
        </Link>
      </header>

      <main className="mx-auto max-w-7xl px-6 pb-24 pt-12 md:pt-20">
        <div className="grid items-center gap-16 md:grid-cols-2">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Built for Indian schools · Class I to X
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="mt-6 font-serif text-5xl font-semibold leading-[1.05] tracking-tight text-foreground md:text-6xl"
            >
              The school timetable,{" "}
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: "var(--gradient-hero)" }}
              >
                reimagined
              </span>
              .
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="mt-6 max-w-lg text-lg text-muted-foreground"
            >
              Manage teachers, classes, subjects and period slots. Auto-generate
              a clash-free six-day, seven-period schedule and export to Excel in
              one click.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="mt-10 flex flex-wrap gap-3"
            >
              <Link
                to="/dashboard"
                className="group inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-base font-semibold text-primary-foreground transition-all hover:scale-[1.02]"
                style={{
                  background: "var(--gradient-hero)",
                  boxShadow: "var(--shadow-elegant)",
                }}
              >
                Get Started
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <a
                href="#features"
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-6 py-3.5 text-base font-medium text-foreground hover:bg-secondary"
              >
                Learn more
              </a>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="relative"
          >
            <div
              className="absolute -inset-6 rounded-3xl opacity-30 blur-3xl"
              style={{ background: "var(--gradient-hero)" }}
            />
            <div
              className="relative overflow-hidden rounded-2xl border border-border bg-card p-6"
              style={{ boxShadow: "var(--shadow-elegant)" }}
            >
              <div className="flex items-center justify-between border-b border-border pb-3 text-sm">
                <span className="font-semibold">Class VI · Monday</span>
                <span className="text-muted-foreground">7 periods</span>
              </div>
              <div className="mt-4 space-y-2 text-sm">
                {[
                  ["08:00", "English", "Anubhuti Mam"],
                  ["08:40", "Maths", "Arvind Sir"],
                  ["09:20", "Sanskrit", "Anjali Mam"],
                  ["10:20", "Science", "Yuvika Mam"],
                  ["11:00", "Hindi", "Suanchal Mam"],
                  ["11:40", "S.St", "Ankit Sir"],
                  ["12:20", "P.E", "Veer Sir"],
                ].map(([t, s, te]) => (
                  <div
                    key={t}
                    className="flex items-center justify-between rounded-lg bg-secondary/60 px-3 py-2"
                  >
                    <span className="font-mono text-xs text-muted-foreground">
                      {t}
                    </span>
                    <span className="font-medium text-foreground">{s}</span>
                    <span className="text-xs text-muted-foreground">{te}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        <section id="features" className="mt-32 grid gap-6 md:grid-cols-4">
          {[
            {
              icon: Users,
              title: "Teachers",
              desc: "Add, edit and assign subjects & classes.",
            },
            {
              icon: GraduationCap,
              title: "Classes",
              desc: "Manage Class I through X.",
            },
            {
              icon: CalendarDays,
              title: "Periods",
              desc: "Custom slots with timings.",
            },
            {
              icon: FileSpreadsheet,
              title: "Excel Export",
              desc: "One-click .xlsx download.",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-border bg-card p-6"
              style={{ boxShadow: "var(--shadow-soft)" }}
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="font-serif text-lg font-semibold text-foreground">
                {f.title}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </section>
      </main>

      <footer className="border-t border-border py-6 text-center text-sm text-muted-foreground">
        Designed and developed by{" "}
        <span className="font-medium text-foreground">Divyansh Jain</span>
      </footer>
    </div>
  );
}
