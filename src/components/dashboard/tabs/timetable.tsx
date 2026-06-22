import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Table,
  Sparkles,
  FileSpreadsheet,
  Printer,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Move,
} from "lucide-react";
import {
  useClasses,
  usePeriods,
  useSchool,
  useSubjects,
  useTeachers,
  useTimetableState,
} from "@/lib/store";
import { DAYS } from "@/lib/defaults";
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

// DND-Kit Imports
import {
  DndContext,
  useDraggable,
  useDroppable,
  DragStartEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import { cn } from "@/lib/utils";

export function TimetableTab() {
  const [classes] = useClasses();
  const [subjects] = useSubjects();
  const [periods] = usePeriods();
  const [teachers] = useTeachers();
  const [school] = useSchool();

  // Custom Store hook containing our swapPeriods logic
  const [tt, setTt, swapPeriods] = useTimetableState();

  const [selected, setSelected] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [hoveredTeacher, setHoveredTeacher] = useState<string | null>(null);

  // Tracking active dragging item for Live Clash Detection
  const [activeDragInfo, setActiveDragInfo] = useState<{
    teacher: string;
    subject: string;
    sourceDi: number;
    sourcePi: number;
  } | null>(null);

  const generate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const next = generateTimetable(classes, subjects, periods, teachers);
      setTt(next);
      setSelected(classes[0]?.name ?? "");
      setIsGenerating(false);
    }, 800);
  };

  const download = (format: "class" | "master") => {
    if (!tt) return;
    exportTimetableExcel(school, tt, classes, periods, format);
  };

  const handlePrint = () => {
    window.print();
  };

  const activeGrid = useMemo(
    () => (tt && selected ? tt[selected] : null),
    [tt, selected],
  );

  // Helper Logic: Checks if a teacher is already busy in ANY OTHER class at a specific day/period
  const checkTeacherClash = (
    teacherName: string,
    dayIdx: number,
    periodIdx: number,
    currentClass: string,
  ) => {
    if (!tt || !teacherName) return false;
    return Object.keys(tt).some((className) => {
      if (className === currentClass) return false; // Ignore current class grid
      const cell = tt[className]?.[dayIdx]?.[periodIdx];
      return cell && cell.teacher === teacherName;
    });
  };

  // DND Handler: When user starts dragging a period
  const handleDragStart = (event: DragStartEvent) => {
    const id = event.active.id as string;
    const [di, pi] = id.split("-").map(Number);
    const cell = activeGrid?.[di]?.[pi];
    if (cell) {
      setActiveDragInfo({
        teacher: cell.teacher,
        subject: cell.subject,
        sourceDi: di,
        sourcePi: pi,
      });
    }
  };

  // DND Handler: When user drops the period
  const handleDragEnd = (event: DragEndEvent) => {
    setActiveDragInfo(null);
    const { active, over } = event;
    if (!over || active.id === over.id || !activeGrid) return;

    const [srcDi, srcPi] = (active.id as string).split("-").map(Number);
    const [destDi, destPi] = (over.id as string).split("-").map(Number);

    // Enforce same-day swapping constraints
    if (srcDi !== destDi) {
      alert("⚠️ You can only swap periods within the same day!");
      return;
    }

    // Advanced Clash Guard Diagnostics before finalizing swap
    const cellA = activeGrid[srcDi]?.[srcPi];
    const cellB = activeGrid[destDi]?.[destPi];

    const teacherAClashes = cellA
      ? checkTeacherClash(cellA.teacher, destDi, destPi, selected)
      : false;
    const teacherBClashes = cellB
      ? checkTeacherClash(cellB.teacher, srcDi, srcPi, selected)
      : false;

    if (teacherAClashes || teacherBClashes) {
      const proceed = window.confirm(
        "⚠️ Warning: This manual swap will create a Schedule Clash for teachers. Do you still want to force this change?",
      );
      if (!proceed) return;
    }

    // Call store helper to commit changes
    swapPeriods(selected, srcDi, srcPi, destPi);
  };

  // Calculate Quick Stats
  const stats = useMemo(() => {
    if (!activeGrid) return null;
    const total = DAYS.length * periods.length;
    let filled = 0;
    activeGrid.forEach((day) => {
      day.forEach((period) => {
        if (period) filled++;
      });
    });
    return {
      total,
      filled,
      empty: total - filled,
      percentage: Math.round((filled / total) * 100) || 0,
    };
  }, [activeGrid, periods.length]);

  return (
    <div className="print:m-0 print:p-0">
      <div className="print:hidden">
        <SectionHeader
          title="Generate Timetable"
          desc="Auto-build a clash-free schedule for all classes."
          action={
            <div className="flex flex-wrap gap-2.5">
              <PrimaryBtn onClick={generate} disabled={isGenerating}>
                {isGenerating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
                {tt ? "Regenerate" : "Generate"}
              </PrimaryBtn>

              {tt && (
                <>
                  <button
                    onClick={handlePrint}
                    className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold shadow-sm transition-all hover:bg-secondary hover:text-foreground text-muted-foreground"
                  >
                    <Printer className="h-4 w-4" /> Print
                  </button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold shadow-sm transition-all hover:bg-secondary hover:text-foreground text-muted-foreground">
                        <FileSpreadsheet className="h-4 w-4" /> Export
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[200px]">
                      <DropdownMenuItem
                        className="cursor-pointer font-medium"
                        onClick={() => download("class")}
                      >
                        Class-wise Format
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="cursor-pointer font-medium"
                        onClick={() => download("master")}
                      >
                        Master Format (Day-wise)
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              )}
            </div>
          }
        />
      </div>

      <AnimatePresence mode="wait">
        {!tt && !isGenerating && (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="print:hidden"
          >
            <Card>
              <div className="flex flex-col items-center justify-center px-6 py-24 text-center">
                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary/80 text-muted-foreground ring-1 ring-border/50">
                  <Table className="h-8 w-8" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-foreground">
                  No timetable generated yet
                </h3>
                <p className="mt-2 max-w-md text-[15px] text-muted-foreground">
                  Our smart algorithm resolves teacher clashes and balances
                  workloads. Click Generate to build your 6-day schedule.
                </p>
              </div>
            </Card>
          </motion.div>
        )}

        {isGenerating && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-32 print:hidden"
          >
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="mt-4 animate-pulse font-medium text-muted-foreground">
              Running clash-resolution algorithm...
            </p>
          </motion.div>
        )}

        {tt && !isGenerating && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between print:hidden">
              <div
                className="flex gap-2 overflow-x-auto pb-2 scroll-smooth"
                style={{ scrollbarWidth: "none" }}
              >
                {classes.map((c) => {
                  const active = selected === c.name;
                  return (
                    <button
                      key={c.id}
                      onClick={() => setSelected(c.name)}
                      className={cn(
                        "relative flex-shrink-0 rounded-xl px-5 py-2 text-sm font-bold transition-all",
                        active
                          ? "text-primary-foreground shadow-md"
                          : "border border-border/60 bg-card text-muted-foreground hover:bg-secondary hover:text-foreground",
                      )}
                    >
                      {active && (
                        <motion.div
                          layoutId="active-class-pill"
                          className="absolute inset-0 rounded-xl"
                          style={{ background: "var(--gradient-hero)" }}
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 25,
                          }}
                        />
                      )}
                      <span className="relative z-10">Class {c.name}</span>
                    </button>
                  );
                })}
              </div>

              {stats && (
                <div className="flex shrink-0 items-center gap-4 rounded-2xl border border-border/50 bg-card px-4 py-3 shadow-sm">
                  <div className="flex flex-col">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                      Utilization
                    </span>
                    <span className="text-sm font-bold text-foreground">
                      {stats.percentage}% Filled
                    </span>
                  </div>
                  <div className="h-8 w-px bg-border/60" />
                  <div className="flex gap-3 text-sm">
                    <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="h-4 w-4" />
                      <span className="font-bold">{stats.filled}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
                      <AlertCircle className="h-4 w-4" />
                      <span className="font-bold">{stats.empty}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Drag and Drop Context Wrapper */}
            <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
              {activeGrid && (
                <div className="print:mt-0 print:border-none print:shadow-none overflow-x-auto rounded-[1.5rem] border border-border/60 bg-card shadow-sm">
                  <div className="hidden print:block pb-4 text-center">
                    <h1 className="text-2xl font-bold">{school}</h1>
                    <h2 className="text-lg text-gray-600">
                      Class {selected} Timetable
                    </h2>
                  </div>

                  <table className="w-full min-w-[900px] text-sm print:min-w-full">
                    <thead>
                      <tr className="border-b border-border/60 bg-secondary/50 text-left text-xs uppercase tracking-wider text-muted-foreground print:bg-gray-100">
                        <th className="sticky left-0 z-20 bg-secondary/50 px-5 py-4 font-bold print:bg-gray-100 print:text-black">
                          Day / Period
                        </th>
                        {periods.map((p) => (
                          <th key={p.id} className="px-4 py-4 print:text-black">
                            <div className="font-bold text-foreground print:text-black">
                              {p.label}
                            </div>
                            <div className="mt-0.5 font-mono text-[10px] opacity-70">
                              {p.time}
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40">
                      {DAYS.map((d, di) => (
                        <tr
                          key={d}
                          className="group/row hover:bg-secondary/20 transition-colors print:hover:bg-transparent"
                        >
                          <td className="sticky left-0 z-10 bg-card px-5 py-4 font-bold text-foreground group-hover/row:bg-secondary/10 print:bg-white print:text-black">
                            {d}
                          </td>
                          {periods.map((p, pi) => (
                            <TimetableCell
                              key={p.id}
                              di={di}
                              pi={pi}
                              cell={activeGrid[di]?.[pi]}
                              hoveredTeacher={hoveredTeacher}
                              setHoveredTeacher={setHoveredTeacher}
                              activeDragInfo={activeDragInfo}
                              checkTeacherClash={checkTeacherClash}
                              currentClass={selected}
                            />
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </DndContext>

            <p className="text-xs text-muted-foreground italic text-center print:hidden">
              💡 Pro-Tip: Drag and drop cards horizontally to manually rearrange
              periods. System will notify if teacher clashes occur.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- SUB-COMPONENT: REUSABLE DRAG & DROP ENABLED CELL ---
interface CellProps {
  di: number;
  pi: number;
  cell: any;
  hoveredTeacher: string | null;
  setHoveredTeacher: (name: string | null) => void;
  activeDragInfo: any;
  checkTeacherClash: (
    name: string,
    day: number,
    period: number,
    cls: string,
  ) => boolean;
  currentClass: string;
}

function TimetableCell({
  di,
  pi,
  cell,
  hoveredTeacher,
  setHoveredTeacher,
  activeDragInfo,
  checkTeacherClash,
  currentClass,
}: CellProps) {
  const cellId = `${di}-${pi}`;

  // Register Droppable area
  const { setNodeRef: setDroppableRef, isOver } = useDroppable({ id: cellId });

  // Register Draggable item (Disabled if cell is empty)
  const {
    attributes,
    listeners,
    setNodeRef: setDraggableRef,
    transform,
    isDragging,
  } = useDraggable({
    id: cellId,
    disabled: !cell,
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 50,
      }
    : undefined;

  const isTeacherHovered = hoveredTeacher && cell?.teacher === hoveredTeacher;

  // Real-time calculation: Is this specific target slot going to cause a clash for the currently dragged teacher?
  const wouldClash = useMemo(() => {
    if (!isOver || !activeDragInfo) return false;
    return checkTeacherClash(activeDragInfo.teacher, di, pi, currentClass);
  }, [isOver, activeDragInfo, di, pi, currentClass, checkTeacherClash]);

  return (
    <td
      ref={setDroppableRef}
      className={cn(
        "px-3 py-3 align-top transition-all duration-200",
        // Visual indicator adjustments for drag-over state diagnostics
        isOver &&
          !wouldClash &&
          "bg-emerald-500/15 scale-[0.97] rounded-xl ring-2 ring-emerald-500/30",
        isOver &&
          wouldClash &&
          "bg-destructive/15 scale-[0.97] rounded-xl ring-2 ring-destructive/40",
      )}
    >
      <div
        ref={setDraggableRef}
        style={style}
        {...listeners}
        {...attributes}
        onMouseEnter={() => cell && setHoveredTeacher(cell.teacher)}
        onMouseLeave={() => setHoveredTeacher(null)}
        className={cn(
          "w-full h-full min-h-[64px]",
          cell ? "cursor-grab active:cursor-grabbing" : "",
        )}
      >
        {cell ? (
          <div
            className={cn(
              "relative overflow-hidden rounded-xl border p-2.5 transition-all duration-200 select-none shadow-sm",
              isDragging && "opacity-20 shadow-none scale-95",
              isTeacherHovered
                ? "border-primary/50 bg-primary/10 shadow-[0_0_15px_rgba(var(--primary),0.2)] scale-[1.02] z-10"
                : "border-border/40 bg-secondary/40 hover:border-border",
            )}
          >
            {/* Visual indicator drag icon visible on card hover */}
            <Move className="absolute right-2 top-2 h-3 w-3 opacity-0 group-hover/row:opacity-40 text-muted-foreground print:hidden transition-opacity" />

            <div className="relative z-10 font-bold text-foreground print:text-black">
              {cell.subject}
            </div>
            <div className="relative z-10 mt-1 text-[11px] font-medium text-muted-foreground print:text-gray-600">
              {cell.teacher}
            </div>
          </div>
        ) : (
          <div className="flex h-full min-h-[64px] items-center justify-center rounded-xl border border-dashed border-border/40 bg-transparent select-none print:border-gray-200">
            <span className="text-muted-foreground/30 print:text-gray-300">
              —
            </span>
          </div>
        )}
      </div>
    </td>
  );
}
