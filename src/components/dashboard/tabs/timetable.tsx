import { useMemo, useState } from "react";
import { Table, Sparkles, FileSpreadsheet } from "lucide-react";
import {
  useClasses,
  usePeriods,
  useSchool,
  useSubjects,
  useTeachers,
} from "@/lib/store";
import { DAYS, type Timetable } from "@/lib/defaults";
import { generateTimetable } from "@/lib/generator";
import { exportTimetableExcel } from "@/lib/excel";
import { SectionHeader } from "@/components/ui/section-header";
import { PrimaryBtn } from "@/components/ui/primary-btn";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function TimetableTab() {
  const [classes] = useClasses();
  const [subjects] = useSubjects();
  const [periods] = usePeriods();
  const [teachers] = useTeachers();
  const [school] = useSchool();
  const [tt, setTt] = useState<Timetable | null>(null);
  const [selected, setSelected] = useState<string>("");

  const generate = () => {
    const next = generateTimetable(classes, subjects, periods, teachers);
    setTt(next);
    setSelected(classes[0]?.name ?? "");
  };

  const download = (format: "class" | "master") => {
    if (!tt) return;
    exportTimetableExcel(school, tt, classes, periods, format);
  };

  const activeGrid = useMemo(
    () => (tt && selected ? tt[selected] : null),
    [tt, selected],
  );

  return (
    <>
      <SectionHeader
        title="Generate Timetable"
        desc="Auto-build a clash-free schedule for all classes."
        action={
          <div className="flex gap-2">
            <PrimaryBtn onClick={generate}>
              <Sparkles className="h-4 w-4" /> {tt ? "Regenerate" : "Generate"}
            </PrimaryBtn>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  disabled={!tt}
                  className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold hover:bg-secondary disabled:opacity-40"
                >
                  <FileSpreadsheet className="h-4 w-4" /> Export
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => download("class")}
                >
                  Class-wise Format
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => download("master")}
                >
                  Master Format (Day-wise)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        }
      />

      {!tt && (
        <Card>
          <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
              <Table className="h-7 w-7" />
            </div>
            <h3 className="font-serif text-xl font-semibold">
              No timetable yet
            </h3>
            <p className="mt-1 max-w-md text-sm text-muted-foreground">
              Click Generate to build a six-day, seven-period schedule from your
              teachers and subjects.
            </p>
          </div>
        </Card>
      )}

      {tt && (
        <>
          <div className="mb-4 flex flex-wrap gap-2">
            {classes.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelected(c.name)}
                className={`rounded-xl px-3.5 py-1.5 text-sm font-medium ${selected === c.name ? "text-primary-foreground" : "border border-border bg-card hover:bg-secondary"}`}
                style={
                  selected === c.name
                    ? { background: "var(--gradient-hero)" }
                    : undefined
                }
              >
                Class {c.name}
              </button>
            ))}
          </div>

          {activeGrid && (
            <div
              className="overflow-x-auto rounded-2xl border border-border bg-card"
              style={{ boxShadow: "var(--shadow-soft)" }}
            >
              <table className="w-full min-w-[900px] text-sm">
                <thead>
                  <tr className="bg-secondary text-left text-xs uppercase tracking-wider text-muted-foreground">
                    <th className="px-4 py-3">Day / Period</th>
                    {periods.map((p) => (
                      <th key={p.id} className="px-4 py-3">
                        <div className="font-semibold text-foreground">
                          {p.label}
                        </div>
                        <div className="font-mono text-[10px]">{p.time}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {DAYS.map((d, di) => (
                    <tr key={d} className="border-t border-border">
                      <td className="px-4 py-3 font-semibold">{d}</td>
                      {periods.map((p, pi) => {
                        const cell = activeGrid[di]?.[pi];
                        return (
                          <td key={p.id} className="px-4 py-3 align-top">
                            {cell ? (
                              <div className="rounded-lg bg-accent/40 px-2 py-1.5">
                                <div className="font-medium text-foreground">
                                  {cell.subject}
                                </div>
                                <div className="text-[11px] text-muted-foreground">
                                  {cell.teacher}
                                </div>
                              </div>
                            ) : (
                              <span className="text-muted-foreground/40">
                                —
                              </span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </>
  );
}
