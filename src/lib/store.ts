import { useSyncExternalStore, useCallback } from "react";
import {
  DEFAULT_CLASSES,
  DEFAULT_PERIODS,
  DEFAULT_SCHOOL,
  DEFAULT_SUBJECTS,
  DEFAULT_TEACHERS,
  type ClassInfo,
  type PeriodSlot,
  type Subject,
  type Teacher,
} from "./defaults";

export type Substitution = {
  id: string;
  date: string;
  absentTeacher: string;
  proxyAssignments: {
    periodId: string;
    proxyTeacher: string;
    classId: string;
  }[];
};

// 1. Subscription Listener: Doosre tabs aur current tab me changes sunne ke liye
function subscribe(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("storage", callback);
  window.addEventListener("local-storage-sync", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("local-storage-sync", callback);
  };
}

// 2. Memory Cache: Yeh sabse zaroori hai! Isse React baar-baar naye arrays nahi banayega, jisse Hang issue hamesha ke liye khatam.
const lsCache = new Map<string, { raw: string; parsed: any }>();

function useLS<T>(key: string, initial: T) {
  // 3. Snapshot Getter (Stable references deta hai)
  const getSnapshot = useCallback(() => {
    if (typeof window === "undefined") return initial;
    const raw = window.localStorage.getItem(key);
    if (!raw) return initial;

    // Agar data change nahi hua hai, toh purana cache return karo (No re-renders!)
    const cached = lsCache.get(key);
    if (cached && cached.raw === raw) {
      return cached.parsed as T;
    }

    // Naya data parse karo aur cache me save karo
    try {
      const parsed = JSON.parse(raw);
      lsCache.set(key, { raw, parsed });
      return parsed as T;
    } catch {
      return initial;
    }
  }, [key, initial]);

  const getServerSnapshot = useCallback(() => initial, [initial]);

  // 4. The Magic Hook: React 18 ka in-built anti-freeze global state manager
  const value = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // 5. Updater function
  const setValue = useCallback(
    (newValue: T | ((val: T) => T)) => {
      if (typeof window === "undefined") return;
      const nextValue =
        newValue instanceof Function ? newValue(value) : newValue;

      window.localStorage.setItem(key, JSON.stringify(nextValue));
      window.dispatchEvent(new Event("local-storage-sync")); // Baaki components ko turant update karo
    },
    [key, value],
  );

  return [value, setValue, true] as const;
}

export const useSchool = () => useLS<string>("tt.school", DEFAULT_SCHOOL);
export const useTeachers = () =>
  useLS<Teacher[]>("tt.teachers", DEFAULT_TEACHERS);
export const useClasses = () =>
  useLS<ClassInfo[]>("tt.classes", DEFAULT_CLASSES);
export const useSubjects = () =>
  useLS<Subject[]>("tt.subjects", DEFAULT_SUBJECTS);
export const usePeriods = () =>
  useLS<PeriodSlot[]>("tt.periods", DEFAULT_PERIODS);

export const uid = () => Math.random().toString(36).slice(2, 10);

// Naya hook for Substitutions
export const useSubstitutions = () =>
  useLS<Substitution[]>("tt.substitutions", []);

// Naya hook for Generated Timetable (with Swapping Logic)
export const useTimetableState = () => {
  const [timetable, setTimetable] = useLS<any | null>("tt.timetable", null);

  // Magic Function: Do periods ko aapas mein swap karne ke liye
  const swapPeriods = (
    className: string,
    dayIndex: number,
    sourcePeriodIndex: number,
    destinationPeriodIndex: number,
  ) => {
    if (!timetable) return;

    // Create a deep copy taaki react properly re-render ho
    const updatedTimetable = JSON.parse(JSON.stringify(timetable));
    const classSchedule = updatedTimetable[className];

    if (classSchedule && classSchedule[dayIndex]) {
      const daySchedule = classSchedule[dayIndex];

      // Swap the cells
      const temp = daySchedule[sourcePeriodIndex];
      daySchedule[sourcePeriodIndex] = daySchedule[destinationPeriodIndex];
      daySchedule[destinationPeriodIndex] = temp;

      // Naya timetable save kardo
      setTimetable(updatedTimetable);
    }
  };

  return [timetable, setTimetable, swapPeriods] as const;
};
