import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  BookOpen, 
  Calendar,
  Clock,
  Users,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import PageHeader from '../../components/layout/PageHeader';
import StatCard from '../../components/common/StatCard';
import TimetableView from '../../components/timetable/TimetableView';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { loadTimetableData } from '../../features/timetable/timetableSlice';
import type { RootState, AppDispatch } from '../../app/store';

const TeacherDashboardPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { timetableSlots, isLoading } = useSelector((state: RootState) => state.timetable);

  useEffect(() => {
    dispatch(loadTimetableData('teacher'));
  }, [dispatch]);

  // Filter slots for current teacher
  const teacherSlots = timetableSlots.filter(slot => 
    slot.teacherName === user?.name || slot.teacherId === user?.id
  );

  // Get today's classes
  const today = new Date().getDay(); // 0 = Sunday, 1 = Monday, etc.
  const todaySlots = teacherSlots.filter(slot => slot.dayOfWeek === (today === 0 ? 6 : today - 1));

  // Teacher stats
  const teacherStats = [
    {
      title: 'My Courses',
      value: 3,
      icon: BookOpen,
      description: 'Active this semester',
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
      title: 'Total Students',
      value: 45,
      icon: Users,
      description: 'Across all courses',
      color: 'text-purple-600',
    },
    {
      title: 'This Week',
      value: teacherSlots.length,
      icon: Calendar,
      description: 'Total classes',
      color: 'text-orange-600',
    },
  ];

  const myCourses = [
    {
      id: '1',
      name: 'Data Structures',
      code: 'CS201',
      students: 25,
      credits: 3,
      nextClass: 'Today, 9:00 AM',
      status: 'active',
    },
    {
      id: '2',
      name: 'Database Systems',
      code: 'CS301',
      students: 20,
      credits: 4,
      nextClass: 'Tomorrow, 11:00 AM',
      status: 'active',
    },
    {
      id: '3',
      name: 'Software Engineering',
      code: 'CS401',
      students: 18,
      credits: 3,
      nextClass: 'Friday, 2:00 PM',
      status: 'active',
    },
  ];

  const upcomingTasks = [
    {
      task: 'Grade CS201 assignments',
      deadline: 'Due today',
      priority: 'high',
    },
    {
      task: 'Prepare CS301 lab materials',
      deadline: 'Due tomorrow',
      priority: 'medium',
    },
    {
      task: 'Submit grade reports',
      deadline: 'Due Friday',
      priority: 'low',
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title={`Good morning, ${user?.name?.split(' ')[0] || 'Professor'}`}
        subtitle="Here's your teaching schedule and course overview"
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {teacherStats.map((stat) => (
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

      {/* Today's Schedule */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Today's Schedule
          </CardTitle>
          <CardDescription>
            Your classes for today, {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {todaySlots.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {todaySlots.map((slot) => (
                <Card key={slot.id} className="timetable-slot">
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary">{slot.courseCode}</Badge>
                        <span className="text-sm text-muted-foreground">
                          {slot.startTime} - {slot.endTime}
                        </span>
                      </div>
                      <h4 className="font-medium">{slot.courseName}</h4>
                      <p className="text-sm text-muted-foreground">{slot.classroomName}</p>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Users className="h-3 w-3" />
                        {slot.studentGroups.join(', ')}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No classes scheduled for today</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* My Courses */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              My Courses
            </CardTitle>
            <CardDescription>
              Courses you're teaching this semester
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {myCourses.map((course) => (
                <div key={course.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{course.name}</h4>
                      <Badge variant="outline">{course.code}</Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{course.students} students</span>
                      <span>{course.credits} credits</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Next: {course.nextClass}
                    </p>
                  </div>
                  <CheckCircle className="h-5 w-5 text-success" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Upcoming Tasks
            </CardTitle>
            <CardDescription>
              Tasks and deadlines to keep track of
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingTasks.map((task, index) => (
                <div key={index} className="flex items-start gap-3">
                  <AlertCircle className={`h-4 w-4 mt-1 ${
                    task.priority === 'high' ? 'text-destructive' :
                    task.priority === 'medium' ? 'text-warning' :
                    'text-muted-foreground'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{task.task}</p>
                    <p className="text-xs text-muted-foreground">{task.deadline}</p>
                  </div>
                  <Badge 
                    variant={task.priority === 'high' ? 'destructive' : 'secondary'}
                    className="text-xs"
                  >
                    {task.priority}
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
            Your complete teaching timetable for this week
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TimetableView 
            slots={teacherSlots} 
            isLoading={isLoading}
            showFilters={false}
            userRole="teacher"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default TeacherDashboardPage;