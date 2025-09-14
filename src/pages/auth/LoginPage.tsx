import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Calendar, Loader2 } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { loginUser, clearError } from '../../features/auth/authSlice';
import type { RootState, AppDispatch } from '../../app/store';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginForm = z.infer<typeof loginSchema>;

const LoginPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoading, error, isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  const from = location.state?.from?.pathname || '/';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Clear error when component mounts
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      const redirectPath = from !== '/' ? from : `/${user.role}/dashboard`;
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, user, navigate, from]);

  const onSubmit = async (data: LoginForm) => {
    await dispatch(loginUser(data));
  };

  const demoCredentials = [
    { role: 'Admin', email: 'admin@scheduler.com', password: 'admin123' },
    { role: 'Teacher', email: 'teacher@scheduler.com', password: 'teacher123' },
    { role: 'Student', email: 'student@scheduler.com', password: 'student123' },
  ];

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left side - Brand */}
      <div className="hidden lg:flex lg:flex-1 lg:flex-col lg:justify-center lg:px-12 bg-primary">
        <div className="text-center text-primary-foreground">
          <div className="flex justify-center mb-8">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-foreground text-primary">
              <Calendar className="h-8 w-8" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-4">Auto Scheduler Wiz</h1>
          <p className="text-xl text-primary-foreground/80 mb-8">
            AI-powered timetable generation for educational institutions
          </p>
          <div className="grid grid-cols-1 gap-4 max-w-md mx-auto">
            <div className="text-left p-4 rounded-lg bg-primary-foreground/10">
              <h3 className="font-semibold mb-2">Intelligent Scheduling</h3>
              <p className="text-sm text-primary-foreground/70">
                Advanced AI algorithms automatically resolve conflicts and optimize resource utilization
              </p>
            </div>
            <div className="text-left p-4 rounded-lg bg-primary-foreground/10">
              <h3 className="font-semibold mb-2">Multi-Role Access</h3>
              <p className="text-sm text-primary-foreground/70">
                Tailored dashboards for administrators, teachers, and students
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="flex flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="mx-auto w-full max-w-md">
          {/* Mobile brand */}
          <div className="lg:hidden text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Calendar className="h-6 w-6" />
              </div>
            </div>
            <h1 className="text-2xl font-bold">Auto Scheduler Wiz</h1>
          </div>

          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">Sign in</CardTitle>
              <CardDescription className="text-center">
                Enter your credentials to access your dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    {...register('email')}
                    disabled={isLoading}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    {...register('password')}
                    disabled={isLoading}
                  />
                  {errors.password && (
                    <p className="text-sm text-destructive">{errors.password.message}</p>
                  )}
                </div>

                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    'Sign in'
                  )}
                </Button>
              </form>

              {/* Demo credentials */}
              <div className="mt-6 pt-6 border-t border-border">
                <p className="text-sm text-muted-foreground text-center mb-3">
                  Demo Credentials:
                </p>
                <div className="grid grid-cols-1 gap-2 text-xs">
                  {demoCredentials.map((cred) => (
                    <div key={cred.role} className="flex justify-between items-center p-2 rounded bg-muted">
                      <span className="font-medium">{cred.role}:</span>
                      <span className="text-muted-foreground">{cred.email}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;