import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { AuthState, User, LoginForm } from '../../types';

// Mock users for demonstration
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    email: 'admin@scheduler.com',
    role: 'admin',
    avatarUrl: undefined,
  },
  {
    id: '2',
    name: 'Prof. Michael Chen',
    email: 'teacher@scheduler.com',
    role: 'teacher',
    avatarUrl: undefined,
  },
  {
    id: '3',
    name: 'Alice Williams',
    email: 'student@scheduler.com',
    role: 'student',
    avatarUrl: undefined,
  },
];

// Mock login API call
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: LoginForm, { rejectWithValue }) => {
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Find user by email
      const user = mockUsers.find((u) => u.email === credentials.email);
      
      if (!user) {
        throw new Error('Invalid email or password');
      }

      // Mock token generation
      const token = `mock-jwt-token-${user.id}-${Date.now()}`;

      return { user, token };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Login failed');
    }
  }
);

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem('token');
    },
    clearError: (state) => {
      state.error = null;
    },
    // For demo purposes - auto-login with stored token
    autoLogin: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, clearError, autoLogin } = authSlice.actions;
export default authSlice.reducer;