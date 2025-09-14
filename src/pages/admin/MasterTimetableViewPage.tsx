import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Calendar, Download, Printer, Filter } from 'lucide-react';
import PageHeader from '../../components/layout/PageHeader';
import TimetableView from '../../components/timetable/TimetableView';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { loadTimetableData } from '../../features/timetable/timetableSlice';
import type { RootState, AppDispatch } from '../../app/store';

const MasterTimetableViewPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { timetableSlots, stats, isLoading } = useSelector((state: RootState) => state.timetable);

  useEffect(() => {
    dispatch(loadTimetableData('admin'));
  }, [dispatch]);

  const handleExport = () => {
    // Mock export functionality
    console.log('Exporting timetable...');
  };

  const handlePrint = () => {
    // Mock print functionality
    window.print();
  };

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Master Timetable"
        subtitle="Complete institutional schedule with all classes and resources"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={handlePrint}>
              <Printer className="mr-2 h-4 w-4" />
              Print
            </Button>
            <Button variant="outline" onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        }
      />

      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-primary">{stats.totalCourses}</p>
              <p className="text-sm text-muted-foreground">Total Courses</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-primary">{stats.totalTeachers}</p>
              <p className="text-sm text-muted-foreground">Active Teachers</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-primary">{stats.totalClassrooms}</p>
              <p className="text-sm text-muted-foreground">Available Rooms</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-primary">{stats.totalStudents}</p>
              <p className="text-sm text-muted-foreground">Enrolled Students</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-primary">{stats.utilizationRate}%</p>
              <p className="text-sm text-muted-foreground">Utilization</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className={`text-2xl font-bold ${stats.conflictCount > 0 ? 'text-destructive' : 'text-success'}`}>
                {stats.conflictCount}
              </p>
              <p className="text-sm text-muted-foreground">Conflicts</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Master Timetable */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Complete Schedule View
          </CardTitle>
          <CardDescription>
            All classes, teachers, and resources in a unified timetable view
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

export default MasterTimetableViewPage;