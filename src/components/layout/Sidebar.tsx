import { useSelector } from 'react-redux';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  BookOpen, 
  Building, 
  Settings,
  PlusCircle,
  UserCircle,
  ClipboardList,
  Clock
} from 'lucide-react';
import { cn } from '../../lib/utils';
import type { RootState } from '../../app/store';

const Sidebar = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const location = useLocation();

  // Role-specific navigation items
  const getNavItems = () => {
    switch (user?.role) {
      case 'admin':
        return [
          { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
          { name: 'Create Timetable', href: '/admin/create-timetable', icon: PlusCircle },
          { name: 'Master Timetable', href: '/admin/master-timetable', icon: Calendar },
          { name: 'Teachers', href: '/admin/teachers', icon: Users },
          { name: 'Students', href: '/admin/students', icon: UserCircle },
          { name: 'Courses', href: '/admin/courses', icon: BookOpen },
          { name: 'Classrooms', href: '/admin/classrooms', icon: Building },
          { name: 'Settings', href: '/admin/settings', icon: Settings },
        ];
      case 'teacher':
        return [
          { name: 'Dashboard', href: '/teacher/dashboard', icon: LayoutDashboard },
          { name: 'My Schedule', href: '/teacher/schedule', icon: Calendar },
          { name: 'My Courses', href: '/teacher/courses', icon: BookOpen },
          { name: 'Class Lists', href: '/teacher/class-lists', icon: ClipboardList },
          { name: 'Settings', href: '/teacher/settings', icon: Settings },
        ];
      case 'student':
        return [
          { name: 'Dashboard', href: '/student/dashboard', icon: LayoutDashboard },
          { name: 'My Schedule', href: '/student/schedule', icon: Calendar },
          { name: 'My Courses', href: '/student/courses', icon: BookOpen },
          { name: 'Exam Schedule', href: '/student/exams', icon: Clock },
          { name: 'Settings', href: '/student/settings', icon: Settings },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  return (
    <div className="flex h-screen w-64 flex-col bg-card border-r border-border">
      {/* Logo/Brand */}
      <div className="flex h-16 items-center px-6 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Calendar className="h-4 w-4" />
          </div>
          <div>
            <h1 className="text-lg font-semibold">Scheduler Wiz</h1>
            <p className="text-xs text-muted-foreground capitalize">{user?.role} Portal</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <NavLink
              key={item.name}
              to={item.href}
              className={cn(
                'sidebar-item',
                isActive ? 'active' : ''
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </NavLink>
          );
        })}
      </nav>

      {/* User info */}
      <div className="border-t border-border p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
            {user?.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;