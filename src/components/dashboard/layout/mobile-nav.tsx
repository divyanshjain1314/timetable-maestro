import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { School, Menu, X, Sun, Moon, ArrowLeft } from "lucide-react";
import { useSchool } from "@/lib/store";
import { useTheme } from "@/lib/theme";
import { Logo } from "@/components/ui/logo";

const menuVariants: Variants = {
  hidden: { opacity: 0, y: -20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24,
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    scale: 0.95,
    transition: { duration: 0.2 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0 },
};

export function MobileNav({
  nav,
  activeTab,
  setTab,
}: {
  nav: any[];
  activeTab: string;
  setTab: (id: string) => void;
}) {
  const [school, setSchool] = useSchool();
  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <>
      {/* --- TOP HEADER BAR --- */}
      <div className="fixed left-0 right-0 top-0 z-40 flex h-[72px] items-center justify-between border-b border-border/40 bg-background/70 px-5 backdrop-blur-2xl transition-all md:hidden">
        {/* Logo & Name */}
        <Link
          to="/"
          className="group flex items-center gap-3 transition-opacity active:opacity-70"
        >
          {/* Mobile mein thoda bada logo (h-10 w-10) */}
          <Logo className="h-10 w-10 transition-transform group-active:scale-95" />

          <span className="max-w-[130px] truncate font-serif text-[1.15rem] font-semibold tracking-tight text-foreground sm:max-w-[200px]">
            {school || "Timetable"}
          </span>
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-1.5">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={toggleTheme}
            className="flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            {theme === "dark" ? (
              <Sun className="h-[22px] w-[22px]" />
            ) : (
              <Moon className="h-[22px] w-[22px]" />
            )}
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/50 text-foreground transition-colors hover:bg-secondary"
          >
            <Menu className="h-5 w-5" />
          </motion.button>
        </div>
      </div>

      {/* --- FULL SCREEN OVERLAY & MENU --- */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop Blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-50 bg-background/80 backdrop-blur-xl md:hidden"
              onClick={() => setIsOpen(false)}
            />

            {/* Floating Premium Menu Card */}
            <div className="fixed inset-x-4 top-6 z-50 md:hidden pointer-events-none flex justify-center">
              <motion.div
                variants={menuVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="pointer-events-auto flex w-full max-w-sm flex-col overflow-hidden rounded-[2rem] border border-border/50 bg-card/95 p-4 shadow-2xl ring-1 ring-black/5 dark:ring-white/10"
              >
                {/* Menu Header (Close Button & School Input) */}
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex flex-1 items-center gap-3 rounded-2xl bg-secondary/60 px-4 py-3.5 ring-1 ring-border/50 transition-all focus-within:bg-background focus-within:ring-primary/30">
                    <School className="h-5 w-5 text-muted-foreground" />
                    <input
                      type="text"
                      value={school}
                      onChange={(e) => setSchool(e.target.value)}
                      placeholder="School Name"
                      className="w-full bg-transparent font-medium text-foreground outline-none placeholder:text-muted-foreground/60"
                    />
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsOpen(false)}
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-secondary/80 text-muted-foreground hover:bg-secondary hover:text-foreground"
                  >
                    <X className="h-6 w-6" />
                  </motion.button>
                </div>

                {/* Navigation Links */}
                <nav className="flex flex-col gap-1.5 px-1">
                  {nav.map((n) => {
                    const active = activeTab === n.id;
                    return (
                      <motion.button
                        variants={itemVariants}
                        key={n.id}
                        onClick={() => {
                          setTab(n.id);
                          setIsOpen(false);
                        }}
                        className={`group relative flex items-center gap-4 rounded-2xl px-4 py-3.5 text-base font-medium transition-all ${
                          active
                            ? "text-primary-foreground shadow-sm"
                            : "text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
                        }`}
                        style={
                          active
                            ? { background: "var(--gradient-hero)" }
                            : undefined
                        }
                      >
                        <n.icon
                          className={`h-5 w-5 transition-transform group-active:scale-90 ${
                            active ? "opacity-100" : "opacity-70"
                          }`}
                        />
                        {n.label}
                      </motion.button>
                    );
                  })}
                </nav>

                {/* Footer (Back to Home) */}
                <motion.div
                  variants={itemVariants}
                  className="mt-4 border-t border-border/40 px-1 pt-4"
                >
                  <Link
                    to="/"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 rounded-2xl px-4 py-3.5 text-[15px] font-medium text-muted-foreground transition-all hover:bg-destructive/10 hover:text-destructive active:scale-[0.98]"
                  >
                    <ArrowLeft className="h-5 w-5 opacity-70" />
                    Exit Dashboard
                  </Link>
                </motion.div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
