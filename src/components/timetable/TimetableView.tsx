import { useState } from 'react';
import { AlertTriangle, Clock, MapPin, Users } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Card, CardContent } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';
import EmptyState from '../common/EmptyState';
import type { TimetableSlot } from '../../types';

interface TimetableViewProps {
  slots: TimetableSlot[];
  isLoading?: boolean;
  showFilters?: boolean;
  userRole?: string;
}

const days = [
  'Monday',
  'Tuesday', 
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday'
];

const timeSlots = [
  '08:00', '09:00', '10:00', '11:00', '12:00', 
  '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
];

const TimetableView: React.FC<TimetableViewProps> = ({
  slots,
  isLoading = false,
  showFilters = true,
  userRole,
}) => {
  const [selectedTeacher, setSelectedTeacher] = useState<string>('all');
  const [selectedClassroom, setSelectedClassroom] = useState<string>('all');
  const [selectedGroup, setSelectedGroup] = useState<string>('all');

  // Filter slots based on selections
  const filteredSlots = slots.filter(slot => {
    if (selectedTeacher !== 'all' && slot.teacherId !== selectedTeacher) return false;
    if (selectedClassroom !== 'all' && slot.classroomId !== selectedClassroom) return false;
    if (selectedGroup !== 'all' && !slot.studentGroups.includes(selectedGroup)) return false;
    return true;
  });

  // Get unique values for filters
  const teachers = Array.from(new Set(slots.map(s => ({ id: s.teacherId, name: s.teacherName }))));
  const classrooms = Array.from(new Set(slots.map(s => ({ id: s.classroomId, name: s.classroomName }))));
  const groups = Array.from(new Set(slots.flatMap(s => s.studentGroups)));

  // Organize slots by day and time
  const getTimetableGrid = () => {
    const grid: { [key: string]: TimetableSlot | null } = {};
    
    filteredSlots.forEach(slot => {
      const key = `${slot.dayOfWeek}-${slot.startTime}`;
      grid[key] = slot;
    });

    return grid;
  };

  const timetableGrid = getTimetableGrid();

  const getSlotForTimeAndDay = (dayIndex: number, time: string) => {
    return timetableGrid[`${dayIndex}-${time}`];
  };

  const renderSlotCard = (slot: TimetableSlot) => {
    const hasConflicts = slot.conflicts && slot.conflicts.length > 0;
    
    return (
      <TooltipProvider key={slot.id}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Card className={`timetable-slot ${hasConflicts ? 'conflict' : ''}`}>
              <CardContent className="p-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge 
                      variant="secondary" 
                      className="text-xs font-medium"
                      style={{ backgroundColor: '#3B82F6', color: 'white' }}
                    >
                      {slot.courseCode}
                    </Badge>
                    {hasConflicts && (
                      <AlertTriangle className="h-4 w-4 text-destructive" />
                    )}
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-sm leading-tight">{slot.courseName}</h4>
                    <p className="text-xs text-muted-foreground">{slot.teacherName}</p>
                  </div>

                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    {slot.classroomName}
                  </div>

                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {slot.startTime} - {slot.endTime}
                  </div>

                  {slot.studentGroups.length > 0 && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Users className="h-3 w-3" />
                      {slot.studentGroups.join(', ')}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TooltipTrigger>
          <TooltipContent className="max-w-sm">
            <div className="space-y-2">
              <div>
                <strong>{slot.courseName} ({slot.courseCode})</strong>
              </div>
              <div>Teacher: {slot.teacherName}</div>
              <div>Classroom: {slot.classroomName}</div>
              <div>Time: {slot.startTime} - {slot.endTime}</div>
              <div>Groups: {slot.studentGroups.join(', ')}</div>
              {hasConflicts && (
                <div className="text-destructive">
                  <strong>Conflicts:</strong>
                  <ul className="list-disc list-inside">
                    {slot.conflicts?.map((conflict, index) => (
                      <li key={index}>{conflict.message}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading timetable...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      {showFilters && (
        <div className="flex flex-wrap gap-4">
          <Select value={selectedTeacher} onValueChange={setSelectedTeacher}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by teacher" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Teachers</SelectItem>
              {teachers.map(teacher => (
                <SelectItem key={teacher.id} value={teacher.id}>
                  {teacher.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedClassroom} onValueChange={setSelectedClassroom}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by classroom" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Classrooms</SelectItem>
              {classrooms.map(classroom => (
                <SelectItem key={classroom.id} value={classroom.id}>
                  {classroom.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedGroup} onValueChange={setSelectedGroup}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by group" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Groups</SelectItem>
              {groups.map(group => (
                <SelectItem key={group} value={group}>
                  {group}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Timetable Grid */}
      {filteredSlots.length === 0 ? (
        <EmptyState
          icon={Clock}
          title="No classes scheduled"
          description="No classes match your current filter criteria or no timetable has been generated yet."
        />
      ) : (
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <div className="grid grid-cols-8 gap-0">
            {/* Header row */}
            <div className="data-table-header p-3 border-b border-border">
              <span className="text-sm font-medium">Time</span>
            </div>
            {days.slice(0, 7).map(day => (
              <div key={day} className="data-table-header p-3 border-b border-border border-l border-border">
                <span className="text-sm font-medium">{day}</span>
              </div>
            ))}

            {/* Time slots rows */}
            {timeSlots.map(time => (
              <div key={time} className="contents">
                <div className="data-table-header p-3 border-b border-border">
                  <span className="text-sm font-medium">{time}</span>
                </div>
                {days.slice(0, 7).map((day, dayIndex) => {
                  const slot = getSlotForTimeAndDay(dayIndex, time);
                  return (
                    <div 
                      key={`${day}-${time}`} 
                      className="p-2 border-b border-l border-border min-h-[80px]"
                    >
                      {slot ? renderSlotCard(slot) : null}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TimetableView;