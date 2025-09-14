// Core type definitions for Auto Scheduler Wiz

export type UserRole = 'admin' | 'teacher' | 'student';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
}

export interface Course {
  id: string;
  name: string;
  code: string;
  credits: number;
  teacherId: string;
  teacherName: string;
  color: string;
}

export interface Classroom {
  id: string;
  name: string;
  capacity: number;
  type: 'lecture' | 'lab' | 'seminar';
  building: string;
  floor: number;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  studentId: string;
  semester: number;
  department: string;
  enrolledCourses: string[];
}

export interface Teacher {
  id: string;
  name: string;
  email: string;
  department: string;
  specialization: string;
  courses: string[];
}

export interface TimetableSlot {
  id: string;
  courseId: string;
  courseName: string;
  courseCode: string;
  teacherId: string;
  teacherName: string;
  classroomId: string;
  classroomName: string;
  dayOfWeek: number; // 0 = Monday, 6 = Sunday
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  duration: number; // in minutes
  studentGroups: string[];
  conflicts?: ConflictInfo[];
}

export interface ConflictInfo {
  type: 'teacher' | 'classroom' | 'student_group';
  message: string;
  severity: 'warning' | 'error';
}

export interface TimetableConfig {
  id: string;
  name: string;
  semester: string;
  startDate: string;
  endDate: string;
  workingDays: number[];
  timeSlots: TimeSlot[];
  courses: Course[];
  teachers: Teacher[];
  classrooms: Classroom[];
  students: Student[];
}

export interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  duration: number;
}

export interface TimetableStats {
  totalCourses: number;
  totalTeachers: number;
  totalClassrooms: number;
  totalStudents: number;
  utilizationRate: number;
  conflictCount: number;
}

// Authentication state types
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Timetable state types
export interface TimetableState {
  configs: TimetableConfig[];
  activeConfig: TimetableConfig | null;
  timetableSlots: TimetableSlot[];
  isGenerating: boolean;
  isLoading: boolean;
  error: string | null;
  stats: TimetableStats | null;
}

// Form validation schemas types
export interface LoginForm {
  email: string;
  password: string;
}

export interface CourseForm {
  name: string;
  code: string;
  credits: number;
  teacherId: string;
}

export interface ClassroomForm {
  name: string;
  capacity: number;
  type: 'lecture' | 'lab' | 'seminar';
  building: string;
  floor: number;
}

export interface StudentForm {
  name: string;
  email: string;
  studentId: string;
  semester: number;
  department: string;
}

export interface TeacherForm {
  name: string;
  email: string;
  department: string;
  specialization: string;
}

// Additional types for components
export interface Column<T> {
  key: keyof T | string;
  label: string;
  render?: (value: any, row: T) => React.ReactNode;
  width?: string;
}