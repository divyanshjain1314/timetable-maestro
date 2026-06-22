import { useState, useMemo } from "react";
import { format, getDay } from "date-fns";
import { motion } from "framer-motion";
import {
  UserMinus,
  CheckCircle2,
  AlertCircle,
  Calendar as CalendarIcon,
  UserPlus,
  Sparkles,
} from "lucide-react";
import {
  useClasses,
  usePeriods,
  useTeachers,
  useTimetableState,
  useSubstitutions,
} from "@/lib/store";
import { DAYS } from "@/lib/defaults";

// Reusable UI Components
import { SectionHeader } from "@/components/ui/section-header";
import { Field } from "@/components/ui/field";
import { PrimaryBtn } from "@/components/ui/primary-btn";

// Radix Select Components
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar"; // Jo file aapne abhi share ki
import { cn } from "@/lib/utils"; // Agar pehle se import nahi hai toh

export function SubstitutionTab() {
  const [teachers] = useTeachers();
  const [classes] = useClasses();
  const [periods] = usePeriods();
  const [timetable] = useTimetableState();
  const [subs, setSubs] = useSubstitutions();

  const [date, setDate] = useState<string>(format(new Date(), "yyyy-MM-dd"));
  const [absentTeacher, setAbsentTeacher] = useState<string>("");
  const [selections, setSelections] = useState<Record<number, string>>({});
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const dayIndex = useMemo(() => {
    const d = new Date(date);
    let day = getDay(d) - 1;
    if (day < 0) day = 0;
    if (day > 5) day = 5;
    return day;
  }, [date]);

  const dayName = DAYS[dayIndex];

  const savedSub = useMemo(() => {
    return subs.find(
      (s) => s.date === date && s.absentTeacher === absentTeacher,
    );
  }, [subs, date, absentTeacher]);

  const missingSchedule = useMemo(() => {
    if (!timetable || !absentTeacher) return [];
    const schedule: {
      periodIndex: number;
      class: string;
      subject: string;
      periodLabel: string;
    }[] = [];

    classes.forEach((c) => {
      const classGrid = timetable[c.name];
      if (classGrid && classGrid[dayIndex]) {
        classGrid[dayIndex].forEach((cell: any, pIndex: number) => {
          if (cell && cell.teacher === absentTeacher) {
            schedule.push({
              periodIndex: pIndex,
              class: c.name,
              subject: cell.subject,
              periodLabel: periods[pIndex]?.label || `P${pIndex + 1}`,
            });
          }
        });
      }
    });
    return schedule.sort((a, b) => a.periodIndex - b.periodIndex);
  }, [timetable, absentTeacher, classes, dayIndex, periods]);

  const getFreeTeachers = (pIndex: number) => {
    if (!timetable) return [];
    const busyTeachers = new Set<string>();

    classes.forEach((c) => {
      const classGrid = timetable[c.name];
      if (classGrid && classGrid[dayIndex]) {
        const cell = classGrid[dayIndex][pIndex];
        if (cell && cell.teacher) {
          busyTeachers.add(cell.teacher);
        }
      }
    });

    return teachers
      .map((t) => t.name)
      .filter((t) => !busyTeachers.has(t) && t !== absentTeacher);
  };

  const handleSave = () => {
    if (Object.keys(selections).length === 0) return;

    const newSubstitution = {
      id: savedSub?.id || Math.random().toString(36).slice(2, 9),
      date,
      absentTeacher,
      proxyAssignments: missingSchedule
        .filter((slot) => selections[slot.periodIndex])
        .map((slot) => ({
          periodId: slot.periodLabel,
          proxyTeacher: selections[slot.periodIndex],
          classId: slot.class,
        })),
    };

    const newSubsList = [
      ...subs.filter((s) => s.id !== savedSub?.id),
      newSubstitution,
    ];
    setSubs(newSubsList);
    setSelections({});
    alert("Substitutions Saved Successfully! 🎉");
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <SectionHeader
        title="Proxy & Substitution"
        desc="Manage daily teacher absences and auto-assign free staff."
      />

      <div className="grid gap-8 md:grid-cols-3">
        {/* LEFT COLUMN: Input Form */}
        <div className="md:col-span-1 space-y-6">
          <div className="rounded-[1.5rem] border border-border/50 bg-card p-6 shadow-sm">
            <h3 className="mb-5 font-serif text-lg font-bold flex items-center gap-2">
              <UserMinus className="h-5 w-5 text-destructive" />
              Mark Absent
            </h3>

            <div className="space-y-5">
              {/* Date Selection with Custom Calendar */}
              <Field label="Select Date">
                {/* Popover ab is state se control hoga */}
                <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                  <PopoverTrigger asChild>
                    {/* Yahan py-6 ki jagah py-3 kar diya hai */}
                    <button
                      className={cn(
                        "flex w-full items-center gap-3 rounded-xl border border-border/50 bg-secondary/30 px-4 py-3 text-sm font-medium outline-none transition-all hover:bg-secondary/50 focus:border-primary/50 focus:ring-1 focus:ring-primary/50",
                        !date && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="h-5 w-5 text-muted-foreground" />
                      {date ? (
                        format(new Date(date), "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </button>
                  </PopoverTrigger>

                  <PopoverContent
                    className="w-auto rounded-[1.5rem] p-0 shadow-2xl"
                    align="start"
                  >
                    <Calendar
                      mode="single"
                      selected={new Date(date)}
                      onSelect={(newDate) => {
                        if (newDate) {
                          setDate(format(newDate, "yyyy-MM-dd"));
                          setIsCalendarOpen(false); // <-- MAGIC: Date select hote hi popover band!
                        }
                      }}
                      initialFocus
                      className="p-3"
                    />
                  </PopoverContent>
                </Popover>
                <p className="mt-1.5 text-[11px] font-medium text-primary">
                  {dayName} Schedule will be loaded
                </p>
              </Field>

              {/* Absent Teacher Selection with Radix Select */}
              <Field label="Absent Teacher">
                <Select
                  value={absentTeacher || undefined}
                  onValueChange={(value) => setAbsentTeacher(value)}
                >
                  <SelectTrigger className="w-full rounded-xl border border-border/50 bg-secondary/30 px-3 py-6 text-sm font-medium outline-none transition-all focus:border-primary/50 focus:ring-1 focus:ring-primary/50">
                    <SelectValue placeholder="-- Select Teacher --" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-border/50 shadow-xl">
                    {teachers.map((t) => (
                      <SelectItem
                        key={t.id}
                        value={t.name}
                        className="cursor-pointer rounded-lg"
                      >
                        {t.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Smart Proxy Assignment */}
        <div className="md:col-span-2">
          {!timetable ? (
            <div className="flex h-full flex-col items-center justify-center rounded-[1.5rem] border border-dashed border-border/60 bg-secondary/10 p-10 text-center">
              <AlertCircle className="mb-3 h-8 w-8 text-amber-500" />
              <h3 className="font-serif text-lg font-bold">
                Timetable not generated
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Please generate a timetable first to use the proxy manager.
              </p>
            </div>
          ) : !absentTeacher ? (
            <div className="flex h-full flex-col items-center justify-center rounded-[1.5rem] border border-dashed border-border/60 bg-secondary/10 p-10 text-center">
              <Sparkles className="mb-3 h-8 w-8 text-muted-foreground/50" />
              <p className="text-sm font-medium text-muted-foreground">
                Select a teacher to view their daily schedule and assign
                proxies.
              </p>
            </div>
          ) : (
            <div className="rounded-[1.5rem] border border-border/50 bg-card p-6 shadow-sm">
              <div className="mb-6 flex items-center justify-between border-b border-border/40 pb-4">
                <div>
                  <h3 className="font-serif text-xl font-bold">
                    {absentTeacher}'s Schedule
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {missingSchedule.length} periods to substitute on {dayName}
                  </p>
                </div>
              </div>

              {/* Saved Proxies Banner */}
              {savedSub && (
                <div className="mb-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-5">
                  <h4 className="mb-3 flex items-center gap-2 font-bold text-emerald-600">
                    <CheckCircle2 className="h-5 w-5" /> Saved Proxies for Today
                  </h4>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {savedSub.proxyAssignments.map((p, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between rounded-xl bg-background/50 p-3 ring-1 ring-border/50"
                      >
                        <div>
                          <p className="text-xs font-semibold text-muted-foreground">
                            {p.periodId} • Class {p.classId}
                          </p>
                          <p className="font-bold text-foreground">
                            {p.proxyTeacher}
                          </p>
                        </div>
                        <button className="text-[10px] font-bold uppercase text-primary hover:underline">
                          Print Slip
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {missingSchedule.length === 0 ? (
                <div className="rounded-xl bg-emerald-500/10 p-6 text-center text-emerald-600">
                  <CheckCircle2 className="mx-auto mb-2 h-6 w-6" />
                  <p className="font-bold">No periods to cover!</p>
                  <p className="text-sm">
                    This teacher has a free schedule on {dayName}.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {missingSchedule.map((slot) => {
                    const freeTeachers = getFreeTeachers(slot.periodIndex);
                    return (
                      <div
                        key={slot.periodIndex}
                        className="group flex flex-col gap-3 rounded-2xl border border-border/40 bg-secondary/20 p-4 transition-colors hover:border-primary/30 hover:bg-secondary/40 sm:flex-row sm:items-center sm:justify-between"
                      >
                        {/* Period Info */}
                        <div className="flex items-center gap-4">
                          <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-background shadow-sm ring-1 ring-border/50">
                            <span className="text-[10px] font-bold uppercase text-muted-foreground">
                              Period
                            </span>
                            <span className="font-serif text-lg font-bold text-foreground">
                              {slot.periodIndex + 1}
                            </span>
                          </div>
                          <div>
                            <h4 className="font-bold text-foreground">
                              Class {slot.class}
                            </h4>
                            <p className="text-xs font-medium text-muted-foreground">
                              {slot.subject}
                            </p>
                          </div>
                        </div>

                        {/* Proxy Selection with Custom Radix Select */}
                        <div className="sm:text-right w-full sm:w-auto mt-2 sm:mt-0 relative">
                          <Field label="Assign Proxy">
                            <div className="relative mt-1">
                              <Select
                                value={
                                  selections[slot.periodIndex] || undefined
                                }
                                onValueChange={(value) =>
                                  setSelections((prev) => ({
                                    ...prev,
                                    [slot.periodIndex]: value,
                                  }))
                                }
                              >
                                <SelectTrigger className="w-full sm:min-w-[220px] rounded-xl border border-border/60 bg-background pl-10 py-5 text-sm font-medium transition-all focus:border-primary focus:ring-1 focus:ring-primary">
                                  <SelectValue placeholder="-- Choose Free Teacher --" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl shadow-xl">
                                  {freeTeachers.map((ft) => (
                                    <SelectItem
                                      key={ft}
                                      value={ft}
                                      className="cursor-pointer rounded-lg"
                                    >
                                      {ft}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>

                              <UserPlus className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary/70 z-10" />
                            </div>
                          </Field>
                          <span className="mt-1 block text-[10px] font-semibold text-emerald-500">
                            {freeTeachers.length} teachers available
                          </span>
                        </div>
                      </div>
                    );
                  })}

                  {/* Save Button */}
                  <div className="mt-6 flex items-center justify-between pt-4 border-t border-border/40">
                    <p className="text-xs text-muted-foreground">
                      * Only selected proxies will be saved.
                    </p>
                    <PrimaryBtn
                      onClick={handleSave}
                      disabled={Object.keys(selections).length === 0}
                    >
                      {savedSub ? "Update Substitutions" : "Save Substitutions"}
                    </PrimaryBtn>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
