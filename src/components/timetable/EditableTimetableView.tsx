import React, { useState } from 'react';
import { Edit2, Trash2, Plus, Save, X, Clock, MapPin, Users, AlertTriangle } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Label } from '../ui/label';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';
import { useToast } from '../../hooks/use-toast';
import EmptyState from '../common/EmptyState';
import type { TimetableSlot, Course, Teacher, Classroom } from '../../types';

interface EditableTimetableViewProps {
  slots: TimetableSlot[];
  courses: Course[];
  teachers: Teacher[];
  classrooms: Classroom[];
  onUpdateSlot: (slot: TimetableSlot) => void;
  onDeleteSlot: (slotId: string) => void;
  onAddSlot: (slot: Omit<TimetableSlot, 'id'>) => void;
  isLoading?: boolean;
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

const EditableTimetableView: React.FC<EditableTimetableViewProps> = ({
  slots,
  courses,
  teachers,
  classrooms,
  onUpdateSlot,
  onDeleteSlot,
  onAddSlot,
  isLoading = false,
}) => {
  const [editingSlot, setEditingSlot] = useState<string | null>(null);
  const [editingData, setEditingData] = useState<Partial<TimetableSlot>>({});
  const [draggedSlot, setDraggedSlot] = useState<TimetableSlot | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [addSlotData, setAddSlotData] = useState({
    dayOfWeek: 0,
    startTime: '09:00',
    endTime: '10:00',
    courseId: '',
    teacherId: '',
    classroomId: '',
    studentGroups: ['Group A']
  });
  const { toast } = useToast();

  // Organize slots by day and time
  const getTimetableGrid = () => {
    const grid: { [key: string]: TimetableSlot | null } = {};
    
    slots.forEach(slot => {
      const key = `${slot.dayOfWeek}-${slot.startTime}`;
      grid[key] = slot;
    });

    return grid;
  };

  const timetableGrid = getTimetableGrid();

  const getSlotForTimeAndDay = (dayIndex: number, time: string) => {
    return timetableGrid[`${dayIndex}-${time}`];
  };

  const handleEditSlot = (slot: TimetableSlot) => {
    setEditingSlot(slot.id);
    setEditingData(slot);
  };

  const handleSaveEdit = () => {
    if (editingSlot && editingData) {
      const course = courses.find(c => c.id === editingData.courseId);
      const teacher = teachers.find(t => t.id === editingData.teacherId);
      const classroom = classrooms.find(c => c.id === editingData.classroomId);

      if (course && teacher && classroom) {
        const updatedSlot: TimetableSlot = {
          ...editingData as TimetableSlot,
          courseName: course.name,
          courseCode: course.code,
          teacherName: teacher.name,
          classroomName: classroom.name,
        };
        onUpdateSlot(updatedSlot);
        setEditingSlot(null);
        setEditingData({});
        toast({
          title: 'Slot updated',
          description: 'The class has been updated successfully.',
        });
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingSlot(null);
    setEditingData({});
  };

  const handleDeleteSlot = (slotId: string) => {
    onDeleteSlot(slotId);
    toast({
      title: 'Slot deleted',
      description: 'The class has been removed from the timetable.',
    });
  };

  const handleDragStart = (e: React.DragEvent, slot: TimetableSlot) => {
    setDraggedSlot(slot);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, dayIndex: number, time: string) => {
    e.preventDefault();
    if (draggedSlot) {
      const existingSlot = getSlotForTimeAndDay(dayIndex, time);
      if (!existingSlot) {
        const endTimeIndex = timeSlots.indexOf(time) + 1;
        const endTime = endTimeIndex < timeSlots.length ? timeSlots[endTimeIndex] : '19:00';
        
        const updatedSlot = {
          ...draggedSlot,
          dayOfWeek: dayIndex,
          startTime: time,
          endTime: endTime
        };
        onUpdateSlot(updatedSlot);
        toast({
          title: 'Class moved',
          description: `Moved to ${days[dayIndex]} at ${time}`,
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Cannot move',
          description: 'Time slot is already occupied',
        });
      }
      setDraggedSlot(null);
    }
  };

  const handleAddSlot = () => {
    const course = courses.find(c => c.id === addSlotData.courseId);
    const teacher = teachers.find(t => t.id === addSlotData.teacherId);
    const classroom = classrooms.find(c => c.id === addSlotData.classroomId);

    if (course && teacher && classroom) {
      const newSlot: Omit<TimetableSlot, 'id'> = {
        ...addSlotData,
        courseCode: course.code,
        courseName: course.name,
        teacherName: teacher.name,
        classroomName: classroom.name,
        duration: 60,
      };
      onAddSlot(newSlot);
      setShowAddDialog(false);
      setAddSlotData({
        dayOfWeek: 0,
        startTime: '09:00',
        endTime: '10:00',
        courseId: '',
        teacherId: '',
        classroomId: '',
        studentGroups: ['Group A']
      });
      toast({
        title: 'Slot added',
        description: 'New class has been added to the timetable.',
      });
    }
  };

  const renderSlotCard = (slot: TimetableSlot) => {
    const isEditing = editingSlot === slot.id;
    const hasConflicts = slot.conflicts && slot.conflicts.length > 0;
    
    if (isEditing) {
      return (
        <Card className="timetable-slot editing">
          <CardContent className="p-3">
            <div className="space-y-2">
              <Select 
                value={editingData.courseId} 
                onValueChange={(value) => setEditingData(prev => ({ ...prev, courseId: value }))}
              >
                <SelectTrigger className="h-8 bg-background">
                  <SelectValue placeholder="Select course" />
                </SelectTrigger>
                <SelectContent className="z-50 bg-background border border-border">
                  {courses.map(course => (
                    <SelectItem key={`course-${course.id}`} value={course.id}>
                      {course.code} - {course.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select 
                value={editingData.teacherId} 
                onValueChange={(value) => setEditingData(prev => ({ ...prev, teacherId: value }))}
              >
                <SelectTrigger className="h-8 bg-background">
                  <SelectValue placeholder="Select teacher" />
                </SelectTrigger>
                <SelectContent className="z-50 bg-background border border-border">
                  {teachers.map(teacher => (
                    <SelectItem key={`teacher-${teacher.id}`} value={teacher.id}>
                      {teacher.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select 
                value={editingData.classroomId} 
                onValueChange={(value) => setEditingData(prev => ({ ...prev, classroomId: value }))}
              >
                <SelectTrigger className="h-8 bg-background">
                  <SelectValue placeholder="Select classroom" />
                </SelectTrigger>
                <SelectContent className="z-50 bg-background border border-border">
                  {classrooms.map(classroom => (
                    <SelectItem key={`classroom-${classroom.id}`} value={classroom.id}>
                      {classroom.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex gap-1">
                <Button size="sm" onClick={handleSaveEdit} className="h-7 px-2">
                  <Save className="h-3 w-3" />
                </Button>
                <Button size="sm" variant="outline" onClick={handleCancelEdit} className="h-7 px-2">
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <TooltipProvider key={slot.id}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Card 
              className={`timetable-slot cursor-move ${hasConflicts ? 'conflict' : ''}`}
              draggable
              onDragStart={(e) => handleDragStart(e, slot)}
            >
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
                    <div className="flex gap-1">
                      {hasConflicts && (
                        <AlertTriangle className="h-3 w-3 text-destructive" />
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEditSlot(slot)}
                        className="h-5 w-5 p-0"
                      >
                        <Edit2 className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteSlot(slot.id)}
                        className="h-5 w-5 p-0 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
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
      {/* Action Bar */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Editable Timetable</h3>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Class
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Class</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Day</Label>
                <Select value={addSlotData.dayOfWeek.toString()} onValueChange={(value) => setAddSlotData(prev => ({ ...prev, dayOfWeek: parseInt(value) }))}>
                  <SelectTrigger className="bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="z-50 bg-background border border-border">
                    {days.slice(0, 7).map((day, index) => (
                      <SelectItem key={`day-${index}`} value={index.toString()}>
                        {day}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Time</Label>
                <Select value={addSlotData.startTime} onValueChange={(value) => setAddSlotData(prev => ({ ...prev, startTime: value }))}>
                  <SelectTrigger className="bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="z-50 bg-background border border-border">
                    {timeSlots.map(time => (
                      <SelectItem key={`time-${time}`} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Course</Label>
                <Select value={addSlotData.courseId} onValueChange={(value) => setAddSlotData(prev => ({ ...prev, courseId: value }))}>
                  <SelectTrigger className="bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="z-50 bg-background border border-border">
                    {courses.map(course => (
                      <SelectItem key={`add-course-${course.id}`} value={course.id}>
                        {course.code} - {course.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Teacher</Label>
                <Select value={addSlotData.teacherId} onValueChange={(value) => setAddSlotData(prev => ({ ...prev, teacherId: value }))}>
                  <SelectTrigger className="bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="z-50 bg-background border border-border">
                    {teachers.map(teacher => (
                      <SelectItem key={`add-teacher-${teacher.id}`} value={teacher.id}>
                        {teacher.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Classroom</Label>
                <Select value={addSlotData.classroomId} onValueChange={(value) => setAddSlotData(prev => ({ ...prev, classroomId: value }))}>
                  <SelectTrigger className="bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="z-50 bg-background border border-border">
                    {classrooms.map(classroom => (
                      <SelectItem key={`add-classroom-${classroom.id}`} value={classroom.id}>
                        {classroom.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={handleAddSlot} className="w-full">
                Add Class
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Timetable Grid */}
      {slots.length === 0 ? (
        <EmptyState
          icon={Clock}
          title="No classes scheduled"
          description="Click 'Add Class' to start building your timetable."
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
                      key={`${day}-${time}-${dayIndex}`} 
                      className={`p-2 border-b border-l border-border min-h-[120px] transition-colors ${
                        draggedSlot ? 'hover:bg-muted/50' : ''
                      }`}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, dayIndex, time)}
                    >
                      {slot ? renderSlotCard(slot) : (
                        <div className="h-full flex items-center justify-center text-muted-foreground text-xs border-2 border-dashed border-muted rounded-md opacity-0 hover:opacity-100 transition-opacity">
                          {draggedSlot ? 'Drop here' : '+ Add class'}
                        </div>
                      )}
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

export default EditableTimetableView;