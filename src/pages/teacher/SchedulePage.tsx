import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PageHeader from '../../components/layout/PageHeader';
import TimetableView from '../../components/timetable/TimetableView';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';
import { loadTimetableData } from '../../features/timetable/timetableSlice';
import type { RootState, AppDispatch } from '../../app/store';

const SchedulePage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { timetableSlots, isLoading } = useSelector((state: RootState) => state.timetable);

  useEffect(() => {
    dispatch(loadTimetableData({}));
  }, [dispatch]);

  // Filter teacher's schedule
  const teacherSchedule = timetableSlots.filter(slot => 
    slot.teacherName === 'Prof. Rajesh Kumar'
  );

  const todayClasses = teacherSchedule.filter(slot => {
    const today = new Date().getDay();
    return slot.dayOfWeek === (today === 0 ? 6 : today - 1);
  });

  const upcomingClasses = teacherSchedule
    .filter(slot => {
      const today = new Date().getDay();
      const tomorrow = (today === 0 ? 6 : today - 1) + 1;
      return slot.dayOfWeek === tomorrow % 7;
    })
    .slice(0, 3);

  return (
    <div className="space-y-6">
      <PageHeader 
        title="My Teaching Schedule" 
        subtitle="View your complete teaching schedule and upcoming classes"
      />

      {/* Today's Classes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Today's Classes
          </CardTitle>
        </CardHeader>
        <CardContent>
          {todayClasses.length > 0 ? (
            <div className="space-y-3">
              {todayClasses.map((slot) => (
                <div 
                  key={slot.id}
                  className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-primary"></div>
                    <div>
                      <h3 className="font-medium">{slot.courseName}</h3>
                      <p className="text-sm text-muted-foreground">{slot.courseCode}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-sm">
                        <Clock className="h-4 w-4" />
                        {slot.startTime} - {slot.endTime}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        {slot.classroomName}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-sm">
                        <Users className="h-4 w-4" />
                        {slot.studentGroups.join(', ')}
                      </div>
                      <Badge variant="outline" className="mt-1">
                        {slot.duration} min
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-4">No classes scheduled for today</p>
          )}
        </CardContent>
      </Card>

      {/* Upcoming Classes */}
      <Card>
        <CardHeader>
          <CardTitle>Tomorrow's Classes</CardTitle>
        </CardHeader>
        <CardContent>
          {upcomingClasses.length > 0 ? (
            <div className="space-y-3">
              {upcomingClasses.map((slot) => (
                <div 
                  key={slot.id}
                  className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Badge variant="outline">Tomorrow</Badge>
                    <div>
                      <h3 className="font-medium">{slot.courseName}</h3>
                      <p className="text-sm text-muted-foreground">{slot.courseCode}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-sm">
                        <Clock className="h-4 w-4" />
                        {slot.startTime} - {slot.endTime}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        {slot.classroomName}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-sm">
                        <Users className="h-4 w-4" />
                        {slot.studentGroups.join(', ')}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-4">No classes scheduled for tomorrow</p>
          )}
        </CardContent>
      </Card>

      {/* Weekly Schedule */}
      <Card>
        <CardHeader>
          <CardTitle>Complete Weekly Schedule</CardTitle>
          <CardDescription>View your entire teaching schedule for the week</CardDescription>
        </CardHeader>
        <CardContent>
          <TimetableView 
            slots={teacherSchedule}
            showFilters={true}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default SchedulePage;