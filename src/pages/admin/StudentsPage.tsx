import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, Users } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import PageHeader from '../../components/layout/PageHeader';
import DataTable from '../../components/common/DataTable';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../components/ui/form';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { useToast } from '../../hooks/use-toast';
import { addStudent, removeStudent } from '../../features/timetable/timetableSlice';
import type { RootState, AppDispatch } from '../../app/store';
import type { Student, Column } from '../../types';

const studentSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email format'),
  studentId: z.string().min(3, 'Student ID is required'),
  semester: z.number().min(1).max(8),
  department: z.string().min(2, 'Department is required'),
});

type StudentFormData = z.infer<typeof studentSchema>;

const StudentsPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();
  const { activeConfig } = useSelector((state: RootState) => state.timetable);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);

  const form = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      name: '',
      email: '',
      studentId: '',
      semester: 1,
      department: '',
    },
  });

  // Mock initial data
  useEffect(() => {
    const mockStudents: Student[] = [
      {
        id: '1',
        name: 'Alice Johnson',
        email: 'alice.johnson@student.edu',
        studentId: 'CS2021001',
        semester: 4,
        department: 'Computer Science',
        enrolledCourses: ['CS201', 'CS301', 'MATH201'],
      },
      {
        id: '2',
        name: 'Bob Smith',
        email: 'bob.smith@student.edu',
        studentId: 'CS2021002',
        semester: 4,
        department: 'Computer Science',
        enrolledCourses: ['CS201', 'CS301'],
      },
      {
        id: '3',
        name: 'Carol Davis',
        email: 'carol.davis@student.edu',
        studentId: 'MATH2021001',
        semester: 3,
        department: 'Mathematics',
        enrolledCourses: ['MATH201', 'MATH301'],
      },
    ];
    setStudents(mockStudents);
  }, []);

  const columns: Column<Student>[] = [
    {
      key: 'name',
      label: 'Name',
      width: '180px',
    },
    {
      key: 'studentId',
      label: 'Student ID',
      width: '120px',
    },
    {
      key: 'email',
      label: 'Email',
      width: '200px',
    },
    {
      key: 'department',
      label: 'Department',
      width: '150px',
    },
    {
      key: 'semester',
      label: 'Semester',
      width: '100px',
      render: (semester: number) => (
        <Badge variant="outline">{semester}</Badge>
      ),
    },
    {
      key: 'enrolledCourses',
      label: 'Enrolled Courses',
      render: (courses: string[]) => (
        <div className="flex gap-1 flex-wrap">
          {courses.map((course) => (
            <Badge key={course} variant="secondary" className="text-xs">
              {course}
            </Badge>
          ))}
        </div>
      ),
    },
  ];

  const onSubmit = (data: StudentFormData) => {
    const newStudent: Student = {
      id: crypto.randomUUID(),
      ...data,
      enrolledCourses: [],
    };

    setStudents(prev => [...prev, newStudent]);
    dispatch(addStudent(newStudent));
    
    toast({
      title: 'Student Added',
      description: `${data.name} has been added successfully.`,
    });

    form.reset();
    setIsDialogOpen(false);
  };

  const handleEdit = (student: Student) => {
    form.setValue('name', student.name);
    form.setValue('email', student.email);
    form.setValue('studentId', student.studentId);
    form.setValue('semester', student.semester);
    form.setValue('department', student.department);
    setIsDialogOpen(true);
  };

  const handleDelete = (student: Student) => {
    setStudents(prev => prev.filter(s => s.id !== student.id));
    dispatch(removeStudent(student.id));
    
    toast({
      title: 'Student Removed',
      description: `${student.name} has been removed.`,
      variant: 'destructive',
    });
  };

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Students Management"
        subtitle="Manage student enrollment and course assignments"
        actions={
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Student
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Student</DialogTitle>
                <DialogDescription>
                  Enter the student's information to add them to the system.
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="studentId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Student ID</FormLabel>
                        <FormControl>
                          <Input placeholder="CS2024001" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="john.doe@student.edu" type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="department"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Department</FormLabel>
                        <FormControl>
                          <Input placeholder="Computer Science" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="semester"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Semester</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="1" 
                            max="8" 
                            placeholder="1" 
                            {...field} 
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">Add Student</Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Student Body ({students.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={students}
            columns={columns}
            onEdit={handleEdit}
            onDelete={handleDelete}
            emptyMessage="No students found. Add your first student to get started."
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentsPage;