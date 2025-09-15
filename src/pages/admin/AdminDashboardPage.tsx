import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { 
  Users, 
  BookOpen, 
  Building, 
  Calendar,
  TrendingUp,
  AlertTriangle,
  Clock,
  UserCheck
} from 'lucide-react';
import PageHeader from '../../components/layout/PageHeader';
import StatCard from '../../components/common/StatCard';
import TimetableView from '../../components/timetable/TimetableView';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { loadTimetableData } from '../../features/timetable/timetableSlice';
import type { RootState, AppDispatch } from '../../app/store';

const AdminDashboardPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { timetableSlots, stats, isLoading } = useSelector((state: RootState) => state.timetable);

  useEffect(() => {
    dispatch(loadTimetableData('admin'));
  }, [dispatch]);

  // Get today's classes
  const today = new Date().getDay(); // 0 = Sunday, 1 = Monday, etc.
  const todaySlots = timetableSlots.filter(slot => slot.dayOfWeek === (today === 0 ? 6 : today - 1));

  const statsData = [
    {
      title: 'Total Students',
      value: stats?.totalStudents || 0,
      icon: Users,
      description: 'Active enrollments',
      trend: { value: 12, isPositive: true },
      color: 'text-blue-600',
    },
    {
      title: 'Active Courses',
      value: stats?.totalCourses || 0,
      icon: BookOpen,
      description: 'This semester',
      trend: { value: 3, isPositive: true },
      color: 'text-green-600',
    },
    {
      title: 'Teaching Staff',
      value: stats?.totalTeachers || 0,
      icon: UserCheck,
      description: 'Faculty members',
      trend: { value: 5, isPositive: true },
      color: 'text-purple-600',
    },
    {
      title: 'Classrooms',
      value: stats?.totalClassrooms || 0,
      icon: Building,
      description: 'Available rooms',
      color: 'text-orange-600',
    },
    {
      title: 'Utilization Rate',
      value: `${stats?.utilizationRate || 0}%`,
      icon: TrendingUp,
      description: 'Resource efficiency',
      trend: { value: 8, isPositive: true },
      color: 'text-indigo-600',
    },
    {
      title: 'Conflicts',
      value: stats?.conflictCount || 0,
      icon: AlertTriangle,
      description: 'Requires attention',
      color: 'text-red-600',
    },
  ];

  const recentActivities = [
    {
      action: 'New timetable generated',
      time: '2 hours ago',
      user: 'System',
      status: 'success',
    },
    {
      action: 'Course CS301 updated',
      time: '4 hours ago',
      user: 'Dr. Sarah Johnson',
      status: 'info',
    },
    {
      action: 'Classroom B201 added',
      time: '1 day ago',
      user: 'Admin',
      status: 'success',
    },
    {
      action: 'Schedule conflict resolved',
      time: '2 days ago',
      user: 'Dr. Michael Chen',
      status: 'warning',
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title={`Welcome back, ${user?.name?.split(' ')[0] || 'Admin'}`}
        subtitle="Here's an overview of your institution's scheduling system"
        actions={
          stats ? (
            <Button asChild>
              <Link to="/admin/master-timetable">View Master Timetable</Link>
            </Button>
          ) : (
            <Button asChild>
              <Link to="/admin/create-timetable">Create New Timetable</Link>
            </Button>
          )
        }
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statsData.map((stat) => {
          const getStatLink = (title: string) => {
            switch (title) {
              case 'Total Students': return '/admin/students';
              case 'Active Courses': return '/admin/courses';
              case 'Teaching Staff': return '/admin/teachers';
              case 'Classrooms': return '/admin/classrooms';
              default: return '#';
            }
          };

          const statLink = getStatLink(stat.title);
          const isClickable = statLink !== '#';

          return isClickable ? (
            <Link key={stat.title} to={statLink} className="block">
              <StatCard
                title={stat.title}
                value={stat.value}
                icon={stat.icon}
                description={stat.description}
                trend={stat.trend}
                color={stat.color}
              />
            </Link>
          ) : (
            <StatCard
              key={stat.title}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              description={stat.description}
              trend={stat.trend}
              color={stat.color}
            />
          );
        })}
      </div>

      {/* Today's Schedule Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Today's Schedule Preview
          </CardTitle>
          <CardDescription>
            Classes scheduled for today, {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TimetableView 
            slots={todaySlots} 
            isLoading={isLoading}
            showFilters={false}
            userRole="admin"
          />
        </CardContent>
      </Card>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>
              Latest system and user activities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.status === 'success' ? 'bg-success' :
                    activity.status === 'warning' ? 'bg-warning' :
                    'bg-primary'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{activity.time}</span>
                      <span>•</span>
                      <span>{activity.user}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common administrative tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3">
              <Button variant="outline" className="justify-start">
                <Calendar className="mr-2 h-4 w-4" />
                Create Timetable
              </Button>
              <Button variant="outline" className="justify-start">
                <Users className="mr-2 h-4 w-4" />
                Manage Students
              </Button>
              <Button variant="outline" className="justify-start">
                <BookOpen className="mr-2 h-4 w-4" />
                Add Course
              </Button>
              <Button variant="outline" className="justify-start">
                <Building className="mr-2 h-4 w-4" />
                Add Classroom
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* System Status */}
        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
            <CardDescription>
              Current system health
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Timetable Generator</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-success"></div>
                  <span className="text-xs text-muted-foreground">Online</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Database</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-success"></div>
                  <span className="text-xs text-muted-foreground">Healthy</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Last Backup</span>
                <span className="text-xs text-muted-foreground">2 hours ago</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Next Maintenance</span>
                <span className="text-xs text-muted-foreground">Sunday 2:00 AM</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Current Timetable Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Current Timetable Overview</CardTitle>
          <CardDescription>
            Master schedule for all classes and resources
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TimetableView 
            slots={timetableSlots} 
            isLoading={isLoading}
            showFilters={true}
            userRole="admin"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboardPage;