import { useState } from 'react';
import { Calendar, Clock, MapPin, BookOpen, AlertTriangle, CheckCircle } from 'lucide-react';
import PageHeader from '../../components/layout/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Alert, AlertDescription } from '../../components/ui/alert';

const ExamSchedulePage = () => {
  const [selectedExam, setSelectedExam] = useState<string | null>(null);

  // Mock exam data
  const upcomingExams = [
    {
      id: '1',
      courseName: 'Data Structures and Algorithms',
      courseCode: 'CS201',
      examType: 'Mid-term',
      date: '2024-03-15',
      time: '10:00 AM - 12:00 PM',
      duration: 120,
      venue: 'Examination Hall A',
      instructor: 'Prof. Rajesh Kumar',
      syllabus: ['Arrays and Strings', 'Linked Lists', 'Stacks and Queues', 'Trees'],
      status: 'upcoming',
      seatingArrangement: 'Seat No: 45',
    },
    {
      id: '2',
      courseName: 'Database Management Systems',
      courseCode: 'CS301',
      examType: 'Final',
      date: '2024-03-22',
      time: '2:00 PM - 5:00 PM',
      duration: 180,
      venue: 'Computer Lab 1',
      instructor: 'Dr. Sunita Verma',
      syllabus: ['SQL Queries', 'Normalization', 'Transactions', 'Indexing'],
      status: 'upcoming',
      seatingArrangement: 'System No: 12',
    },
    {
      id: '3',
      courseName: 'Linear Algebra',
      courseCode: 'MATH201',
      examType: 'Mid-term',
      date: '2024-03-18',
      time: '9:00 AM - 11:00 AM',
      duration: 120,
      venue: 'Mathematics Block Room 201',
      instructor: 'Prof. Arjun Singh',
      syllabus: ['Matrix Operations', 'Eigenvalues', 'Vector Spaces', 'Linear Transformations'],
      status: 'upcoming',
      seatingArrangement: 'Seat No: 23',
    },
  ];

  const pastExams = [
    {
      id: '4',
      courseName: 'Programming Fundamentals',
      courseCode: 'CS101',
      examType: 'Final',
      date: '2024-02-28',
      time: '10:00 AM - 1:00 PM',
      duration: 180,
      venue: 'Computer Lab 2',
      instructor: 'Dr. Priya Mehta',
      status: 'completed',
      grade: 'A-',
      marks: '85/100',
    },
    {
      id: '5',
      courseName: 'Discrete Mathematics',
      courseCode: 'MATH101',
      examType: 'Mid-term',
      date: '2024-02-15',
      time: '2:00 PM - 4:00 PM',
      duration: 120,
      venue: 'Examination Hall B',
      instructor: 'Prof. Vikram Sharma',
      status: 'completed',
      grade: 'B+',
      marks: '78/100',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'default';
      case 'completed':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getDaysUntilExam = (examDate: string) => {
    const today = new Date();
    const exam = new Date(examDate);
    const diffTime = exam.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Exam Schedule" 
        subtitle="View your upcoming and past examinations"
      />

      {/* Alert for upcoming exams */}
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          You have {upcomingExams.length} upcoming exams. Make sure to check the schedule and prepare accordingly.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upcoming">Upcoming Exams ({upcomingExams.length})</TabsTrigger>
          <TabsTrigger value="past">Past Exams ({pastExams.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          <div className="grid gap-4">
            {upcomingExams.map((exam) => {
              const daysUntil = getDaysUntilExam(exam.date);
              return (
                <Card key={exam.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <BookOpen className="h-5 w-5" />
                          {exam.courseName}
                        </CardTitle>
                        <CardDescription>
                          {exam.courseCode} • {exam.examType} Examination
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        <Badge variant={daysUntil <= 3 ? 'destructive' : 'default'}>
                          {daysUntil === 0 ? 'Today' : daysUntil === 1 ? 'Tomorrow' : `${daysUntil} days`}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4" />
                          {formatDate(exam.date)}
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-4 w-4" />
                          {exam.time} ({exam.duration} minutes)
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-4 w-4" />
                          {exam.venue}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm">
                          <span className="font-medium">Instructor:</span> {exam.instructor}
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">Seating:</span> {exam.seatingArrangement}
                        </p>
                      </div>
                    </div>

                    {exam.syllabus && (
                      <div>
                        <p className="text-sm font-medium mb-2">Syllabus Coverage:</p>
                        <div className="flex flex-wrap gap-2">
                          {exam.syllabus.map((topic, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {topic}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Download Admit Card
                      </Button>
                      <Button variant="outline" size="sm">
                        Study Materials
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="past" className="space-y-4">
          <div className="grid gap-4">
            {pastExams.map((exam) => (
              <Card key={exam.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        {exam.courseName}
                      </CardTitle>
                      <CardDescription>
                        {exam.courseCode} • {exam.examType} Examination
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary">{exam.grade}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4" />
                        {formatDate(exam.date)}
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4" />
                        {exam.time} ({exam.duration} minutes)
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4" />
                        {exam.venue}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm">
                        <span className="font-medium">Instructor:</span> {exam.instructor}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Marks:</span> {exam.marks}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      View Answer Sheet
                    </Button>
                    <Button variant="outline" size="sm">
                      Download Certificate
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

export default ExamSchedulePage;