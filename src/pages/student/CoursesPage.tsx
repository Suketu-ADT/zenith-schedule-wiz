import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Search, BookOpen, User, Clock, Star, Plus } from 'lucide-react';
import PageHeader from '../../components/layout/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Progress } from '../../components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { loadTimetableData } from '../../features/timetable/timetableSlice';
import type { RootState, AppDispatch } from '../../app/store';

const CoursesPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { timetableSlots } = useSelector((state: RootState) => state.timetable);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(loadTimetableData({}));
  }, [dispatch]);

  // Mock enrolled courses data
  const enrolledCourses = [
    {
      id: '1',
      name: 'Data Structures and Algorithms',
      code: 'CS201',
      credits: 4,
      instructor: 'Prof. Rajesh Kumar',
      semester: 'Spring 2024',
      progress: 75,
      grade: 'A-',
      attendance: 85,
      assignments: { completed: 8, total: 10 },
    },
    {
      id: '2',
      name: 'Database Management Systems',
      code: 'CS301',
      credits: 3,
      instructor: 'Dr. Sunita Verma',
      semester: 'Spring 2024',
      progress: 60,
      grade: 'B+',
      attendance: 92,
      assignments: { completed: 6, total: 8 },
    },
    {
      id: '3',
      name: 'Linear Algebra',
      code: 'MATH201',
      credits: 3,
      instructor: 'Prof. Arjun Singh',
      semester: 'Spring 2024',
      progress: 45,
      grade: 'B',
      attendance: 88,
      assignments: { completed: 4, total: 7 },
    },
  ];

  // Mock available courses
  const availableCourses = [
    {
      id: '4',
      name: 'Machine Learning Fundamentals',
      code: 'CS401',
      credits: 4,
      instructor: 'Dr. Kavita Rao',
      semester: 'Fall 2024',
      capacity: 60,
      enrolled: 45,
      prerequisites: ['CS201', 'MATH201'],
      rating: 4.8,
    },
    {
      id: '5',
      name: 'Web Development',
      code: 'CS305',
      credits: 3,
      instructor: 'Prof. Amit Gupta',
      semester: 'Fall 2024',
      capacity: 40,
      enrolled: 35,
      prerequisites: ['CS201'],
      rating: 4.6,
    },
    {
      id: '6',
      name: 'Computer Networks',
      code: 'CS303',
      credits: 3,
      instructor: 'Dr. Neha Joshi',
      semester: 'Fall 2024',
      capacity: 50,
      enrolled: 28,
      prerequisites: ['CS201'],
      rating: 4.5,
    },
  ];

  const filteredEnrolled = enrolledCourses.filter(course =>
    course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAvailable = availableCourses.filter(course =>
    course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader 
        title="My Courses" 
        subtitle="Manage your enrolled courses and explore new ones"
      />

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search courses..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <Tabs defaultValue="enrolled" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="enrolled">Enrolled Courses ({enrolledCourses.length})</TabsTrigger>
          <TabsTrigger value="available">Available Courses ({availableCourses.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="enrolled" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredEnrolled.map((course) => (
              <Card key={course.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{course.name}</CardTitle>
                      <CardDescription>{course.code} • {course.credits} Credits</CardDescription>
                    </div>
                    <Badge variant="secondary">{course.grade}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4" />
                    {course.instructor}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Course Progress</span>
                      <span>{course.progress}%</span>
                    </div>
                    <Progress value={course.progress} className="h-2" />
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Attendance</p>
                      <p className="font-medium">{course.attendance}%</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Assignments</p>
                      <p className="font-medium">{course.assignments.completed}/{course.assignments.total}</p>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full">
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="available" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredAvailable.map((course) => (
              <Card key={course.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{course.name}</CardTitle>
                      <CardDescription>{course.code} • {course.credits} Credits</CardDescription>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-current text-yellow-500" />
                      <span className="text-sm">{course.rating}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4" />
                    {course.instructor}
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Enrollment</span>
                      <span>{course.enrolled}/{course.capacity}</span>
                    </div>
                    <Progress value={(course.enrolled / course.capacity) * 100} className="h-2" />
                  </div>

                  {course.prerequisites.length > 0 && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Prerequisites:</p>
                      <div className="flex flex-wrap gap-1">
                        {course.prerequisites.map((prereq) => (
                          <Badge key={prereq} variant="outline" className="text-xs">
                            {prereq}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <Button className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Enroll Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CoursesPage;