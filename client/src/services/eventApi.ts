import { api } from './api';
import type { IEvent, IEventFormData } from '../types/event';

export const eventApi = {
  getEvents: async (start: string, end: string): Promise<{ success: boolean; data: IEvent[] }> => {
    const res = await api.get('/events', { params: { start, end } });
    return res.data;
  },

  getEventById: async (id: string): Promise<{ success: boolean; data: IEvent }> => {
    const res = await api.get(`/events/${id}`);
    return res.data;
  },

  createEvent: async (data: IEventFormData): Promise<{ success: boolean; data: IEvent; message: string }> => {
    const res = await api.post('/events', data);
    return res.data;
  },

  updateEvent: async (id: string, data: Partial<IEventFormData>): Promise<{ success: boolean; data: IEvent; message: string }> => {
    const res = await api.put(`/events/${id}`, data);
    return res.data;
  },

  deleteEvent: async (id: string): Promise<{ success: boolean; data: { id: string }; message: string }> => {
    const res = await api.delete(`/events/${id}`);
    return res.data;
  },
};
