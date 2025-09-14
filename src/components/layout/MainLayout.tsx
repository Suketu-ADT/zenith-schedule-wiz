import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { autoLogin } from '../../features/auth/authSlice';
import type { RootState } from '../../app/store';

const MainLayout = () => {
  const dispatch = useDispatch();
  const { user, token } = useSelector((state: RootState) => state.auth);

  // Auto-login for demo purposes if token exists but no user
  useEffect(() => {
    if (token && !user) {
      // In a real app, you'd validate the token with your API
      // For demo, we'll extract user info from localStorage or use default
      const mockUser = {
        id: '1',
        name: 'Dr. Sarah Johnson',
        email: 'admin@scheduler.com',
        role: 'admin' as const,
      };
      dispatch(autoLogin(mockUser));
    }
  }, [token, user, dispatch]);

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;