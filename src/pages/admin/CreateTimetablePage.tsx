import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Check, 
  Users, 
  BookOpen, 
  Building, 
  UserCheck,
  Plus,
  Loader2,
  Calendar
} from 'lucide-react';
import PageHeader from '../../components/layout/PageHeader';
import DataTable, { Column } from '../../components/common/DataTable';
import TimetableView from '../../components/timetable/TimetableView';
import EditableTimetableView from '../../components/timetable/EditableTimetableView';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Separator } from '../../components/ui/separator';
import { Badge } from '../../components/ui/badge';
import { useToast } from '../../hooks/use-toast';
import { 
  generateTimetable, 
  addCourse, 
  addTeacher, 
  addClassroom, 
  addStudent,
  removeCourse,
  removeTeacher,
  removeClassroom,
  removeStudent
} from '../../features/timetable/timetableSlice';
import type { RootState, AppDispatch } from '../../app/store';
import type { Course, Teacher, Classroom, Student, TimetableSlot } from '../../types';

const steps = [
  { id: 1, name: 'Basic Info', icon: Calendar },
  { id: 2, name: 'Teachers', icon: UserCheck },
  { id: 3, name: 'Courses', icon: BookOpen },
  { id: 4, name: 'Classrooms', icon: Building },
  { id: 5, name: 'Students', icon: Users },
  { id: 6, name: 'Generate', icon: Check },
  { id: 7, name: 'Review', icon: Calendar },
];

// Form schemas
const courseSchema = z.object({
  name: z.string().min(1, 'Course name is required'),
  code: z.string().min(1, 'Course code is required'),
  credits: z.coerce.number().min(1, 'Credits must be at least 1'),
  teacherId: z.string().min(1, 'Teacher is required'),
});

const teacherSchema = z.object({
  name: z.string().min(1, 'Teacher name is required'),
  email: z.string().email('Valid email is required'),
  department: z.string().min(1, 'Department is required'),
  specialization: z.string().min(1, 'Specialization is required'),
});

const classroomSchema = z.object({
  name: z.string().min(1, 'Classroom name is required'),
  capacity: z.coerce.number().min(1, 'Capacity must be at least 1'),
  type: z.enum(['lecture', 'lab', 'seminar']),
  building: z.string().min(1, 'Building is required'),
  floor: z.coerce.number().min(0, 'Floor must be 0 or higher'),
});

const studentSchema = z.object({
  name: z.string().min(1, 'Student name is required'),
  email: z.string().email('Valid email is required'),
  studentId: z.string().min(1, 'Student ID is required'),
  semester: z.coerce.number().min(1, 'Semester must be at least 1'),
  department: z.string().min(1, 'Department is required'),
});

const CreateTimetablePage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();
  const { activeConfig, isGenerating, timetableSlots, stats } = useSelector((state: RootState) => state.timetable);
  
  const [currentStep, setCurrentStep] = useState(1);
  const [mockData, setMockData] = useState({
    teachers: [] as Teacher[],
    courses: [] as Course[],
    classrooms: [] as Classroom[],
    students: [] as Student[],
  });

  // Form instances
  const courseForm = useForm({
    resolver: zodResolver(courseSchema),
    defaultValues: { name: '', code: '', credits: 3, teacherId: '' },
  });

  const teacherForm = useForm({
    resolver: zodResolver(teacherSchema),
    defaultValues: { name: '', email: '', department: '', specialization: '' },
  });

  const classroomForm = useForm({
    resolver: zodResolver(classroomSchema),
    defaultValues: { name: '', capacity: 30, type: 'lecture' as const, building: '', floor: 1 },
  });

  const studentForm = useForm({
    resolver: zodResolver(studentSchema),
    defaultValues: { name: '', email: '', studentId: '', semester: 1, department: '' },
  });

  // Table columns
  const teacherColumns: Column<Teacher>[] = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'department', label: 'Department' },
    { key: 'specialization', label: 'Specialization' },
  ];

  const courseColumns: Column<Course>[] = [
    { key: 'code', label: 'Code' },
    { key: 'name', label: 'Name' },
    { key: 'credits', label: 'Credits' },
    { key: 'teacherName', label: 'Teacher' },
  ];

  const classroomColumns: Column<Classroom>[] = [
    { key: 'name', label: 'Name' },
    { key: 'capacity', label: 'Capacity' },
    { 
      key: 'type', 
      label: 'Type',
      render: (value) => <Badge variant="outline">{value}</Badge>
    },
    { key: 'building', label: 'Building' },
    { key: 'floor', label: 'Floor' },
  ];

  const studentColumns: Column<Student>[] = [
    { key: 'studentId', label: 'Student ID' },
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'department', label: 'Department' },
    { key: 'semester', label: 'Semester' },
  ];

  // Form handlers
  const handleAddTeacher = (data: any) => {
    const teacher: Teacher = {
      id: Date.now().toString(),
      ...data,
      courses: [],
    };
    setMockData(prev => ({ ...prev, teachers: [...prev.teachers, teacher] }));
    teacherForm.reset();
    toast({
      title: 'Teacher added',
      description: `${teacher.name} has been added successfully.`,
    });
  };

  const handleAddCourse = (data: any) => {
    const teacher = mockData.teachers.find(t => t.id === data.teacherId);
    if (!teacher) return;

    const course: Course = {
      id: Date.now().toString(),
      ...data,
      teacherName: teacher.name,
      color: '#3B82F6',
    };
    setMockData(prev => ({ ...prev, courses: [...prev.courses, course] }));
    courseForm.reset();
    toast({
      title: 'Course added',
      description: `${course.name} has been added successfully.`,
    });
  };

  const handleAddClassroom = (data: any) => {
    const classroom: Classroom = {
      id: Date.now().toString(),
      ...data,
    };
    setMockData(prev => ({ ...prev, classrooms: [...prev.classrooms, classroom] }));
    classroomForm.reset();
    toast({
      title: 'Classroom added',
      description: `${classroom.name} has been added successfully.`,
    });
  };

  const handleAddStudent = (data: any) => {
    const student: Student = {
      id: Date.now().toString(),
      ...data,
      enrolledCourses: [],
    };
    setMockData(prev => ({ ...prev, students: [...prev.students, student] }));
    studentForm.reset();
    toast({
      title: 'Student added',
      description: `${student.name} has been added successfully.`,
    });
  };

  const handleGenerateTimetable = async () => {
    if (mockData.teachers.length === 0 || mockData.courses.length === 0 || mockData.classrooms.length === 0) {
      toast({
        variant: 'destructive',
        title: 'Missing data',
        description: 'Please add at least one teacher, course, and classroom before generating.',
      });
      return;
    }

    try {
      await dispatch(generateTimetable('mock-config-id')).unwrap();
      setCurrentStep(7); // Move to review step
      toast({
        title: 'Timetable generated successfully!',
        description: 'Your new timetable is ready for review.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Generation failed',
        description: error as string,
      });
    }
  };

  const handleUpdateSlot = (updatedSlot: TimetableSlot) => {
    // Update slot in the timetable - this would typically update the Redux store
    console.log('Updating slot:', updatedSlot);
    // For now, just show a toast as this is mock data
    toast({
      title: 'Slot updated',
      description: 'The class has been updated successfully.',
    });
  };

  const handleDeleteSlot = (slotId: string) => {
    // Delete slot from the timetable - this would typically update the Redux store
    console.log('Deleting slot:', slotId);
    // For now, just show a toast as this is mock data
    toast({
      title: 'Slot deleted',
      description: 'The class has been removed from the timetable.',
    });
  };

  const handleAddSlot = (newSlot: Omit<TimetableSlot, 'id'>) => {
    // Add new slot to the timetable - this would typically update the Redux store
    const slotWithId = {
      ...newSlot,
      id: `slot-${Date.now()}`,
    };
    console.log('Adding slot:', slotWithId);
    // For now, just show a toast as this is mock data
    toast({
      title: 'Slot added',
      description: 'New class has been added to the timetable.',
    });
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Timetable Configuration</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Timetable Name</Label>
                  <Input id="name" placeholder="Fall 2024 Schedule" />
                </div>
                <div>
                  <Label htmlFor="semester">Semester</Label>
                  <Input id="semester" placeholder="Fall 2024" />
                </div>
                <div>
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input id="startDate" type="date" />
                </div>
                <div>
                  <Label htmlFor="endDate">End Date</Label>
                  <Input id="endDate" type="date" />
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Add Teachers</h3>
              <form onSubmit={teacherForm.handleSubmit(handleAddTeacher)} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <Label htmlFor="teacherName">Full Name</Label>
                  <Input id="teacherName" {...teacherForm.register('name')} />
                </div>
                <div>
                  <Label htmlFor="teacherEmail">Email</Label>
                  <Input id="teacherEmail" type="email" {...teacherForm.register('email')} />
                </div>
                <div>
                  <Label htmlFor="department">Department</Label>
                  <Input id="department" {...teacherForm.register('department')} />
                </div>
                <div>
                  <Label htmlFor="specialization">Specialization</Label>
                  <Input id="specialization" {...teacherForm.register('specialization')} />
                </div>
                <div className="md:col-span-2">
                  <Button type="submit" className="w-full">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Teacher
                  </Button>
                </div>
              </form>
            </div>
            <DataTable
              data={mockData.teachers}
              columns={teacherColumns}
              onDelete={(teacher) => setMockData(prev => ({ 
                ...prev, 
                teachers: prev.teachers.filter(t => t.id !== teacher.id)
              }))}
            />
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Add Courses</h3>
              <form onSubmit={courseForm.handleSubmit(handleAddCourse)} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <Label htmlFor="courseName">Course Name</Label>
                  <Input id="courseName" {...courseForm.register('name')} />
                </div>
                <div>
                  <Label htmlFor="courseCode">Course Code</Label>
                  <Input id="courseCode" {...courseForm.register('code')} />
                </div>
                <div>
                  <Label htmlFor="credits">Credits</Label>
                  <Input id="credits" type="number" {...courseForm.register('credits')} />
                </div>
                <div>
                  <Label htmlFor="teacher">Teacher</Label>
                  <Select onValueChange={(value) => courseForm.setValue('teacherId', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select teacher" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockData.teachers.map(teacher => (
                        <SelectItem key={teacher.id} value={teacher.id}>
                          {teacher.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-2">
                  <Button type="submit" className="w-full" disabled={mockData.teachers.length === 0}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Course
                  </Button>
                </div>
              </form>
            </div>
            <DataTable
              data={mockData.courses}
              columns={courseColumns}
              onDelete={(course) => setMockData(prev => ({ 
                ...prev, 
                courses: prev.courses.filter(c => c.id !== course.id)
              }))}
            />
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Add Classrooms</h3>
              <form onSubmit={classroomForm.handleSubmit(handleAddClassroom)} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <Label htmlFor="classroomName">Room Name</Label>
                  <Input id="classroomName" {...classroomForm.register('name')} />
                </div>
                <div>
                  <Label htmlFor="capacity">Capacity</Label>
                  <Input id="capacity" type="number" {...classroomForm.register('capacity')} />
                </div>
                <div>
                  <Label htmlFor="type">Room Type</Label>
                  <Select onValueChange={(value) => classroomForm.setValue('type', value as any)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lecture">Lecture Hall</SelectItem>
                      <SelectItem value="lab">Laboratory</SelectItem>
                      <SelectItem value="seminar">Seminar Room</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="building">Building</Label>
                  <Input id="building" {...classroomForm.register('building')} />
                </div>
                <div>
                  <Label htmlFor="floor">Floor</Label>
                  <Input id="floor" type="number" {...classroomForm.register('floor')} />
                </div>
                <div>
                  <Button type="submit" className="w-full">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Classroom
                  </Button>
                </div>
              </form>
            </div>
            <DataTable
              data={mockData.classrooms}
              columns={classroomColumns}
              onDelete={(classroom) => setMockData(prev => ({ 
                ...prev, 
                classrooms: prev.classrooms.filter(c => c.id !== classroom.id)
              }))}
            />
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Add Students</h3>
              <form onSubmit={studentForm.handleSubmit(handleAddStudent)} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <Label htmlFor="studentName">Full Name</Label>
                  <Input id="studentName" {...studentForm.register('name')} />
                </div>
                <div>
                  <Label htmlFor="studentEmail">Email</Label>
                  <Input id="studentEmail" type="email" {...studentForm.register('email')} />
                </div>
                <div>
                  <Label htmlFor="studentId">Student ID</Label>
                  <Input id="studentId" {...studentForm.register('studentId')} />
                </div>
                <div>
                  <Label htmlFor="semester">Semester</Label>
                  <Input id="semester" type="number" {...studentForm.register('semester')} />
                </div>
                <div>
                  <Label htmlFor="studentDepartment">Department</Label>
                  <Input id="studentDepartment" {...studentForm.register('department')} />
                </div>
                <div>
                  <Button type="submit" className="w-full">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Student
                  </Button>
                </div>
              </form>
            </div>
            <DataTable
              data={mockData.students}
              columns={studentColumns}
              onDelete={(student) => setMockData(prev => ({ 
                ...prev, 
                students: prev.students.filter(s => s.id !== student.id)
              }))}
            />
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-medium mb-4">Ready to Generate Timetable</h3>
              <p className="text-muted-foreground mb-6">
                Review your configuration and generate the AI-powered timetable
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <Card>
                  <CardContent className="p-4 text-center">
                    <UserCheck className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <p className="text-2xl font-bold">{mockData.teachers.length}</p>
                    <p className="text-sm text-muted-foreground">Teachers</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <BookOpen className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <p className="text-2xl font-bold">{mockData.courses.length}</p>
                    <p className="text-sm text-muted-foreground">Courses</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <Building className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <p className="text-2xl font-bold">{mockData.classrooms.length}</p>
                    <p className="text-sm text-muted-foreground">Classrooms</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <Users className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <p className="text-2xl font-bold">{mockData.students.length}</p>
                    <p className="text-sm text-muted-foreground">Students</p>
                  </CardContent>
                </Card>
              </div>

              <Button 
                onClick={handleGenerateTimetable}
                size="lg"
                disabled={isGenerating}
                className="min-w-[200px]"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Calendar className="mr-2 h-4 w-4" />
                    Generate Timetable
                  </>
                )}
              </Button>
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-lg font-medium mb-2">Generated Timetable</h3>
              <p className="text-muted-foreground">
                Here's your AI-generated timetable based on the data you entered
              </p>
            </div>

            {stats && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <Card>
                  <CardContent className="p-4 text-center">
                    <BookOpen className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <p className="text-xl font-bold">{stats.totalCourses}</p>
                    <p className="text-xs text-muted-foreground">Total Courses</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <Users className="h-6 w-6 mx-auto mb-2 text-green-600" />
                    <p className="text-xl font-bold">{stats.utilizationRate}%</p>
                    <p className="text-xs text-muted-foreground">Utilization</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <Building className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                    <p className="text-xl font-bold">{stats.totalClassrooms}</p>
                    <p className="text-xs text-muted-foreground">Classrooms</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <UserCheck className="h-6 w-6 mx-auto mb-2 text-orange-600" />
                    <p className="text-xl font-bold">{stats.conflictCount}</p>
                    <p className="text-xs text-muted-foreground">Conflicts</p>
                  </CardContent>
                </Card>
              </div>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Generated Timetable</CardTitle>
                <CardDescription>
                  Review and edit your generated timetable. You can drag classes to move them, edit details, or add new classes.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <EditableTimetableView
                  slots={timetableSlots}
                  courses={mockData.courses}
                  teachers={mockData.teachers}
                  classrooms={mockData.classrooms}
                  onUpdateSlot={handleUpdateSlot}
                  onDeleteSlot={handleDeleteSlot}
                  onAddSlot={handleAddSlot}
                  isLoading={isGenerating}
                />
              </CardContent>
            </Card>

            <div className="flex gap-4 justify-center">
              <Button 
                variant="outline" 
                onClick={() => setCurrentStep(6)}
              >
                Back to Configure
              </Button>
              <Button>
                Save Timetable
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Create New Timetable"
        subtitle="Set up courses, teachers, and resources to generate an optimized schedule"
      />

      {/* Progress Steps */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`wizard-step ${
                  currentStep === step.id ? 'active' :
                  currentStep > step.id ? 'completed' : ''
                }`}>
                  <step.icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{step.name}</span>
                </div>
                {index < steps.length - 1 && (
                  <Separator className="w-8 mx-2" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Step Content */}
      <Card>
        <CardContent className="p-6">
          {renderStepContent()}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
          disabled={currentStep === 1}
        >
          Previous
        </Button>
        <Button
          onClick={() => setCurrentStep(Math.min(7, currentStep + 1))}
          disabled={currentStep === 7}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default CreateTimetablePage;