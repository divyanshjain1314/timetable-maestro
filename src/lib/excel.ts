import * as XLSX from "xlsx";
import { DAYS, type ClassInfo, type PeriodSlot, type Timetable } from "./defaults";

export function exportTimetableExcel(
  school: string,
  timetable: Timetable,
  classes: ClassInfo[],
  periods: PeriodSlot[],
) {
  const wb = XLSX.utils.book_new();

  for (const cls of classes) {
    const grid = timetable[cls.name];
    if (!grid) continue;
    const header = ["Day / Period", ...periods.map((p) => `${p.label}\n${p.time}`)];
    const rows = DAYS.map((day, di) => [
      day,
      ...periods.map((_, pi) => {
        const cell = grid[di]?.[pi];
        return cell ? `${cell.subject}\n(${cell.teacher})` : "-";
      }),
    ]);
    const aoa = [[`${school} — Class ${cls.name}`], header, ...rows];
    const ws = XLSX.utils.aoa_to_sheet(aoa);
    ws["!cols"] = [{ wch: 14 }, ...periods.map(() => ({ wch: 22 }))];
    ws["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: periods.length } }];
    XLSX.utils.book_append_sheet(wb, ws, `Class ${cls.name}`);
  }

  XLSX.writeFile(wb, `${school.replace(/\s+/g, "_")}_Timetable.xlsx`);
}