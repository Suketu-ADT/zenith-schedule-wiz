import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { 
  TimetableState, 
  TimetableConfig, 
  TimetableSlot, 
  TimetableStats,
  Course,
  Teacher,
  Classroom,
  Student
} from '../../types';

// Mock data for demonstration
const mockCourses: Course[] = [
  { id: '1', name: 'Data Structures', code: 'CS201', credits: 3, teacherId: '2', teacherName: 'Prof. Michael Chen', color: '#3B82F6' },
  { id: '2', name: 'Database Systems', code: 'CS301', credits: 4, teacherId: '2', teacherName: 'Prof. Michael Chen', color: '#10B981' },
  { id: '3', name: 'Linear Algebra', code: 'MATH201', credits: 3, teacherId: '3', teacherName: 'Dr. Emily Davis', color: '#F59E0B' },
];

const mockTimetableSlots: TimetableSlot[] = [
  {
    id: '1',
    courseId: '1',
    courseName: 'Data Structures',
    courseCode: 'CS201',
    teacherId: '2',
    teacherName: 'Prof. Michael Chen',
    classroomId: '1',
    classroomName: 'Room A101',
    dayOfWeek: 0, // Monday
    startTime: '09:00',
    endTime: '10:30',
    duration: 90,
    studentGroups: ['CS-2A', 'CS-2B'],
  },
  {
    id: '2',
    courseId: '2',
    courseName: 'Database Systems',
    courseCode: 'CS301',
    teacherId: '2',
    teacherName: 'Prof. Michael Chen',
    classroomId: '2',
    classroomName: 'Lab B201',
    dayOfWeek: 2, // Wednesday
    startTime: '11:00',
    endTime: '12:30',
    duration: 90,
    studentGroups: ['CS-3A'],
  },
];

const mockStats: TimetableStats = {
  totalCourses: 12,
  totalTeachers: 8,
  totalClassrooms: 15,
  totalStudents: 150,
  utilizationRate: 78,
  conflictCount: 2,
};

// Mock API call for timetable generation
export const generateTimetable = createAsyncThunk(
  'timetable/generate',
  async (configId: string, { rejectWithValue }) => {
    try {
      // Simulate AI processing time
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Simulate random success/failure for demo
      const shouldSucceed = Math.random() > 0.3;

      if (!shouldSucceed) {
        throw new Error('Failed to generate timetable: Teacher availability conflict detected for Prof. Chen on Monday 9:00-10:30');
      }

      return {
        slots: mockTimetableSlots,
        stats: mockStats,
      };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Generation failed');
    }
  }
);

// Mock API call for loading timetable data
export const loadTimetableData = createAsyncThunk(
  'timetable/loadData',
  async (userRole: string) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return {
      slots: mockTimetableSlots,
      stats: mockStats,
    };
  }
);

const initialState: TimetableState = {
  configs: [],
  activeConfig: null,
  timetableSlots: [],
  isGenerating: false,
  isLoading: false,
  error: null,
  stats: null,
};

const timetableSlice = createSlice({
  name: 'timetable',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setActiveConfig: (state, action: PayloadAction<TimetableConfig>) => {
      state.activeConfig = action.payload;
    },
    addCourse: (state, action: PayloadAction<Course>) => {
      if (state.activeConfig) {
        state.activeConfig.courses.push(action.payload);
      }
    },
    addTeacher: (state, action: PayloadAction<Teacher>) => {
      if (state.activeConfig) {
        state.activeConfig.teachers.push(action.payload);
      }
    },
    addClassroom: (state, action: PayloadAction<Classroom>) => {
      if (state.activeConfig) {
        state.activeConfig.classrooms.push(action.payload);
      }
    },
    addStudent: (state, action: PayloadAction<Student>) => {
      if (state.activeConfig) {
        state.activeConfig.students.push(action.payload);
      }
    },
    removeCourse: (state, action: PayloadAction<string>) => {
      if (state.activeConfig) {
        state.activeConfig.courses = state.activeConfig.courses.filter(c => c.id !== action.payload);
      }
    },
    removeTeacher: (state, action: PayloadAction<string>) => {
      if (state.activeConfig) {
        state.activeConfig.teachers = state.activeConfig.teachers.filter(t => t.id !== action.payload);
      }
    },
    removeClassroom: (state, action: PayloadAction<string>) => {
      if (state.activeConfig) {
        state.activeConfig.classrooms = state.activeConfig.classrooms.filter(c => c.id !== action.payload);
      }
    },
    removeStudent: (state, action: PayloadAction<string>) => {
      if (state.activeConfig) {
        state.activeConfig.students = state.activeConfig.students.filter(s => s.id !== action.payload);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(generateTimetable.pending, (state) => {
        state.isGenerating = true;
        state.error = null;
      })
      .addCase(generateTimetable.fulfilled, (state, action) => {
        state.isGenerating = false;
        state.timetableSlots = action.payload.slots;
        state.stats = action.payload.stats;
      })
      .addCase(generateTimetable.rejected, (state, action) => {
        state.isGenerating = false;
        state.error = action.payload as string;
      })
      .addCase(loadTimetableData.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loadTimetableData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.timetableSlots = action.payload.slots;
        state.stats = action.payload.stats;
      })
      .addCase(loadTimetableData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to load data';
      });
  },
});

export const {
  clearError,
  setActiveConfig,
  addCourse,
  addTeacher,
  addClassroom,
  addStudent,
  removeCourse,
  removeTeacher,
  removeClassroom,
  removeStudent,
} = timetableSlice.actions;

export default timetableSlice.reducer;