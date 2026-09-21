import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { IUser } from '../types/user';
import { authApi } from '../services/authApi';
import { initSocketClient, disconnectSocket } from '../services/socket';

interface AuthState {
  user: IUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

export const checkAuthStatus = createAsyncThunk(
  'auth/checkStatus',
  async (_, { rejectWithValue }) => {
    try {
      const res = await authApi.getMe();
      if (res.success && res.data) {
        initSocketClient();
        return res.data;
      }
      return rejectWithValue('Failed to authenticate');
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Authentication error');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authApi.logout();
      disconnectSocket();
      return null;
    } catch (err: any) {
      disconnectSocket();
      return rejectWithValue(err.response?.data?.message || 'Logout error');
    }
  }
);

export const devLoginUser = createAsyncThunk(
  'auth/devLogin',
  async (payload: { email?: string; name?: string } | undefined, { rejectWithValue }) => {
    try {
      const res = await authApi.devLogin(payload);
      if (res.success && res.data) {
        initSocketClient(res.data.token);
        return res.data.user;
      }
      return rejectWithValue('Dev login failed');
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Dev login error');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<IUser>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;
    },
    clearAuth: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkAuthStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(checkAuthStatus.rejected, (state, action) => {
        state.user = null;
        state.isAuthenticated = false;
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(devLoginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(devLoginUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(devLoginUser.rejected, (state, action) => {
        state.user = null;
        state.isAuthenticated = false;
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setUser, clearAuth } = authSlice.actions;
export default authSlice.reducer;
