import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PageHeader from '../../components/layout/PageHeader';
import TimetableView from '../../components/timetable/TimetableView';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { loadTimetableData } from '../../features/timetable/timetableSlice';
import type { RootState, AppDispatch } from '../../app/store';

const SchedulePage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { timetableSlots, isLoading } = useSelector((state: RootState) => state.timetable);

  useEffect(() => {
    dispatch(loadTimetableData({}));
  }, [dispatch]);

  // Filter student's schedule
  const studentSchedule = timetableSlots.filter(slot => 
    slot.studentGroups.includes('CS-2A') || slot.studentGroups.includes('CS-3A')
  );

  const todayClasses = studentSchedule.filter(slot => {
    const today = new Date().getDay();
    return slot.dayOfWeek === (today === 0 ? 6 : today - 1); // Convert Sunday=0 to Monday=0 format
  });

  const upcomingClasses = studentSchedule
    .filter(slot => {
      const today = new Date().getDay();
      const tomorrow = (today === 0 ? 6 : today - 1) + 1;
      return slot.dayOfWeek === tomorrow % 7;
    })
    .slice(0, 3);

  return (
    <div className="space-y-6">
      <PageHeader 
        title="My Schedule" 
        subtitle="View your complete class schedule"
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
                  className="flex items-center justify-between p-3 rounded-lg border bg-card"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-primary"></div>
                    <div>
                      <h3 className="font-medium">{slot.courseName}</h3>
                      <p className="text-sm text-muted-foreground">{slot.courseCode}</p>
                    </div>
                  </div>
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
          <CardTitle>Upcoming Classes</CardTitle>
        </CardHeader>
        <CardContent>
          {upcomingClasses.length > 0 ? (
            <div className="space-y-3">
              {upcomingClasses.map((slot) => (
                <div 
                  key={slot.id}
                  className="flex items-center justify-between p-3 rounded-lg border bg-card"
                >
                  <div className="flex items-center gap-3">
                    <Badge variant="outline">Tomorrow</Badge>
                    <div>
                      <h3 className="font-medium">{slot.courseName}</h3>
                      <p className="text-sm text-muted-foreground">with {slot.teacherName}</p>
                    </div>
                  </div>
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
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-4">No upcoming classes</p>
          )}
        </CardContent>
      </Card>

      {/* Full Schedule */}
      <Card>
        <CardHeader>
          <CardTitle>Complete Weekly Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <TimetableView 
            slots={studentSchedule}
            showFilters={true}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default SchedulePage;