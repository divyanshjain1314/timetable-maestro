import {
  Users,
  GraduationCap,
  BookOpen,
  Clock,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { useClasses, usePeriods, useSubjects, useTeachers } from "@/lib/store";
import { SectionHeader } from "@/components/ui/section-header";

export function Overview({ onJump }: { onJump: (tab: string) => void }) {
  const [teachers] = useTeachers();
  const [classes] = useClasses();
  const [subjects] = useSubjects();
  const [periods] = usePeriods();

  const stats = [
    {
      label: "Teachers",
      value: teachers.length,
      icon: Users,
      tab: "teachers",
    },
    {
      label: "Classes",
      value: classes.length,
      icon: GraduationCap,
      tab: "classes",
    },
    {
      label: "Subjects",
      value: subjects.length,
      icon: BookOpen,
      tab: "subjects",
    },
    {
      label: "Period Slots",
      value: periods.length,
      icon: Clock,
      tab: "periods",
    },
  ];

  return (
    <>
      <SectionHeader
        title="Welcome back"
        desc="Everything you need to plan your week."
      />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <button
            key={s.label}
            onClick={() => onJump(s.tab)}
            className="rounded-2xl border border-border bg-card p-5 text-left transition-all hover:-translate-y-0.5 hover:shadow-lg"
            style={{ boxShadow: "var(--shadow-soft)" }}
          >
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-accent-foreground">
              <s.icon className="h-5 w-5" />
            </div>
            <div className="font-serif text-4xl font-semibold">{s.value}</div>
            <div className="mt-1 text-sm text-muted-foreground">{s.label}</div>
          </button>
        ))}
      </div>

      <div
        className="relative mt-8 overflow-hidden rounded-2xl p-8 text-primary-foreground transition-all hover:shadow-lg"
        style={{
          background: "var(--gradient-hero)",
          boxShadow: "var(--shadow-elegant)",
        }}
      >
        {/* Background blur effect for a premium feel */}
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />

        <div className="relative z-10 flex flex-wrap items-center justify-between gap-6">
          <div>
            <h2 className="flex items-center gap-2 font-serif text-2xl font-semibold">
              <Sparkles className="h-5 w-5 text-white/90" />
              Ready to generate?
            </h2>
            <p className="mt-2 max-w-md text-white/80">
              Auto-build a clash-free timetable and export it directly to Excel
              in one click.
            </p>
          </div>
          <button
            onClick={() => onJump("timetable")}
            // Dark mode text fix: Changed 'text-foreground' to 'text-slate-900'
            className="group flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-slate-900 shadow-sm transition-all hover:scale-[1.02] hover:bg-white/90 active:scale-95"
          >
            Open Generator
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </>
  );
}
