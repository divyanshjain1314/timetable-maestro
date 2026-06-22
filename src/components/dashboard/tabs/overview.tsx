import { Users, GraduationCap, BookOpen, Clock } from "lucide-react";
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
        className="mt-8 rounded-2xl p-8 text-primary-foreground"
        style={{
          background: "var(--gradient-hero)",
          boxShadow: "var(--shadow-elegant)",
        }}
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="font-serif text-2xl font-semibold">
              Ready to generate?
            </h2>
            <p className="mt-1 text-white/80">
              Auto-build a clash-free timetable and export to Excel.
            </p>
          </div>
          <button
            onClick={() => onJump("timetable")}
            className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-foreground hover:bg-white/90 transition-colors"
          >
            Open Generator →
          </button>
        </div>
      </div>
    </>
  );
}
