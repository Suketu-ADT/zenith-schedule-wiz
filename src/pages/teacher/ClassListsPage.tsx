import { useState } from 'react';
import { Search, Users, Download, Mail, Phone, Filter, UserCheck, UserX } from 'lucide-react';
import PageHeader from '../../components/layout/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';

const ClassListsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('all');

  // Mock student data for different courses
  const courses = ['all', 'CS201', 'CS401', 'CS501'];
  
  const students = [
    {
      id: '1',
      name: 'Aarav Sharma',
      email: 'aarav.sharma@college.edu',
      studentId: 'CS21B001',
      phone: '+91 98765 43210',
      course: 'CS201',
      courseName: 'Data Structures',
      section: 'A',
      semester: '4th',
      attendance: 92,
      averageGrade: 'A-',
      assignments: { submitted: 8, total: 10 },
      lastLogin: '2024-03-15 10:30',
      status: 'active',
    },
    {
      id: '2',
      name: 'Diya Patel',
      email: 'diya.patel@college.edu',
      studentId: 'CS21B002',
      phone: '+91 87654 32109',
      course: 'CS201',
      courseName: 'Data Structures',
      section: 'A',
      semester: '4th',
      attendance: 88,
      averageGrade: 'B+',
      assignments: { submitted: 9, total: 10 },
      lastLogin: '2024-03-15 14:20',
      status: 'active',
    },
    {
      id: '3',
      name: 'Rohan Gupta',
      email: 'rohan.gupta@college.edu',
      studentId: 'CS21B003',
      phone: '+91 76543 21098',
      course: 'CS401',
      courseName: 'Advanced Database',
      section: 'B',
      semester: '6th',
      attendance: 75,
      averageGrade: 'B',
      assignments: { submitted: 6, total: 8 },
      lastLogin: '2024-03-14 16:45',
      status: 'active',
    },
    {
      id: '4',
      name: 'Priya Singh',
      email: 'priya.singh@college.edu',
      studentId: 'CS21B004',
      phone: '+91 65432 10987',
      course: 'CS401',
      courseName: 'Advanced Database',
      section: 'B',
      semester: '6th',
      attendance: 95,
      averageGrade: 'A',
      assignments: { submitted: 8, total: 8 },
      lastLogin: '2024-03-15 09:15',
      status: 'active',
    },
    {
      id: '5',
      name: 'Arjun Mehta',
      email: 'arjun.mehta@college.edu',
      studentId: 'CS21B005',
      phone: '+91 54321 09876',
      course: 'CS501',
      courseName: 'Machine Learning',
      section: 'A',
      semester: '8th',
      attendance: 82,
      averageGrade: 'B+',
      assignments: { submitted: 5, total: 6 },
      lastLogin: '2024-03-13 12:30',
      status: 'inactive',
    },
    {
      id: '6',
      name: 'Kavya Reddy',
      email: 'kavya.reddy@college.edu',
      studentId: 'CS21B006',
      phone: '+91 43210 98765',
      course: 'CS501',
      courseName: 'Machine Learning',
      section: 'A',
      semester: '8th',
      attendance: 98,
      averageGrade: 'A+',
      assignments: { submitted: 6, total: 6 },
      lastLogin: '2024-03-15 11:45',
      status: 'active',
    },
  ];

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCourse = selectedCourse === 'all' || student.course === selectedCourse;
    return matchesSearch && matchesCourse;
  });

  const activeStudents = filteredStudents.filter(s => s.status === 'active');
  const inactiveStudents = filteredStudents.filter(s => s.status === 'inactive');

  const getAttendanceColor = (attendance: number) => {
    if (attendance >= 90) return 'text-green-600';
    if (attendance >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return 'bg-green-100 text-green-800';
    if (grade.startsWith('B')) return 'bg-blue-100 text-blue-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Class Lists" 
        subtitle="Manage your students and track their progress"
        actions={
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline">
              <Mail className="h-4 w-4 mr-2" />
              Send Email
            </Button>
          </div>
        }
      />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedCourse} onValueChange={setSelectedCourse}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by course" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Courses</SelectItem>
            <SelectItem value="CS201">CS201 - Data Structures</SelectItem>
            <SelectItem value="CS401">CS401 - Advanced Database</SelectItem>
            <SelectItem value="CS501">CS501 - Machine Learning</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{filteredStudents.length}</p>
                <p className="text-sm text-muted-foreground">Total Students</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{activeStudents.length}</p>
                <p className="text-sm text-muted-foreground">Active Students</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <UserX className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">{inactiveStudents.length}</p>
                <p className="text-sm text-muted-foreground">Low Activity</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></div>
              <div>
                <p className="text-2xl font-bold">
                  {Math.round(filteredStudents.reduce((acc, s) => acc + s.attendance, 0) / filteredStudents.length)}%
                </p>
                <p className="text-sm text-muted-foreground">Avg Attendance</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All Students ({filteredStudents.length})</TabsTrigger>
          <TabsTrigger value="active">Active ({activeStudents.length})</TabsTrigger>
          <TabsTrigger value="inactive">Low Activity ({inactiveStudents.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>Student List</CardTitle>
              <CardDescription>Complete list of students in your courses</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Course</TableHead>
                    <TableHead>Attendance</TableHead>
                    <TableHead>Grade</TableHead>
                    <TableHead>Assignments</TableHead>
                    <TableHead>Last Active</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src="" />
                            <AvatarFallback>{student.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{student.name}</p>
                            <p className="text-sm text-muted-foreground">{student.studentId}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{student.course}</p>
                          <p className="text-sm text-muted-foreground">{student.courseName}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`font-medium ${getAttendanceColor(student.attendance)}`}>
                          {student.attendance}%
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={getGradeColor(student.averageGrade)}>
                          {student.averageGrade}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">
                          {student.assignments.submitted}/{student.assignments.total}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {new Date(student.lastLogin).toLocaleDateString('en-IN')}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm">
                            <Mail className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Phone className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="active">
          <Card>
            <CardHeader>
              <CardTitle>Active Students</CardTitle>
              <CardDescription>Students with regular activity and good attendance</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Course</TableHead>
                    <TableHead>Attendance</TableHead>
                    <TableHead>Grade</TableHead>
                    <TableHead>Last Active</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeStudents.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src="" />
                            <AvatarFallback>{student.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{student.name}</p>
                            <p className="text-sm text-muted-foreground">{student.studentId}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{student.course}</TableCell>
                      <TableCell>
                        <span className={`font-medium ${getAttendanceColor(student.attendance)}`}>
                          {student.attendance}%
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={getGradeColor(student.averageGrade)}>
                          {student.averageGrade}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {new Date(student.lastLogin).toLocaleDateString('en-IN')}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inactive">
          <Card>
            <CardHeader>
              <CardTitle>Students Needing Attention</CardTitle>
              <CardDescription>Students with low activity or attendance concerns</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Course</TableHead>
                    <TableHead>Attendance</TableHead>
                    <TableHead>Grade</TableHead>
                    <TableHead>Last Active</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inactiveStudents.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src="" />
                            <AvatarFallback>{student.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{student.name}</p>
                            <p className="text-sm text-muted-foreground">{student.studentId}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{student.course}</TableCell>
                      <TableCell>
                        <span className={`font-medium ${getAttendanceColor(student.attendance)}`}>
                          {student.attendance}%
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={getGradeColor(student.averageGrade)}>
                          {student.averageGrade}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {new Date(student.lastLogin).toLocaleDateString('en-IN')}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          <Mail className="h-4 w-4 mr-1" />
                          Contact
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClassListsPage;