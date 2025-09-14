import { Provider } from 'react-redux';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { store } from './app/store';
import ProtectedRoute from './components/auth/ProtectedRoute';
import MainLayout from './components/layout/MainLayout';
import LoginPage from './pages/auth/LoginPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import CreateTimetablePage from './pages/admin/CreateTimetablePage';
import MasterTimetableViewPage from './pages/admin/MasterTimetableViewPage';
import TeacherDashboardPage from './pages/teacher/TeacherDashboardPage';
import StudentDashboardPage from './pages/student/StudentDashboardPage';
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginPage />} />
            
            {/* Protected routes with layout */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <MainLayout />
                </ProtectedRoute>
              }
            >
              {/* Default redirect based on user role */}
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              
              {/* Admin routes */}
              <Route
                path="admin/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="admin/create-timetable"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <CreateTimetablePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="admin/master-timetable"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <MasterTimetableViewPage />
                  </ProtectedRoute>
                }
              />
              
              {/* Teacher routes */}
              <Route
                path="teacher/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['teacher']}>
                    <TeacherDashboardPage />
                  </ProtectedRoute>
                }
              />
              
              {/* Student routes */}
              <Route
                path="student/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['student']}>
                    <StudentDashboardPage />
                  </ProtectedRoute>
                }
              />
            </Route>
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </Provider>
);

export default App;
