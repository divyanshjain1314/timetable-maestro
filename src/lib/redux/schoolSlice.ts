import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// --- Types ---
export interface Teacher {
  id: string;
  name: string;
  subjects: string[];
  maxPeriodsPerDay: number;
}

export interface ClassRoom {
  id: string;
  name: string;
  section: string;
}

export interface TimetableEntry {
  id: string; // Unique ID for the entry
  classId: string;
  teacherId: string;
  subject: string;
}

// Timetable Structure: { "Monday": { "Period_1": [TimetableEntry, ...] } }
export type TimetableState = Record<string, Record<string, TimetableEntry[]>>;

export interface SchoolState {
  teachers: Teacher[];
  classes: ClassRoom[];
  timetable: TimetableState;
  absentTeachers: string[]; // Array of Teacher IDs absent today
}

const initialState: SchoolState = {
  teachers: [],
  classes: [],
  timetable: {},
  absentTeachers: [],
};

const schoolSlice = createSlice({
  name: "school",
  initialState,
  reducers: {
    addTeacher: (state, action: PayloadAction<Teacher>) => {
      state.teachers.push(action.payload);
    },
    addClass: (state, action: PayloadAction<ClassRoom>) => {
      state.classes.push(action.payload);
    },
    // Timetable Assignment with basic structure safety
    assignPeriod: (
      state,
      action: PayloadAction<{
        day: string;
        period: string;
        entry: TimetableEntry;
      }>,
    ) => {
      const { day, period, entry } = action.payload;
      if (!state.timetable[day]) state.timetable[day] = {};
      if (!state.timetable[day][period]) state.timetable[day][period] = [];

      // Update or add entry
      const existingIndex = state.timetable[day][period].findIndex(
        (e) => e.classId === entry.classId,
      );
      if (existingIndex >= 0) {
        state.timetable[day][period][existingIndex] = entry; // Override if class already has a period assigned
      } else {
        state.timetable[day][period].push(entry);
      }
    },
    removePeriod: (
      state,
      action: PayloadAction<{ day: string; period: string; entryId: string }>,
    ) => {
      const { day, period, entryId } = action.payload;
      if (state.timetable[day]?.[period]) {
        state.timetable[day][period] = state.timetable[day][period].filter(
          (e) => e.id !== entryId,
        );
      }
    },
    markTeacherAbsent: (state, action: PayloadAction<string>) => {
      if (!state.absentTeachers.includes(action.payload)) {
        state.absentTeachers.push(action.payload);
      }
    },
    markTeacherPresent: (state, action: PayloadAction<string>) => {
      state.absentTeachers = state.absentTeachers.filter(
        (id) => id !== action.payload,
      );
    },
  },
});

export const {
  addTeacher,
  addClass,
  assignPeriod,
  removePeriod,
  markTeacherAbsent,
  markTeacherPresent,
} = schoolSlice.actions;

export default schoolSlice.reducer;
