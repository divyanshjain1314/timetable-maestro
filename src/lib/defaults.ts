// Default seed data parsed from the school's handwritten notes.
export type Teacher = {
  id: string;
  name: string;
  subjects: string[];
  classes: string[]; // e.g. ["VI","VII","VIII","IX","X"]
};

export type ClassInfo = { id: string; name: string }; // roman numerals
export type Subject = { id: string; name: string; periodsPerWeek: number };
export type PeriodSlot = { id: string; label: string; time: string };

export type TimetableCell = { subject: string; teacher: string } | null;
// timetable[className][dayIndex][periodIndex]
export type Timetable = Record<string, TimetableCell[][]>;

export const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export const DEFAULT_SCHOOL = "Sagar Public School";

export const DEFAULT_PERIODS: PeriodSlot[] = [
  { id: "p1", label: "Period 1", time: "08:00 - 08:40" },
  { id: "p2", label: "Period 2", time: "08:40 - 09:20" },
  { id: "p3", label: "Period 3", time: "09:20 - 10:00" },
  { id: "p4", label: "Period 4", time: "10:20 - 11:00" },
  { id: "p5", label: "Period 5", time: "11:00 - 11:40" },
  { id: "p6", label: "Period 6", time: "11:40 - 12:20" },
  { id: "p7", label: "Period 7", time: "12:20 - 13:00" },
];

export const DEFAULT_CLASSES: ClassInfo[] = [
  { id: "c1", name: "I" },
  { id: "c2", name: "II" },
  { id: "c3", name: "III" },
  { id: "c4", name: "IV" },
  { id: "c5", name: "V" },
  { id: "c6", name: "VI" },
  { id: "c7", name: "VII" },
  { id: "c8", name: "VIII" },
  { id: "c9", name: "IX" },
  { id: "c10", name: "X" },
];

export const DEFAULT_SUBJECTS: Subject[] = [
  { id: "s1", name: "English", periodsPerWeek: 6 },
  { id: "s2", name: "Hindi", periodsPerWeek: 6 },
  { id: "s3", name: "Maths", periodsPerWeek: 6 },
  { id: "s4", name: "Science", periodsPerWeek: 6 },
  { id: "s5", name: "S.St", periodsPerWeek: 6 },
  { id: "s6", name: "Sanskrit", periodsPerWeek: 5 },
  { id: "s7", name: "P.E", periodsPerWeek: 2 },
  { id: "s8", name: "Art & Craft", periodsPerWeek: 1 },
  { id: "s9", name: "Kaushal Bodh", periodsPerWeek: 2 },
  { id: "s10", name: "Computer", periodsPerWeek: 2 },
  { id: "s11", name: "EVS", periodsPerWeek: 6 },
  { id: "s12", name: "G.K", periodsPerWeek: 4 },
  { id: "s13", name: "Activity", periodsPerWeek: 10 },
];

export const DEFAULT_TEACHERS: Teacher[] = [
  {
    id: "t1",
    name: "Anjali Mam",
    subjects: ["Sanskrit"],
    classes: ["VI", "VII", "VIII", "IX", "X"],
  },
  {
    id: "t2",
    name: "Ankit Sir",
    subjects: ["S.St", "Kaushal Bodh"],
    classes: ["VI", "VII", "VIII", "IX", "X"],
  },
  {
    id: "t3",
    name: "Anubhuti Mam",
    subjects: ["English", "Kaushal Bodh"],
    classes: ["VI", "VII", "VIII", "IX", "X"],
  },
  {
    id: "t4",
    name: "Suanchal Mam",
    subjects: ["Hindi"],
    classes: ["V", "VI", "VII", "VIII", "IX", "X"],
  },
  {
    id: "t5",
    name: "Yuvika Mam",
    subjects: ["Science"],
    classes: ["VI", "VII", "VIII", "IX", "X"],
  },
  {
    id: "t6",
    name: "Arvind Sir",
    subjects: ["Maths"],
    classes: ["VI", "VII", "VIII", "IX", "X"],
  },
  { id: "t7", name: "Veer Sir", subjects: ["P.E"], classes: ["VI", "VII"] },
  {
    id: "t8",
    name: "Neha Mam",
    subjects: ["Art & Craft"],
    classes: ["III", "IV", "V", "VI", "VII"],
  },
  {
    id: "t9",
    name: "Babli Mam",
    subjects: ["EVS", "Maths", "Activity"],
    classes: ["I", "II", "III", "IV", "V"],
  },
  {
    id: "t10",
    name: "Pooja Mam",
    subjects: ["G.K", "Computer", "Activity"],
    classes: ["I", "II", "III", "IV", "V"],
  },
  {
    id: "t11",
    name: "Sonam Mam",
    subjects: ["English", "Activity"],
    classes: ["I", "II", "III", "IV", "V"],
  },
  {
    id: "t12",
    name: "Arti Mam",
    subjects: ["Hindi", "G.K"],
    classes: ["I", "II", "III", "IV"],
  },
  {
    id: "t13",
    name: "Vivek Sir",
    subjects: ["English"],
    classes: ["VIII", "IX"],
  },
  {
    id: "t14",
    name: "Aarti Singh",
    subjects: ["Science"],
    classes: ["IV", "V", "VI"],
  },
];
