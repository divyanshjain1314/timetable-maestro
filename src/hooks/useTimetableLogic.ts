import { useAppSelector } from "@/lib/redux/hooks";
import { Teacher, TimetableEntry } from "@/lib/redux/schoolSlice"; // Importing types

export const useTimetableLogic = () => {
  // Optional chaining aur default fallbacks add kiye gaye hain
  const schoolState = useAppSelector((state) => state.school);

  const teachers: Teacher[] = schoolState?.teachers || [];
  const timetable = schoolState?.timetable || {};
  const absentTeachers: string[] = schoolState?.absentTeachers || [];

  // 1. Conflict Detection Engine
  const checkTeacherConflict = (
    day: string,
    period: string,
    teacherId: string,
  ) => {
    const periodEntries: TimetableEntry[] = timetable[day]?.[period] || [];
    const isAlreadyTeaching = periodEntries.some(
      (entry) => entry.teacherId === teacherId,
    );

    // Check Max Periods limit
    let dailyPeriodsAssigned = 0;
    if (timetable[day]) {
      Object.values(timetable[day]).forEach((periodSlots) => {
        if (periodSlots.some((entry) => entry.teacherId === teacherId)) {
          dailyPeriodsAssigned++;
        }
      });
    }

    const teacher = teachers.find((t) => t.id === teacherId);
    const isOverloaded = teacher
      ? dailyPeriodsAssigned >= teacher.maxPeriodsPerDay
      : false;

    return {
      hasConflict: isAlreadyTeaching || isOverloaded,
      isAlreadyTeaching,
      isOverloaded,
    };
  };

  // 2. Smart Substitution Suggestions
  const getSubstitutionSuggestions = (
    day: string,
    period: string,
    absentTeacherId: string,
  ): Teacher[] => {
    const absentTeacher = teachers.find((t) => t.id === absentTeacherId);
    if (!absentTeacher) return [];

    const periodEntries: TimetableEntry[] = timetable[day]?.[period] || [];
    const busyTeacherIds = periodEntries.map((e) => e.teacherId);

    // Find teachers who are NOT busy in this period and are NOT absent
    const availableTeachers = teachers.filter(
      (teacher) =>
        !busyTeacherIds.includes(teacher.id) &&
        !absentTeachers.includes(teacher.id),
    );

    // Sort: Teachers who teach the same subject get priority
    return availableTeachers.sort((a, b) => {
      const aMatchesSubject = a.subjects.some((sub) =>
        absentTeacher.subjects.includes(sub),
      );
      const bMatchesSubject = b.subjects.some((sub) =>
        absentTeacher.subjects.includes(sub),
      );

      if (aMatchesSubject && !bMatchesSubject) return -1;
      if (!aMatchesSubject && bMatchesSubject) return 1;
      return 0;
    });
  };

  return {
    checkTeacherConflict,
    getSubstitutionSuggestions,
  };
};
