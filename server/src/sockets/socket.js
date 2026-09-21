import { Server as SocketIOServer } from 'socket.io';
import jwt from 'jsonwebtoken';

let io = null;

export const initSocket = (httpServer) => {
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';

  io = new SocketIOServer(httpServer, {
    cors: {
      origin: clientUrl,
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      credentials: true,
    },
  });

  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token || socket.handshake.query?.token;
      if (!token) {
        // Allow unauthenticated socket connection to connect, but won't join private user room
        return next();
      }

      const secret = process.env.JWT_SECRET || 'google_calendar_clone_jwt_secret_key_2026';
      const decoded = jwt.verify(token, secret);
      socket.userId = decoded.id;
      return next();
    } catch (err) {
      console.warn('[Socket Auth Warning] Invalid token provided:', err.message);
      return next();
    }
  });

  io.on('connection', (socket) => {
    if (socket.userId) {
      const room = `user:${socket.userId}`;
      socket.join(room);
      console.log(`[Socket.IO] Client ${socket.id} joined private room ${room}`);
    } else {
      console.log(`[Socket.IO] Unauthenticated client ${socket.id} connected`);
    }

    socket.on('disconnect', () => {
      console.log(`[Socket.IO] Client ${socket.id} disconnected`);
    });
  });

  console.log('[Socket.IO] Socket server initialized');
  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.IO is not initialized!');
  }
  return io;
};
