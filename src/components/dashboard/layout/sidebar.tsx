import { Link } from "react-router-dom";
import { School, ArrowLeft } from "lucide-react";
import { useSchool } from "@/lib/store";

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

  return (
    <aside
      className="sticky top-0 hidden h-screen w-72 shrink-0 flex-col border-r md:flex"
      style={{
        background: "var(--sidebar-bg)",
        color: "var(--sidebar-fg)",
        borderColor: "transparent",
      }}
    >
      <div className="border-b border-white/10 px-6 py-6">
        <div className="mb-3 flex items-center gap-2 text-xs uppercase tracking-widest text-white/50">
          <School className="h-3.5 w-3.5" /> School
        </div>
        <input
          type="text"
          value={school}
          onChange={(e) => setSchool(e.target.value)}
          className="w-full bg-transparent font-serif text-xl font-semibold text-white outline-none focus:border-b focus:border-white/40"
        />
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {nav.map((n) => {
          const active = activeTab === n.id;
          return (
            <button
              key={n.id}
              onClick={() => setTab(n.id)}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
                active
                  ? "text-white shadow-md"
                  : "text-white/70 hover:bg-white/5 hover:text-white"
              }`}
              style={
                active ? { background: "var(--gradient-hero)" } : undefined
              }
            >
              <n.icon className="h-4 w-4" />
              {n.label}
            </button>
          );
        })}
      </nav>
      <div className="border-t border-white/10 p-4 text-xs text-white/40">
        <Link
          to="/"
          className="inline-flex items-center gap-1 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-3 w-3" /> Back to home
        </Link>
        <div className="mt-2">Designed by Divyansh Jain</div>
      </div>
    </aside>
  );
}
