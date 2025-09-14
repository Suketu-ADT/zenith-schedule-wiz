import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, BookOpen } from 'lucide-react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { Badge } from '../../components/ui/badge';
import { useToast } from '../../hooks/use-toast';
import { addCourse, removeCourse } from '../../features/timetable/timetableSlice';
import type { RootState, AppDispatch } from '../../app/store';
import type { Course, Column } from '../../types';

const courseSchema = z.object({
  name: z.string().min(2, 'Course name must be at least 2 characters'),
  code: z.string().min(3, 'Course code is required'),
  credits: z.number().min(1).max(6),
  teacherId: z.string().min(1, 'Teacher must be selected'),
});

type CourseFormData = z.infer<typeof courseSchema>;

const mockTeachers = [
  { id: '1', name: 'Dr. Sarah Johnson' },
  { id: '2', name: 'Prof. Michael Chen' },
  { id: '3', name: 'Dr. Emily Davis' },
];

const CoursesPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();
  const { activeConfig } = useSelector((state: RootState) => state.timetable);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);

  const form = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      name: '',
      code: '',
      credits: 3,
      teacherId: '',
    },
  });

  // Mock initial data
  useEffect(() => {
    const mockCourses: Course[] = [
      {
        id: '1',
        name: 'Data Structures and Algorithms',
        code: 'CS201',
        credits: 3,
        teacherId: '1',
        teacherName: 'Dr. Sarah Johnson',
        color: '#3B82F6',
      },
      {
        id: '2',
        name: 'Database Management Systems',
        code: 'CS301',
        credits: 4,
        teacherId: '2',
        teacherName: 'Prof. Michael Chen',
        color: '#10B981',
      },
      {
        id: '3',
        name: 'Linear Algebra',
        code: 'MATH201',
        credits: 3,
        teacherId: '3',
        teacherName: 'Dr. Emily Davis',
        color: '#F59E0B',
      },
    ];
    setCourses(mockCourses);
  }, []);

  const columns: Column<Course>[] = [
    {
      key: 'code',
      label: 'Course Code',
      width: '120px',
      render: (code: string, course: Course) => (
        <div className="flex items-center gap-2">
          <div 
            className="w-3 h-3 rounded-full" 
            style={{ backgroundColor: course.color }}
          />
          <span className="font-mono">{code}</span>
        </div>
      ),
    },
    {
      key: 'name',
      label: 'Course Name',
      width: '250px',
    },
    {
      key: 'credits',
      label: 'Credits',
      width: '80px',
      render: (credits: number) => (
        <Badge variant="outline">{credits}</Badge>
      ),
    },
    {
      key: 'teacherName',
      label: 'Instructor',
      width: '200px',
    },
  ];

  const onSubmit = (data: CourseFormData) => {
    const selectedTeacher = mockTeachers.find(t => t.id === data.teacherId);
    
    const newCourse: Course = {
      id: crypto.randomUUID(),
      ...data,
      teacherName: selectedTeacher?.name || '',
      color: `#${Math.floor(Math.random()*16777215).toString(16)}`, // Random color
    };

    setCourses(prev => [...prev, newCourse]);
    dispatch(addCourse(newCourse));
    
    toast({
      title: 'Course Added',
      description: `${data.name} has been added successfully.`,
    });

    form.reset();
    setIsDialogOpen(false);
  };

  const handleEdit = (course: Course) => {
    form.setValue('name', course.name);
    form.setValue('code', course.code);
    form.setValue('credits', course.credits);
    form.setValue('teacherId', course.teacherId);
    setIsDialogOpen(true);
  };

  const handleDelete = (course: Course) => {
    setCourses(prev => prev.filter(c => c.id !== course.id));
    dispatch(removeCourse(course.id));
    
    toast({
      title: 'Course Removed',
      description: `${course.name} has been removed.`,
      variant: 'destructive',
    });
  };

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Courses Management"
        subtitle="Manage academic courses and their assignments"
        actions={
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Course
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Course</DialogTitle>
                <DialogDescription>
                  Enter the course information to add it to the curriculum.
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Course Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Data Structures and Algorithms" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Course Code</FormLabel>
                        <FormControl>
                          <Input placeholder="CS201" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="credits"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Credits</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="1" 
                            max="6" 
                            placeholder="3" 
                            {...field} 
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 3)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="teacherId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Instructor</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select an instructor" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {mockTeachers.map((teacher) => (
                              <SelectItem key={teacher.id} value={teacher.id}>
                                {teacher.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
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
                    <Button type="submit">Add Course</Button>
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
            <BookOpen className="h-5 w-5" />
            Course Catalog ({courses.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={courses}
            columns={columns}
            onEdit={handleEdit}
            onDelete={handleDelete}
            emptyMessage="No courses found. Add your first course to get started."
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default CoursesPage;