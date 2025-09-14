import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, GraduationCap } from 'lucide-react';
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
import { addTeacher, removeTeacher } from '../../features/timetable/timetableSlice';
import type { RootState, AppDispatch } from '../../app/store';
import type { Teacher, Column } from '../../types';

const teacherSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email format'),
  department: z.string().min(2, 'Department is required'),
  specialization: z.string().min(2, 'Specialization is required'),
});

type TeacherFormData = z.infer<typeof teacherSchema>;

const TeachersPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();
  const { activeConfig } = useSelector((state: RootState) => state.timetable);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [teachers, setTeachers] = useState<Teacher[]>([]);

  const form = useForm<TeacherFormData>({
    resolver: zodResolver(teacherSchema),
    defaultValues: {
      name: '',
      email: '',
      department: '',
      specialization: '',
    },
  });

  // Mock initial data
  useEffect(() => {
    const mockTeachers: Teacher[] = [
      {
        id: '1',
        name: 'Dr. Sarah Johnson',
        email: 'sarah.johnson@scheduler.com',
        department: 'Computer Science',
        specialization: 'Data Structures & Algorithms',
        courses: ['CS201', 'CS301'],
      },
      {
        id: '2',
        name: 'Prof. Michael Chen',
        email: 'michael.chen@scheduler.com',
        department: 'Computer Science',
        specialization: 'Database Systems',
        courses: ['CS301', 'CS401'],
      },
      {
        id: '3',
        name: 'Dr. Emily Davis',
        email: 'emily.davis@scheduler.com',
        department: 'Mathematics',
        specialization: 'Linear Algebra',
        courses: ['MATH201', 'MATH301'],
      },
    ];
    setTeachers(mockTeachers);
  }, []);

  const columns: Column<Teacher>[] = [
    {
      key: 'name',
      label: 'Name',
      width: '200px',
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
      key: 'specialization',
      label: 'Specialization',
      width: '200px',
    },
    {
      key: 'courses',
      label: 'Courses',
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

  const onSubmit = (data: TeacherFormData) => {
    const newTeacher: Teacher = {
      id: crypto.randomUUID(),
      ...data,
      courses: [],
    };

    setTeachers(prev => [...prev, newTeacher]);
    dispatch(addTeacher(newTeacher));
    
    toast({
      title: 'Teacher Added',
      description: `${data.name} has been added successfully.`,
    });

    form.reset();
    setIsDialogOpen(false);
  };

  const handleEdit = (teacher: Teacher) => {
    form.setValue('name', teacher.name);
    form.setValue('email', teacher.email);
    form.setValue('department', teacher.department);
    form.setValue('specialization', teacher.specialization);
    setIsDialogOpen(true);
  };

  const handleDelete = (teacher: Teacher) => {
    setTeachers(prev => prev.filter(t => t.id !== teacher.id));
    dispatch(removeTeacher(teacher.id));
    
    toast({
      title: 'Teacher Removed',
      description: `${teacher.name} has been removed.`,
      variant: 'destructive',
    });
  };

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Teachers Management"
        subtitle="Manage teaching staff and their assignments"
        actions={
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Teacher
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Teacher</DialogTitle>
                <DialogDescription>
                  Enter the teacher's information to add them to the system.
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
                          <Input placeholder="Dr. John Smith" {...field} />
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
                          <Input placeholder="john.smith@university.edu" type="email" {...field} />
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
                    name="specialization"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Specialization</FormLabel>
                        <FormControl>
                          <Input placeholder="Data Structures & Algorithms" {...field} />
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
                    <Button type="submit">Add Teacher</Button>
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
            <GraduationCap className="h-5 w-5" />
            Teaching Staff ({teachers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={teachers}
            columns={columns}
            onEdit={handleEdit}
            onDelete={handleDelete}
            emptyMessage="No teachers found. Add your first teacher to get started."
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default TeachersPage;