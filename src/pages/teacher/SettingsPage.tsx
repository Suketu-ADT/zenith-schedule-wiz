import { useState } from 'react';
import { useSelector } from 'react-redux';
import { User, Bell, Lock, Palette, Globe, Download, Mail, Phone, BookOpen, Clock } from 'lucide-react';
import PageHeader from '../../components/layout/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Switch } from '../../components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Textarea } from '../../components/ui/textarea';
import { useToast } from '../../hooks/use-toast';
import type { RootState } from '../../app/store';

const SettingsPage = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { toast } = useToast();
  
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '+91 98765 43210',
    employeeId: 'FAC001',
    department: 'Computer Science Engineering',
    designation: 'Associate Professor',
    specialization: 'Machine Learning, Data Structures',
    officeRoom: 'CS-201',
    officeHours: '10:00 AM - 12:00 PM, 2:00 PM - 4:00 PM',
    bio: 'Associate Professor with 8+ years of experience in Computer Science. Specializes in Machine Learning and Data Structures.',
  });

  const [teachingPreferences, setTeachingPreferences] = useState({
    maxClassesPerDay: '4',
    preferredTimeSlots: ['morning', 'afternoon'],
    blackoutDays: ['saturday'],
    labPreference: true,
    projectGuidanceSlots: '2',
    remoteTeaching: false,
  });

  const [notifications, setNotifications] = useState({
    classReminders: true,
    assignmentDeadlines: true,
    studentInquiries: true,
    scheduleChanges: true,
    gradeSubmissionReminders: true,
    emailNotifications: true,
    smsNotifications: false,
    weeklyReports: true,
  });

  const [systemPreferences, setSystemPreferences] = useState({
    theme: 'dark',
    language: 'english',
    timezone: 'Asia/Kolkata',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '12h',
    defaultGradingScale: 'percentage',
  });

  const handleSaveProfile = () => {
    toast({
      title: "Profile Updated",
      description: "Your profile information has been saved successfully.",
    });
  };

  const handleSaveTeachingPreferences = () => {
    toast({
      title: "Teaching Preferences Updated",
      description: "Your teaching preferences have been saved.",
    });
  };

  const handleSaveNotifications = () => {
    toast({
      title: "Notification Settings Updated",
      description: "Your notification preferences have been saved.",
    });
  };

  const handleSaveSystemPreferences = () => {
    toast({
      title: "System Preferences Updated",
      description: "Your system preferences have been saved.",
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Settings" 
        subtitle="Manage your teaching preferences and account settings"
      />

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="teaching">Teaching</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Faculty Information
              </CardTitle>
              <CardDescription>
                Update your personal and professional information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src="" />
                  <AvatarFallback className="text-lg">
                    {profile.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <Button variant="outline">Change Photo</Button>
                  <p className="text-sm text-muted-foreground mt-1">
                    JPG, PNG or GIF. Max size 2MB.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="employeeId">Employee ID</Label>
                  <Input
                    id="employeeId"
                    value={profile.employeeId}
                    onChange={(e) => setProfile({ ...profile, employeeId: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    value={profile.department}
                    onChange={(e) => setProfile({ ...profile, department: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="designation">Designation</Label>
                  <Select value={profile.designation} onValueChange={(value) => setProfile({ ...profile, designation: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Assistant Professor">Assistant Professor</SelectItem>
                      <SelectItem value="Associate Professor">Associate Professor</SelectItem>
                      <SelectItem value="Professor">Professor</SelectItem>
                      <SelectItem value="Visiting Faculty">Visiting Faculty</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="specialization">Specialization</Label>
                  <Input
                    id="specialization"
                    value={profile.specialization}
                    onChange={(e) => setProfile({ ...profile, specialization: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="officeRoom">Office Room</Label>
                  <Input
                    id="officeRoom"
                    value={profile.officeRoom}
                    onChange={(e) => setProfile({ ...profile, officeRoom: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="officeHours">Office Hours</Label>
                <Input
                  id="officeHours"
                  value={profile.officeHours}
                  onChange={(e) => setProfile({ ...profile, officeHours: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Professional Bio</Label>
                <Textarea
                  id="bio"
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  rows={3}
                />
              </div>

              <Button onClick={handleSaveProfile}>Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="teaching" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Teaching Preferences
              </CardTitle>
              <CardDescription>
                Configure your teaching schedule and classroom preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="maxClasses">Maximum Classes Per Day</Label>
                  <Select value={teachingPreferences.maxClassesPerDay} onValueChange={(value) => setTeachingPreferences({ ...teachingPreferences, maxClassesPerDay: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2">2 Classes</SelectItem>
                      <SelectItem value="3">3 Classes</SelectItem>
                      <SelectItem value="4">4 Classes</SelectItem>
                      <SelectItem value="5">5 Classes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="projectSlots">Project Guidance Slots Per Week</Label>
                  <Select value={teachingPreferences.projectGuidanceSlots} onValueChange={(value) => setTeachingPreferences({ ...teachingPreferences, projectGuidanceSlots: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Slot</SelectItem>
                      <SelectItem value="2">2 Slots</SelectItem>
                      <SelectItem value="3">3 Slots</SelectItem>
                      <SelectItem value="4">4 Slots</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Lab Teaching Preference</h4>
                    <p className="text-sm text-muted-foreground">Prefer hands-on lab sessions</p>
                  </div>
                  <Switch
                    checked={teachingPreferences.labPreference}
                    onCheckedChange={(checked) => setTeachingPreferences({ ...teachingPreferences, labPreference: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Remote Teaching</h4>
                    <p className="text-sm text-muted-foreground">Available for online classes</p>
                  </div>
                  <Switch
                    checked={teachingPreferences.remoteTeaching}
                    onCheckedChange={(checked) => setTeachingPreferences({ ...teachingPreferences, remoteTeaching: checked })}
                  />
                </div>
              </div>

              <Button onClick={handleSaveTeachingPreferences}>Save Teaching Preferences</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Preferences
              </CardTitle>
              <CardDescription>
                Choose what notifications you want to receive
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Class Reminders</h4>
                    <p className="text-sm text-muted-foreground">Get notified about upcoming classes</p>
                  </div>
                  <Switch
                    checked={notifications.classReminders}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, classReminders: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Assignment Deadlines</h4>
                    <p className="text-sm text-muted-foreground">Reminders for assignment review deadlines</p>
                  </div>
                  <Switch
                    checked={notifications.assignmentDeadlines}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, assignmentDeadlines: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Student Inquiries</h4>
                    <p className="text-sm text-muted-foreground">Be notified when students contact you</p>
                  </div>
                  <Switch
                    checked={notifications.studentInquiries}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, studentInquiries: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Schedule Changes</h4>
                    <p className="text-sm text-muted-foreground">Be notified when your schedule changes</p>
                  </div>
                  <Switch
                    checked={notifications.scheduleChanges}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, scheduleChanges: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Grade Submission Reminders</h4>
                    <p className="text-sm text-muted-foreground">Reminders for grade submission deadlines</p>
                  </div>
                  <Switch
                    checked={notifications.gradeSubmissionReminders}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, gradeSubmissionReminders: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Weekly Reports</h4>
                    <p className="text-sm text-muted-foreground">Receive weekly teaching summaries</p>
                  </div>
                  <Switch
                    checked={notifications.weeklyReports}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, weeklyReports: checked })}
                  />
                </div>
              </div>

              <hr />

              <div className="space-y-4">
                <h3 className="font-medium">Notification Methods</h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <div>
                      <h4 className="font-medium">Email Notifications</h4>
                      <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                    </div>
                  </div>
                  <Switch
                    checked={notifications.emailNotifications}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, emailNotifications: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    <div>
                      <h4 className="font-medium">SMS Notifications</h4>
                      <p className="text-sm text-muted-foreground">Receive notifications via SMS</p>
                    </div>
                  </div>
                  <Switch
                    checked={notifications.smsNotifications}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, smsNotifications: checked })}
                  />
                </div>
              </div>

              <Button onClick={handleSaveNotifications}>Save Notification Preferences</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                System Preferences
              </CardTitle>
              <CardDescription>
                Customize your application experience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="theme">Theme</Label>
                  <Select value={systemPreferences.theme} onValueChange={(value) => setSystemPreferences({ ...systemPreferences, theme: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select value={systemPreferences.language} onValueChange={(value) => setSystemPreferences({ ...systemPreferences, language: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="hindi">हिंदी</SelectItem>
                      <SelectItem value="marathi">मराठी</SelectItem>
                      <SelectItem value="tamil">தமிழ்</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select value={systemPreferences.timezone} onValueChange={(value) => setSystemPreferences({ ...systemPreferences, timezone: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Asia/Kolkata">IST (Asia/Kolkata)</SelectItem>
                      <SelectItem value="Asia/Mumbai">Mumbai</SelectItem>
                      <SelectItem value="Asia/Delhi">Delhi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="defaultGrading">Default Grading Scale</Label>
                  <Select value={systemPreferences.defaultGradingScale} onValueChange={(value) => setSystemPreferences({ ...systemPreferences, defaultGradingScale: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage (0-100)</SelectItem>
                      <SelectItem value="gpa">GPA (0-10)</SelectItem>
                      <SelectItem value="letter">Letter Grades (A-F)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button onClick={handleSaveSystemPreferences}>Save System Preferences</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Security Settings
              </CardTitle>
              <CardDescription>
                Manage your account security and data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Change Password</h4>
                  <div className="space-y-2">
                    <Input type="password" placeholder="Current Password" />
                    <Input type="password" placeholder="New Password" />
                    <Input type="password" placeholder="Confirm New Password" />
                  </div>
                  <Button className="mt-2">Update Password</Button>
                </div>

                <hr />

                <div>
                  <h4 className="font-medium mb-2">Two-Factor Authentication</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Add an extra layer of security to your account
                  </p>
                  <Button variant="outline">Enable 2FA</Button>
                </div>

                <hr />

                <div>
                  <h4 className="font-medium mb-2">Data Export</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Download your teaching data and student records
                  </p>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Export Teaching Data
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;