import {
  DAYS,
  type ClassInfo,
  type PeriodSlot,
  type Subject,
  type Teacher,
  type Timetable,
  type TimetableCell,
} from "./defaults";

// Generate a timetable greedily. For each class, fill 6 days x N periods.
// Respects: subject periods-per-week per class, teacher not double-booked at same slot.
export function generateTimetable(
  classes: ClassInfo[],
  subjects: Subject[],
  periods: PeriodSlot[],
  teachers: Teacher[],
): Timetable {
  const dayCount = DAYS.length;
  const periodCount = periods.length;
  // teacherBusy[day][period] = Set of teacher names
  const busy: Set<string>[][] = Array.from({ length: dayCount }, () =>
    Array.from({ length: periodCount }, () => new Set<string>()),
  );

  const result: Timetable = {};

  // Subject set per class context: primary (I-V) vs secondary (VI-X)
  const isPrimary = (cn: string) => ["I", "II", "III", "IV", "V"].includes(cn);

  for (const cls of classes) {
    const grid: TimetableCell[][] = Array.from({ length: dayCount }, () =>
      Array.from({ length: periodCount }, () => null as TimetableCell),
    );

    // Build subject demand list for this class
    const demand: { subject: string; count: number }[] = [];
    const subjectNames = isPrimary(cls.name)
      ? ["English", "Hindi", "Maths", "EVS", "G.K", "Computer", "Activity"]
      : [
          "English",
          "Hindi",
          "Maths",
          "Science",
          "S.St",
          "Sanskrit",
          "P.E",
          "Art & Craft",
          "Kaushal Bodh",
          "Computer",
        ];

    for (const sn of subjectNames) {
      const subj = subjects.find((s) => s.name === sn);
      if (subj) demand.push({ subject: sn, count: subj.periodsPerWeek });
    }

    // Cap demand to total slots
    const totalSlots = dayCount * periodCount;
    let totalDemand = demand.reduce((a, b) => a + b.count, 0);
    while (totalDemand > totalSlots) {
      const max = demand.reduce((a, b) => (b.count > a.count ? b : a));
      max.count -= 1;
      totalDemand -= 1;
    }

    // Flatten into a queue, interleaved so subjects spread across days
    const queue: string[] = [];
    const working = demand.map((d) => ({ ...d }));
    while (working.some((w) => w.count > 0)) {
      for (const w of working) {
        if (w.count > 0) {
          queue.push(w.subject);
          w.count -= 1;
        }
      }
    }

    // Place: iterate slots day-by-day, period-by-period
    let qi = 0;
    for (let p = 0; p < periodCount; p++) {
      for (let d = 0; d < dayCount; d++) {
        if (qi >= queue.length) break;
        // find next subject in queue that has an available teacher
        let placed = false;
        for (let look = 0; look < queue.length - qi && !placed; look++) {
          const subjectName = queue[qi + look];
          const teacher = teachers.find(
            (t) =>
              t.subjects.includes(subjectName) &&
              t.classes.includes(cls.name) &&
              !busy[d][p].has(t.name),
          );
          // avoid same subject twice in a day for this class
          const sameDay = grid[d].some((c) => c?.subject === subjectName);
          if (teacher && !sameDay) {
            grid[d][p] = { subject: subjectName, teacher: teacher.name };
            busy[d][p].add(teacher.name);
            // swap to consume
            [queue[qi], queue[qi + look]] = [queue[qi + look], queue[qi]];
            qi++;
            placed = true;
          }
        }
        if (!placed) {
          // leave blank, skip this queue head to avoid infinite loop
          // try without sameDay restriction
          for (let look = 0; look < queue.length - qi && !placed; look++) {
            const subjectName = queue[qi + look];
            const teacher = teachers.find(
              (t) =>
                t.subjects.includes(subjectName) &&
                t.classes.includes(cls.name) &&
                !busy[d][p].has(t.name),
            );
            if (teacher) {
              grid[d][p] = { subject: subjectName, teacher: teacher.name };
              busy[d][p].add(teacher.name);
              [queue[qi], queue[qi + look]] = [queue[qi + look], queue[qi]];
              qi++;
              placed = true;
            }
          }
        }
      }
    }

    result[cls.name] = grid;
  }

  return result;
}
