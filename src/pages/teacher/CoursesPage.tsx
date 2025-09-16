import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Search, BookOpen, Users, Clock, Plus, Edit, FileText, Calendar } from 'lucide-react';
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
    dispatch(loadTimetableData('teacher'));
  }, [dispatch]);

  // Mock teacher's courses data
  const activeCourses = [
    {
      id: '1',
      name: 'Data Structures and Algorithms',
      code: 'CS201',
      credits: 4,
      semester: 'Spring 2024',
      enrolledStudents: 45,
      maxCapacity: 50,
      syllabusCovered: 65,
      totalClasses: 40,
      conductedClasses: 26,
      nextClass: '2024-03-16 10:00',
      classroom: 'Room A101',
      assignments: { pending: 3, graded: 8 },
    },
    {
      id: '2',
      name: 'Advanced Database Systems',
      code: 'CS401',
      credits: 3,
      semester: 'Spring 2024',
      enrolledStudents: 30,
      maxCapacity: 35,
      syllabusCovered: 45,
      totalClasses: 30,
      conductedClasses: 14,
      nextClass: '2024-03-17 14:00',
      classroom: 'Lab B201',
      assignments: { pending: 5, graded: 4 },
    },
    {
      id: '3',
      name: 'Machine Learning Fundamentals',
      code: 'CS501',
      credits: 4,
      semester: 'Spring 2024',
      enrolledStudents: 28,
      maxCapacity: 30,
      syllabusCovered: 30,
      totalClasses: 42,
      conductedClasses: 12,
      nextClass: '2024-03-18 11:00',
      classroom: 'Lab C301',
      assignments: { pending: 2, graded: 3 },
    },
  ];

  const pastCourses = [
    {
      id: '4',
      name: 'Programming Fundamentals',
      code: 'CS101',
      credits: 3,
      semester: 'Fall 2023',
      studentsEnrolled: 60,
      averageGrade: 'B+',
      completionRate: 95,
      feedback: 4.6,
    },
    {
      id: '5',
      name: 'Object Oriented Programming',
      code: 'CS102',
      credits: 4,
      semester: 'Fall 2023',
      studentsEnrolled: 55,
      averageGrade: 'A-',
      completionRate: 98,
      feedback: 4.8,
    },
  ];

  const filteredActive = activeCourses.filter(course =>
    course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPast = pastCourses.filter(course =>
    course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return date.toLocaleDateString('en-IN', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="My Courses" 
        subtitle="Manage your teaching courses and track progress"
        actions={
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Course
          </Button>
        }
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

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="active">Active Courses ({activeCourses.length})</TabsTrigger>
          <TabsTrigger value="past">Past Courses ({pastCourses.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          <div className="grid gap-4">
            {filteredActive.map((course) => (
              <Card key={course.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl">{course.name}</CardTitle>
                      <CardDescription>{course.code} • {course.credits} Credits • {course.semester}</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm">
                        <FileText className="h-4 w-4 mr-1" />
                        Materials
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Enrollment</span>
                        <span>{course.enrolledStudents}/{course.maxCapacity}</span>
                      </div>
                      <Progress value={(course.enrolledStudents / course.maxCapacity) * 100} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Syllabus Progress</span>
                        <span>{course.syllabusCovered}%</span>
                      </div>
                      <Progress value={course.syllabusCovered} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Classes Conducted</span>
                        <span>{course.conductedClasses}/{course.totalClasses}</span>
                      </div>
                      <Progress value={(course.conductedClasses / course.totalClasses) * 100} className="h-2" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Next Class</p>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <p className="font-medium">{formatDateTime(course.nextClass)}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Classroom</p>
                      <p className="font-medium">{course.classroom}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Pending Assignments</p>
                      <p className="font-medium">{course.assignments.pending}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Graded Assignments</p>
                      <p className="font-medium">{course.assignments.graded}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Users className="h-4 w-4 mr-1" />
                      View Students
                    </Button>
                    <Button variant="outline" size="sm">
                      <BookOpen className="h-4 w-4 mr-1" />
                      Assignments
                    </Button>
                    <Button variant="outline" size="sm">
                      <Clock className="h-4 w-4 mr-1" />
                      Attendance
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="past" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredPast.map((course) => (
              <Card key={course.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{course.name}</CardTitle>
                  <CardDescription>{course.code} • {course.credits} Credits</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Students</p>
                      <p className="font-medium">{course.studentsEnrolled}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Average Grade</p>
                      <Badge variant="secondary">{course.averageGrade}</Badge>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Completion Rate</p>
                      <p className="font-medium">{course.completionRate}%</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Student Feedback</p>
                      <p className="font-medium">⭐ {course.feedback}/5</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="w-full">
                      View Reports
                    </Button>
                    <Button variant="outline" size="sm" className="w-full">
                      Export Data
                    </Button>
                  </div>
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