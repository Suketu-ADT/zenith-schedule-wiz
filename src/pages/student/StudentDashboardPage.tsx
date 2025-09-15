import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Calendar,
  Clock,
  GraduationCap,
  CheckCircle,
  AlertCircle,
  MapPin,
  TrendingUp
} from 'lucide-react';
import PageHeader from '../../components/layout/PageHeader';
import StatCard from '../../components/common/StatCard';
import TimetableView from '../../components/timetable/TimetableView';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Progress } from '../../components/ui/progress';
import { loadTimetableData } from '../../features/timetable/timetableSlice';
import type { RootState, AppDispatch } from '../../app/store';

const StudentDashboardPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { timetableSlots, isLoading } = useSelector((state: RootState) => state.timetable);

  useEffect(() => {
    dispatch(loadTimetableData('student'));
  }, [dispatch]);

  // Filter slots for student (based on student groups - mock for demo)
  const studentGroups = ['CS-2A', 'CS-2B']; // Mock student groups
  const studentSlots = timetableSlots.filter(slot => 
    slot.studentGroups.some(group => studentGroups.includes(group))
  );

  // Get today's classes and upcoming days
  const today = new Date().getDay(); // 0 = Sunday, 1 = Monday, etc.
  const todaySlots = studentSlots.filter(slot => slot.dayOfWeek === (today === 0 ? 6 : today - 1));
  
  // Mock upcoming assignments data
  const upcomingAssignments = [
    {
      course: 'Data Structures',
      assignment: 'Binary Tree Implementation',
      deadline: 'Due tomorrow',
      priority: 'high',
    },
    {
      course: 'Database Systems',
      assignment: 'ER Diagram Project',
      deadline: 'Due in 3 days',
      priority: 'medium',
    },
    {
      course: 'Linear Algebra',
      assignment: 'Matrix Operations',
      deadline: 'Due next week',
      priority: 'low',
    },
  ];

  // Get upcoming deadlines (within next week)
  const upcomingDeadlines = upcomingAssignments.filter(assignment => 
    assignment.deadline.includes('tomorrow') || assignment.deadline.includes('3 days')
  ).length;

  // Get slots for next few days
  const getNextDaySlots = (daysFromToday: number) => {
    const dayIndex = (today + daysFromToday) % 7;
    const adjustedIndex = dayIndex === 0 ? 6 : dayIndex - 1;
    return studentSlots.filter(slot => slot.dayOfWeek === adjustedIndex);
  };

  // Student stats
  const studentStats = [
    {
      title: 'Enrolled Courses',
      value: 6,
      icon: BookOpen,
      description: 'This semester',
      color: 'text-blue-600',
    },
    {
      title: 'Classes Today',
      value: todaySlots.length,
      icon: Clock,
      description: 'Scheduled classes',
      color: 'text-green-600',
    },
    {
      title: 'Credits',
      value: 18,
      icon: GraduationCap,
      description: 'Total this semester',
      color: 'text-purple-600',
    },
    {
      title: 'Upcoming Deadlines',
      value: upcomingDeadlines,
      icon: AlertCircle,
      description: 'Due within next week',
      color: 'text-red-600',
    },
    {
      title: 'Attendance',
      value: '92%',
      icon: CheckCircle,
      description: 'Overall rate',
      color: 'text-orange-600',
    },
  ];

  const enrolledCourses = [
    {
      id: '1',
      name: 'Data Structures',
      code: 'CS201',
      instructor: 'Prof. Michael Chen',
      credits: 3,
      nextClass: 'Today, 9:00 AM',
      room: 'Room A101',
      grade: 'A-',
    },
    {
      id: '2',
      name: 'Database Systems',
      code: 'CS301',
      instructor: 'Prof. Michael Chen',
      credits: 4,
      nextClass: 'Tomorrow, 11:00 AM',
      room: 'Lab B201',
      grade: 'B+',
    },
    {
      id: '3',
      name: 'Linear Algebra',
      code: 'MATH201',
      instructor: 'Dr. Emily Davis',
      credits: 3,
      nextClass: 'Friday, 2:00 PM',
      room: 'Room C301',
      grade: 'A',
    },
  ];

  // This data is already defined above, so removing duplicate

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title={`Welcome, ${user?.name?.split(' ')[0] || 'Student'}`}
        subtitle="Here's your academic schedule and course overview"
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {studentStats.map((stat) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            description={stat.description}
            color={stat.color}
          />
        ))}
      </div>

      {/* My Week Ahead */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            My Week Ahead
          </CardTitle>
          <CardDescription>
            Your schedule for the upcoming days
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="today" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="today">Today</TabsTrigger>
              <TabsTrigger value="tomorrow">Tomorrow</TabsTrigger>
              <TabsTrigger value="day2">Day +2</TabsTrigger>
              <TabsTrigger value="day3">Day +3</TabsTrigger>
              <TabsTrigger value="day4">Day +4</TabsTrigger>
            </TabsList>
            
            <TabsContent value="today" className="mt-4">
              {todaySlots.length > 0 ? (
                <div className="space-y-3">
                  {todaySlots.map((slot) => (
                    <div key={slot.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
                      <div>
                        <h4 className="font-medium">{slot.courseName}</h4>
                        <p className="text-sm text-muted-foreground">{slot.classroomName}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{slot.startTime}</p>
                        <Badge variant="secondary" className="text-xs">{slot.courseCode}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">No classes today</p>
              )}
            </TabsContent>
            
            {[1, 2, 3, 4].map((day) => (
              <TabsContent key={day} value={day === 1 ? 'tomorrow' : `day${day}`} className="mt-4">
                {(() => {
                  const daySlots = getNextDaySlots(day);
                  return daySlots.length > 0 ? (
                    <div className="space-y-3">
                      {daySlots.map((slot) => (
                        <div key={slot.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
                          <div>
                            <h4 className="font-medium">{slot.courseName}</h4>
                            <p className="text-sm text-muted-foreground">{slot.classroomName}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">{slot.startTime}</p>
                            <Badge variant="secondary" className="text-xs">{slot.courseCode}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">No classes scheduled</p>
                  );
                })()}
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Academic Progress Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            My Academic Progress
          </CardTitle>
          <CardDescription>
            Track your credit completion across different course categories
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {[
            { type: 'Major Courses', earned: 45, total: 60, color: 'bg-primary' },
            { type: 'Minor Courses', earned: 12, total: 18, color: 'bg-secondary' },
            { type: 'General Education', earned: 30, total: 36, color: 'bg-accent' },
            { type: 'Electives', earned: 9, total: 12, color: 'bg-muted' }
          ].map((category) => (
            <div key={category.type} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{category.type}</span>
                <span className="text-muted-foreground">{category.earned}/{category.total} credits</span>
              </div>
              <Progress value={(category.earned / category.total) * 100} className="h-2" />
            </div>
          ))}
          <Button asChild className="w-full mt-4">
            <Link to="/student/course-catalog">Explore & Enroll in Courses</Link>
          </Button>
        </CardContent>
      </Card>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Enrolled Courses */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              My Courses
            </CardTitle>
            <CardDescription>
              Courses you're enrolled in this semester
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {enrolledCourses.map((course) => (
                <div key={course.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{course.name}</h4>
                      <Badge variant="outline">{course.code}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">
                      {course.instructor} • {course.credits} credits
                    </p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>Next: {course.nextClass}</span>
                      <span>•</span>
                      <span>{course.room}</span>
                    </div>
                  </div>
                  <Badge 
                    variant={course.grade.startsWith('A') ? 'default' : 'secondary'}
                    className="ml-2"
                  >
                    {course.grade}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Assignments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Upcoming Assignments
            </CardTitle>
            <CardDescription>
              Assignments and deadlines to keep track of
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingAssignments.map((assignment, index) => (
                <div key={index} className="flex items-start gap-3">
                  <AlertCircle className={`h-4 w-4 mt-1 ${
                    assignment.priority === 'high' ? 'text-destructive' :
                    assignment.priority === 'medium' ? 'text-warning' :
                    'text-muted-foreground'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{assignment.assignment}</p>
                    <p className="text-xs text-muted-foreground">
                      {assignment.course} • {assignment.deadline}
                    </p>
                  </div>
                  <Badge 
                    variant={assignment.priority === 'high' ? 'destructive' : 'secondary'}
                    className="text-xs"
                  >
                    {assignment.priority}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Schedule */}
      <Card>
        <CardHeader>
          <CardTitle>My Weekly Schedule</CardTitle>
          <CardDescription>
            Your complete class timetable for this week
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TimetableView 
            slots={studentSlots} 
            isLoading={isLoading}
            showFilters={false}
            userRole="student"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentDashboardPage;