import { useState } from "react";
import { School, Menu, X } from "lucide-react";
import { useSchool } from "@/lib/store";

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

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 flex h-16 items-center justify-between border-b border-border bg-background/80 px-5 backdrop-blur-xl md:hidden">
        {" "}
        <div className="flex items-center gap-3">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-xl shadow-sm"
            style={{ background: "var(--gradient-hero)" }}
          >
            <School className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="max-w-[150px] truncate font-serif text-lg font-semibold text-foreground sm:max-w-[200px]">
            {school || "Timetable"}
          </span>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {isOpen && (
        <div className="fixed inset-0 top-16 z-40 bg-background/95 backdrop-blur-sm md:hidden">
          <div className="flex flex-col border-b border-border bg-card p-5 shadow-2xl animate-in slide-in-from-top-2 duration-200">
            <div className="mb-6 flex items-center gap-3 rounded-xl border border-border bg-secondary/50 px-4 py-3">
              <School className="h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                value={school}
                onChange={(e) => setSchool(e.target.value)}
                placeholder="Enter School Name"
                className="w-full bg-transparent font-medium text-foreground outline-none"
              />
            </div>
            <nav className="flex flex-col gap-2">
              {nav.map((n) => {
                const active = activeTab === n.id;
                return (
                  <button
                    key={n.id}
                    onClick={() => {
                      setTab(n.id);
                      setIsOpen(false);
                    }}
                    className={`flex items-center gap-3 rounded-xl px-4 py-3.5 text-base font-medium transition-all ${
                      active
                        ? "text-primary-foreground shadow-md"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    }`}
                    style={
                      active
                        ? { background: "var(--gradient-hero)" }
                        : undefined
                    }
                  >
                    <n.icon
                      className={`h-5 w-5 ${active ? "" : "opacity-70"}`}
                    />
                    {n.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
