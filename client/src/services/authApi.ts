import { api } from './api';
import type { IUser } from '../types/user';

export const authApi = {
  getMe: async (): Promise<{ success: boolean; data: IUser }> => {
    const res = await api.get('/auth/me');
    return res.data;
  },

  logout: async (): Promise<{ success: boolean; message: string }> => {
    const res = await api.post('/auth/logout');
    localStorage.removeItem('token');
    return res.data;
  },

  devLogin: async (data?: { email?: string; name?: string }): Promise<{ success: boolean; data: { user: IUser; token: string } }> => {
    const res = await api.post('/auth/dev-login', data || {});
    if (res.data?.data?.token) {
      localStorage.setItem('token', res.data.data.token);
    }
    return res.data;
  },
};
