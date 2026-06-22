import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { School, ArrowLeft, Sun, Moon } from "lucide-react";
import { useSchool } from "@/lib/store";
import { useTheme } from "@/lib/theme";
import { Logo } from "@/components/ui/logo";

export function Sidebar({
  nav,
  activeTab,
  setTab,
}: {
  nav: any[];
  activeTab: string;
  setTab: (id: string) => void;
}) {
  const [school, setSchool] = useSchool();
  const { theme, toggleTheme } = useTheme();

  return (
    <aside className="hidden w-[280px] flex-col border-r border-border/40 bg-background/60 backdrop-blur-2xl transition-all md:flex z-10 relative">
      {/* --- HEADER --- */}
      <div className="flex h-[72px] items-center px-6">
        <Link
          to="/"
          className="group flex items-center gap-3.5 transition-all active:scale-[0.98]"
        >
          {/* Naya Logo yahan laga diya */}
          <Logo className="h-9 w-9 transition-transform group-hover:scale-105" />

          <span className="font-serif text-xl font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
            Timetable
          </span>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6 scrollbar-hide">
        {/* --- SCHOOL INPUT --- */}
        <div className="mb-8 flex items-center gap-3 rounded-2xl bg-secondary/50 px-4 py-3.5 ring-1 ring-border/50 transition-all focus-within:bg-background focus-within:ring-primary/30 focus-within:shadow-sm hover:bg-secondary/70">
          <School className="h-5 w-5 text-muted-foreground transition-colors" />
          <input
            type="text"
            value={school}
            onChange={(e) => setSchool(e.target.value)}
            placeholder="Enter School Name"
            className="w-full bg-transparent text-[15px] font-medium text-foreground outline-none placeholder:text-muted-foreground/60"
          />
        </div>

        {/* --- NAVIGATION --- */}
        <nav className="flex flex-col gap-1.5">
          {nav.map((n) => {
            const active = activeTab === n.id;
            return (
              <button
                key={n.id}
                onClick={() => setTab(n.id)}
                className="group relative flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 text-left text-[15px] font-medium transition-colors outline-none"
              >
                {/* Magic Sliding Background */}
                {active && (
                  <motion.div
                    layoutId="sidebar-active-tab"
                    className="absolute inset-0 rounded-2xl shadow-sm"
                    style={{ background: "var(--gradient-hero)" }}
                    initial={false}
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 30,
                    }}
                  />
                )}

                {/* Text and Icon (z-10 ensures they stay above the sliding background) */}
                <span className="relative z-10 flex items-center gap-3 w-full">
                  <n.icon
                    className={`h-5 w-5 transition-transform group-active:scale-90 ${
                      active
                        ? "text-primary-foreground"
                        : "text-muted-foreground group-hover:text-foreground"
                    }`}
                  />
                  <span
                    className={
                      active
                        ? "text-primary-foreground"
                        : "text-muted-foreground group-hover:text-foreground"
                    }
                  >
                    {n.label}
                  </span>
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* --- FOOTER --- */}
      <div className="mt-auto border-t border-border/40 p-5 bg-background/50">
        <div className="mb-5 flex items-center justify-between">
          <Link
            to="/"
            className="group flex items-center gap-2.5 text-sm font-semibold text-muted-foreground transition-all hover:text-foreground active:scale-[0.97]"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary/80 ring-1 ring-border/50 transition-colors group-hover:bg-destructive/10 group-hover:text-destructive group-hover:ring-destructive/20">
              <ArrowLeft className="h-4 w-4" />
            </div>
            Exit Studio
          </Link>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary/80 text-muted-foreground ring-1 ring-border/50 transition-all hover:bg-secondary hover:text-foreground"
          >
            {theme === "dark" ? (
              <Sun className="h-[18px] w-[18px]" />
            ) : (
              <Moon className="h-[18px] w-[18px]" />
            )}
          </motion.button>
        </div>

        <div className="text-center text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40">
          Designed by Divyansh Jain
        </div>
      </div>
    </aside>
  );
}
