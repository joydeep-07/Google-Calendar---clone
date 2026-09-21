import { io, Socket } from 'socket.io-client';
import { store } from '../redux/store';
import { socketEventCreated, socketEventUpdated, socketEventDeleted } from '../redux/eventSlice';
import type { IEvent } from '../types/event';

let socket: Socket | null = null;

export const initSocketClient = (token?: string) => {
  if (socket) {
    socket.disconnect();
  }

  const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
  const authToken = token || localStorage.getItem('token');

  socket = io(socketUrl, {
    withCredentials: true,
    auth: { token: authToken },
    query: { token: authToken },
    autoConnect: true,
  });

  socket.on('connect', () => {
    console.log('[Socket.IO Client] Connected to server, socket id:', socket?.id);
  });

  socket.on('event:created', (newEvent: IEvent) => {
    console.log('[Socket.IO Client] Received event:created', newEvent);
    store.dispatch(socketEventCreated(newEvent));
  });

  socket.on('event:updated', (updatedEvent: IEvent) => {
    console.log('[Socket.IO Client] Received event:updated', updatedEvent);
    store.dispatch(socketEventUpdated(updatedEvent));
  });

  socket.on('event:deleted', (deletedId: string) => {
    console.log('[Socket.IO Client] Received event:deleted', deletedId);
    store.dispatch(socketEventDeleted(deletedId));
  });

  socket.on('disconnect', (reason) => {
    console.log('[Socket.IO Client] Disconnected:', reason);
  });

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
