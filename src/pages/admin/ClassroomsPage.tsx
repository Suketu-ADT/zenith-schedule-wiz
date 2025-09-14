import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, MapPin } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import PageHeader from '../../components/layout/PageHeader';
import DataTable from '../../components/common/DataTable';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../components/ui/form';
import { Input } from '../../components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { Badge } from '../../components/ui/badge';
import { useToast } from '../../hooks/use-toast';
import { addClassroom, removeClassroom } from '../../features/timetable/timetableSlice';
import type { RootState, AppDispatch } from '../../app/store';
import type { Classroom, Column } from '../../types';

const classroomSchema = z.object({
  name: z.string().min(2, 'Classroom name must be at least 2 characters'),
  capacity: z.number().min(1, 'Capacity must be at least 1'),
  type: z.enum(['lecture', 'lab', 'seminar']),
  building: z.string().min(1, 'Building is required'),
  floor: z.number().min(0, 'Floor cannot be negative'),
});

type ClassroomFormData = z.infer<typeof classroomSchema>;

const ClassroomsPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();
  const { activeConfig } = useSelector((state: RootState) => state.timetable);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);

  const form = useForm<ClassroomFormData>({
    resolver: zodResolver(classroomSchema),
    defaultValues: {
      name: '',
      capacity: 30,
      type: 'lecture',
      building: '',
      floor: 1,
    },
  });

  // Mock initial data
  useEffect(() => {
    const mockClassrooms: Classroom[] = [
      {
        id: '1',
        name: 'Room A101',
        capacity: 50,
        type: 'lecture',
        building: 'Academic Block A',
        floor: 1,
      },
      {
        id: '2',
        name: 'Lab B201',
        capacity: 30,
        type: 'lab',
        building: 'Engineering Block B',
        floor: 2,
      },
      {
        id: '3',
        name: 'Seminar Hall C301',
        capacity: 25,
        type: 'seminar',
        building: 'Administrative Block C',
        floor: 3,
      },
    ];
    setClassrooms(mockClassrooms);
  }, []);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'lecture':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'lab':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'seminar':
        return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  const columns: Column<Classroom>[] = [
    {
      key: 'name',
      label: 'Room Name',
      width: '150px',
    },
    {
      key: 'type',
      label: 'Type',
      width: '100px',
      render: (type: string) => (
        <Badge variant="outline" className={getTypeColor(type)}>
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </Badge>
      ),
    },
    {
      key: 'capacity',
      label: 'Capacity',
      width: '100px',
      render: (capacity: number) => (
        <span className="font-medium">{capacity} seats</span>
      ),
    },
    {
      key: 'building',
      label: 'Building',
      width: '200px',
    },
    {
      key: 'floor',
      label: 'Floor',
      width: '80px',
      render: (floor: number) => (
        <Badge variant="secondary">{floor}</Badge>
      ),
    },
  ];

  const onSubmit = (data: ClassroomFormData) => {
    const newClassroom: Classroom = {
      id: crypto.randomUUID(),
      ...data,
    };

    setClassrooms(prev => [...prev, newClassroom]);
    dispatch(addClassroom(newClassroom));
    
    toast({
      title: 'Classroom Added',
      description: `${data.name} has been added successfully.`,
    });

    form.reset();
    setIsDialogOpen(false);
  };

  const handleEdit = (classroom: Classroom) => {
    form.setValue('name', classroom.name);
    form.setValue('capacity', classroom.capacity);
    form.setValue('type', classroom.type);
    form.setValue('building', classroom.building);
    form.setValue('floor', classroom.floor);
    setIsDialogOpen(true);
  };

  const handleDelete = (classroom: Classroom) => {
    setClassrooms(prev => prev.filter(c => c.id !== classroom.id));
    dispatch(removeClassroom(classroom.id));
    
    toast({
      title: 'Classroom Removed',
      description: `${classroom.name} has been removed.`,
      variant: 'destructive',
    });
  };

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Classrooms Management"
        subtitle="Manage physical learning spaces and their configurations"
        actions={
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Classroom
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Classroom</DialogTitle>
                <DialogDescription>
                  Enter the classroom details to add it to the facility inventory.
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Room Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Room A101" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Room Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select room type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="lecture">Lecture Hall</SelectItem>
                            <SelectItem value="lab">Laboratory</SelectItem>
                            <SelectItem value="seminar">Seminar Room</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="capacity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Seating Capacity</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="1" 
                            placeholder="30" 
                            {...field} 
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 30)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="building"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Building</FormLabel>
                        <FormControl>
                          <Input placeholder="Academic Block A" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="floor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Floor</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="0" 
                            placeholder="1" 
                            {...field} 
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">Add Classroom</Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Facility Inventory ({classrooms.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={classrooms}
            columns={columns}
            onEdit={handleEdit}
            onDelete={handleDelete}
            emptyMessage="No classrooms found. Add your first classroom to get started."
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ClassroomsPage;